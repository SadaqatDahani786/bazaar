import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import { createOrder, deleteOrder, getManyOrder } from '../api/order'
import { IAddress } from '../components/AddressView/AddressView'
import { IMedia } from './mediaReducer'
import { IProduct } from './productReducer'
import { IUserDatabase } from './userReducer'

/**
 ** ======================================================
 ** Interface [IOrder]
 ** ======================================================
 */
export interface IOrder {
    _id: string
    customer: IUserDatabase
    products: Array<{
        product: IProduct
        selected_variants: Array<{
            name: string
            terms: [
                {
                    name: string
                    media?: IMedia
                }
            ]
        }>
        quantity: number
    }>
    shipping: {
        address: IAddress
    }
    billing: {
        address: IAddress
        payment_method: 'card' | 'cash_on_delivery'
        paid_amount: number
        transaction_id?: string
    }
    delivery_status:
        | 'processing'
        | 'pending_payment'
        | 'on_hold'
        | 'completed'
        | 'cancelled'
        | 'refunded'
        | undefined
    status_changed_at: string
    created_at: string
    isSelected: boolean
}

/**
 ** ======================================================
 ** Thunk [getManyOrderAsync]
 ** ======================================================
 */
export const getManyOrderAsync = createAsyncThunk(
    'get/manyOrder',
    async (_, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(getManyOrder())

            //2) Return response
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
 ** Thunk [createOrderAsync]
 ** ======================================================
 */
export const createOrderAsync = createAsyncThunk(
    'create/order',
    async (
        {
            formData,
            cb = () => '',
        }: { formData: GenericFormData; cb: (res?: IOrder | null) => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(createOrder(formData))

            //2) Callback
            cb(response.data.data)

            //3) Return response
            return response.data.data
        } catch (err) {
            //1) Callback
            cb(null)

            //2) Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [deleteOrderAsync]
 ** ======================================================
 */
export const deleteOrderAsync = createAsyncThunk(
    'delete/order',
    async ({ ids, cb = () => '' }: { ids: Array<string>; cb?: () => void }) => {
        //1) Create requests from ids to delete
        const deleteRequests = ids.map((id) => axios(deleteOrder(id)))

        //2) Consume promise to delete
        return Promise.all(deleteRequests).then(() => {
            cb()
            return ids
        })
    }
)

/**
 ** ======================================================
 ** Reducer Slice [order]
 ** ======================================================
 */
//Default state
const defaultState: {
    isLoading: {
        create: boolean
        fetch: boolean
        update: boolean
        delete: boolean
    }
    errors: {
        create: string
        fetch: string
        update: string
        delete: string
    }
    data: Array<IOrder>
} = {
    isLoading: {
        create: false,
        fetch: false,
        update: false,
        delete: false,
    },
    errors: {
        create: '',
        fetch: '',
        update: '',
        delete: '',
    },
    data: [],
}

//Slice order
const sliceOrder = createSlice({
    name: 'order',
    initialState: defaultState,
    reducers: {
        editSelectedStatus: (
            state,
            action: { payload: { ids: Array<string>; edit?: boolean } }
        ) => {
            //1) Get id and edit from payload
            const { ids, edit } = action.payload

            //2) Make changes
            const updatedData = state.data.map((order) => {
                if (ids.includes(order._id))
                    return {
                        ...order,
                        isSelected:
                            edit === undefined ? !order.isSelected : edit,
                    }
                return order
            })

            //3) Update state
            return { ...state, data: updatedData }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(
                getManyOrderAsync.fulfilled,
                (state, action: { payload: Array<IOrder> }) => {
                    //1) Get orders
                    const orders = action.payload

                    //2) Transform
                    const updatedData = orders.map((order) => ({
                        ...order,
                        isSelected: false,
                    }))

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, fetch: false },
                        errors: { ...state.errors, fetch: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(getManyOrderAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getManyOrderAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(
                createOrderAsync.fulfilled,
                (state, action: { payload: IOrder }) => {
                    //1) Get order
                    const order = action.payload

                    //2) Transform data
                    const updatedData = [
                        {
                            ...order,
                            isSelected: false,
                        },
                        ...state.data,
                    ]

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, create: false },
                        errors: { ...state.errors, create: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(createOrderAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, create: true },
                errors: { ...state.errors, create: '' },
                data: state.data,
            }))
            .addCase(createOrderAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, create: false },
                errors: { ...state.errors, create: action.payload as string },
                data: state.data,
            }))
            .addCase(
                deleteOrderAsync.fulfilled,
                (state, action: { payload: Array<string> }) => {
                    //1) Get ids of deleted orders
                    const deleteOrderIds = action.payload

                    //2) Filter out deleted orders
                    const updatedData = state.data.filter(
                        (order) => !deleteOrderIds.includes(order._id)
                    )

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(deleteOrderAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, delete: true },
                errors: { ...state.errors, delete: '' },
                data: state.data,
            }))
            .addCase(deleteOrderAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, delete: false },
                errors: { ...state.errors, delete: action.payload as string },
                data: state.data,
            })),
})

/**
 ** ======================================================
 ** Export
 ** ======================================================
 */
//extract actions and reducer from slice
const { actions, reducer } = sliceOrder

//export actions
export const { editSelectedStatus } = actions

//export reducer
export default reducer
