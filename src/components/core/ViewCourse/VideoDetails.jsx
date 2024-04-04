import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI'
import { updateCompletedLectures } from '../../../store/slices/viewCourseSlice'
import { BigPlayButton, Player } from 'video-react'
import { FaPlay } from "react-icons/fa";
import IconBtn from '../../common/IconBtn'

function VideoDetails() {

  const {courseId, sectionId, subsectionId} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const playerRef = useRef()
  const location = useLocation()
  const {token} = useSelector((state) => state.auth)
  const {courseSectionData, courseEntireData, completedLectures} = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const setVideoSpecificDetails = async() => {
      if(!courseSectionData.length) {
        return;
      }

      if(!courseId || !sectionId || !subsectionId) {
        navigate("/dashboard/enrolled-courses")
      }
      else {
        //lets assume all 3 fields are present
        const filteredData = courseSectionData.filter(
          (section) => section._id === sectionId 
        )

        const filteredVideoData = filteredData?.[0]?.subsection.filter(
          (data) => data._id === subsectionId
        )

        setVideoData(filteredVideoData[0])
        setVideoEnded(false)
      }
    }

    setVideoSpecificDetails()
  }, [courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    //find section Index
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    )

    //find subsection index
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subsection.findIndex(
      (data) => data._id === subsectionId
    )

    if(currentSectionIndex === 0 && currentSubsectionIndex === 0) {
      return true
    }
    else {
      return false
    }
  }

  const isLastVideo = () => {
    //find section Index
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections = courseSectionData[currentSectionIndex].subsection.length
    
    //find subsection index
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subsection.findIndex(
      (data) => data._id === subsectionId
    )

    if(currentSectionIndex === courseSectionData.length - 1
      && currentSubsectionIndex === noOfSubsections - 1
    ) {
      return true
    }
    else {
      return false
    }
  }

  const goToNextVideo = () => {
    //find section Index
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections = courseSectionData[currentSectionIndex].subsection.length

    //find subsection index
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subsection.findIndex(
      (data) => data._id === subsectionId
    )

    if(currentSubsectionIndex !== noOfSubsections - 1) {
      //same section ki next video me jaao
      const nextSubsectionId = courseSectionData[currentSectionIndex]?.subsection[currentSubsectionIndex + 1]._id

      // go to this video
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubsectionId}`)
    }
    else {
      //next section ka first video me jaao
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubsectionId = courseSectionData[currentSectionIndex + 1]?.subsection[0]._id

      //go to this video
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`)
    }
  }

  const goToPrevVideo = () => {
    //find section Index
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections = courseSectionData[currentSectionIndex].subsection.length
    
    //find subsection index
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subsection.findIndex(
      (data) => data._id === subsectionId
    )

    if(currentSubsectionIndex !== 0) {
      //same section ki prev video me jaao
      const prevSubsectionId = courseSectionData[currentSectionIndex]?.subsection[currentSubsectionIndex - 1]._id

      // go to this video
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubsectionId}`)
    }
    else {
      //different section ka last video me jaao
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubsectionLength = courseSectionData[currentSectionIndex - 1].subsection.length
      const prevSubsectionId = courseSectionData[currentSectionIndex - 1]?.subsection[prevSubsectionLength - 1]._id

      //go to this video
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubsectionId}`)
    }
  }

  const handleLectureCompletion = async() => {

    setLoading(true)

    const res = await markLectureAsComplete({
      courseId: courseId,
      subsectionId: subsectionId
    }, token)

    //update in state
    if(res) {
      dispatch(updateCompletedLectures(subsectionId))
      console.log("updated..", completedLectures);
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white">
        {
          !videoData ? (
            <div className='text-3xl mt-10 font-semibold'>
              No Data Found
            </div>
          )
          : (
            <Player
              ref= {playerRef}
              aspectRatio='16:9'
              playsInline
              onEnded={() => setVideoEnded(true)}
              src={videoData?.videoUrl}
            >
              {/* Play Button  */}
              <BigPlayButton position="center" />

              {/* Render when video ends */}
              {
                videoEnded && (
                  <div
                    style={{
                      backgroundImage: "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                    }}
                    className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                  >
                    {
                      !completedLectures.includes(subsectionId) && (
                        <IconBtn   
                          disabled={loading}
                          onClick={() => handleLectureCompletion()}
                          text={!loading ? "Mark as Completed" : "Loading.."}
                          customClasses="text-xl max-w-max px-4 mx-auto"
                        />
                      )
                    }

                    <IconBtn 
                      disabled={loading}
                      onClick={() => {
                        if(playerRef?.current) {
                          playerRef?.current?.seek(0)
                          setVideoEnded(false)
                        }
                      }}
                      text={"Rewatch"}
                      customClasses="text-xl max-w-max px-4 mx-auto mt-5"
                    />

                    <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                      {
                        !isFirstVideo() && (
                          <button
                            disabled={loading}
                            onClick={goToPrevVideo}
                            className='blackButton'
                          >
                            Prev
                          </button>
                        )
                      }
                      {
                        !isLastVideo() && (
                          <button
                            disabled={loading}
                            onClick={goToNextVideo}
                            className='blackButton'
                          >
                            Next
                          </button>
                        )
                      }
                    </div>

                  </div>
                )
              }
            </Player>
          )
        }

        <h1 className="mt-4 text-3xl font-semibold">
          {videoData?.title}
        </h1>
        <p className="pt-2 pb-6">
          {videoData?.description}
        </p>
    </div>
  )
}

export default VideoDetails