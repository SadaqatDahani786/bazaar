import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/review`

/*
 ** ======================================================
 ** getManyReview = Get one or many review
 ** ======================================================
 */
export const getManyReview = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: API_ENDPOINT,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** createReview = Create a review
 ** ======================================================
 */
export const createReview = (formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: API_ENDPOINT,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** updateReview = Update a review
 ** ======================================================
 */
export const updateReview = (id: string, formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** deleteReview = Delete a review
 ** ======================================================
 */
export const deleteReview = (id: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'DELETE',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** searchReview = Get one or many review via search
 ** ======================================================
 */
export const searchReview = (query: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/search/${query}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}
