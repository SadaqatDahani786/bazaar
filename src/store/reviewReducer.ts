import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import {
    createReview,
    deleteReview,
    getManyReview,
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
    async (_, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(getManyReview())

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
        }: { id: string; formData: GenericFormData; cb: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(updateReview(id, formData))

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
            .addCase(
                getManyReviewAsync.fulfilled,
                (state, action: { payload: Array<IReview> }) => {
                    //1) Get reviews from payload
                    const reviews = action.payload

                    //2) Transform data
                    const updateData = reviews.map((review) => ({
                        ...review,
                        isSelected: false,
                    }))

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, fetch: false },
                        errors: { ...state.errors, fetch: '' },
                        data: updateData,
                    }
                }
            )
            .addCase(getManyReviewAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getManyReviewAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(
                createReviewAsync.fulfilled,
                (state, action: { payload: IReview }) => {
                    //1) Get review
                    const review = action.payload

                    //2) Make changes
                    const updateData = [
                        { ...review, isSelected: false },
                        ...state.data,
                    ]

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, create: false },
                        errors: { ...state.errors, create: '' },
                        data: updateData,
                    }
                }
            )
            .addCase(createReviewAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, create: true },
                errors: { ...state.errors, create: '' },
                data: state.data,
            }))
            .addCase(createReviewAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, create: false },
                errors: { ...state.errors, create: action.payload as string },
                data: state.data,
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
                        isLoading: { ...state.isLoading, update: false },
                        errors: { ...state.errors, update: '' },
                        data: updateData,
                    }
                }
            )
            .addCase(updateReviewAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, update: true },
                errors: { ...state.errors, update: '' },
                data: state.data,
            }))
            .addCase(updateReviewAsync.rejected, (state, action) => ({
                isLoading: { ...state.isLoading, update: false },
                errors: { ...state.errors, update: action.payload as string },
                data: state.data,
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
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(deleteReviewAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, delete: true },
                errors: { ...state.errors, delete: '' },
                data: state.data,
            }))
            .addCase(
                searchReviewAsync.fulfilled,
                (state, action: { payload: Array<IReview> }) => {
                    //1) Get reviews
                    const reviews = action.payload

                    //2) Make changes
                    const updatedData = reviews.map((review) => ({
                        ...review,
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
            .addCase(searchReviewAsync.pending, (state) => ({
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(searchReviewAsync.rejected, (state, action) => ({
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
const { actions, reducer } = sliceReview

//export actions
export const { editSelectedStatus } = actions

//export reducer
export default reducer
