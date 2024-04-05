import React from 'react'
import { IoMdPeople } from "react-icons/io";
import { LuNetwork } from "react-icons/lu";

function CourseCard({cardData, currentCard, setCurrentCard}) {
  return (
        <div className={`h-[300px] w-[290px] md:w-[380px]  box-border cursor-pointer text-richblack-25
        ${currentCard === cardData.heading 
        ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50" 
        : "bg-richblack-800" } my-5`}
        onClick={() => setCurrentCard(cardData.heading)}
        >
            <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
                <div className={` ${ currentCard === cardData?.heading && "text-richblack-800"
                } font-semibold text-[20px]`}>
                    {cardData.heading}
                </div>
                <p className='text-richblack-400'>{cardData.description}</p>
            </div>

            <div className={`flex justify-between ${
          currentCard === cardData?.heading ? "text-blue-300" : "text-richblack-300"} px-6 py-3 font-medium`}>
                <div className="flex items-center gap-2 text-[16px]">
                    <IoMdPeople />
                    <p>{cardData.level}</p>
                </div>

                <div className="flex items-center gap-2 text-[16px]">
                    <LuNetwork />
                    <p>{cardData.lessionNumber} Lessons</p>
                </div>
            </div>

        </div>
  )
}

export default CourseCard