import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function RequirementField({
  label,
  name,
  register,
  errors,
  setValue,
  getValues
}) {

  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);
  const {editCourse, course} = useSelector((state) => state.course)

  const handleAddRequirement = () => {
    if(requirement) {
      setRequirementList([...requirementList, requirement])
    }
    setRequirement("");
  }

  const handleRemoveRequirement = (index) => {
    const newRequirementList = [...requirementList]
    newRequirementList.splice(index, 1)
    setRequirementList(newRequirementList)
  }

  useEffect(() => {
    if (editCourse) {
      setRequirementList(course?.instructions)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, requirementList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementList])

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name}  className="text-sm text-richblack-5">
        {label}
        <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          name={name}
          id={name}
          placeholder={"Enter Benefits of the course"}
          onChange={(e) => setRequirement(e.target.value)}
          value={requirement}
          className='w-full form-style'
        />
        <button
        type='button'
        onClick={handleAddRequirement}
        className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {
        requirementList.length > 0 &&
        <ul className="mt-2 list-inside list-disc">
          {
            requirementList.map((requirement, index) => (
              <li key={index} className="flex items-center text-richblack-5">
                <span>{requirement}</span>
                <button
                type='button'
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
                >
                  clear
                </button>
              </li>
            ))
          }
        </ul>
      }
      {
        errors[name] &&
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {errors[name].message}
        </span>
      }
    </div>
  )
}

export default RequirementField