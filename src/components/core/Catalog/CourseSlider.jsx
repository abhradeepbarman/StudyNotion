import React from 'react'
import {Swiper, SwiperSlide } from 'swiper/react'
import CourseCard from './CourseCard'
import {Pagination, Navigation} from "swiper/modules"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


function CourseSlider({courses}) {
  return (
    <>
      {
        courses?.length ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Navigation, Pagination]}
            breakpoints={{
              1024: {
                slidesPerView: 3,
              }
            }}
            className='max-h-[30rem] mySwiper'
          >
            {
              courses.map((course, index) => (
                <SwiperSlide key={index}>
                  <CourseCard course={course} Height={"h-[250px]"} />
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) : (
          <p className="text-xl text-richblack-5">
            No Course Found
          </p>
        )
      }
    </>
  )
}

export default CourseSlider