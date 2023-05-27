import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/category`

/*
 ** ======================================================
 ** getManyCategory = Get one or many categories
 ** ======================================================
 */
export const getManyCateogory = (
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
 ** getProductsInCategory = Get products in category
 ** ======================================================
 */
export const getProductsInCategory = (
    category_slug: string,
    queryParams: { key: string; value: string }[] = []
) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${category_slug}/product?${queryParams
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
 ** getSalesInEachCategory = Get total sales in each category
 ** ======================================================
 */
export const getSalesInEachCategory = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/sales-in-each-category`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** createCategory = Create a category
 ** ======================================================
 */
export const createCategory = (formData: GenericFormData) => {
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
 ** updateCategory = Update a category
 ** ======================================================
 */
export const updateCategory = (id: string, formData: GenericFormData) => {
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
 ** deleteCateogry = Delete a cateogry
 ** ======================================================
 */
export const deleteCategory = (id: string) => {
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
 ** searchCategory = Get one or many categories
 ** ======================================================
 */
export const searchCategory = (query: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/search/${query}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}
