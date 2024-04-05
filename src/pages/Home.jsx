import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from "../components/core/HomePage/TimelineSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import Footer from "../components/common/Footer"
import ReviewSlider from '../components/core/HomePage/ReviewSlider';

function Home() {
  return (
    <div>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between z-20 max-w-maxContent'>
      
        <Link to={"/signup"}>

            <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit  border-b-2 border-richblack-600 hover:border-none'>

              <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>

                <p>Become an Instructor</p>
                <FaArrowRight />
              </div>
            </div>
        </Link>

        <div className='text-center text-3xl md:text-4xl font-semibold mt-8'>
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className='w-[80%] text-center text-sm md:text-lg font-bold text-richblack-300 mt-4 max-w-maxContent'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </div>

        <div className='flex flex-col md:flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}>
                Learn More
            </CTAButton>
    
            <CTAButton active={false} linkto={"/login"}>
                Book a Demo
            </CTAButton>
        </div>

        <div className='mx-3 my-1 mt-14 relative'
        style={{boxShadow: "0px -10px 70px -30px #bfdbfe"}}
        >
          <video
            muted 
            loop
            autoPlay
          >
            <source src={Banner} type='video/mp4' />
          </video>
          <div className='absolute bg-white top-5 -right-5 w-[100%] h-[100%]  -z-30 '></div>
        </div>

        {/* code section 1  */}
        <div className='mt-8'>
          <CodeBlocks position={"flex-col lg:flex-row"}
          heading={
            <div className='text-3xl md:text-4xl font-semibold text-center md:text-start'>
              Unlock your <HighlightText text={"coding potential"} /> with our online courses.
            </div>
          }  
          subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
          ctaBtn1={
            {
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }
          }
          ctaBtn2={
            {
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }
          }
          codeblock={`<!DOCTYPE html>\n
          <html>\n
          head><>Example</\n
          title><linkrel="stylesheet"href="styles.css">\n
          /head>\n
          body>\n
          h1><ahref="/">Header</a>\n
          /h1>\n
          nav><ahref="one/">One</a><ahref="two/">Two</\n
          a><ahref="three/">Three</a>\n
          /nav>`}
          codeColor={"text-yellow-25"}
          shadowColor={"bg-yellow-5"}
          />  
        </div>

        {/* code section 2  */}
        <div>
          <CodeBlocks position={"lg:flex-row-reverse"}
          heading={
            <div className='text-3xl md:text-4xl font-semibold text-center md:text-start'>
              Start <HighlightText text={"coding in"} />  
              <br/> <HighlightText text={"seconds"} className="mt-4" />  
            </div>
          }  
          subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
          ctaBtn1={
            {
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }
          }
          ctaBtn2={
            {
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }
          }
          codeblock={`import React from 'react';\n
          import ReactDOM from 'react-dom/client';\n
          function Hello(props) {\n
            return (\n
                <div>\n
                    Hello World\n
                </div>\n
            );\n
          }\n
          const container = document.getElementById("root")\n
          const root = ReactDOM.createRoot(container);`}
          codeColor={"text-white"}
          shadowColor={"bg-blue-50"}
          />  
        </div>

        <ExploreMore />

      </div>


      {/* Section 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
          <div className='homepage_bg h-[330px]'>
              <div className='w-11/12 max-w-maxContent flex  items-center gap-5 mx-auto justify-center h-[250px]'>

                <div className='flex flex-row gap-7 text-white relative top-32 z-20'>

                  <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex items-center gap-3'>
                      Explore full Catalog
                      <FaArrowRight/>
                    </div>
                  </CTAButton>

                  <CTAButton active={false} linkto={"/signup"}>
                    <div>
                      Learn More 
                    </div>
                  </CTAButton>
                </div>

              </div>
          </div>

          <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between'>
              <div className='flex flex-col md:flex-row gap-12 mb-10 mt-[100px] justify-between'>
                  <div className='text-4xl font-semibold w-full md:w-[45%]'>
                    Get the skills you need for a 
                    <HighlightText text={"job that is in demand."} />
                  </div>

                  <div className='flex flex-col gap-8 w-full md:w-[40%] items-start'>
                    <div className='text-[16px]'>
                      The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>

                    <div>
                      <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                      </CTAButton>
                    </div>
                  </div>
              </div>


            <TimelineSection />

            <LearningLanguageSection />

          </div>


      </div>

      {/* Section 3 */}
      <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
        
          <InstructorSection />

          <h2 className='text-center text-2xl md:text-4xl font-semibold mt-10'>Reviews from other learners</h2>

          {/* review slider here */}
          <ReviewSlider />

      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home