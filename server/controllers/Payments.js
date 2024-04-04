const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
require('dotenv').config()
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");


//initiate the razorpay order
exports.capturePayment = async (req, res) => {
    
    const {courses} = req.body
    const userId = req.user.id

    console.log("courses in cart", courses);

    if(courses.length === 0) {
        return res.json({
            success: false,
            message: "Please provide Course Id",
        })
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(404).json({
                    success: false,
                    message: "Could not find the course",
                })
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Already Enrolled in the course"
                })
            }

            totalAmount += course.price;
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            })
        }

        
    }

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        const paymentResponse = await instance.orders.create(options)    
        return res.json({
            success: true,
            data: paymentResponse,
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
        })
    }
}

// verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req.user.id

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(200).json({
            success: false,
            message: "Payment Failed",
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_SECRET)
                .update(body.toString())
                .digest("hex")

    if(expectedSignature === razorpay_signature) {
        //match
        //enroll student
        await enrollStudent(courses, userId, res)

        //return response
        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        })
    }

    return res.status(400).json({
        success: false,
        message: "Payment Failed"
    })
}


const enrollStudent = async(courses, userId, res) => {

    if(!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide the data for Courses or user Id"
        })
    }

    for(const courseId of courses) {
        try {
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: { studentsEnrolled: userId}},
                {new: true}
            )

            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found"
                })
            }

            const courseProgress = CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: []
            })

            //find the student & give him all the courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                { $push : { 
                    courses: courseId,
                    courseProgress: courseProgress._id
                } },
                {new: true}
            )

            //send mail to the student
            const emailResponse = await mailSender(
                enrollStudent.email,
                courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName)
            )

            console.log("Email sent successfully", emailResponse)    
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}


exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    const userId = req.user.id

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the fields"
        })
    }

    try {
        //find student
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            "Payment Received",
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount/100,
                orderId,
                paymentId
            )  
        )
    } catch (error) {
        console.log("Error in sending mail", error);
        return res.status(500).json({
            success: false,
            message: "Could not send email"
        })
    }
}




// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async(req, res) => {
//     //get course id and user id
//     const {courseId} = req.body;
//     const userId = req.user.id;

//     //validation
//     // valid course id or not
//     if(!courseId) {
//         return res.json({
//             success: false,
//             message: "Please provide valid course id"
//         })
//     }

//     //valid course details
//     let course;
//     try {
//         course = await Course.findById(courseId);
//         if(!course) {
//             return res.json({
//                 success: false,
//                 message: "Could not find the course",
//             });
//         }

//         //user already paid for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             //student already enrolled
//             return res.status(200).json({
//                 success: false,
//                 message: "Student is already enrolled",
//             })
//         }

//     } 
//     catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }

// //     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes: {
//             courseId,
//             userId,
//        }
//     }

//     try {
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         //return response  
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         })
//     } 
//     catch (error) {
//         console.log(error);
//         res.json({
//             success: false,
//             message: "Could not initiate order",
//         })
//     }
// // }


// // //verify signature of Razorpay and Server
// exports.verifySignature = async(req, res) => {
//     const webhookSecret = "1234";

//     const signature = req.header["x-razorpay-signature"];

//     //convert webhook secret to hashed format
//     const shasum = crypto.createHmac("sha256", webhookSecret)
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try {
//             //find the course & enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id: courseId},
//                 {
//                     $push: {
//                         studentsEnrolled: userId,
//                     }
//                 },
//                 {new: true},
//             )  ;
            
//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: "Course not found",    
//                 })
//             }

//             console.log(enrolledCourse);

//             //find the student and add course to the list of enrolled courses
//             const enrolledStudent = await User.findOneAndUpdate(
//                 {_id: userId},
//                 {
//                     $push: {
//                         courses: courseId,
//                     }
//                 },
//                 {new: true},
//             );

//             console.log(enrolledStudent);

//             //mail send
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations from StudyNotion", 
//                 "You are onboarded into new StudyNotion Course",
//             )

//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified & course added"
//             })

//         } 
//         catch (error) {
//             console.log(error);
//             res.json({
//                 success: false,
//                 message: error.message,
//             })
//         }
//     }
//     else {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid request",
//         })
//     }
// }

