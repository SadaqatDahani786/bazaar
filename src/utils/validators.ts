/**
 ** ======================================================
 ** Interface IValidatorOptions
 ** ======================================================
 */
export interface IValidatorOptions {
    ignoreSpaces?: boolean
    ignoreCase?: boolean
    ignoreHyphens?: boolean
    ignoreDashes?: boolean
    ignorePunctuations?: boolean
    password?: string
    min?: number
    max?: number
}
/**
 ** ======================================================
 ** Validator [isAlpha]
 ** ======================================================
 */
export const isAlpha = (
    val: string,
    options: IValidatorOptions = {
        ignoreSpaces: true,
        ignoreCase: true,
        ignoreHyphens: false,
        ignoreDashes: false,
        ignorePunctuations: false,
    }
) => {
    //1) Regex pattern to test for alpha values
    const pattern = `^[a-z${options.ignoreSpaces ? '\\s' : ''}${
        options.ignoreHyphens ? '\\-' : ''
    }${options.ignoreDashes ? '\\_' : ''}${
        options.ignorePunctuations
            ? '\\-\\_\\.\\,\\"\\\'\\:\\;\\(\\)\\&\\!'
            : ''
    }]+$`

    //2) Test value against regex pattern, if matched, return
    const regex = RegExp(pattern, options.ignoreCase ? 'i' : '')
    if (regex.test(val)) return false

    //3) Matched failed, return true to indicate error
    return true
}

/**
 ** ======================================================
 ** Validator [isAlphaNumeric]
 ** ======================================================
 */
export const isAlphaNumeric = (
    val: string,
    options: IValidatorOptions = {
        ignoreSpaces: true,
        ignoreCase: true,
        ignoreHyphens: false,
        ignoreDashes: false,
        ignorePunctuations: false,
    }
) => {
    //1) Regex pattern to test for alpha numeric values
    const pattern = `^[a-z0-9${options.ignoreSpaces ? '\\s' : ''}${
        options.ignoreHyphens ? '\\-' : ''
    }${options.ignoreDashes ? '\\_' : ''}${
        options.ignorePunctuations
            ? '\\-\\_\\.\\,\\"\\\'\\:\\;\\(\\)\\&\\!'
            : ''
    }]+$`

    //2) Test value against regex pattern, if matched, return
    const regex = RegExp(pattern, options.ignoreCase ? 'i' : '')
    if (regex.test(val)) return false

    //3) Matched failed, return true to indicate error
    return true
}

/**
 ** ======================================================
 ** Validator [isNumber]
 ** ======================================================
 */
export const isNumber = (
    val: string,
    options: IValidatorOptions = { ignoreHyphens: false, ignoreDashes: false }
) => {
    //1) Regex pattern to test for numeric values
    const pattern = `^[0-9${options.ignoreHyphens ? '\\-' : ''}${
        options.ignoreDashes ? '\\_' : ''
    }]+$`

    //2) Test value against regex pattern, if matched, return
    const regex = RegExp(pattern, '')
    if (regex.test(val)) return false

    //3) Matched failed, return true to indicate error
    return true
}

/**
 ** ======================================================
 ** Validator [isDecimal]
 ** ======================================================
 */
export const IsDecimal = (val: string) => {
    //1) Regex pattern to test for decimal values
    const pattern = `^\\d*\\.?\\d+$`

    //2) Test value against regex pattern, if matched, return
    const regex = RegExp(pattern, '')
    if (regex.test(val)) return false

    //3) Matched failed, return true to indicate error
    return true
}

/**
 ** ======================================================
 ** Validator [isMin]
 ** ======================================================
 */
export const isMin = (val: string, { min = 0 }: IValidatorOptions) => {
    return parseInt(val) < min
}

/**
 ** ======================================================
 ** Validator [isMax]
 ** ======================================================
 */
export const isMax = (val: string, { max = 0 }: IValidatorOptions) => {
    return parseInt(val) > max
}

/**
 ** ======================================================
 ** Validator [isMinLength]
 ** ======================================================
 */
export const isMinLength = (val: string, { min = 0 }: IValidatorOptions) => {
    return val.length < min
}

/**
 ** ======================================================
 ** Validator [isMaxLength]
 ** ======================================================
 */
export const isMaxLength = (val: string, { max = 0 }: IValidatorOptions) => {
    return val.length > max
}

/**
 ** ======================================================
 ** Validator [Date]
 ** ======================================================
 */
export const isDate = (val: string) => {
    //1) Regex pattern to test for valid date
    const regex = /^[a-z0-9\-_\s]+$/i

    //2) Test value against regex pattern, if matched, return
    if (regex.test(val)) return false

    //3) Matched failed, return true to indicate error
    return true
}

/**
 ** ======================================================
 ** Validator [isPassMissmatched]
 ** ======================================================
 */
export const isPassMissmatched = (
    val: string,
    { password }: IValidatorOptions
) => {
    return val !== password
}

/**
 ** ======================================================
 ** Validator [isCard]
 ** ======================================================
 */
export const isCard = (val: string) => {
    //1) Regex pattern to test valid card number
    const regex = /^([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4})$/

    //2) Test value against regex pattern, if matched, return
    if (regex.test(val)) return false

    //3) Matched failed, return true to indicate error
    return true
}

/**
 ** ======================================================
 ** Validator [isEmail]
 ** ======================================================
 */
export const isEmail = (val: string) => {
    //1) Regex pattern to test valid email
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    //2) Test value against regex pattern, if matched, return
    if (regex.test(val)) return false

    //3) Matched failed, return true to indicate error
    return true
}

/**
 ** ======================================================
 ** Validator [isEmpty]
 ** ======================================================
 */
export const isEmpty = (val: string) => {
    //1) if empty, return true to indicate error
    if (!val || val.toString().trim() === '' || val.toString().trim() === ' ')
        return true

    //2) No error, val not empty
    return false
}

/**
 ** ======================================================
 ** Validator Creator
 ** ======================================================
 */
export const createValidator = (
    validators: Array<{
        validator: (val: string, options: IValidatorOptions) => boolean
        message: string
        options?: IValidatorOptions
    }>
) => {
    return (val: string) => {
        //1) Define vars to hold the state
        let error = false,
            message = ''

        //2) Test the val against each validator, if failed return with an error
        for (let i = 0; i < validators.length; i++) {
            //=> Extract options
            const opt = { ...validators[i].options }

            //=> Test val against validator
            if (validators[i].validator(val, opt)) {
                error = true
                message = validators[i].message
                return [error, message]
            }
        }

        //3) No errors, return safely
        return [error, message]
    }
}
