import { ChangeEvent, useCallback, useEffect, useState } from 'react'

/**
 ** ======================================================
 ** Type [file]
 ** ======================================================
 */
type file = { name: string; url: string; file?: File }

/**
 ** ======================================================
 ** Interface [useUploadProp]
 ** ======================================================
 */
interface useUploadProps {
    default_value: Array<file>
    min?: number
}

/**
 ** ======================================================
 ** Custom Hook [useUpload]
 ** ======================================================
 */
const useUpload = ({ default_value = [], min = 1 }: useUploadProps) => {
    const [value, setValue] = useState(default_value)
    const [error, setError] = useState(false)
    const [touched, setTouched] = useState(false)
    const [modified, setModified] = useState(false)

    //Validate
    const validate = useCallback(
        (val = value) => {
            setTouched(true)
            setError(!(val.length >= min))
        },
        [value, min]
    )

    //validate default value
    useEffect(() => {
        if (default_value.length <= 0) return
        validate(default_value)
    }, [default_value, validate])

    //Reset input
    const reset = () => {
        setValue(default_value)
        setError(false)
        setTouched(false)
        setModified(false)
    }

    //On Input Blur Handler
    const onBlur = () => {
        validate()
    }

    //On Input Change Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        //Get files from event
        const files = e.target.files
        if (!files) return

        //Create urls from files
        const urls: Array<file> = []
        Array.from(files).map((file) => {
            urls.push({
                name: file.name,
                url: URL.createObjectURL(file),
                file: file,
            })
        })

        //Update
        setValue(urls)
        setError(false)
        setModified(true)

        //ReValidate
        validate(urls)
    }

    return {
        value,
        onBlur,
        onChange,
        reset,
        validation: { error, touched, validate },
        modified,
    }
}

export default useUpload
