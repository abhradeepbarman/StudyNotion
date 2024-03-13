const Section = require("../models/Section");
const Course = require("../models/Course");

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
                path: "subSection",
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
        const {sectionName, sectionId} = req.body;

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

        //return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection,
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
        //fetch id - assuming that we are sending ID in parameters
        const {sectionId} = req.params;

        //validation
        if(!sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //delete section in section schema
        await Section.findByIdAndDelete( sectionId )

        //delete sectionId in course schema
        //delete subsection related with sectionId
        //[Testing] -- do we need to delete the entry from course schema also??
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        })
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