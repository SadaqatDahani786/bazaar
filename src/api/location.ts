import { BASE_URL } from '../utils/consts'

//API ENDPOINT URL
const API_ENDPOINT = `${BASE_URL}/location`

/**
 ** ======================================================
 ** getCountries = Fetch all countries
 ** ======================================================
 */
export const getCountries = () => {
    return {
        url: `${API_ENDPOINT}/countries`,
        options: {
            credentials: 'include',
        },
    }
}

/**
 ** ======================================================
 ** getStatesInCountry = Fetch all states in country
 ** ======================================================
 */
export const getStatesInCountry = (country: string) => {
    return {
        url: `${API_ENDPOINT}/states-in-country/${country}`,
        options: {
            credentials: 'include',
        },
    }
}

/**
 ** ======================================================
 ** getCitiesInState = Fetch all cities in state
 ** ======================================================
 */
export const getCitiesInState = (state: string) => {
    return {
        url: `${API_ENDPOINT}/cities-in-state/${state}`,
        options: {
            credentials: 'include',
        },
    }
}
