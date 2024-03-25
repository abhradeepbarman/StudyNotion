import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {apiConnector} from "../../../services/apiConnector"
import {contactusEndpoint} from "../../../services/apis"
import CountryCode from "../../../data/countrycode.json"

function ContactUsForm() {

    const [loading, setLoading] = useState(false);

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitSuccessful }
    } = useForm();

    useEffect(() => {
      if(isSubmitSuccessful) {
        reset({
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          message: "",
        })
      }
    }, [isSubmitSuccessful, reset])

    //sending data in backend on form submission
    const submitContactForm = async(data) => {
      console.log(data);
      
      try {
        setLoading(true);
        const {CONTACT_US_API} = contactusEndpoint;
        
        const response = await apiConnector("POST", CONTACT_US_API, data);
        console.log( "logging response", response);
        setLoading(false);
      } 
      catch (error) {
        console.log("Error: ", error);
        setLoading(false);
      }
    }

  return (
    <form onSubmit={handleSubmit(submitContactForm)}
    className="flex flex-col gap-7"
    >

        <div className="flex flex-col gap-5">

          {/* first name & last name */}
          <div className="flex flex-row gap-4">
              {/* first name  */}
              <div className='lg:w-[48%]'>
                <label className="lable-style flex flex-col gap-1">
                  <p>
                    First Name
                  </p>
                  <input 
                    type="text"
                    name='firstName'
                    id='firstName'
                    placeholder="Enter first name"
                    className="form-style"
                    {...register("firstName", { required: true })}
                  />
                  {
                    errors.firstName && (
                      <span>
                        Please enter a valid first name
                      </span>
                    )
                  }
                </label>
              </div>

            {/* last name */}
            <div className="lg:w-[48%]">
              <label className="lable-style flex flex-col gap-1">
                <p>
                  Last Name
                </p>
                <input 
                  type="text"
                  name='lastName'
                  id='lastName'
                  placeholder="Enter last name"
                  className="form-style"
                  {...register("lastName")}
                />
              </label>
            </div>
          </div>

          {/* email  */}
          <div className="flex flex-col gap-2">
            <label className="lable-style flex flex-col gap-1"> 
                <p>
                  Email Address
                </p>
                <input 
                  type="text"
                  name='email'
                  id='email'
                  placeholder="Enter email address"
                  className="form-style"
                  {...register("email", { required: true })}
                />
                {
                  errors.email && (
                    <span>
                      Please enter a valid email address
                    </span>
                  )
                }
            </label>
          </div>
          
          {/* phone number  */}
          <div className="flex flex-col gap-2">

            <label htmlFor='phoneNumber' className="lable-style">Phone Number</label>

            <div className="flex gap-5">
              {/* dropdown  */}
              <div className="flex w-[81px] flex-col gap-2">
                <select
                name='dropdown'
                id='dropdown'
                className="form-style"
                {...register("countryCode", {required: true})}
                >
                {
                  CountryCode.map((element, index) => (
                    <option key={index} value={element.code}
                    selected={element.country === "India"}
                    >
                      {element.code} - {element.country}
                    </option>
                  ))
                } 

                </select>
              </div>

              {/* phone number field  */}
              <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                <input 
                  type="number"
                  name='phoneNumber'
                  id='phoneNumber'
                  placeholder="01234 56789"
                  className="form-style"
                  {...register("phoneNumber", 
                  { required: {value: true, message: "Invalid phone number"}, 
                  maxLength: {value: 10, message: "Invalid phone number",
                  minLength: {value: 8, message: "Invalid phone number"}}
                })}
                />
              </div>
              {
                errors.phoneNumber && 
                (
                  <span>
                    {errors.phoneNumber.message}
                  </span>
                )
              }


            </div>
          </div>

          {/* message */}
          <div className="flex flex-col gap-2">
            <label className="lable-style flex flex-col gap-1">
              <p>
                Message
              </p>
              <textarea 
                type="text"
                name='message'
                rows="7"
                cols="30"
                id='message'
                placeholder="Enter your message here"
                className="form-style"
                {...register("message", {required: true})}
              />
              {
                errors.message && (
                  <span>
                    Please enter message
                  </span>
                )
              }
            </label>
          </div>

        </div>

        <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
        >
          Send Message
       </button>
    </form>
  )
}

export default ContactUsForm