import React from 'react'
import InstructorImage from "../../../assets/Images/Instructor.png"
import HighlightText from "./HighlightText"
import CTAButton from "./Button"
import { FaArrowRight } from "react-icons/fa";

function InstructorSection() {
  return (
    <div className='mt-16'>
        <div className='flex flex-row gap-20 items-center'>

          <div className='w-[50%]'>
            <img src={InstructorImage} alt="" className='shadow-white' />
          </div>

          <div className='w-[50%] flex flex-col gap-10 items-start'>
            <div className='text-4xl font-semibold'>
              Become an <br/>
              <HighlightText text={"instructor"} />
            </div>

            <p className='font-medium text-[16px] w-[85%] text-richblack-300'>
              Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            <CTAButton active={true} linkto={"/signup"}>
              <div className='flex flex-row gap-2 items-center'>
                <p>Start Teaching Today</p>
                <FaArrowRight />
              </div> 
            </CTAButton>

          </div>

        </div>
    </div>
  )
}

export default InstructorSection