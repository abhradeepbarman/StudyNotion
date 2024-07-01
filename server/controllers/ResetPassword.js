const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
require("dotenv").config()

//reset password token
exports.resetPasswordToken = async(req, res) => {
    try {
        //fetch email from req body
        const {email} = req.body;

        //email validation --> H.W
        if(!email) {
            res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        //check user for this email 
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({
                success: false,
                message: "Your email is not registered with us"
            });
        }

        //generate token
        const token = crypto.randomUUID();

        //update user by adding token & expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email: email},  
            {
                token: token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            }, 
            {new: true});

        //create url
        const frontend_url = process.env.FRONTEND_URL
        const url = `${frontend_url}/update-password/${token}`

        //send mail containing url
        await mailSender(email, 
                        "Password Reset Link", 
                        `Your Link for email verification is ${url}. Please click this url to reset your password.`);
                        
        //return response
        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check email and change password"
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password mail"
        })    
    }

}

//reset password
exports.resetPassword = async(req, res) => {
    try {
        //fetch token, new Password, confirm new Password from req body
        const {password, confirmPassword, token} = req.body;

        //password match
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching",
            })
        }

        //get userDetails from db using token
        const userDetails = await User.findOne({token: token});

        //if no entry --> invalid token
        if(!userDetails) {
            return res.json({
                success: false,
                message: "token invalid"
            })
        }

        //token expiry check
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, please regenerate your token"
            });
        }

        //password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        //password update
        await User.findOneAndUpdate(
            {token: token}, 
            {password: hashedPassword}, 
            {new: true}
        );

        //return res
        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password",
        });
    }
}