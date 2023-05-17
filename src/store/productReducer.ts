import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import {
    createProduct,
    deleteProduct,
    getManyProduct,
    getProduct,
    getTopSellingProducts,
    searchProduct,
    updateProduct,
} from '../api/product'
import { ICategory } from './categoryReducer'
import { IMedia, IMediaDatabase } from './mediaReducer'

/**
 ** ======================================================
 ** Interface [IProduct]
 ** ======================================================
 */
export interface IProduct {
    _id: string
    sku: string
    title: string
    description: string
    price: number
    selling_price: number
    stock: number
    image: IMediaDatabase
    image_gallery: Array<IMediaDatabase>
    categories: Array<ICategory>
    manufacturing_details: {
        brand: string
        model_number: string
        release_date: string
    }
    shipping: {
        dimensions: {
            width: number
            height: number
            length: number
        }
        weight: number
    }
    variants: [
        {
            name: string
            variant_type: 'color' | 'size' | 'other'
            terms: [
                {
                    name: string
                    image?: IMedia
                }
            ]
        }
    ]
    staff_picked?: boolean
    created_at: string
    isSelected: boolean
}

/**
 ** ======================================================
 ** Thunk [getProductAsync]
 ** ======================================================
 */
export const getProductAsync = createAsyncThunk(
    'get/product',
    async (
        {
            id,
            cb = () => '',
        }: { id: string; cb: (prod: IProduct | null) => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getProduct(id))

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
 ** Thunk [getManyProductAsync]
 ** ======================================================
 */
export const getManyProductAsync = createAsyncThunk(
    'get/manyProduct',
    async (_, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(getManyProduct())

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
 ** Thunk [getTopSellingProductsAsync]
 ** ======================================================
 */
export const getTopSellingProductsAsync = createAsyncThunk(
    'get/top-selling-products',
    async (
        cb: (
            res: {
                sold: number
                sales: number
                product: IProduct
                image: IMediaDatabase
            }[]
        ) => void,
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getTopSellingProducts())

            //2) Callback
            cb(response.data.data)

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
 ** Thunk [createProductAsync]
 ** ======================================================
 */
export const createProductAsync = createAsyncThunk(
    'create/product',
    async (
        {
            formData,
            cb = () => '',
        }: { formData: GenericFormData; cb: (res?: IProduct | null) => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(createProduct(formData))

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
 ** Thunk [updateProductAsync]
 ** ======================================================
 */
export const updateProductAsync = createAsyncThunk(
    'update/product',
    async (
        {
            id,
            formData,
            cb = () => '',
        }: {
            id: string
            formData: GenericFormData
            cb: (res?: IProduct | null) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(updateProduct(id, formData))

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
 ** Thunk [deleteProductAsync]
 ** ======================================================
 */
export const deleteProductAsync = createAsyncThunk(
    'delete/product',
    async ({ ids, cb = () => '' }: { ids: Array<string>; cb?: () => void }) => {
        //1) Create requests from ids to delete
        const deleteRequests = ids.map((id) => axios(deleteProduct(id)))

        //2) Consume promise to delete
        return Promise.all(deleteRequests).then(() => {
            cb()
            return ids
        })
    }
)

/**
 ** ======================================================
 ** Thunk [searchProductAsync]
 ** ======================================================
 */
export const searchProductAsync = createAsyncThunk(
    'search/product',
    async (query: string, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(searchProduct(query))

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
 ** Reducer Slice [product]
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
    data: Array<IProduct>
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

//Slice product
const sliceProduct = createSlice({
    name: 'product',
    initialState: defaultState,
    reducers: {
        editSelectedStatus: (
            state,
            action: { payload: { ids: Array<string>; edit?: boolean } }
        ) => {
            //1) Get id and edit from payload
            const { ids, edit } = action.payload

            //2) Make changes
            const updatedData = state.data.map((prod) => {
                if (ids.includes(prod._id))
                    return {
                        ...prod,
                        isSelected:
                            edit === undefined ? !prod.isSelected : edit,
                    }
                return prod
            })

            //3) Update state
            return { ...state, data: updatedData }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getProductAsync.fulfilled, (state) => {
                return {
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    data: state.data,
                }
            })
            .addCase(getProductAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getProductAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(
                getManyProductAsync.fulfilled,
                (state, action: { payload: Array<IProduct> }) => {
                    //1) Get product
                    const product = action.payload

                    //2) Transform data
                    const updatedData = product.map((prod) => ({
                        ...prod,
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
            .addCase(getManyProductAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getManyProductAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(getTopSellingProductsAsync.fulfilled, (state) => {
                return {
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    data: state.data,
                }
            })
            .addCase(getTopSellingProductsAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getTopSellingProductsAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(
                createProductAsync.fulfilled,
                (state, action: { payload: IProduct }) => {
                    //1) Get product
                    const product = action.payload

                    //2) Transform data
                    const updatedData = [
                        {
                            ...product,
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
            .addCase(createProductAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, create: true },
                errors: { ...state.errors, create: '' },
                data: state.data,
            }))
            .addCase(createProductAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, create: false },
                errors: { ...state.errors, create: action.payload as string },
                data: state.data,
            }))
            .addCase(
                updateProductAsync.fulfilled,
                (state, action: { payload: IProduct }) => {
                    //1) Get product
                    const product = action.payload

                    //2) Make changes
                    const updatedData = state.data.map((prod) => {
                        if (prod._id === product._id) return product
                        return prod
                    })

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, update: false },
                        errors: { ...state.errors, update: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(updateProductAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, update: true },
                errors: { ...state.errors, update: '' },
                data: state.data,
            }))
            .addCase(updateProductAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, update: false },
                errors: { ...state.errors, update: action.payload as string },
                data: state.data,
            }))
            .addCase(
                deleteProductAsync.fulfilled,
                (state, action: { payload: Array<string> }) => {
                    //1) Get ids of deleted products
                    const deleteProductsIds = action.payload

                    //2) Filter out deleted products
                    const updatedData = state.data.filter(
                        (prod) => !deleteProductsIds.includes(prod._id)
                    )

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(deleteProductAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, delete: true },
                errors: { ...state.errors, delete: '' },
                data: state.data,
            }))
            .addCase(deleteProductAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, delete: false },
                errors: { ...state.errors, delete: action.payload as string },
                data: state.data,
            }))
            .addCase(
                searchProductAsync.fulfilled,
                (state, action: { payload: Array<IProduct> }) => {
                    //1) Get products
                    const products = action.payload

                    //2) Make changes
                    const updatedData = products.map((prod) => ({
                        ...prod,
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
            .addCase(searchProductAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(searchProductAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            })),
})

/**
 ** ======================================================
 ** Export
 ** ======================================================
 */
//extract actions and reducer from slice
const { actions, reducer } = sliceProduct

//export actions
export const { editSelectedStatus } = actions

//export reducer
export default reducer
