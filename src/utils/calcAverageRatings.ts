/**
 ** ======================================================
 ** Utility Method [calcAverageRatings]
 ** ======================================================
 */
export const calcAverageRatings = (
    ratings: { rating_star: number; ratings_count: number }[]
) => {
    const { totalRating, totalResponse } = ratings.reduce<{
        totalResponse: number
        totalRating: number
    }>(
        (acc, currItem) => {
            return {
                totalResponse: acc.totalResponse + currItem.ratings_count,
                totalRating:
                    acc.totalRating +
                    currItem.rating_star * currItem.ratings_count,
            }
        },
        { totalResponse: 0, totalRating: 0 }
    )

    return {
        average: parseFloat((totalRating / totalResponse).toFixed(1)),
        total: totalResponse,
    }
}
