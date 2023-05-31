import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { sendEmail } from '../api/mailt'

/**
 ** ======================================================
 ** Thunk [sendEmailAsync]
 ** ======================================================
 */
export const sendEmailAsync = createAsyncThunk(
    'post/email',
    async (
        {
            name,
            email,
            message,
            subject,
        }: {
            name: string
            email: string
            message: string
            subject: string
        },
        { rejectWithValue }
    ) => {
        try {
            //Send http request
            await axios(sendEmail(email, name, message, subject))
        } catch (err) {
            //Reject with value
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Reducer Slice [Mail]
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
const sliceMail = createSlice({
    name: 'mail',
    initialState: defaultState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(sendEmailAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: false,
                    error: '',
                }
            })
            .addCase(sendEmailAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    error: '',
                }
            })
            .addCase(sendEmailAsync.rejected, (state, action) => {
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
const { reducer } = sliceMail

//export reducer
export default reducer
