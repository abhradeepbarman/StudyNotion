const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async(req, res) => {
    try {
        // Get user ID from request object
		const userId = req.user.id;

        //data fetch
        const {courseName, courseDescription, whatYouWillLearn, price, category, tag} = req.body;

        //thumbnail fetch
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, Please try again"
            })
        }

        // Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

        //validation
        if(!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found"
            })
        }

        //category validation
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            //category invalid
            return res.status(404).json({
                success: false,
                message: "Category details not found"
            })
        }

        //image upload to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME); 

        //create an entry for new Course in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price: price,
            tag: tag,
			category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        //add course entry in User schema
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true},
        )

        //add course entry in Category schema
        //H.W
        await Category.findOneAndUpdate(
            {_id: category},
            {
                $push: {
                    course: newCourse._id,
                }
            },
            {new: true},
        )

        //return response 
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        })   
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        })
    }
}

//get all courses handler function
exports.showAllCourses = async(req, res) => {
    try {
        //Understand later
        const alllCourses = await Course.find({}, {courseName: true,
                                                    price: true,
                                                    thumbnail: true,
                                                    instructor: true,
                                                    ratingAndReviews: true,
                                                    studentsEnrolled: true})
                                                    .populate("instructor")
                                                    .exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: alllCourses,
        })
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Cannot fetch Data",
            error: error.message,
        })
    }
}