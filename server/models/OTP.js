const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

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
        expires: 5 * 60 * 1000,
    }
});

// a function -> to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email, 
            "Veification Email", 
            emailTemplate(otp)
        );

        console.log("Email sent Successfully: ", mailResponse.response);
    } 
    catch (error) {
        console.log("Error while sending verification mail!");
        console.log(error);
    }
}

otpSchema.pre("save", async function (next) {

    console.log("New document saved to database");
    console.log("email: ", this.email );
    console.log("otp: ", this.otp );
    
    // Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})

module.exports = mongoose.model("OTP", otpSchema);