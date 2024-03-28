import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { useSelector } from 'react-redux';

function ChipInput({
    label,
    name,
    placeholder,
    register,
    errors,
    setValue,
    getValues
}) {

    const [chips, setChips] = useState([])
    const {editCourse, course} = useSelector((state) => state.course)

    const handleDeleteChip = (index) => {
        const newChips = [...chips]
        newChips.splice(index, 1)
        setChips(newChips)
    }

    const handleKeyDown = (event) => {
        if(event.key === "Enter" || event.key === ",") {
            event.preventDefault()

            const chipValue = event.target.value.trim()

            if(chipValue && !chips.includes(chipValue)) {
                const newChips = [...chips, chipValue]
                setChips(newChips)
                event.target.value = ""
            }
        }
    }

    useEffect(() => {
        if(editCourse) {
            setChips(course?.tag)
        }
        register(name, { required: true, validate: (value) => value.length > 0})
    }, [])

    useEffect(() => {
        setValue(name, chips)
    }, [chips])

  return (

    <div className="flex flex-col space-y-2">
        {/* Render the label for the input */}
        <label  className="text-sm text-richblack-5" htmlFor={name}>
            {label}
            <sup className="text-pink-200">*</sup>
        </label>

        {/* Render the chips and input */}
        <div className="flex w-full flex-wrap gap-y-2">
            {
                chips.map((chip, index) => (
                    <div key={index}
                    className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                    >
                        {chip}
                        {/* render the delete button for the chip */}
                        <button type='button' onClick={() => handleDeleteChip(index)}
                        className="ml-2 focus:outline-none"
                        >
                            <IoMdClose />
                        </button>
                    </div>
                ))
            }
        </div>

        {/* Render the input for adding new chips */}
        <input
            id={name}
            name={name}
            type="text"
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="form-style w-full"
        />
        {
            errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Please enter a valid {label}
                </span>
            )
        }
    </div>
  )
}

export default ChipInput