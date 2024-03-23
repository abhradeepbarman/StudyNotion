import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OtpInput from 'react-otp-input';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, signUp } from '../services/operations/authAPI';
import { FaArrowLeftLong } from "react-icons/fa6";
import { BsArrowCounterclockwise } from "react-icons/bs";

function VerifyEmail() {
    const {signupData, loading} = useSelector((state) => state.auth)
    const [otp, setOtp] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(()=> {
        if(!signupData) {
           navigate("/signup") 
        }
    })


    function handleOnSubmit (e) {
        e.preventDefault()

        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData;

        signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate, dispatch);
    }

  return (
    <div  className='flex justify-center items-center mt-[150px] text-richblack-5'>
        {
            loading ? (
                <div className='flex flex-col items-center justify-center gap-y-2 '>
                    <div className='spinner'></div>
                    <p className='font-bold'>Loading...</p>
                </div>
            ) : (
                <div  className='w-[400px] space-y-3'>
                    <h1 className='text-3xl font-semibold text-richblack-5'>Verify Email</h1>
                    <p className='text-richblack-500'>
                        A verification code has been sent to you. Enter the code below
                    </p>

                    <form onSubmit={handleOnSubmit}
                    className='flex flex-col'
                    >
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={
                                (props) => <input {...props}
                                style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                                className="w-full rounded-[0.5rem] bg-richblack-800 px-[12px] py-3 text-richblack-5 mr-2"
                            />}
                        />

                        <button type='submit'
                        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-semibold text-richblack-800"
                        >
                            Verify Email
                        </button>
                    </form>

                    <div className='flex justify-between mt-2'>
                        <Link to={"/login"} className='flex gap-2 items-center text-richblack-5 text-md' >
                            <FaArrowLeftLong />
                            <p>Back to Login</p>
                        </Link>

                        <button onClick={() => sendOtp(signupData.email, navigate, dispatch)}
                        className='flex gap-2 items-center text-blue-100 text-md'
                        >
                            <BsArrowCounterclockwise />
                            <p>Resent it</p>
                        </button>
                    </div>

                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail