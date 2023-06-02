import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import {
    createCheckoutNoPay,
    createStripeCheckoutSession,
} from '../api/checkout'

/**
 ** ======================================================
 ** Thunk [createStripeCheckoutSessionAsync]
 ** ======================================================
 */
export const createStripeCheckoutSessionAsync = createAsyncThunk(
    'create/stripe-checkout-session',
    async (cb: (res?: string) => void, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(createStripeCheckoutSession())

            //2) Callback
            cb(response.data.data)

            //3) Return response
            return response.data.data
        } catch (err) {
            //Callback
            cb()

            console.log(err)

            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [createCheckoutNoPayAsync]
 ** ======================================================
 */
export const createCheckoutNoPayAsync = createAsyncThunk(
    'create/checkout-no-pay',
    async (cb: (err?: unknown) => void, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(createCheckoutNoPay())

            //2) Callback
            cb()

            //3) Return response
            return response.data.data
        } catch (err) {
            //Callback
            cb(err)

            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Reducer Slice [auth]
 ** ======================================================
 */
//Default state
const defaultState: {
    isLoading: boolean
    error: string
} = {
    isLoading: false,
    error: '',
}

//Slice
const sliceCheckout = createSlice({
    name: 'checkout',
    initialState: defaultState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(createStripeCheckoutSessionAsync.fulfilled, (state) => {
                return { ...state, isLoading: false, error: '' }
            })
            .addCase(createStripeCheckoutSessionAsync.pending, (state) => {
                return { ...state, isLoading: true, error: '' }
            })
            .addCase(
                createStripeCheckoutSessionAsync.rejected,
                (state, action) => {
                    return {
                        ...state,
                        isLoading: false,
                        error: action.payload as string,
                    }
                }
            )
            .addCase(createCheckoutNoPayAsync.fulfilled, (state) => {
                return { ...state, isLoading: false, error: '' }
            })
            .addCase(createCheckoutNoPayAsync.pending, (state) => {
                return { ...state, isLoading: true, error: '' }
            })
            .addCase(createCheckoutNoPayAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload as string,
                }
            }),
})

/**
 ** ======================================================
 ** Export
 ** ======================================================
 */
//extract reducer from slice
const { reducer } = sliceCheckout

//export reducer
export default reducer
