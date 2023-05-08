import { GenericFormData, AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/user`

/** ======================================================
 ** getManyUser = Fetch users
 ** ======================================================
 */
export const getManyUser = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: API_ENDPOINT,
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