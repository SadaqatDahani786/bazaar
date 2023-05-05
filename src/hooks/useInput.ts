import { ChangeEvent, useCallback, useEffect, useState } from 'react'

/**
 ** ======================================================
 ** Interface [useInputProps]
 ** ======================================================
 */
interface useInputProps {
    default_value: string
    validation: (val: string) => Array<string | boolean>
}

/**
 ** ======================================================
 ** Custom Hook [useInput]
 ** ======================================================
 */
const useInput = ({ default_value, validation }: useInputProps) => {
    /*
     ** **
     ** ** ** State
     ** **
     */
    const [input, setInput] = useState<string>(default_value)
    const [inputError, setInputError] = useState(false)
    const [inputTouched, setInputTouched] = useState(false)
    const [inputErrorMessage, setInputErrorMessage] = useState('')

    /*
     ** **
     ** ** ** Hooks
     ** **
     */
    //Validate Input
    const inputValidate = useCallback(
        (val = input) => {
            //1) Validate input value
            const [error, message] = validation(val)

            //2) Set the results of validation
            setInputError(error as boolean)
            setInputTouched(true)
            setInputErrorMessage(message as string)
        },
        [input, validation]
    )

    //Set default value
    useEffect(() => {
        setInput(default_value)
        if (default_value) setInputTouched(true)
    }, [default_value])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Blur handler
    const onBlurHandler = () => {
        inputValidate()
    }

    //Change handler
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInput(val)
        inputValidate(val)
    }

    //Reset the input state to default or undefined
    const reset = (resetToDefault: boolean) => {
        if (resetToDefault) {
            setInput(default_value)
            inputValidate(default_value)
        } else {
            setInput('')
            setInputError(false)
            setInputTouched(false)
            setInputErrorMessage('')
        }
    }

    //return
    return {
        onChangeHandler,
        onBlurHandler,
        value: input,
        validation: {
            error: inputError,
            message: inputErrorMessage,
            touched: inputTouched,
            validate: inputValidate,
        },
        reset,
    }
}

export default useInput
