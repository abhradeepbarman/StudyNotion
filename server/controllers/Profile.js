const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader")


//update profile of a user
exports.updateProfile = async(req, res) => {
    try {
        //fetch data
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;

        //fetch user id
        const id = req.user.id;

        //validation
        if(!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId); 

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;
        profileDetails.gender = gender;

        // Save the updated profile
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update profile, please try again",  
        })
    }
}

//delete account
exports.deleteAccount = async(req, res) => {
    try {
        //get user id
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id);

        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }



        //TODO: unenroll user from all enrolled courses
      //   for (const courseId of userDetails.courses) {
      //     await Course.findByIdAndUpdate(
      //         courseId,
      //         {
      //             $pull: {
      //                 studentsEnrolled: id,
      //             }
      //         },
      //         { new: true }
      //     );
      // }


        //delete profile of user
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        //delete user
        await User.findByIdAndDelete(userDetails._id);

        //return response
        return res.status(200).json({
           success: true,
           message: "User deleted successfully", 
        })
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to delete account, please try again",
        })
    }
}

//get All details of a user
exports.getAllUserDetails = async(req, res) => {
    try {
        //fetch data
        const id = req.user.id;

        //get user details
        const userDetails = await User.findOne({_id: id})
                                        .populate("additionalDetails")
                                        .exec();
        
        //validation
        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            userDetails,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to get all user details, please try again",
            error: error.message,
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id

      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subsection"
            }
          }
        })
        .exec()

      console.log( "user details...", userDetails);

      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }

      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};