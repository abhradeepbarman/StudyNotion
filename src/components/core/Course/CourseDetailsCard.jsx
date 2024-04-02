import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from '../../../utils/constants'
import toast from 'react-hot-toast'
import { addToCart } from '../../../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa";
import copy from 'copy-to-clipboard'

function CourseDetailsCard({course, setConfirmationModal, handleBuyCourse}) {

  const {user} = useSelector((state) => state.profile)
  const {token} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    thumbnail,
    price,
    _id: courseId,
  } = course

  const handleAddToCart = () => {
    if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor. You can't buy a course")
      return
    }

    if(token) {
      dispatch(addToCart(course))
      return
    }

    setConfirmationModal({
      text1: "You are not Logged in!",
      text2: "Please login to add cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null)
    })
  }

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  return (
    <div>
      <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
        <img 
          src={thumbnail}
          alt=''
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {price}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleBuyCourse}
              className='yellowButton'
            >
              {
                user &&  course?.studentsEnrolled.includes(user?._id) 
                ? "Go To Course"
                : "Buy Now"
              }
            </button>

            {
              (!user || !course?.studentsEnrolled.includes(user?._id)) 
              && (
              <button onClick={handleAddToCart} className="blackButton">
                Add to Cart
              </button>)
            }
          </div>

          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-day Money Back Gurantee
            </p>
          </div>

          <div>
            <p className={`my-2 text-xl font-semibold `}>
              This course includes : 
            </p>

            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {
                course?.instructions?.map((item, i) => (
                  <p key={i} className={`flex gap-2`}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                ))
              }
            </div>
          </div>  

          <div className="text-center">
            <button onClick={handleShare}
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
            >
              <FaShareSquare size={15}  /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsCard