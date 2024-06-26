// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
  getFullCourseDetails
} = require("../controllers/Course")


// Categories Controllers Import
const {
  createCategory,
  showAllCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubsection,
  updateSubsection,
  deleteSubsection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingAndReviews,
} = require("../controllers/RatingAndReview")

// import course progress
const {updateCourseProgress} = require("../controllers/CourseProgress") 

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//edit course
router.put("/editCourse", auth, isInstructor, editCourse)
//delete course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
//get full details of course
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// get instructor courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.put("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection)
// Add a Sub Section to a Section
router.post("/addSubsection", auth, isInstructor, createSubsection)
// Edit Sub Section
router.put("/updateSubsection", auth, isInstructor, updateSubsection)
// Delete Sub Section
router.delete("/deleteSubsection", auth, isInstructor, deleteSubsection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategory", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)


//********************course progress********************************************
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingAndReviews)

module.exports = router