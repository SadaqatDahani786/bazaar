import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import {
    createCategory,
    deleteCategory,
    getManyCateogory,
    getSalesInEachCategory,
    searchCategory,
    updateCategory,
} from '../api/categories'
import { IMediaDatabase } from './mediaReducer'

/** ======================================================
 ** Interface [ICategory]
 ** ======================================================
 */
export interface ICategory {
    _id: string
    slug: string
    name: string
    description: string
    image: IMediaDatabase
    parent: {
        _id: string
        name: string
        slug: string
    }
    created_at: string
    isSelected: boolean
}

/**
 ** ======================================================
 ** Thunk [getManyCategoryAsync]
 ** ======================================================
 */
export const getManyCategoryAsync = createAsyncThunk(
    'get/manyCategory',
    async (
        queryParams: { key: string; value: string }[] = [],
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getManyCateogory(queryParams))

            //2) Return response
            return {
                categories: response.data.data,
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
 ** Thunk [getSalesInEachCategoryAsync]
 ** ======================================================
 */
export const getSalesInEachCategoryAsync = createAsyncThunk(
    'get/sales-in-each-category',
    async (
        cb: (
            res: {
                category: ICategory
                sales: number
                orders: number
            }[]
        ) => void,
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(getSalesInEachCategory())

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
 ** Thunk [createCategoryAsync]
 ** ======================================================
 */
export const createCategoryAsync = createAsyncThunk(
    'create/category',
    async (
        {
            formData,
            cb = () => '',
        }: { formData: GenericFormData; cb?: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(createCategory(formData))

            //2) Callback
            cb()

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
 ** Thunk [updateCategoryAsync]
 ** ======================================================
 */
export const updateCategoryAsync = createAsyncThunk(
    'update/category',
    async (
        {
            id,
            formData,
            cb = () => '',
        }: { id: string; formData: GenericFormData; cb?: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(updateCategory(id, formData))

            //2) Callback
            cb()

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
 ** Thunk [deleteCategoryAsync]
 ** ======================================================
 */
export const deleteCategoryAsync = createAsyncThunk(
    'delete/category',
    async ({ ids, cb = () => '' }: { ids: Array<string>; cb?: () => void }) => {
        //1) Create requests from ids to delete
        const deleteRequests = ids.map((id) => axios(deleteCategory(id)))

        //2) Consume promise to delete
        return Promise.all(deleteRequests).then(() => {
            cb()
            return ids
        })
    }
)

/**
 ** ======================================================
 ** Thunk [searchCategoryAsync]
 ** ======================================================
 */
export const searchCategoryAsync = createAsyncThunk(
    'search/category',
    async (query: string, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(searchCategory(query))

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
 ** Reducer Slice [category]
 ** ======================================================
 */
//Default state
const defaultState: {
    isLoading: {
        fetch: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
    errors: { fetch: string; create: string; update: string; delete: string }
    data: Array<ICategory>
    count: number
} = {
    isLoading: { fetch: false, create: false, update: false, delete: false },
    errors: { fetch: '', create: '', update: '', delete: '' },
    data: [],
    count: 0,
}

//Slice
const sliceCategory = createSlice({
    name: 'category',
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
            .addCase(getManyCategoryAsync.fulfilled, (state, action) => {
                //1) Get categories
                const categories =
                    (action.payload?.categories as ICategory[]) || []
                const count = (action.payload?.count as number) || 0

                //2) Transform
                const updatedData = categories.map((category) => ({
                    ...category,
                    isSelected: false,
                }))

                //3) Update state
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    data: updatedData,
                    count: count,
                }
            })
            .addCase(getManyCategoryAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getManyCategoryAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(getSalesInEachCategoryAsync.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    data: state.data,
                }
            })
            .addCase(getSalesInEachCategoryAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(getSalesInEachCategoryAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: false },
                errors: { ...state.errors, fetch: action.payload as string },
                data: state.data,
            }))
            .addCase(
                createCategoryAsync.fulfilled,
                (state, action: { payload: ICategory }) => {
                    //1) Get category
                    const category = action.payload

                    //2) Make changes
                    const updatedData = [
                        { ...category, isSelected: false },
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
            .addCase(createCategoryAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, create: true },
                errors: { ...state.errors, create: '' },
                data: state.data,
            }))
            .addCase(createCategoryAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, create: false },
                errors: { ...state.errors, create: action.payload as string },
                data: state.data,
            }))
            .addCase(
                updateCategoryAsync.fulfilled,
                (state, action: { payload: ICategory }) => {
                    //1) Get category from paylad
                    const category = action.payload

                    //2) Find and apply changes to the updated category
                    const updatedData = state.data.map((cat) => {
                        if (cat._id === cat._id) return cat
                        return category
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
            .addCase(updateCategoryAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, update: true },
                errors: { ...state.errors, update: '' },
                data: state.data,
            }))
            .addCase(updateCategoryAsync.rejected, (state, action) => ({
                ...state,
                isLoading: { ...state.isLoading, update: false },
                errors: { ...state.errors, update: action.payload as string },
                data: state.data,
            }))
            .addCase(
                deleteCategoryAsync.fulfilled,
                (state, action: { payload: Array<string> }) => {
                    //1) Get ids of deleted categories
                    const deletedCategoriesId = action.payload

                    //2) Filter out deleted categories
                    const updatedData = state.data.filter(
                        (cat) => !deletedCategoriesId.includes(cat._id)
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
            .addCase(deleteCategoryAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, delete: true },
                errors: { ...state.errors, delete: '' },
                data: state.data,
            }))
            .addCase(
                searchCategoryAsync.fulfilled,
                (state, action: { payload: Array<ICategory> }) => {
                    //1) Get categories
                    const categries = action.payload

                    //2) Make changes
                    const updatedData = categries.map((cat) => ({
                        ...cat,
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
            .addCase(searchCategoryAsync.pending, (state) => ({
                ...state,
                isLoading: { ...state.isLoading, fetch: true },
                errors: { ...state.errors, fetch: '' },
                data: state.data,
            }))
            .addCase(searchCategoryAsync.rejected, (state, action) => ({
                ...state,
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
//extract actions & reducer from slice
const { actions, reducer } = sliceCategory

//export actions
export const { editSelectedStatus } = actions

//export reducer
export default reducer
