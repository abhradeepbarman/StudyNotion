const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    message: {
        type: String,
    }
})

module.exports = mongoose.model("ContactUs", contactUsSchema);