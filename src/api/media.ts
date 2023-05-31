import { AxiosRequestConfig, GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/media`

/** ======================================================
 ** getMedia = Fetch media files
 ** ======================================================
 */
export const getMedia = (queryParams: { key: string; value: string }[]) => {
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
 ** uploadMedia = Upload one or more media files
 ** ======================================================
 */
export const uploadMedia = (data: GenericFormData) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/upload`,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data,
        withCredentials: true,
    }

    //2) Return options
    return options
}

/** ======================================================
 ** updateMedia = Update media file
 ** ======================================================
 */
export const updateMedia = ({
    id,
    data,
}: {
    id: string
    data: {
        title: string
        description: string
        caption: string
    }
}) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/${id}`,
        method: 'PUT',
        data,
        withCredentials: true,
    }

    //2) Run options
    return options
}

/** ======================================================
 ** deleteMedia = Delete media file
 ** ======================================================
 */
export const deleteMedia = (id: string) => {
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
 ** searchMedia = Search media file
 ** ======================================================
 */
export const searchMedia = (query: string) => {
    //1) Create a request with options
    const options: AxiosRequestConfig = {
        url: `${API_ENDPOINT}/search/${query}`,
        method: 'GET',
        withCredentials: true,
    }

    //2) Return options
    return options
}
