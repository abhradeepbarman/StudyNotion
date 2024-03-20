import React from 'react'
import HighlightText from "./HighlightText"
import KnowYourProgress from "../../../assets/Images/Know_your_progress.svg"
import CompareWithOthers from "../../../assets/Images/Compare_with_others.svg"
import PlanYourLessons from "../../../assets/Images/Plan_your_lessons.svg"
import CTAButton from "./Button";

function LearningLanguageSection() {
  return (
    <div className='mt-[150px] mb-20'>
      <div className='flex flex-col gap-5 items-center'>
        
        <div className='text-4xl font-semibold text-center'>
          Your swiss knife for 
          <HighlightText text={"learning any language"} />
        </div>

        <div className='text-center text-richblack-700 mx-auto text-[17px] font-medium w-[80%]'>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-row items-center justify-center mt-5 mx-auto'>
          <img src={KnowYourProgress} 
                alt='KnowYourProgressImage' 
                className='object-contain -mr-32' />
          <img src={CompareWithOthers} alt='CompareWithOthersImage' className='object-contain' />
          <img src={PlanYourLessons} alt='PlanYourLessonsImage' className='object-contain -ml-36' />
        </div>

        <div className='w-fit'>
          <CTAButton active={true} linkto={"/signup"}>
            <div>
              Learn More
            </div>
          </CTAButton>
        </div>

      </div>
    </div>
  )
}

export default LearningLanguageSection