/**
 ** ======================================================
 ** Interface [getGrowthIncreaseOptions]
 ** ======================================================
 */
interface getGrowthIncreaseOptions<T> {
    arr: T[]
    extracter: (arrValue: T) => number
}

/**
 ** ======================================================
 ** Utility Method [getGrowthIncrease]
 ** ======================================================
 */
export function getGrowthIncrease<T>({
    arr,
    extracter,
}: getGrowthIncreaseOptions<T>) {
    //1) Extract values
    const valStart = arr.length > 1 ? extracter(arr[arr.length - 2]) : 0
    const valEnd = arr.length > 0 ? extracter(arr[arr.length - 1]) : 0

    //2) Calc change & percentage
    const change = valEnd - valStart
    const changePercent = (change / valStart) * 100

    //3) Check the no of decimal places value has
    const decimalPlaces =
        (change / 1000).toString().split('.').length > 1
            ? (change / 1000).toString().split('.')[1].length
            : 0

    //4) Return results
    return {
        growth:
            decimalPlaces > 2
                ? Math.ceil((change / 1000) * 100) / 100
                : change / 1000,
        growthPercentage: isNaN(changePercent)
            ? 0.0
            : changePercent === Infinity
            ? 100.0
            : parseFloat(changePercent.toFixed(2)),
    }
}
