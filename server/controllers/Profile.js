const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");


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
        const {id} = req.body;

        //validation
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        //TODO: unenroll user from all enrolled courses
        userDetails.courses.map(async(courseId) => {
            //delete the user from course schema
            await Course.findByIdAndUpdate(
                {_id: courseId},
                {
                    $pull: {
                        studentsEnrolled: id,
                    }
                },
                {new: true},
            )
        });

        //delete profile of user
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails});

        //delete user
        await User.findByIdAndDelete({_id: id});

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
explore.getAllUserDetails = async(req, res) => {
    try {
        //fetch data
        const {id} = req.body;

        //get user details
        const userDetails = await User.findById({_id: id}).populate("additionalDetails").exec();
        
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