import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import { getProductsInCategory } from '../api/categories'
import {
    createProduct,
    deleteProduct,
    getBrands,
    getColors,
    getItemsBoughtTogether,
    getManyProduct,
    getProduct,
    getSimilarViewedItems,
    getSizes,
    getTopSellingProducts,
    getTrendingItemsInYourArea,
    getUserInterestsItems,
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
    async (
        {
            queryParams = [],
            cb = () => '',
        }: {
            queryParams: { key: string; value: string }[]
            cb: (products: IProduct[]) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getManyProduct(queryParams))

            //2) Callback
            cb(response.data.data)

            //3) Return response
            return {
                products: response.data.data,
                count: response.data.count,
            }
        } catch (err) {
            //Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [getProductsInCategorytAsync]
 ** ======================================================
 */
export const getProductsInCategoryAsync = createAsyncThunk(
    'get/products-in-category',
    async (
        {
            category_slug,
            queryParams,
            cb = () => undefined,
        }: {
            category_slug: string
            queryParams: { key: string; value: string }[]
            cb?: (products: IProduct[]) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(
                getProductsInCategory(category_slug, queryParams)
            )

            cb(response.data.data)

            //2) Return response
            return {
                products: response.data.data,
                count: response.data.count,
            }
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
 ** Thunk [getUserInterestsItemsAsync]
 ** ======================================================
 */
export const getUserInterestsItemsAsync = createAsyncThunk(
    'get/user-interests-item',
    async (cb: (product: IProduct[]) => void, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(getUserInterestsItems())

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
 ** Thunk [getSimilarViewedItemsAsync]
 ** ======================================================
 */
export const getSimilarViewedItemsAsync = createAsyncThunk(
    'get/similar-viewed-items',
    async (
        {
            id,
            cb = () => '',
        }: { id: string; cb: (product: IProduct[]) => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getSimilarViewedItems(id))

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
 ** Thunk [getItemsBoughtTogetherAsync]
 ** ======================================================
 */
export const getItemsBoughtTogetherAsync = createAsyncThunk(
    'get/items-bought-together',
    async (
        {
            id,
            cb = () => undefined,
        }: {
            id: string
            cb: (
                res: {
                    sold: number
                    product: IProduct
                    image: IMediaDatabase
                }[]
            ) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getItemsBoughtTogether(id))

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
 ** Thunk [getTrendingItemsInYourAreaAsync]
 ** ======================================================
 */
export const getTrendingItemsInYourAreaAsync = createAsyncThunk(
    'get/trending-items-in-your-area',
    async (cb: (products: IProduct[]) => void, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(getTrendingItemsInYourArea())

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
 ** Thunk [getBrandsAsync]
 ** ======================================================
 */
export const getBrandsAsync = createAsyncThunk(
    'get/brands',
    async (
        cb: (
            res: {
                brand: string
                count: number
            }[]
        ) => void,
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getBrands())

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
 ** Thunk [getColorsAsync]
 ** ======================================================
 */
export const getColorsAsync = createAsyncThunk(
    'get/colors',
    async (
        cb: (
            res: {
                color: string
            }[]
        ) => void,
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getColors())

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
 ** Thunk [getSizesAsync]
 ** ======================================================
 */
export const getSizesAsync = createAsyncThunk(
    'get/sizes',
    async (
        cb: (
            res: {
                size: string
            }[]
        ) => void,
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getSizes())

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
    count: number
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
    count: 0,
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
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getProductAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getProductAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getManyProductAsync.fulfilled, (state, { payload }) => {
                //1) Get product and count from payload
                const products = payload?.products as Array<IProduct>
                const count = payload?.count as number

                //2) Transform data
                const updatedData = products.map((prod) => ({
                    ...prod,
                    isSelected: false,
                }))
                //3) Update state
                return {
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    data: updatedData,
                    count: count,
                }
            })
            .addCase(getManyProductAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getManyProductAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(
                getProductsInCategoryAsync.fulfilled,
                (state, { payload }) => {
                    //1) Get product and count from payload
                    const products = payload?.products as Array<IProduct>
                    const count = payload?.count as number

                    //2) Transform data
                    const updatedData = products.map((prod) => ({
                        ...prod,
                        isSelected: false,
                    }))

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, fetch: false },
                        errors: { ...state.errors, fetch: '' },
                        data: updatedData,
                        count,
                    }
                }
            )
            .addCase(getProductsInCategoryAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getProductsInCategoryAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getTopSellingProductsAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getTopSellingProductsAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getTopSellingProductsAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getItemsBoughtTogetherAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getItemsBoughtTogetherAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getItemsBoughtTogetherAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getUserInterestsItemsAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getUserInterestsItemsAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getUserInterestsItemsAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getSimilarViewedItemsAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getSimilarViewedItemsAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getSimilarViewedItemsAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getTrendingItemsInYourAreaAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getTrendingItemsInYourAreaAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(
                getTrendingItemsInYourAreaAsync.rejected,
                (state, action) => ({
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: {
                        ...state.errors,
                        fetch: action.payload as string,
                    },
                })
            )
            .addCase(getBrandsAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getBrandsAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getBrandsAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getColorsAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getColorsAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getColorsAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getSizesAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getSizesAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getSizesAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
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
                        ...state,
                        isLoading: { ...state.isLoading, create: false },
                        errors: { ...state.errors, create: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(createProductAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, create: true },
                errors: { ...state.errors, create: '' },
            }))
            .addCase(createProductAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, create: false },
                errors: { ...state.errors, create: action.payload as string },
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
                        ...state,
                        isLoading: { ...state.isLoading, update: false },
                        errors: { ...state.errors, update: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(updateProductAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, update: true },
                errors: { ...state.errors, update: '' },
            }))
            .addCase(updateProductAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, update: false },
                errors: { ...state.errors, update: action.payload as string },
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
                        ...state,
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(deleteProductAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, delete: true },
                errors: { ...state.errors, delete: '' },
            }))
            .addCase(deleteProductAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, delete: false },
                errors: { ...state.errors, delete: action.payload as string },
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
                        ...state,
                        isLoading: { ...state.isLoading, fetch: false },
                        errors: { ...state.errors, fetch: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(searchProductAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(searchProductAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
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
