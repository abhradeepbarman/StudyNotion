import React from 'react'
import CTAButton from './Button'
import { FaArrowRight } from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'

function CodeBlocks({
  position, heading, subheading, ctaBtn1, ctaBtn2, codeblock, backgroundGradient, codeColor, shadowColor
}) {
  return (
    <div className={`flex ${position} my-20 justify-around gap-10 px-8`}>
        
      {/* section1  */}
      <div className='flex flex-col w-[50%] gap-8'>
        {heading}
        <div className='text-richblack-300 font-bold w-[80%]'>
          {subheading}
        </div>

        <div className='flex gap-7 mt-7'>

          <CTAButton active={ctaBtn1.active} linkto={ctaBtn1.linkto}>
            <div className='flex gap-2 items-center'>
              {ctaBtn1.btnText}
              <FaArrowRight/>
            </div>
          </CTAButton>

          <CTAButton active={ctaBtn2.active} linkto={ctaBtn2.linkto}>
              {ctaBtn2.btnText}
          </CTAButton>

        </div>
      </div>

      {/* section 2 - code */}
      <div className='h-fit flex flex-row text-10[px] w-[100%] py-4 lg:w-[500px] glass relative'>
        {/*TODO: BG Gradient  */}

        <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold -mt-1'>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 leading-3`}>

           <TypeAnimation 
            sequence={[codeblock, 8000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true} 
    
            style={
              {
                whiteSpace: "pre-line",
                display: 'block',
              }
            }
           />
        </div>

        <div className={`w-[350px] h-[230px] opacity-20 absolute 
        ${shadowColor} blur-3xl  rounded-full right-[200px] -top-2`}></div>

      </div>

    </div>
  )
}

export default CodeBlocks