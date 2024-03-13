const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async(req, res) => {
    //get course id and user id
    const {courseId} = req.body;
    const userId = req.user.id;

    //validation
    // valid course id or not
    if(!courseId) {
        return res.json({
            success: false,
            message: "Please provide valid course id"
        })
    }

    //valid course details
    let course;
    try {
        course = await Course.findById(courseId);
        if(!course) {
            return res.json({
                success: false,
                message: "Could not find the course",
            });
        }

        //user already paid for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            //student already enrolled
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled",
            })
        }

    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId,
            userId,
       }
    }

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response  
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    } 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Could not initiate order",
        })
    }
}


//verify signature of Razorpay and Server
exports.verifySignature = async(req, res) => {
    const webhookSecret = "1234";

    const signature = req.header["x-razorpay-signature"];

    //convert webhook secret to hashed format
    const shasum = crypto.createHmac("sha256", webhookSecret)
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try {
            //find the course & enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {
                    $push: {
                        studentsEnrolled: userId,
                    }
                },
                {new: true},
            )  ;
            
            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found",    
                })
            }

            console.log(enrolledCourse);

            //find the student and add course to the list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {
                    $push: {
                        courses: courseId,
                    }
                },
                {new: true},
            );

            console.log(enrolledStudent);

            //mail send
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations from StudyNotion", 
                "You are onboarded into new StudyNotion Course",
            )

            return res.status(200).json({
                success: true,
                message: "Signature verified & course added"
            })

        } 
        catch (error) {
            console.log(error);
            res.json({
                success: false,
                message: error.message,
            })
        }
    }
    else {
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        })
    }
}

