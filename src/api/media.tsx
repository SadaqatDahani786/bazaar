import { GenericFormData } from 'axios'

const API_ENDPOINT = 'http://localhost:5000/api/v1'

/** ======================================================
 ** getMedia = Fetch media files
 ** ======================================================
 */
export const getMedia = () => {
    return {
        url: `${API_ENDPOINT}/media`,
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
        url: `${API_ENDPOINT}/media/upload`,
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
        url: `${API_ENDPOINT}/media/${id}`,
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
        url: `${API_ENDPOINT}/media/${id}`,
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
        url: `${API_ENDPOINT}/media/search/${query}`,
        method: 'GET',
        credentials: 'include',
    }
}
