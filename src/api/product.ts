import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/product`

/*
 ** ======================================================
 ** getProduct = Get one product
 ** ======================================================
 */
export const getProduct = (id: string) => {
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
 ** getManyProduct = Get one or many product
 ** ======================================================
 */
export const getManyProduct = (
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
 ** getTrendingItemsInYourArea = Get items that are trending where user lives
 ** ======================================================
 */
export const getTrendingItemsInYourArea = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/trending-items-in-your-area`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getItemsBoughtTogether = Get items that are frequently bought together
 ** ======================================================
 */
export const getItemsBoughtTogether = (id: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}/frequently-bought-together`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getSimilarViewedItems = Get similar viewed items by other customers
 ** ======================================================
 */
export const getSimilarViewedItems = (id: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}/similar-viewed-items`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getUserInterestsItems = Get items that user might be interested in
 ** ======================================================
 */
export const getUserInterestsItems = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/user-interests-item`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getUserProductReview = Get review of current user on the product
 ** ======================================================
 */
export const getUserProductReview = (prodId: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${prodId}/review/user`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** createUserProductReview = Update review of current user on the product
 ** ======================================================
 */
export const createUserProductReview = (
    prodId: string,
    formData: GenericFormData
) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${prodId}/review/user`,
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

/*
 ** ======================================================
 ** updateUserProductReview = Update review of current user on the product
 ** ======================================================
 */
export const updateUserProductReview = (
    prodId: string,
    formData: GenericFormData
) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${prodId}/review/user`,
        method: 'PUT',
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** deleteUserProductReview = Delete review of current user on the product
 ** ======================================================
 */
export const deleteUserProductReview = (prodId: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${prodId}/review/user`,
        method: 'DELETE',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getTopSellingProducts = Get one or many top selling products
 ** ======================================================
 */
export const getTopSellingProducts = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/top-selling-products`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getBrands = Get brands from products
 ** ======================================================
 */
export const getBrands = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/filter/brand`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getColors = Get colors from products
 ** ======================================================
 */
export const getColors = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/filter/color`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** getSizes = Get sizes from products
 ** ======================================================
 */
export const getSizes = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/filter/size`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** createProduct = Create a product
 ** ======================================================
 */
export const createProduct = (formData: GenericFormData) => {
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
 ** updateProduct = Update a product
 ** ======================================================
 */
export const updateProduct = (id: string, formData: GenericFormData) => {
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
 ** deleteProduct = Delete a product
 ** ======================================================
 */
export const deleteProduct = (id: string) => {
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
 ** searchProduct = Get one or many product via search
 ** ======================================================
 */
export const searchProduct = (query: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/search/${query}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}
