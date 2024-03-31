import toast from 'react-hot-toast'
import { apiConnector } from '../apiConnector'
import { catalogData } from '../apis'

export const getCatalogPageData = async(categoryId) => {
    let result = []
    const toastId = toast.loading("Loading...")

    try {
        const response = await apiConnector( "POST", catalogData.CATALOGPAGEDATA_API,{ categoryId: categoryId,})


            if(!response?.data?.success) {
                throw new Error("could not fetch category page data")
            }

            console.log("response...", response);
            result = response?.data
    } 
    catch (error) {
        console.log("CATALOG page DATA API error", error);
        toast.error(error.message)
        result = error?.message?.data
    }

    toast.dismiss(toastId)
    return result
}
