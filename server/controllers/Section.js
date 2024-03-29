const Section = require("../models/Section");
const Course = require("../models/Course");
const Subsection = require("../models/Subsection")

exports.createSection = async(req, res) => {
    try {
        //data fetch
        const {sectionName, courseId} = req.body;

        //validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //create section
        const newSection = await Section.create({sectionName});

        //add section in course schema
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true}
        )
        .populate({
            path: "courseContent",
            populate: {
                path: "subsection",
            },
        })
        .exec();

        //return res
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: error.message,
        })
    }
}

exports.updateSection = async(req, res) => {
    try {
        //data fetch
        const {sectionName, sectionId, courseId} = req.body;

        //validation
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //update data in db
        const updatedSection  = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName: sectionName},
            {new: true}
        )

        //update course
        const course = await Course.findById(courseId)
                            .populate({
                                path: "courseContent",
                                populate: {
                                    path: "subsection"
                                }
                            })

        //return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: course,
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again",
            error: error.message,
        })
    }
}

exports.deleteSection = async(req, res) => {
    try {
        const { sectionId, courseId }  = req.body;

        //delete section from course
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})

        //find section
		const section = await Section.findById(sectionId);

		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await Subsection.deleteMany({_id: {$in: section.subsection}});
        
        //delete section
		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subsection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message,
        })
    }
}