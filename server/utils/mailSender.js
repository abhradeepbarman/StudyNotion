const nodemailer = require("nodemailer");
require("dotenv").config();


const mailSender = async(email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
        }); 

        const info = await transporter.sendMail({
            from: 'StudyNotion || Abhradeep Barman',
            to: email,
            subject: title, 
            html: body, 
        });

        console.log("Email sent Successfully!!!!");
        console.log(info);
        return info;
    } 
    catch (error) {
        console.log("Error while sending email");
        console.log(error);  
    }
}

module.exports = mailSender;