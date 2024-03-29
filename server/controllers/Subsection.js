const Section = require("../models/Section");
const Subsection = require("../models/Subsection");
require("dotenv").config();
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create subsection
exports.createSubsection = async(req,res) => {
    try {
        //fetch data from req body
        const {sectionId, title, description} = req.body;

        //extract file/video
        const video = req.files.videoFile;

        //validation
        if(!sectionId || !title || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //upload video to cloudinary --> got secure url
        const uploadedDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        //create subsection
        const SubsectionDetails = await Subsection.create({
            title: title,
            description: description,
            timeDuration: `${uploadedDetails.duration}`,
            videoUrl: uploadedDetails.secure_url,
        })

        //create subsection entry in section schema   
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push: {
                    subsection: SubsectionDetails._id,
                }
            },
            {new: true}
        ).populate("subsection").exec();
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            data: updatedSection,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create subsection, please try again",
            error: error.message,
        })
    }
}

// H.W --> update subsection
exports.updateSubsection = async(req, res) => {
    try {
        //fetch data
        const { sectionId, subsectionId, title, description} = req.body;


        //find subsection
        const subsection = await Subsection.findById(subsectionId);
        
        //validation
        if(!subsection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            })
        }

        //update subsection
        if(title !== undefined) {
            subsection.title = title;
        }

        if(description !== undefined) {
            subsection.description = description;
        }

        if(req.files && req.files.videoFile !== undefined) {
            const video = req.video.videoFile;
            const uploadedDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

            subsection.videoUrl = uploadedDetails.secure_url;
            subsection.timeDuration = uploadedDetails.duration;
        }

        await subsection.save();

        //find updated section & return it
        const updatedSection = await Section.findById(sectionId).populate("subsection").exec()

        //return response  
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data: updatedSection,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update subsection, please try again",
            error: error.message,
        })
    }
}

//H.W --> delete subsection
exports.deleteSubsection = async(req, res) => {
    try {
        //fetch data
        const { subsectionId, sectionId } = req.body

        //delete subsection Id from section schema
        await Section.findOneAndUpdate(
          { _id: sectionId },
          {
            $pull: {
              subsection: subsectionId,
            },
          }
        )
        
        //delete subsection
        const subSection = await Subsection.findOneAndDelete({ _id: subsectionId })
          
        //validation
        if (!subSection) {
          return res
            .status(404)
            .json({ success: false, message: "SubSection not found" })
        }

        //find updated section & return it
        const updatedSection = await Section.findById(sectionId).populate("subsection")

        
        //return response
        return res.json({
          success: true,
          message: "SubSection deleted successfully",
          data: updatedSection,
        })  
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete subsection, please try again",
            error: error.message,
        })
    }
}