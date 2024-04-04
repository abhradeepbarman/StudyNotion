import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
import IconBtn from '../../common/IconBtn';
import { IoIosArrowDown } from "react-icons/io";
import { getFullDetailsOfCourse } from '../../../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../../../store/slices/viewCourseSlice';

function VideoDetailsSidebar({setReviewModal}) {

    const [activeStatus, setActiveStatus] = useState("")
    const [videoBarActive, setVideoBarActive] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const {courseId, sectionId, subsectionId} = useParams()
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state) => state.viewCourse)
    const {token} = useSelector((state) => state.auth)

    useEffect(() => {
        ;(() => {
          if(!courseSectionData.length) {
            return;
          }

          const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
          )

          const currentSubsectionIndex = courseSectionData?.[currentSectionIndex]?.subsection.findIndex(
               (data) => data._id === subsectionId
          )

          const activeSubsectionId = courseSectionData[currentSectionIndex]?.subsection?.[currentSubsectionIndex]?._id;
          
          //set current section here
          setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
          //set current subsection here
          setVideoBarActive(activeSubsectionId);

        })()
    }, [courseSectionData, courseEntireData, location.pathname])

    useEffect(() => {
      const courseSpecificDetails = async() => {
        const courseData = await getFullDetailsOfCourse(courseId, token)
        console.log("course data......", courseData);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
        dispatch(setEntireCourseData(courseData?.courseDetails))
        dispatch(setCompletedLectures(courseData?.completedVideos))

        let lectures = 0
        courseData?.courseDetails?.courseContent.forEach((section) => {
            lectures += section.subsection.length
        })

        dispatch(setTotalNoOfLectures(lectures))
    }
    courseSpecificDetails()
    }, [])

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
          {/* for button and headings  */}
          <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
            {/* only for buttons  */}
            <div className="flex w-full items-center justify-between ">
              <div
                onClick={() => navigate("/dashboard/enrolled-courses")}
                className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 cursor-pointer"
                title='back'
              >
                <IoIosArrowBack size={30} />
              </div>

              <div >
                <IconBtn 
                  text={"Add Review"}
                  onClick={() => setReviewModal(true)}
                  customClasses="ml-auto"
                />
              </div>
            </div>

            {/* only for heading  */}
            <div className="flex flex-col">
              <p>{courseEntireData?.courseName}</p>
              <p className="text-sm font-semibold text-richblack-500">
                {completedLectures.length}/{totalNoOfLectures}
              </p>
            </div>
          </div>

          {/* for sections & subsections  */}
          <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
            {
              courseSectionData.map((section, index) => (
                <div
                  className="mt-2 cursor-pointer text-sm text-richblack-5"
                  onClick={() => setActiveStatus(section?._id)}
                  key={index}
                >

                  {/* section  */}
                  <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                      <div className="w-[70%] font-semibold">
                        {section?.sectionName}
                      </div>
                      <div>
                        {/* TODO: handle rotate logic  */}
                        <IoIosArrowDown />  
                      </div>
                  </div>

                  {/* subsection  */}
                  <div>
                    {
                      activeStatus === section?._id && (
                        <div className="transition-[height] duration-500 ease-in-out">
                          {
                            section?.subsection.map((topic, index) => (
                                <div
                                  className={`flex gap-3 px-5 py-2 
                                  ${videoBarActive === topic?._id 
                                  ? "bg-yellow-200 text-richblack-900"
                                  : "bg-richblack-900 text-white"
                                  }`}
                                  key={index}
                                  onClick={() => {
                                    navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)

                                    setVideoBarActive(topic?._id)
                                  }}
                                >
                                  <input 
                                    type='checkbox'
                                    checked={completedLectures.includes(topic?._id)}
                                    onChange={() => {}}
                                  />

                                  <span>
                                    {topic.title}
                                  </span>
                                </div>
                            ))
                          }
                        </div>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar