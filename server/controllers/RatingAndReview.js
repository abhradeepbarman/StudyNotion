const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async(req, res) => {
    try {
        //get user id
        const userId = req.user.id;

        //fetch data from req body
        const {rating, review, courseId} = req.body;

        //check if user is enrolled or not
        const courseDetails = await Course.findOne({_id: courseId, 
                                            studentsEnrolled: {$eleMatch: {$eq: userId}}});
        
        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            })
        }

        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId, 
            course: courseId,
        }) 

        if(alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Student already reviewed the course",
            })
        }

        //create rating & review
        const ratingReview = await RatingAndReview.create({
            rating, 
            review, 
            course: courseId, 
            user: userId,
        })

        //update rating in course schema
        await Course.findByIdAndUpdate(courseId, {
            $push: {
                ratingAndReviews: ratingReview._id,
            }
        }, {new: true})

        //return response
        return res.status(200).json({
            success: true,
            message: "Rating & Review created successfully"
        })

    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })    
    }
}

exports.getAverageRating = async(req, res) => {
    try {
        //get course id
        const {courseId} = req.body;

        //calculate average rating -- aggregation pipeline
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"}
                }
            },
        ])


        //return rating
        if(result.length > 0) {

            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating exists
        return res.status(200).json({
            success: true,
            message: "No rating found",
            averageRating: 0,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })       
    }
}

exports.getAllRatingAndReviews = async(req, res) => {
    try {
        const allRatingAndReviews = RatingAndReview.find({})
                                                    .sort({rating: "desc"})
                                                    .populate({
                                                        path: "user",
                                                        select: "firstName lastName email image",
                                                    })
                                                    .populate({
                                                        path: "course",
                                                        select: "courseName",
                                                    })
                                                    .exec();

        return res.status(200).json({
            success: true,
            message: "All Rating & Reviews fetched successfully",
            data: allRatingAndReviews,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })  
    }
}