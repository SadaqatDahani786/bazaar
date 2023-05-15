import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/order`

/*
 ** ======================================================
 ** getOrder = Get one order
 ** ======================================================
 */
export const getOrder = (id: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getManyOrder = Get one or many order
 ** ======================================================
 */
export const getManyOrder = () => {
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
 ** createOrder = Create an order
 ** ======================================================
 */
export const createOrder = (formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: API_ENDPOINT,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}

/*

/*
 ** ======================================================
 ** deleteOrder = Delete an order
 ** ======================================================
 */
export const deleteOrder = (id: string) => {
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
 ** searchOrder = Get one or many order via search
 ** ======================================================
 */
export const searchOrder = (query: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/search/${query}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}
