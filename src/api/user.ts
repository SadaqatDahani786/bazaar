import { GenericFormData, AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/user`

/** ======================================================
 ** getManyUser = Fetch users
 ** ======================================================
 */
export const getManyUser = (
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

/** ======================================================
 ** getUser = Fetch users
 ** ======================================================
 */
export const getUser = (id: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** getCurrentUser = Fetch currently logged in user
 ** ======================================================
 */
export const getCurrentUser = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/me`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getTotalUsersCount = Get total users count
 ** ======================================================
 */
export const getTotalUsersCount = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/total-users-count`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** deleteUser = Delete one or many user
 ** ======================================================
 */
export const deleteUser = (id: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'DELETE',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** createUser = Create a user
 ** ======================================================
 */
export const createUser = (formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: API_ENDPOINT,
        method: 'POST',
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** updateUser = Update a user
 ** ======================================================
 */
export const updateUser = (id: string, formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'PUT',
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** updateUserHistory = Update user's watch history
 ** ======================================================
 */
export const updateUserHistory = (id: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/history?id=${id}`,
        method: 'PATCH',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** clearUserHistory = Clear user's watch history
 ** ======================================================
 */
export const clearUserHistory = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/history`,
        method: 'DELETE',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** updateCurrentUser = Update currently logged in user
 ** ======================================================
 */
export const updateCurrentUser = (
    formData: GenericFormData,
    isMultipartType = true
) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/me`,
        method: 'PUT',
        withCredentials: true,
        headers: {
            'Content-Type': isMultipartType
                ? 'multipart/form-data'
                : 'application/json',
        },
        data: formData,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** searchUser = Get one or many users via search
 ** ======================================================
 */
export const searchUser = (query: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/search/${query}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}
