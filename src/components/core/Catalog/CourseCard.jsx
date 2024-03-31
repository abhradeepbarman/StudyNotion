import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import getAverageRating from '../../../utils/avgRating'
import RatingStars from '../../common/RatingStars'

function CourseCard({course, Height}) {

    const [avgRating, setAvgRating] = useState(0)

    useEffect(() => {
        const count = getAverageRating(course?.ratingAndReviews)
        setAvgRating(count)
    }, [course])

  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div>
                <div className='rounded-lg'>
                    <img src={course?.thumbnail} 
                        alt='' 
                        className={`${Height} w-full rounded-xl object-cover`}
                    />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">
                        {course?.courseName}
                    </p>
                    <p className="text-sm text-richblack-50">
                        {course?.instructor?.firstName} {course?.instructor?.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">
                            {avgRating || 0}
                        </span>
                        <RatingStars review_count={avgRating} />
                        <span className="text-richblack-400">
                            {course?.ratingAndReviews?.length} ratings
                        </span>
                    </div>
                    <p className="text-xl text-richblack-5">
                        Rs. {course?.price}
                    </p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default CourseCard