const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async(req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        //if token is missing
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        //verify token
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken);
            
            //insert decoded token into request body
            req.user = decodedToken;
        } 
        catch (err) {
            //verification issue
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
                error: err,
            });
        }

        next();
    } 
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
}

//isStudent
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only",
            })
        }

        next();
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}

//isInstructor
exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only",
            })
        }

        next();
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}


//isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only",
            })
        }

        next();
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}