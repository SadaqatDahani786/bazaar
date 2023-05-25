import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import {
    addItemInUserCart,
    getUserCart,
    removeItemFromUserCart,
} from '../api/cart'
import { IProduct } from './productReducer'
import { IUserDatabase } from './userReducer'

/**
 ** ======================================================
 ** Interface [ICart]
 ** ======================================================
 */
interface ICart {
    _id: string
    owner: IUserDatabase
    products: Array<{
        product: IProduct
        selected_variants: Array<{
            name: string
            term: string
        }>
        quantity: number
    }>
    created_at?: Date
}

/**
 ** ======================================================
 ** Thunk [getUserCartAsync]
 ** ======================================================
 */
export const getUserCartAsync = createAsyncThunk(
    'get/user-cart',
    async (cb: () => void, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(getUserCart())

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
 ** Thunk [addItemInUserCartAsync]
 ** ======================================================
 */
export const addItemInUserCartAsync = createAsyncThunk(
    'post/add-item-in-cart',
    async (
        {
            data,
            cb = () => undefined,
        }: {
            data: {
                product: string
                quantity: number
                selected_variants: { name: string; term: string }[]
            }
            cb: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(addItemInUserCart(data))

            console.log(response)

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
 ** Thunk [removeItemFromUserCartAsync]
 ** ======================================================
 */
export const removeItemFromUserCartAsync = createAsyncThunk(
    'post/remove-item-from-cart',
    async (
        {
            data,
            cb = () => undefined,
        }: {
            data: {
                product: string
                quantity: number
                selected_variants: { name: string; term: string }[]
            }
            cb: () => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(removeItemFromUserCart(data))

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
 ** Reducer Slice [auth]
 ** ======================================================
 */
//Default state
const defaultState: {
    isLoading: {
        fetch: boolean
        add_item: boolean
        remove_item: boolean
    }
    errors: {
        fetch: string
        add_item: string
        remove_item: string
    }
    data: ICart | undefined
    cartDrawerStatus: boolean
} = {
    isLoading: {
        fetch: false,
        add_item: false,
        remove_item: false,
    },
    errors: {
        fetch: '',
        add_item: '',
        remove_item: '',
    },
    data: undefined,
    cartDrawerStatus: false,
}

//Slice
const sliceCart = createSlice({
    name: 'cart',
    initialState: defaultState,
    reducers: {
        openCartDrawer: (state) => {
            return {
                ...state,
                cartDrawerStatus: true,
            }
        },
        closeCartDrawer: (state) => {
            return {
                ...state,
                cartDrawerStatus: false,
            }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(
                getUserCartAsync.fulfilled,
                (state, action: { payload: ICart }) => {
                    //1) Get cart from payload
                    const cart = action.payload

                    //2) Update state
                    return {
                        ...state,
                        isLoading: {
                            ...state.isLoading,
                            fetch: false,
                        },
                        errors: {
                            ...state.errors,
                            fetch: '',
                        },
                        data: cart,
                    }
                }
            )
            .addCase(getUserCartAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getUserCartAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(
                addItemInUserCartAsync.fulfilled,
                (state, action: { payload: ICart }) => {
                    //1) Get cart from payload
                    const cart = action.payload

                    //2) Update state
                    return {
                        ...state,
                        isLoading: {
                            ...state.isLoading,
                            add_item: false,
                        },
                        errors: {
                            ...state.errors,
                            add_item: '',
                        },
                        data: cart,
                        cartDrawerStatus: true,
                    }
                }
            )
            .addCase(addItemInUserCartAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, add_item: true },
                errors: { ...state.errors, add_item: '' },
                data: state.data,
            }))
            .addCase(addItemInUserCartAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, add_item: false },
                errors: { ...state.errors, add_item: action.payload as string },
                data: state.data,
            }))
            .addCase(
                removeItemFromUserCartAsync.fulfilled,
                (state, action: { payload: ICart }) => {
                    //1) Get cart from payload
                    const cart = action.payload

                    //2) Update state
                    return {
                        ...state,
                        isLoading: {
                            ...state.isLoading,
                            remove_item: false,
                        },
                        errors: {
                            ...state.errors,
                            remove_item: '',
                        },
                        data: cart,
                    }
                }
            )
            .addCase(removeItemFromUserCartAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, remove_item: true },
                errors: { ...state.errors, remove_item: '' },
                data: state.data,
            }))
            .addCase(removeItemFromUserCartAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, remove_item: false },
                errors: {
                    ...state.errors,
                    remove_item: action.payload as string,
                },
                data: state.data,
            })),
})

/**
 ** ======================================================
 ** Export
 ** ======================================================
 */
//extract reducer & actions from slice
const { reducer, actions } = sliceCart

//export actions
export const { closeCartDrawer, openCartDrawer } = actions

//export reducer
export default reducer
