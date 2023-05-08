import { ILocation } from '../store/locationReducer'

/**
 ** ======================================================
 ** Utility Method [isCountryHasStates]
 ** ======================================================
 */
export const isCountryHasStates = (
    countries: Array<ILocation>,
    country: string
) => {
    //1) Get selected country
    const selCountry = countries.find((location) => location.name === country)

    //2) Validate
    if (!selCountry) return false

    //3) Return true if selected country has any state
    return selCountry.states.length > 0
}

export default isCountryHasStates
