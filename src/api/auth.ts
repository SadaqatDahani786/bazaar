import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/auth`

/** ======================================================
 ** signup = User signup
 ** ======================================================
 */
export const signup = (formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/signup`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** login = User login
 ** ======================================================
 */
export const login = (email: string, password: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/login`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({ email, password }),
    }

    //2) Return options
    return options
}

/** ======================================================
 ** logout = User logout
 ** ======================================================
 */
export const logout = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/logout`,
        method: 'POST',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** forgotPassword = Forgot my password
 ** ======================================================
 */
export const forgotPassword = (email: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/forgot-password`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        data: JSON.stringify({ email }),
    }

    //2) Return options
    return options
}

/** ======================================================
 ** updatePassword = Update my password
 ** ======================================================
 */
export const updatePassword = (formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/update-password`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** resetPassword = Reset account password
 ** ======================================================
 */
export const resetPassword = (formData: GenericFormData, token: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/reset-password/${token}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}
