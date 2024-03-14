const Category = require("../models/Category");

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
        //get category id
        const {categoryId} = req.body;

        //get courses for specified category
        const selectedCategory = await Category.findById(categoryId)
                                                .populate("courses")
                                                .exec();

        //validation
        if(!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data not found",
            })
        }

        //get courses for different category
        const differentCategories = await Category.find({
            _id: {$ne: categoryId}, 
        })
        .populate("courses").exec();

        //get top selling courses --> H.W
        
        //return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
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