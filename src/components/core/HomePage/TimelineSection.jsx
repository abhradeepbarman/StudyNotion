import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timeLine = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description: "Fully committed to the success of company" 
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Description: "Students will always be our top priority" 
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        Description: "The ability to switch is an important skills" 
    },
    {
        Logo: Logo4,
        heading: "Solve the problem",
        Description: "Code your way to a solution" 
    },
];

function TimelineSection() {
  return (
    <div>
        <div className='flex flex-col md:flex-row gap-14 items-center'>
            <div className='w-full md:w-[45%] flex flex-col gap-3'>
                {
                    timeLine.map((element, index) => {
                        return(
                            <div key={index}>
                                <div className='flex flex-row gap-6 mb-2' key={index}>
                                    <div className='w-[50px] h-[50px] bg-white flex justify-center items-center rounded-full'>
                                        <img src={element.Logo} alt='logo' />
                                    </div>

                                    <div>
                                        <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                        <p className='text-base'>{element.Description}</p>
                                    </div>

                                    

                                </div>   

                                {index !== timeLine.length-1 
                                ? <div className='h-[50px] border-dashed border-l border-richblack-200 translate-x-6'></div> 
                                : ""}
                            </div>
                        )
                    })
                }
            </div>

            <div className='relative shadow-blue-200 z-20'>
                <img src={timelineImage} alt='timeline' className='shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit'/>

                <div className='absolute bg-caribbeangreen-700 flex flex-col md:flex-row gap-y-5 text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%]'>
                    <div className='flex flex-row gap-3 md:gap-10 items-center  md:border-r border-caribbeangreen-300 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                    </div>

                    <div className='flex flex-row gap-3 md:gap-10 items-center px-7 '>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>TYPES OF COURSES</p>
                    </div>
                </div>

                <div className='w-[100%] h-40 rounded-full bg-blue-100 blur-3xl absolute top-36 -z-20'></div>
            </div>

        </div>
    </div>
  )
}

export default TimelineSection