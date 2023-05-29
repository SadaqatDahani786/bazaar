import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import {
    createUserProductReview,
    deleteUserProductReview,
    getUserProductReview,
    updateUserProductReview,
} from '../api/product'
import {
    createReview,
    deleteReview,
    getManyReview,
    getMyManyReview,
    getRatingsOfProduct,
    searchReview,
    updateReview,
} from '../api/reviews'
import { IMediaDatabase } from './mediaReducer'
import { IUserDatabase } from './userReducer'
/**
 ** ======================================================
 ** Interface [ICategory]
 ** ======================================================
 */
export interface IReview {
    _id: string
    title: string
    review: string
    rating: number
    images: Array<IMediaDatabase>
    author: IUserDatabase
    product: {
        _id: string
        title: string
    }
    created_at: string
    isSelected: boolean
}

/**
 ** ======================================================
 ** Thunk [getManyReviewAsync]
 ** ======================================================
 */
export const getManyReviewAsync = createAsyncThunk(
    'get/manyReview',
    async (
        queryParams: { key: string; value: string }[],
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getManyReview(queryParams))

            //2) Return response
            return { reviews: response.data.data, count: response.data.count }
        } catch (err) {
            //Reject with errorss
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [getMyManyReviewAsync]
 ** ======================================================
 */
export const getMyManyReviewAsync = createAsyncThunk(
    'get/myManyReview',
    async (
        queryParams: { key: string; value: string }[],
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getMyManyReview(queryParams))

            //2) Return response
            return { reviews: response.data.data, count: response.data.count }
        } catch (err) {
            //Reject with errorss
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [getRatingsOfProductAsync]
 ** ======================================================
 */
export const getRatingsOfProductAsync = createAsyncThunk(
    'get/ratings',
    async (
        {
            ids,
            cb = () => undefined,
        }: {
            ids: string[]
            cb: (
                res: {
                    product: string
                    ratings: {
                        rating_star: number
                        ratings_count: number
                    }[]
                }[]
            ) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getRatingsOfProduct(ids))

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
 ** Thunk [getUserProductReviewAsync]
 ** ======================================================
 */
export const getUserProductReviewAsync = createAsyncThunk(
    'get/user-product-review',
    async (
        {
            id,
            cb = () => undefined,
        }: { id: string; cb: (review: IReview) => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getUserProductReview(id))
            //2) Callback
            cb(response.data.data[0])

            //2) Return response
            return response.data.data[0]
        } catch (err) {
            //Reject with errorss
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [createUserProductReviewAsync]
 ** ======================================================
 */
export const createUserProductReviewAsync = createAsyncThunk(
    'create/user-product-review',
    async (
        {
            id,
            formData,
            cb = () => undefined,
        }: {
            id: string
            formData: GenericFormData
            cb: (review?: IReview) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(createUserProductReview(id, formData))

            //2) Callback
            cb(response.data.data)

            //3) Return response
            return response.data.data
        } catch (err) {
            //=>
            cb()

            //=>Reject with errorss
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [updateUserProductReviewAsync]
 ** ======================================================
 */
export const updateUserProductReviewAsync = createAsyncThunk(
    'update/user-product-review',
    async (
        {
            id,
            formData,
            cb = () => undefined,
        }: {
            id: string
            formData: GenericFormData
            cb: (review?: IReview) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(updateUserProductReview(id, formData))

            //2) Callback
            cb(response.data.data)

            //3) Return response
            return response.data.data
        } catch (err) {
            //=>
            cb()

            //=>Reject with errorss
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [delteUserProductReviewAsync]
 ** ======================================================
 */
export const deleteUserProductReviewAsync = createAsyncThunk(
    'delete/user-product-review',
    async (
        { id, cb = () => undefined }: { id: string; cb: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(deleteUserProductReview(id))

            //2) Callback
            cb()

            //3) Return response
            return { ...response.data.data, id }
        } catch (err) {
            //Reject with errorss
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [createReviewAsync]
 ** ======================================================
 */
export const createReviewAsync = createAsyncThunk(
    'create/review',
    async (
        {
            formData,
            cb = () => '',
        }: { formData: GenericFormData; cb: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(createReview(formData))

            //2) Callback
            cb()

            //3) Return response
            return response.data.data
        } catch (err) {
            //1) Callback
            cb()

            //2) Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [updateReviewAsync]
 ** ======================================================
 */
export const updateReviewAsync = createAsyncThunk(
    'update/review',
    async (
        {
            id,
            formData,
            cb = () => '',
        }: {
            id: string
            formData: GenericFormData
            cb: (review?: IReview) => void
        },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(updateReview(id, formData))

            //2) Callback
            cb(response.data.data)

            //3) Return response
            return response.data.data
        } catch (err) {
            //1) Callback
            cb()

            //2) Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [deleteReviewAsync]
 ** ======================================================
 */
export const deleteReviewAsync = createAsyncThunk(
    'delete/review',
    async ({ ids, cb = () => '' }: { ids: Array<string>; cb?: () => void }) => {
        //1) Create requests from ids to delete
        const deleteRequests = ids.map((id) => axios(deleteReview(id)))

        //2) Consume promise to delete
        return Promise.all(deleteRequests).then(() => {
            cb()
            return ids
        })
    }
)

/**
 ** ======================================================
 ** Thunk [searchReviewAsync]
 ** ======================================================
 */
export const searchReviewAsync = createAsyncThunk(
    'search/review',
    async (query: string, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(searchReview(query))

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
 ** Slice [Review]
 ** ======================================================
 */
const defaultState: {
    isLoading: {
        fetch: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
    errors: {
        fetch: string
        create: string
        update: string
        delete: string
    }
    data: Array<IReview>
    count: number
} = {
    isLoading: {
        fetch: false,
        create: false,
        update: false,
        delete: false,
    },
    errors: {
        fetch: '',
        create: '',
        update: '',
        delete: '',
    },
    count: 0,
    data: [],
}

//Slice
const sliceReview = createSlice({
    name: 'review',
    initialState: defaultState,
    reducers: {
        editSelectedStatus: (
            state,
            action: { payload: { ids: Array<string>; edit?: boolean } }
        ) => {
            //1) Get id and edit from payload
            const { ids, edit } = action.payload

            //2) Make changes
            const updatedData = state.data.map((cat) => {
                if (ids.includes(cat._id))
                    return {
                        ...cat,
                        isSelected: edit === undefined ? !cat.isSelected : edit,
                    }
                return cat
            })

            //3) Update state
            return { ...state, data: updatedData }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getManyReviewAsync.fulfilled, (state, { payload }) => {
                //1) Get reviews from payload
                const count = payload?.count || (0 as number)
                const reviews = (payload?.reviews || []) as IReview[]

                //2) Transform data
                const updateData = reviews.map((review) => ({
                    ...review,
                    isSelected: false,
                }))

                //3) Update state
                return {
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    count,
                    data: updateData,
                }
            })
            .addCase(getManyReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getManyReviewAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getMyManyReviewAsync.fulfilled, (state, { payload }) => {
                //1) Get reviews from payload
                const count = payload?.count || (0 as number)
                const reviews = (payload?.reviews || []) as IReview[]

                //2) Transform data
                const updateData = reviews.map((review) => ({
                    ...review,
                    isSelected: false,
                }))

                //3) Update state
                return {
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    count,
                    data: updateData,
                }
            })
            .addCase(getMyManyReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getMyManyReviewAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getRatingsOfProductAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getRatingsOfProductAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getRatingsOfProductAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(getUserProductReviewAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                }
            })
            .addCase(getUserProductReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(getUserProductReviewAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
            }))
            .addCase(
                createUserProductReviewAsync.fulfilled,
                (state, action: { payload: IReview }) => {
                    //1) Get review
                    const review = action.payload

                    //2) Make changes
                    const updatedData = [review, ...state.data]

                    //3) Update state
                    return {
                        ...state,
                        isLoading: { ...state.isLoading, create: false },
                        errors: { ...state.errors, create: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(createUserProductReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, create: true },
                errors: { ...state.errors, create: '' },
            }))
            .addCase(
                createUserProductReviewAsync.rejected,
                (state, action) => ({
                    ...state,
                    isLoading: { ...state.isLoading, create: false },
                    errors: {
                        ...state.errors,
                        create: action.payload as string,
                    },
                })
            )
            .addCase(updateUserProductReviewAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, update: false },
                    errors: { ...state.errors, update: '' },
                }
            })
            .addCase(updateUserProductReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, update: true },
                errors: { ...state.errors, update: '' },
            }))
            .addCase(
                updateUserProductReviewAsync.rejected,
                (state, action) => ({
                    ...state,
                    isLoading: { ...state.isLoading, update: false },
                    errors: {
                        ...state.errors,
                        update: action.payload as string,
                    },
                })
            )
            .addCase(
                deleteUserProductReviewAsync.fulfilled,
                (state, action: { payload: { id: string } }) => {
                    //1) Get id
                    const { id } = action.payload

                    //2) Filter out deleted review
                    const updatedData = state.data.filter(
                        (review) => review.product._id !== id
                    )

                    //3) Update state,
                    return {
                        ...state,
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: updatedData,
                        count: state.count - 1,
                    }
                }
            )
            .addCase(deleteUserProductReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, delete: true },
                errors: { ...state.errors, delete: '' },
            }))
            .addCase(
                deleteUserProductReviewAsync.rejected,
                (state, action) => ({
                    ...state,
                    isLoading: { ...state.isLoading, delete: false },
                    errors: {
                        ...state.errors,
                        delete: action.payload as string,
                    },
                })
            )
            .addCase(
                createReviewAsync.fulfilled,
                (state, action: { payload: IReview }) => {
                    //1) Get review
                    const review = action.payload

                    //2) Make changes
                    const updateData = [
                        ...state.data,
                        { ...review, isSelected: false },
                    ]

                    //3) Update state
                    return {
                        ...state,
                        isLoading: { ...state.isLoading, create: false },
                        errors: { ...state.errors, create: '' },
                        data: updateData,
                    }
                }
            )
            .addCase(createReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, create: true },
                errors: { ...state.errors, create: '' },
            }))
            .addCase(createReviewAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, create: false },
                errors: { ...state.errors, create: action.payload as string },
            }))
            .addCase(
                updateReviewAsync.fulfilled,
                (state, action: { payload: IReview }) => {
                    //1) Get review
                    const review = action.payload

                    //2) Make changes
                    const updateData = state.data.map((rev) => {
                        if (rev._id === review._id) return review
                        return rev
                    })

                    //3) Update state
                    return {
                        ...state,
                        isLoading: { ...state.isLoading, update: false },
                        errors: { ...state.errors, update: '' },
                        data: updateData,
                    }
                }
            )
            .addCase(updateReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, update: true },
                errors: { ...state.errors, update: '' },
            }))
            .addCase(updateReviewAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, update: false },
                errors: { ...state.errors, update: action.payload as string },
            }))
            .addCase(
                deleteReviewAsync.fulfilled,
                (state, action: { payload: Array<string> }) => {
                    //1) Get ids of deleted reviews
                    const deleteReviewsIds = action.payload

                    //2) Filter out deleted review
                    const updatedData = state.data.filter(
                        (review) => !deleteReviewsIds.includes(review._id)
                    )

                    //3) Update state
                    return {
                        ...state,
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: updatedData,
                        count: state.count - 1,
                    }
                }
            )
            .addCase(deleteReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, delete: true },
                errors: { ...state.errors, delete: '' },
            }))
            .addCase(
                searchReviewAsync.fulfilled,
                (
                    state,
                    action: {
                        payload: { count: number; reviews: Array<IReview> }
                    }
                ) => {
                    //1) Get reviews
                    const { count, reviews } = action.payload

                    //2) Make changes
                    const updatedData = reviews.map((review) => ({
                        ...review,
                        isSelected: false,
                    }))

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, fetch: false },
                        errors: { ...state.errors, fetch: '' },
                        count,
                        data: updatedData,
                    }
                }
            )
            .addCase(searchReviewAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
            }))
            .addCase(searchReviewAsync.rejected, (state, action) => ({
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
const { actions, reducer } = sliceReview

//export actions
export const { editSelectedStatus } = actions

//export reducer
export default reducer
