import { AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/checkout`

/*
 ** ======================================================
 ** createStripeCheckoutSession = Checkout with stripe
 ** ======================================================
 */
export const createStripeCheckoutSession = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/session`,
        method: 'POST',
        withCredentials: true,
    }

    //2) Return options
    return options
}

/*
 ** ======================================================
 ** createCheckoutNoPay = Checkout without pay
 ** ======================================================
 */
export const createCheckoutNoPay = () => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/success-no-pay`,
        method: 'POST',
        withCredentials: true,
    }

    //2) Return options
    return options
}
