import {toast} from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import {settingsEndpoints} from "../apis"
import { setUser } from "../../store/slices/profileSlice"
import {logout} from "./authAPI"

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} =  settingsEndpoints

export function updateDisplayPicture(token, formdata) {
    return async(dispatch) => {
        const toastId = toast.loading("loading...")

        try {
            const response = await apiConnector(
                "PUT", 
                UPDATE_DISPLAY_PICTURE_API,
                formdata,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            )

            console.log(
                "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
                response
            )

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            
            toast.success("Display Picture updated successfully")
            dispatch(setUser(response.data.data))
        } 
        catch (error) {
            console.log("UPDATE_DISPLAY_PICTURE_API error: " + error);
            toast.error("Couldn't update Display Picture")
        }

        toast.dismiss(toastId);
    }
}

export function updateProfile(token, formData, user) {

    return async(dispatch) => {
        const toastId = toast.loading("Loading...")

        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_PROFILE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            )

            console.log(response);
            
            if(!response.data.success) {
                throw new Error(response.data.message)
            }

            
            dispatch(setUser({...user, additionalDetails: response.data.profileDetails}));

            console.log("user -->", user);

            toast.success("Profile updated successfully")

        } 
        catch (error) {
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Update Profile")
        }

        toast.dismiss(toastId)
    }
}

export async function updatePassword(token, formData) {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
            Authorization: `Bearer ${token}`,
        })
        console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } 
  catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
        const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
            Authorization: `Bearer ${token}`,
        })
        console.log("DELETE_PROFILE_API API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success("Profile Deleted Successfully")
        dispatch(logout(navigate))
        } 
        catch (error) {
        console.log("DELETE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Delete Profile")
        }
        toast.dismiss(toastId)
    }
}