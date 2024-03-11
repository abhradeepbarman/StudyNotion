const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    }
});

// a function -> to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Veification Email from StudyNotion", otp);
        console.log("Email sent Successfully: ", mailResponse);
    } 
    catch (error) {
        console.log("Error while sending verification mail!");
        console.log(error);
        throw error;
    }
}

otpSchema.pre("save", async(next) => {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);