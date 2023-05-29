import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/review`

/*
 ** ======================================================
 ** getManyReview = Get one or many review
 ** ======================================================
 */
export const getManyReview = (
    queryParams: { key: string; value: string }[] = []
) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}?${queryParams
            .map(({ key, value }) => `${key}=${value}`)
            .join('&')}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getMyManyReview = Get my many reviews
 ** ======================================================
 */
export const getMyManyReview = (
    queryParams: { key: string; value: string }[] = []
) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/my-review?${queryParams
            .map(({ key, value }) => `${key}=${value}`)
            .join('&')}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getRatingsOfProduct = Get ratings of one or many product
 ** ======================================================
 */
export const getRatingsOfProduct = (ids: string[]) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/ratings/${ids.join(',')}`,
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
