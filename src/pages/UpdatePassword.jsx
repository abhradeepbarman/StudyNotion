import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/operations/authAPI'
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";

function UpdatePassword() {
    const {loading} = useSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })

    const {password, confirmPassword} = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value
            }
        ))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        //call services to connect backend
        const token = location.pathname.split('/').at(-1);
        resetPassword(password, confirmPassword, token, dispatch, navigate)
    }

  return (
    <div className='flex justify-center items-center mt-[150px]'>
        {
            loading ? (
                <div className='flex flex-col items-center justify-center gap-y-2 '>
                    <div className='spinner'></div>
                    <p className='font-bold'>Loading...</p>
                </div>
            ) : (
                <div className='text-richblack-5 w-[420px] flex flex-col space-y-2'>
                    <h1 className='text-3xl font-semibold'>Choose New Password</h1>
                    <p className='text-richblack-500'>
                        Almost done. Enter your new password and youre all set.
                    </p>
                    <form onSubmit={handleOnSubmit} className='flex flex-col gap-y-2 my-2'>
                        
                        <label  className='flex flex-col gap-y-1 relative'>
                            <p className='text-richblack-100'>
                                New Password 
                                <sup className='text-red-600'>*</sup> 
                            </p>
                            <input 
                                required 
                                type= {showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={handleOnChange}
                                style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                            />
                            
                            {/* Add Eye icon to show password  */}
                            <span 
                            onClick={() => setShowPassword((prev) => !prev)}
                            className='absolute right-4 top-10 cursor-pointer text-xl'
                            >
                                {
                                    showPassword ? <FiEyeOff /> : <FiEye />
                                }
                            </span>
                        </label>
                        
                        <label className='flex flex-col gap-y-1 relative'>
                            <p className='text-richblack-100'>
                                Confirm new Password 
                                <sup className='text-red-600'>*</sup> 
                            </p>
                            <input 
                                required 
                                type= {showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleOnChange}
                                style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                            />
                            {/* Add Eye icon to show password  */}
                            <span 
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className='absolute right-4 top-10 cursor-pointer text-xl'
                            >
                                {
                                    showConfirmPassword ? <FiEyeOff /> : <FiEye />
                                }
                            </span>
                        </label>

                        <div className='grid grid-cols-2 gap-y-1 text-caribbeangreen-300'>
                            <div className='flex gap-2 items-center'>
                                <FaCircleCheck />
                                <p>one lowercase character</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <FaCircleCheck />
                                <p>one special character</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <FaCircleCheck />
                                <p>one uppercase character</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <FaCircleCheck />
                                <p>8 character minimum</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <FaCircleCheck />
                                <p>one number</p>
                            </div>
                        </div>

                        <button type='submit'
                        className="mt-3 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-semibold text-richblack-800"
                        >
                            Reset Password
                        </button>
                    </form>


                    <div>
                        <Link to={"/login"} className='flex gap-2 items-center text-richblack-5' >
                            <FaArrowLeftLong />
                            <p>Back to Login</p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword