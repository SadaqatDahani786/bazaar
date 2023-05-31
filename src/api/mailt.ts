import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/mail`

/**
 ** ======================================================
 ** Send an email = Send an email
 ** ======================================================
 */
export const sendEmail = (
    email: string,
    name: string,
    message: string,
    subject: string
) => {
    return {
        url: API_ENDPOINT,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            email,
            name,
            message,
            subject,
        }),
    }
}
