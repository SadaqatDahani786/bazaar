/**
 ** ======================================================
 ** Utility Method [getWindowDeimension]
 ** ======================================================
 */
export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}

export default getWindowDimensions
