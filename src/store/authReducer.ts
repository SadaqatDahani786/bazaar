import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import {
    forgotPassword,
    login,
    logout,
    resetPassword,
    signup,
    updatePassword,
} from '../api/auth'
import { getCurrentUser, getUser } from '../api/user'
import { IUserDatabase } from './userReducer'

/**
 ** ======================================================
 ** Thunk [signupAsync]
 ** ======================================================
 */
export const signupAsync = createAsyncThunk(
    'auth/signup',
    async (formData: GenericFormData, { rejectWithValue }) => {
        try {
            //1) Send http request
            await axios(signup(formData))

            //2) Get complete user with it's id
            const reponseUser = await axios(getCurrentUser())

            //3) Return response
            return reponseUser.data.data
        } catch (err) {
            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [loginAsync]
 ** ======================================================
 */
export const loginAsync = createAsyncThunk(
    'auth/login',
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            await axios(login(email, password))

            //2) Get current user
            const reponseUser = await axios(getCurrentUser())

            //3) Return response
            return reponseUser.data.data
        } catch (err) {
            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [logoutAsync]
 ** ======================================================
 */
export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            //Send http request
            await axios(logout())
        } catch (err) {
            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [forgotPasswordAsync]
 ** ======================================================
 */
export const forgotPasswordAsync = createAsyncThunk(
    'auth/forgot-password',
    async (
        { email, cb = () => '' }: { email: string; cb: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(forgotPassword(email))

            //2) Callback
            cb()

            //3) Return response
            return response.data.data
        } catch (err) {
            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [updatePasswordAsync]
 ** ======================================================
 */
export const updatePasswordAsync = createAsyncThunk(
    'auth/update-password',
    async (
        {
            formData,
            cb = () => undefined,
        }: {
            formData: GenericFormData
            cb: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(updatePassword(formData))

            //2) Callback
            cb()

            //3) Return response
            return response.data.data
        } catch (err) {
            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [resetPassword]
 ** ======================================================
 */
export const resetPasswordAsync = createAsyncThunk(
    'auth/reset-password',
    async (
        { formData, token }: { formData: GenericFormData; token: string },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(resetPassword(formData, token))

            //2) Get complete user with it's id
            const reponseUser = await axios(getUser(response.data.data.user))

            //3) Return response
            return reponseUser.data.data
        } catch (err) {
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
    data: IUserDatabase | undefined
} = {
    isLoading: false,
    error: '',
    data: undefined,
}

//Slice
const sliceAuth = createSlice({
    name: 'auth',
    initialState: defaultState,
    reducers: {
        setUser: (state, action: { type: string; payload: IUserDatabase }) => {
            return { ...state, data: action.payload }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(
                signupAsync.fulfilled,
                (state, action: { payload: IUserDatabase }) => {
                    //1) Get user
                    const user = action.payload

                    //2) Save logged in user into local storage
                    localStorage.setItem('user_id', user._id)
                    localStorage.setItem('user_role', user.role)

                    //2) Update state
                    return { isLoading: false, error: '', data: user }
                }
            )
            .addCase(signupAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    error: '',
                }
            })
            .addCase(signupAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload as string,
                }
            })
            .addCase(
                loginAsync.fulfilled,
                (state, action: { payload: IUserDatabase }) => {
                    //1) Get user
                    const user = action.payload

                    //2) Save logged in user into local storage
                    localStorage.setItem('user_id', user._id)
                    localStorage.setItem('user_role', user.role)

                    //2) Update state
                    return { isLoading: false, error: '', data: user }
                }
            )
            .addCase(loginAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    error: '',
                }
            })
            .addCase(loginAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload as string,
                }
            })
            .addCase(logoutAsync.fulfilled, () => {
                //1)Clear storage
                localStorage.removeItem('user_id')
                localStorage.removeItem('user_role')
                localStorage.removeItem('user_photo')
                localStorage.removeItem('user_name')

                //2) Update state
                return { isLoading: false, error: '', data: undefined }
            })
            .addCase(forgotPasswordAsync.fulfilled, (state) => {
                return { ...state, isLoading: false, error: '' }
            })
            .addCase(forgotPasswordAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    error: '',
                }
            })
            .addCase(forgotPasswordAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload as string,
                }
            })
            .addCase(updatePasswordAsync.fulfilled, (state) => {
                return { ...state, isLoading: false, error: '' }
            })
            .addCase(updatePasswordAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    error: '',
                }
            })
            .addCase(updatePasswordAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload as string,
                }
            })
            .addCase(
                resetPasswordAsync.fulfilled,
                (state, action: { payload: IUserDatabase }) => {
                    //1) Get user
                    const user = action.payload

                    //2) Save logged in user into local storage
                    localStorage.setItem('user_id', user._id)
                    localStorage.setItem('user_role', user.role)

                    //2) Update state
                    return { isLoading: false, error: '', data: user }
                }
            )
            .addCase(resetPasswordAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    error: '',
                }
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
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
//extract reducer & actions from slice
const { reducer, actions } = sliceAuth

//export actions
export const { setUser } = actions

//export reducer
export default reducer
