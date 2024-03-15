const ContactUs = require("../models/ContactUs");
const contactForm = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.createContact = async(req, res) => {
    try {
        //fetch data
        const {firstName, lastName, email, phoneNumber, message} = req.body;

        //validation
        if(!firstName || !lastName || !email || !phoneNumber || !message) {
            return res.json({
                success: false,
                message: "Please give all details",
            })
        }

        //make entry in db
        await ContactUs.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            message,
        });

        //email to the user
        await mailSender(
            email,
            "Query received",
            contactForm(email, firstName, lastName, message, phoneNumber)
        )

        //return response
        return res.status(200).json({
            success: true,
            message: "Contact Us form received",
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}