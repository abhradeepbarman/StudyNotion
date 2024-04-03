import React, { useEffect, useState } from 'react'
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";

function CourseAccordian({section, isActive, handleActive}) {

    const convertSeconds = (seconds) => {
        let hours = Math.floor(seconds/3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const remainingSecondsFinal = Math.floor(remainingSeconds % 60);
    
        let str = ``;
        if(hours !== 0) 
            str += `${hours}hours`;
        if(minutes !== 0)
            str += ` ${minutes}min`
        if(remainingSecondsFinal !== 0)
            str += ` ${remainingSecondsFinal}sec`
        
        return str.trim();
    };

    const countDuration = (section) => {
        console.log(section);
        let duration = 0;
        
        section.subsection.forEach((sub) => {
            duration += parseInt(sub.timeDuration)
        });

        console.log("duratio...", duration);

        return duration
    }

  return (
    <div>
        <details open={isActive} >
            <summary className='flex justify-between bg-richblack-700 p-5 border border-richblack-600 cursor-pointer'>
                <div className='flex gap-x-3 items-center'>
                    <IoIosArrowDown />
                    <div>
                        {section.sectionName}
                    </div>
                </div>
                <div className='flex gap-x-5'>
                    <div className='text-yellow-50'>
                        {section.subsection.length || 0} lectures
                    </div>
                    <div>
                        {
                            convertSeconds(countDuration(section))
                        }
                    </div>
                </div>
            </summary>


            <div className='px-5'>
                {
                    section.subsection.map((sub, i) => (
                        <div className='flex justify-between'
                            key={i}
                        >
                            <div className='flex gap-x-3 py-4'
                            >
                                <div className='mt-1'>
                                    <HiMiniVideoCamera />
                                </div>
                                <div className='flex flex-col gap-y-1'>
                                    <div className='font-semibold font-inter tracking-wide'>
                                        {sub.title}
                                    </div>
                                    <div className='text-richblack-300'>
                                        {sub.description}
                                    </div>
                                </div>
                            </div>

                            <div className='py-6 text-richblack-300'>
                                {convertSeconds(sub.timeDuration)}
                            </div>
                        </div>
                    ))
                }
            </div>
        </details>
    </div>
  )
}

export default CourseAccordian