import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import toast from "react-hot-toast"

const {
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API
} = profileEndpoints

export async function getEnrolledCourses(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          )

          console.log("response...", response);
        
        if(!response.data.success) {
            throw new Error(response.data.message)
        }

        result = response.data.data
        console.log("result..", result);
    } 
    catch (error) {
        console.log("GET_USER_ENROLLED_COURSES API error: " + error);
        toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId)
    return result
}

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = []

    try {
        
        const response = await apiConnector("POST", GET_INSTRUCTOR_DATA_API, null, 
        {
            Authorization: `Bearer ${token}`,
        })

        console.log("GET_INSTRUCTOR_API response", response);
        result = response?.data?.courses
    } 
    catch (error) {
        console.log("GET_INSTRUCTOR_API error", error);    
        toast.error("Could not get Instructor data")
    }

    toast.dismiss(toastId)
    return result
}