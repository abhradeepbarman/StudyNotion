const Subsection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")

exports.updateCourseProgress = async(req, res) => {
    const {courseId, subsectionId} = req.body
    const userId = req.user.id

    try {
        //check subsection is valid or not
        const subsection = await Subsection.findById(subsectionId)

        if(!subsection) {
            return res.status(404).json({
                success: false,
                error: "Invalid Subsection"
            })
        }

        //check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        })

        if(!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course Progress does not exist"
            })
        }

        //check for re-completing video / subsection
        if(courseProgress.completedVideos.includes(subsectionId)) {
            return res.status(400).json({
                error: "Subsection already completed",
            })
        }

        //push into completed video
        courseProgress.completedVideos.push(subsectionId);
        console.log("course progress", courseProgress);
        await courseProgress.save()

        return res.status(200).json({
            success: true,
            message: "Course progress marked updated successfully"
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }
}