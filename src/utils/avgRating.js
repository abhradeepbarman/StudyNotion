export default function getAverageRating(ratingArr) {
    if(!ratingArr)  
        return 0

    if(ratingArr.length === 0) 
        return 0;

    const totalReviewCount = ratingArr?.reduce((acc, curr) => {
        acc += curr.rating
        return acc
    }, 0)

    const multiplier = 10
    const avgReviewCount = Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier

    return avgReviewCount
}