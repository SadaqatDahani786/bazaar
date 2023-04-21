import { useState, useEffect } from 'react'
import { getWindowDimensions } from '../utils/getWindowDimensions'

/**
 ** ======================================================
 ** Custom Hook [useWindowDimensions]
 ** ======================================================
 */
const useWindowDimensions = () => {
    //State
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    )

    //Set New Dimension On Window Resize
    const handleResize = () => setWindowDimensions(getWindowDimensions())

    //Add Resize Event Listener On Windows
    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    //return
    return windowDimensions
}

export default useWindowDimensions
