import { GenericFormData } from 'axios'
import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/media`

/** ======================================================
 ** getMedia = Fetch media files
 ** ======================================================
 */
export const getMedia = () => {
    return {
        url: API_ENDPOINT,
        options: {
            credentials: 'include',
        },
    }
}

/** ======================================================
 ** uploadMedia = Upload one or more media files
 ** ======================================================
 */
export const uploadMedia = (data: GenericFormData) => {
    return {
        url: `${API_ENDPOINT}/upload`,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        credentials: 'include',
        data,
    }
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
    return {
        url: `${API_ENDPOINT}/${id}`,
        method: 'PUT',
        credentials: 'include',
        data,
    }
}

/** ======================================================
 ** deleteMedia = Delete media file
 ** ======================================================
 */
export const deleteMedia = (id: string) => {
    return {
        url: `${API_ENDPOINT}/${id}`,
        method: 'DELETE',
        credentials: 'include',
    }
}

/** ======================================================
 ** searchMedia = Search media file
 ** ======================================================
 */
export const searchMedia = (query: string) => {
    return {
        url: `${API_ENDPOINT}/search/${query}`,
        method: 'GET',
        credentials: 'include',
    }
}
