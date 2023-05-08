import { ILocation } from '../store/locationReducer'

/**
 ** ======================================================
 ** Utility Method [isStatesHasCities]
 ** ======================================================
 */
export const isStateHasCities = (
    countries: Array<ILocation>,
    country: string,
    state: string
) => {
    //1) Get selected country
    const selCountry = countries.find((location) => location.name === country)
    if (!selCountry) return false

    //2) Get selected state
    const selState = selCountry.states.find(
        (locState) => locState.name === state
    )
    if (!selState) return false

    //3) Return true if selected state has any city
    return selState.cities.length > 0
}

export default isStateHasCities
