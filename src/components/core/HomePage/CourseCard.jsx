import React from 'react'
import { IoMdPeople } from "react-icons/io";
import { LuNetwork } from "react-icons/lu";

function CourseCard({cardData, currentCard, setCurrentCard}) {
  return (
    <div className='relative'>
        <div className={`flex flex-col  px-7 py-4 h-[290px] w-[380px] justify-between cursor-pointer transition-all duration-100
        ${currentCard === cardData.heading 
        ? "bg-white text-black" 
        : "bg-richblack-800 text-richblack-25" }`}
        onClick={() => setCurrentCard(cardData.heading)}
        >
            <div className='flex flex-col gap-y-3'>
                <h2 className='text-xl font-semibold'>{cardData.heading}</h2>
                <p className='text-richblack-300 text-[1.05rem]'>{cardData.description}</p>
            </div>

            <div className={`flex flex-row justify-between border-dashed border-t-2 pt-4 ${currentCard === cardData.heading ? "text-blue-300" : "text-richblack-400"} font-medium`}>
                <div className='flex flex-row justify-center items-center gap-2'>
                    <IoMdPeople />
                    <p>{cardData.level}</p>
                </div>

                <div className='flex flex-row justify-center items-center gap-2'>
                    <LuNetwork />
                    <p>{cardData.lessionNumber} Lessons</p>
                </div>
            </div>

        </div>

        <div className={`h-[290px] w-[380px]  
        ${currentCard === cardData.heading ? "bg-yellow-50 absolute -z-10 -right-3 top-3" : "" }
        `}></div>
    </div>
  )
}

export default CourseCard