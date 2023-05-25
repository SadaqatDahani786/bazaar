import { AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/cart`

/**
 ** ======================================================
 ** getUserCart = Get logged in user's cart
 ** ======================================================
 */
export const getUserCart = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/user`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/**
 ** ======================================================
 ** addItemInUserCart = Add item into logged in user's cart
 ** ======================================================
 */
export const addItemInUserCart = (data: {
    product: string
    quantity: number
    selected_variants: { name: string; term: string }[]
}) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/add-item`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    }

    //2) Return options
    return options
}

/**
 ** ======================================================
 ** removeItemFromUserCart = Add item into logged in user's cart
 ** ======================================================
 */
export const removeItemFromUserCart = (data: {
    product: string
    quantity: number
    selected_variants: { name: string; term: string }[]
}) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/remove-item`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    }

    //2) Return options
    return options
}
