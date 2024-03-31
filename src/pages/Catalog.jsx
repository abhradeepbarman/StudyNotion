import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector'
import { categories } from '../services/apis'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import CourseCard from '../components/core/Catalog/CourseCard'
import CourseSlider from '../components/core/Catalog/CourseSlider'

function Catalog() {

  const { catalogName } = useParams()
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("") 
  const [active, setActive] = useState(1)

  //fetch all categories & find the selected category id
  useEffect(() => {
    const getCategory= async() => {
      const res = await apiConnector("GET", categories.CATEGORIES_API)
      const category_id = res?.data?.allCategory?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
      setCategoryId(category_id)
    }
    getCategory()
  }, [catalogName])

  useEffect(() => {
    const getCategoryDetails = async() => {
      try {
        const res = await getCatalogPageData(categoryId);
        console.log("printing res", res)
        setCatalogPageData(res)
      } catch (error) {
        console.log(error)
      }
    }

    if(categoryId) {
      getCategoryDetails()
    }
  }, [categoryId])

  return (
    <>
      
      {/* Hero Section  */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {" "}
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div> 

      
      {/* section 1  */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Courses to get you started
        </div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${active === 1 
            ? "border-b border-b-yellow-25 text-yellow-25" 
            : "text-richblack-50"} 
            cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
              ? "border-b border-b-yellow-25 text-yellow-25"
              : "text-richblack-50"} cursor-pointer`}
              onClick={() => setActive(2)}
          >
            New
          </p>
        </div>

        <div>
          <CourseSlider courses={catalogPageData?.data?.selectedCategory?.courses} />
        </div>
      </div>

        {/* section 2  */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <p className="section_heading">
            Top Courses
          </p>
          <div className="py-8">
            <CourseSlider courses={catalogPageData?.data?.topSellingCourse} />
          </div>
        </div>

        {/* section 3  */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <p className="section_heading">
            Frequently Bought Together
          </p>

          <div className='py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {
                catalogPageData?.data?.differentCategories?.courses
                ?.slice(0, 4)
                .map((course, index) => (
                  <CourseCard course={course} key={index} Height={"h-400px"} />
                ))
              }
            </div>
          </div>
        </div>

      <Footer />
    </>
  )
}

export default Catalog