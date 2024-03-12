const OTP = require("../models/OTP")
const User = require("../models/User")
const otpGenerator = require('otp-generator')
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile")
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();


//send otp
exports.sendOTP = async(req, res) => {

    try {
        //fetch email from request body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered!"
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false, 
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        console.log("OTP generated: ", otp);


        //check unique otp or not
        let result = await OTP.findOne({otp: otp});

        while(result) {
            otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                specialChars: false,
                lowerCaseAlphabets: false,
            });

            result = await OTP.findOne({otp: otp});
        }


        //create entry in db for otp
        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
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

//sign up
exports.signup = async(req, res) => {
    try {
        //data fetch from request body
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;

        //validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "ALL fields are required"
            })
        }

        //2 password match
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password & Confirm Password value does not match, please Try again!"
            })
        }

        //check user already exist
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            })
        }

        //find most recent otp stores for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);  
        console.log("Recent OTP ->", recentOtp);
        
        //validate otp
        if(recentOtp.length === 0 ) {
            //OTP not found in db
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if(otp !== recentOtp.otp) {
            //invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //entry create in db
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //response return
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user,
        })

    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered! Please Try again",
        })
    }
}

//login
exports.login = async(req, res) => {
    try {
        //fetch data from request body
        const {email, password} = req.body;

        //validation data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required!"
            })
        }

        //check if user exist
        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered! Please sign up first",
            })
        }

        //password check
        if(await bcrypt.compare(password, user.password)) {
            
            //JWT token generate
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            //create cookie
            //return res
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token, 
                user,
                message: "Logged in successfully"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, Please try again"
        })
    }
}

//change password
exports.changePassword = async(req, res) => {
    //fetch data from req body
    //get old password, new Password, confirm New Password
    const {email, oldPassword, newPassword, confirmNewPassword} = req.body;

    //validation
    if(!email || !oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(403).json({
            success: false,
            message: "All fiels are required",
        })
    }

    try {
        const user = await User.findOne({email});

        // Check if user exists
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        //check if old password is correct
        if(!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            })
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update password in db
        await User.findOneAndUpdate({email}, {password: hashedPassword}, {new:true});
        
        //send mail - Password updated
        await mailSender(email, "Password Change", `<h2>Password changed successfully</h2>`)
        
        //return res
        res.json({ 
            success: true,
            message: 'Password updated successfully' 
        });
    } 
    catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error while changing password' 
        });
    }
}