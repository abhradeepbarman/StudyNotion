import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn'
import { MdOutlineFileUpload } from "react-icons/md";
import {updateDisplayPicture} from "../../../services/operations/settingsAPI"

function ChangeProfilePicture() {

  const {user} = useSelector((state) => state.profile)
  const {token} = useSelector((state) => state.auth)

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if(file) {
      setImageFile(file);
      setPreviewFile(file);
    }
  }
  
  const handleClick = (e) => {
    fileInputRef.current.click();
  }

  const handleFileUpload = () => {
    try {
      console.log("uploading file...");  
      setLoading(true)

      //we are using form data because in backend, image is accepted in form data format
      const formData = new FormData();
      formData.append("displayPicture", imageFile)
      dispatch(updateDisplayPicture(token, formData))
        .then(() => setLoading(false))
    } 
    catch (error) {
        console.log("Error while file uploading");
        console.log(error);
    }
  }

  return (

    <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex items-center gap-x-4">
        <img src={user?.image} alt={`profile-${user.firstName}`}
        className='aspect-square w-[78px] rounded-full object-cover' />

        <div  className="space-y-2">
          <p>Change Profile Picture</p>
          <div className="flex flex-row gap-3">
            <input type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
            accept='image/png, image/gif, image/jpeg, image/jpg'
             />
            
            <button
            onClick={() => handleClick()}
            disabled={loading}
            className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'
            >
              Select
            </button>

            <IconBtn
            text={loading ? "Uploading..." : "Upload"}
            onClick={handleFileUpload}
            >
              {
                !loading &&
                <MdOutlineFileUpload className="text-lg text-richblack-900" />
              }
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeProfilePicture