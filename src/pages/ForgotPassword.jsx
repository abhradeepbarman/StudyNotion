import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';
import { FaArrowLeftLong } from "react-icons/fa6";

function ForgotPassword() {

    const {loading} = useSelector((state) => state.auth);
    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()

    const handleOnSubmit = (e) => {
        e.preventDefault();
        getPasswordResetToken(email, setEmailSent, dispatch);
    }

  return (
    <div className='flex justify-center items-center mt-[150px] text-richblack-5'>
        {
            loading ? (
                <div className='flex flex-col items-center justify-center gap-y-2 '>
                    <div className='spinner'></div>
                    <p className='font-bold'>Loading...</p>
                </div>
            )
            : (
                <div className='w-[400px] space-y-3'>
                    <h1 className='text-3xl font-semibold text-richblack-5'>
                        {
                            !emailSent ? "Reset your Password" : "Check your Email"
                        }
                    </h1>

                    <p className='text-richblack-500'>
                        {
                            !emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                            : `We have sent the reset email to ${email}`
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}
                    className='flex flex-col'
                    >
                        {
                            !emailSent && (
                                <label className='flex flex-col gap-y-2'>
                                    <p className='text-richblack-100'>
                                        Email Address
                                        <sup className='text-red-600 text-r'>*</sup>
                                    </p>
                                    <input 
                                        required
                                        type='email'
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder='Enter your Email Address'
                                        style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                                    />

                                </label>
                            )
                        }

                        <button type='submit'
                        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-semibold text-richblack-800"
                        >
                            {
                            !emailSent? "Reset Password" 
                            : "Resend Email"
                            }
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

export default ForgotPassword