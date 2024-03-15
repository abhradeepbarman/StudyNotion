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
        let {
            courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;
        
        //thumbnail fetch
        const thumbnail = req.files.thumbnailImage;
        
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, Please try again"
            })
        }

        if (!status || status === undefined) {
			status = "Draft";
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
        const categoryDetails = await Category.findOne({_id: category});
        if(!categoryDetails) {
            //category invalid
            return res.status(404).json({
                success: false,
                message: "Category details not found"
            })
        }

        //image upload to cloudinary
        const thumbnailImageDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME); 
        console.log(thumbnailImageDetails);

        //create an entry for new Course in db
        const newCourse = await Course.create({
            courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImageDetails.secure_url,
			status: status,
			instructions: instructions,
        })

        //add course entry in User schema
        await User.findOneAndUpdate(
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
                    courses: newCourse._id,
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

//get all courses
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnrolled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} 
    catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//getCourseDetails
exports.getCourseDetails = async(req, res) => {
    
    try {
        //get course id
        const {courseId} = req.body;
        
        //find course details
        const courseDetails = await Course.findById(courseId)
                                    .populate({
                                        path: "instructor",
                                        populate: {
                                            path: "additionalDetails"
                                        }
                                    })
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path: "courseContent",
                                        populate: {
                                            path: "subsection"
                                        }
                                    })
                                    .exec();

        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            })
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}