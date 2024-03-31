const Category = require("../models/Category");
const Course = require("../models/Course")

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

//create category handler function
exports.createCategory = async(req, res) => {
    try {
        //fetch data
        const {name, description} = req.body

        //validation
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //create entry in db
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully!",
        })
    }   
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })    
    }
}

exports.showAllCategory = async(req, res) => {
    try {
        const allCategory = await Category.find({}, {name: true, description: true});

        res.status(200).json({
            success: true,
            message: "All Category returned successfully",
            allCategory,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })    
    }
}

exports.categoryPageDetails = async(req, res) => {
    try {
        console.log(req.body)
        //get category id
        const { categoryId } = req.body;

        console.log("inside model", categoryId)

        //get courses for specified category
        const selectedCategory = await Category.findOne({_id: categoryId})
                                                .populate({
                                                    path: "courses",
                                                    populate: {
                                                        path: "instructor"
                                                    }
                                                })
                                                .exec();

        //validation
        if(!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data not found",
            })
        }

        if(selectedCategory.courses.length === 0) {
            console.log("No Courses found for the selected category");
            return res.status(404).json({
                success: false,
                message: "No Courses found for this category"
            })
        }

        //get courses for different category
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId }, 
        })
        let differentCategories = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        )
        .populate({
            path: "courses",
            match: { status: "Published" },
        })
        .exec()

        //get top 10 selling courses --> H.W
        const topSellingCourse = await Course.find().sort({studentsEnrolled: -1}).limit(10).populate("instructor").exec()
        
        //return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
                topSellingCourse
            }
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