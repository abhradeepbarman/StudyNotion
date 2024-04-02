const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section")
const Subsection = require("../models/Subsection")
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress")
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

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
			tag: _tag,
			category,
			status,
			instructions: _instructions,
		} = req.body;
        
        //thumbnail fetch
        const thumbnail = req.files.thumbnailImage;

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        console.log("tag", tag)
        console.log("instructions", instructions)
        
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag.length || !instructions.length) {
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

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((section) => {
            section.subsection.forEach((subsection) => {
                const time = parseInt(subsection.timeDuration)
                totalDurationInSeconds += time
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        //return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: {
                courseDetails,
                totalDuration
            },
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

//edit course
exports.editCourse = async(req, res) => {
    try {
        const {courseId} = req.body;
        const updates = req.body;

        //find course
        const course = await Course.findById(courseId)

        if(!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        //if thumbnail image is found, update it
        if(req.files) {
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        //update only the fields that are found in request body
        for(const key in updates) {
            if(key === "tag" || key === "instructions") {
                course[key] = JSON.parse(updates[key])
            }
            else {
                course[key] = updates[key]
            }
        }

        await course.save()

        const updatedCourse = await Course.findById(courseId)
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
                                .exec()

        res.status(200).json({
            success: true,
            message: "Course Updated successfully",
            data: updatedCourse
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getInstructorCourses = async(req, res) => {
    const instructorId = req.user.id

    try {
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({createdAt: -1})
    
        //return instructor courses
        res.status(200).json({
            success: true,
            message: "instructor courses fetched",
            data: instructorCourses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message
        })
    }
}

exports.deleteCourse = async(req, res) => {
    try {
        const {courseId} = req.body

        //find the course
        const course = await Course.findById(courseId)
        if(!course) {
            return res.status(404).json({
                success: false,
                message: "Could not found course"
            })
        }

        //unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for(const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: {
                    courses: courseId
                }
            })
        }

        //delete subsections & sections
        const courseSections = course.courseContent
        for(const sectionId of courseSections) {
            const section = Section.findById(sectionId)

            if(section) {
                const subsections = section.subsections

                if(subsections) {
                    for(const subsectionId of subsections) {
                        await Subsection.findByIdAndDelete(subsectionId)
                    }
                }
            }

            await Section.findByIdAndDelete(sectionId)
        }

        //delete course
        await Course.findByIdAndDelete(courseId)

        //return response
        return res.status(200).json({
            success: true,
            message: "Course Deleted successfully",
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
      const {courseId}  = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subsection",
          },
        })
        .exec()

        console.log("Course Details....", courseDetails);
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
          data: {
            courseDetails,
            CourseProgress
          }
        })
      }
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }