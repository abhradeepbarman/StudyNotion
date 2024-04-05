import React from "react"
import ContactDetails from "../components/core/ContactPage/ContactDetails"
import ContactForm from "../components/core/ContactPage/ContactUsForm"
import Footer from "../components/common/Footer"
import ReviewSlider from "../components/core/HomePage/ReviewSlider"

const Contact = () => {
  return (
    <div>

        {/* first section  */}
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%] p-16 border border-richblack-500 rounded-xl">
            {/* heading section  */}
            <div className="flex flex-col gap-2 mb-5">
                <h1 className="text-2xl md:text-4xl text-richblack-5 font-bold">
                    Got a Idea? We've got the skills. Let's team up
                </h1>
                <p className="text-richblack-400 text-base font-inter">
                    Tell us more about yourself and what you're got in mind.
                </p>
            </div>

            <ContactForm />
        </div>
      </div>


      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>

        {/* <ReviewSlider /> */}
        {/* review slider here */}
        <div className='w-11/12 mx-auto'>
            <ReviewSlider />
        </div>
      </div>


      {/* Footer section  */}
      <Footer />
    </div>
  )
}

export default Contact