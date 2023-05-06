import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {
    getCitiesInState,
    getCountries,
    getStatesInCountry,
} from '../api/location'

/**
 ** ======================================================
 ** Interface
 ** ======================================================
 */
export interface ILocation {
    name: string
    emoji: string
    phone_code: string
    states: Array<{
        name: string
        cities: Array<{
            name: string
        }>
    }>
}

/**
 ** ======================================================
 ** Thunk [getCountriesAsync]
 ** ======================================================
 */
export const getCountriesAsync = createAsyncThunk(
    'get/countries',
    async (cb: () => void = () => '') => {
        //1) Send http request
        const response = await axios(getCountries())

        //2) Callback
        cb()

        //3) Return response
        return response.data.data
    }
)

/**
 ** ======================================================
 ** Thunk [getStatesInCountryAsync]
 ** ======================================================
 */
export const getStatesInCountryAsync = createAsyncThunk(
    'get/states',
    async ({
        country,
        cb = () => '',
    }: {
        country: string
        cb?: () => void
    }) => {
        //1) Send http request
        const response = await axios(getStatesInCountry(country))

        //2) Callback
        cb()

        //3) Return response
        return { country, states: response.data.data }
    }
)

/**
 ** ======================================================
 ** Thunk [getCitiesInStateAsync]
 ** ======================================================
 */
export const getCitiesInStateAsync = createAsyncThunk(
    'get/cities',
    async ({
        country,
        state,
        cb = () => '',
    }: {
        country: string
        state: string
        cb?: () => void
    }) => {
        //1) Send http request
        const response = await axios(getCitiesInState(state))

        //2) Callback
        cb()

        //3) Return response
        return { country, state, cities: response.data.data }
    }
)

/**
 ** ======================================================
 ** Reducer Slice [location]
 ** ======================================================
 */
//Default state
const defaultState: {
    isLoading: {
        country: boolean
        state: boolean
        city: boolean
    }
    errors: {
        country: string
        state: string
        city: string
    }
    data: Array<ILocation>
} = {
    isLoading: {
        country: false,
        state: false,
        city: false,
    },
    errors: {
        country: '',
        state: '',
        city: '',
    },
    data: [],
}

//Slice
const sliceLocation = createSlice({
    name: 'location',
    initialState: defaultState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(
                getCountriesAsync.fulfilled,
                (state, action: { payload: Array<ILocation> }) => {
                    //1) Extract countries from payload
                    const countries = action.payload

                    //2) Transform data
                    const updatedData = countries.map((country) => ({
                        ...country,
                        states: [
                            {
                                name: '',
                                cities: [{ name: '' }],
                            },
                        ],
                    }))

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, country: false },
                        errors: { ...state.errors, country: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(
                getStatesInCountryAsync.fulfilled,
                (
                    state,
                    action: { payload: { country: string; states: [] } }
                ) => {
                    //1) Extract country and state from payload
                    const { country, states } = action.payload

                    //2) Transform data
                    const updatedData = state.data.map((loc) => {
                        if (loc.name === country) {
                            return {
                                ...loc,
                                states: states.map(
                                    (st: { name: string; cities: [] }) => ({
                                        ...st,
                                        cities: [],
                                    })
                                ),
                            }
                        }

                        return loc
                    })

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, state: false },
                        errors: { ...state.errors, state: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(getCitiesInStateAsync.fulfilled, (state, action) => {
                //1) Get country, state and cities from payload
                const { country, state: statename, cities } = action.payload

                //2) Transform data
                const updatedData = state.data.map((loc) => {
                    if (loc.name === country) {
                        return {
                            ...loc,
                            states: loc.states.map((loc_state) => {
                                if (loc_state.name === statename) {
                                    return { name: loc_state.name, cities }
                                }
                                return {
                                    name: loc_state.name,
                                    cities: loc_state.cities,
                                }
                            }),
                        }
                    }

                    return loc
                })

                //3) Update state
                return {
                    isLoading: { ...state.isLoading, city: false },
                    errors: { ...state.errors, city: '' },
                    data: updatedData,
                }
            }),
})
/**
 ** ======================================================
 ** Export
 ** ======================================================
 */
//extract reducer from slice
const { reducer } = sliceLocation

//export reducer
export default reducer
