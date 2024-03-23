import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../store/slices/authSlice"
import { resetCart } from "../../store/slices/cartSlice"
import { setUser } from "../../store/slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { authEndpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = authEndpoints

export async function sendOtp(email, navigate, dispatch) {

    //start loading
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      //connect to backend
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })

      //print the response
      console.log("SENDOTP API RESPONSE............", response)
      console.log(response.data.success)

      //check if we got any data
      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      //success
      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } 
    catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error(error.response.data.message)
    }

    //stop loading
    dispatch(setLoading(false))
    toast.dismiss(toastId)
}

export async function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate,
  dispatch
) {
    //start loading
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      //connect to backend
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      //check if we got any valid response
      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      //signup successful
      toast.success("Signup Successful")
      navigate("/login")
    } 
    catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error(error.response.data.message)
      navigate("/signup")
    }

    //stop loading
    dispatch(setLoading(false))
    toast.dismiss(toastId)
}

export async function login(email, password, navigate, dispatch) {

    //start loading
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    //now connect to backend
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      //check if we got any response
      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      //login successful
      toast.success("Login Successful")
      //save the token in store
      dispatch(setToken(response.data.token))

      //make the profile picture
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

      //save the user details with pfp in the store
      dispatch(setUser({ ...response.data.user, image: userImage }))
      
      //save the token in the local storage
      localStorage.setItem("token", JSON.stringify(response.data.token))

      //navigate to dashboard
      navigate("/dashboard/my-profile")
    } 
    catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error(error.response.data.message)
    }

    //stop loading
    dispatch(setLoading(false))
    toast.dismiss(toastId)
}

export async function getPasswordResetToken(email, setEmailSent, dispatch) {
    
  //start loading
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    
    try {
      //connect to backend
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email})

      console.log("RESETPASSTOKEN RESPONSE............", response)

      //check if we email sent 
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      
      //email sent successfully
      toast.success("Reset Email Sent")
      setEmailSent(true)
    } 
    catch (error) {
      //error
      console.log("RESETPASSTOKEN ERROR............", error)
      toast.error(error.response.data.message)
    }

    //stop loading
    toast.dismiss(toastId)
    dispatch(setLoading(false))
}

export async function resetPassword(password, confirmPassword, token, dispatch, navigate) {
  
    //start loading  
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } 
    catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error(error.response.data.message)
    }

    //stop loading
    toast.dismiss(toastId)
    dispatch(setLoading(false))
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}