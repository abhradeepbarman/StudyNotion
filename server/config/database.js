const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connection successful!"))
    .catch((error) => {
        console.log("DB connection failes");
        console.log(error);
        process.exit(1);
    })
}