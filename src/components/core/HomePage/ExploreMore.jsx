import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore";
import HighlightText from "./HighlightText"
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths",
];

function ExploreMore() {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMycards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div className='relative flex flex-col items-center'>
        <div className='text-4xl font-semibold text-center'>
            Unlock the 
            <HighlightText text={"Power of Code"} />
        </div>

        <p className=' text-center text-richblack-300 text-lg font-semibold mt-3'>Learn to Build Anything You Can Imagine</p>

        <div className='mt-5 hidden md:flex flex-row rounded-full bg-richblack-800 mb-5 border-b border-richblack-500 px-3 py-1 w-fit mx-auto'>
            {
                tabsName.map((element, index) => {
                    return (
                        <div
                        className={`text-[16px] flex flex-row items-center gap-2 ${currentTab === element 
                        ? "bg-richblack-900 text-richblack-5 font-medium" 
                        : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                        key={index}
                        onClick={() => setMycards(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>
        
        <div className='h-[1000px] md:h-[150px]'></div>

        {/* course card group  */}
        <div className='flex flex-col md:flex-row gap-x-10 absolute top-44 mt-5'>
            {
                courses.map((element, index) => {
                    return (
                        <CourseCard
                        key={index}
                        cardData = {element}
                        currentCard = {currentCard}
                        setCurrentCard = {setCurrentCard}
                         />
                    )
                })
            }
        </div>

    </div>
  )
}

export default ExploreMore