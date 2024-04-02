import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI'
import {HiOutlineCurrencyRupee} from "react-icons/hi"
import ChipInput from '../ChipInput'
import Upload from '../Upload'
import RequirementField from '../RequirementField'
import IconBtn from '../../../../common/IconBtn'
import {MdNavigateNext} from "react-icons/md"
import { setStep, setCourse, setEditCourse } from '../../../../../store/slices/courseSlice'
import toast from 'react-hot-toast'
import { addCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import {COURSE_STATUS} from "../../../../../utils/constants"
import { FaSleigh } from 'react-icons/fa'

function CourseInformationForm() {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = useForm()

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth)

    const {editCourse, course} = useSelector((state) => state.course)
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([])

    useEffect(() => {
        const getCategories = async() => {
            setLoading(true)
            
            const categories = await fetchCourseCategories()
            console.log(categories);
            if(categories) {
                setCourseCategories(categories);
            }


            setLoading(false);
        }

        if(editCourse) {
            console.log("course.....", course);
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category._id);
           setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
        }

        getCategories()
    }, [])


    function isFormUpdated() {
        const currentValues = getValues()

        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() || 
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseImage !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instructions.toString()
        ) {
            return true
        }
        else {
            return false
        }
    }

    //   handle next button click
    const onSubmit = async (data) => {
        
        if (editCourse) {
            
            if (isFormUpdated()) {
                const currentValues = getValues()
                const formData = new FormData()
                console.log(data)

                formData.append("courseId", course._id)
                if (currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle)
                }

                if (currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc)
                }

                if (currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice)
                }

                if (currentValues.courseTags.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags))
                }

                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits)
                }

                if (currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory)
                }

                if (currentValues.courseRequirements.toString() !==
                course.instructions.toString()
                ) {
                    formData.append(
                        "instructions",
                        JSON.stringify(data.courseRequirements)
                    )
                }

                if (currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }

        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setEditCourse(FaSleigh))
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } 
      else {
        toast.error("No changes made to the form")
      }

      return;
    }
    
        //New Course
        const formData = new FormData()

        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        console.log("courseRequirements:", data.courseRequirements);
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        console.log("Form data ....", formData);
    
        setLoading(true)
        const result = await addCourseDetails(formData, token)
    
        console.log("result ...", result);
        
        if (result) {
            dispatch(setStep(2))
            dispatch(setCourse(result))
        }
        setLoading(false)
    }


  return (
    <form onSubmit={handleSubmit(onSubmit)}
    className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >

        {/* Course Title  */}
        <div className="flex flex-col space-y-2">
            <label htmlFor='courseTitle' className="text-sm text-richblack-5">
                Course Title
                <sup className="text-pink-200">*</sup>
            </label>
            <input
                type="text"
                name="courseTitle"
                id="courseTitle"
                placeholder="Enter Course Title"
                {...register("courseTitle", { required: true })}
                className="form-style w-full"
            />
            {
                errors.courseTitle && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter a valid course title
                    </span>
                )
            }
        </div>
        
        {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
            <label htmlFor='courseShortDesc' className="text-sm text-richblack-5">
                Course Short Description
                <sup className="text-pink-200">*</sup>
            </label>
            <textarea
                name="courseShortDesc"
                id="courseShortDesc"
                placeholder="Enter Course Short Description"
                {...register("courseShortDesc", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
            />
            {
                errors.courseShortDesc && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter a valid course short description
                    </span>
                )
            }
        </div>
        
        {/* Course Price  */}
        <div className="flex flex-col space-y-2">
            <label htmlFor='coursePrice' className="text-sm text-richblack-5">
                Course Price
                <sup className="text-pink-200">*</sup>
            </label>
            <div className="relative">
                <input
                    type="text"
                    name="coursePrice"
                    id="coursePrice"
                    placeholder="Enter Course Price"
                    {...register("coursePrice", { 
                            required: true, 
                            valueAsNumber: true, 
                    })}
                    className="form-style w-full !pl-12"
                />
                <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
            </div>
            
            {
                errors.coursePrice && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter a valid course price
                    </span>
                ) 
            }
        </div>
        
        {/* Course Category */}
        <div className="flex flex-col space-y-2">
            <label htmlFor='courseCategory' className="text-sm text-richblack-5">
                Course Category 
                <sup className="text-pink-200">*</sup>
            </label>
            <select
            id='courseCategory'
            defaultValue={""}
            {...register("courseCategory", {required:true})}
            className="form-style w-full"
            >
                <option value={""} disabled >Choose a category</option>
                {
                    !loading && courseCategories.map((category) => (
                        <option key={category.id} value={category._id}>
                            {category.name}
                        </option>
                    ))
                }
            </select>
            {
                errors.courseCategory && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please select a valid course category
                    </span>
                )
            }
        </div>

        {/* create a custom tag for handling tags input  */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter tags and press enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />


         {/* create a component for uploading & showing preview of media */}
         <Upload
            label="Course Thumbnail"
            name="courseImage"
            id="courseImage"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
          />

        {/* Benefits of the Course  */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
                Benefits of the Course
                <sup className="text-pink-200">*</sup>
            </label>
            <textarea
                name="courseBenefits"
                id="courseBenefits"
                placeholder="Enter Benefits of the Course"
                {...register("courseBenefits", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
            />
            {
                errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Please enter a valid benefits of the course
                    </span>
                )
            }
        </div>

        {/* Requirements  */}
        <div>
            <RequirementField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
            />
        </div>

        {/* Next Button */}
        <div className="flex justify-end gap-x-2">
            {
                editCourse && (
                    <button
                        onClick={() => dispatch(setStep(2))}
                        disabled={loading}
                        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue without Saving
                    </button>   
                )
            }
            <IconBtn
                type={"Submit"}
                disabled={loading}
                text={!editCourse ? "Next" : "Save Changes"}
            >
                <MdNavigateNext />
            </IconBtn>
        </div>

    </form>
  )
}

export default CourseInformationForm