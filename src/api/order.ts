import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/order`

export interface opts {
    filters?: Array<{ name: string; value: string }>
}

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
export const getManyOrder = (opts?: opts) => {
    //1) Filters
    const filters = opts?.filters
        ? opts.filters
              .filter((filter) => filter.value !== '')
              .map((filter) => `${filter.name}=${filter.value}`)
              .join('&')
        : ''

    //2) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}?${filters}`,
        method: 'GET',
        withCredentials: true,
    }

    //3) Return options
    return options
}

/*
 ** ======================================================
 ** getTotalSales = Get total sales
 ** ======================================================
 */
export const getTotalSales = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/total-sales`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getTotalRefunds = Get total refunds
 ** ======================================================
 */
export const getTotalRefunds = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/total-refunds`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getTotalSalesInYear = Get total sales in year
 ** ======================================================
 */
export const getTotalSalesInYear = (year: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/sales-in-months-of-year/${year}`,
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
 ** ======================================================
 ** updateOrder = Update an order
 ** ======================================================
 */
export const updateOrder = (id: string, formData: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: formData,
    }

    //2) Return options
    return options
}

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
