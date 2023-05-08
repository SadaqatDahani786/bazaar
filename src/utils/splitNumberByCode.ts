/**
 ** ======================================================
 ** Utility Method [splitNumberByCode]
 ** ======================================================
 */
export const splitNumberByCode = (phoneNumber = '') => {
    const len = phoneNumber.length - 10
    return {
        country_code: phoneNumber.substring(0, len),
        number: phoneNumber.substring(len),
    }
}

export default splitNumberByCode
