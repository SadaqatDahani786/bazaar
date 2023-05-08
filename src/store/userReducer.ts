import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'
import {
    createUser,
    deleteUser,
    getManyUser,
    getUser,
    searchUser,
    updateUser,
} from '../api/user'

/**
 ** ======================================================
 ** Interface [IUserDatabase]
 ** ======================================================
 */
export interface IUserDatabase {
    _id: string
    name: string
    username: string
    email: string
    bio: string
    photo: {
        url: string
        title: string
    }
    phone_no: string
    addresses: Array<{
        full_name: string
        address: string
        phone_no: string
        country: string
        state: string
        city: string
        zip_code: string
        property_type: 'house' | 'business' | 'apartment' | 'other'
        default_billing_address: boolean
        default_shipping_address: boolean
    }>
    role: 'member' | 'admin'
    created_at: string
}

/**
 ** ======================================================
 ** Interface [IUser]
 ** ======================================================
 */
export interface IUser extends IUserDatabase {
    isSelected: boolean
}

/**
 ** ======================================================
 ** Thunk [getManyUserAsync]
 ** ======================================================
 */
export const getManyUserAsync = createAsyncThunk('get/manyUser', async () => {
    //1) Send http request
    const response = await axios(getManyUser())

    //2) Return response
    return response.data.data
})

/**
 ** ======================================================
 ** Thunk [getUserAsync]
 ** ======================================================
 */
export const getUserAsync = createAsyncThunk(
    'get/user',
    async ({
        id,
        cb = () => '',
    }: {
        id: string
        cb: (user: IUserDatabase) => void
    }) => {
        //1) Send http request
        const response = await axios(getUser(id))

        //2) Callback
        cb(response.data.data)

        //3) Return response
        return response.data.data
    }
)

/**
 ** ======================================================
 ** Thunk [createUserAsync]
 ** ======================================================
 */
export const createUserAsync = createAsyncThunk(
    'create/user',
    async (
        {
            formData,
            cb = () => undefined,
        }: { formData: GenericFormData; cb?: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(createUser(formData))

            //2) Callback
            cb()

            //3) Return response
            return response.data.data
        } catch (err) {
            //1) Cb
            cb()

            //2) Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [updateUserAsync]
 ** ======================================================
 */
export const updateUserAsync = createAsyncThunk(
    'update/user',
    async (
        {
            id,
            formData,
            cb = () => undefined,
        }: { id: string; formData: GenericFormData; cb?: () => void },
        { rejectWithValue }
    ) => {
        try {
            //1) Send http request
            const response = await axios(updateUser(id, formData))

            //2) Callback
            cb()
            console.log(response)

            //3) Return response
            return response.data.data
        } catch (err) {
            //1) Cb
            cb()
            console.log(err)

            //2) Reject with error
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data?.message)
        }
    }
)

/**
 ** ======================================================
 ** Thunk [deleteUserAsync]
 ** ======================================================
 */
export const deleteUserAsync = createAsyncThunk(
    'delete/user',
    async ({ ids, cb }: { ids: Array<string>; cb?: () => void }) => {
        //1) Create requests from ids to delete
        const deleteRequests = ids.map((id) => axios(deleteUser(id)))

        //2) Consume promise to delete
        return Promise.all(deleteRequests).then(() => {
            cb && cb()
            return ids
        })
    }
)

/**
 ** ======================================================
 ** Thunk [searchUserAsync]
 ** ======================================================
 */
export const searchUserAsync = createAsyncThunk(
    'search/user',
    async (query: string) => {
        //1) Create requests from ids to delete
        const response = await axios(searchUser(query))

        //2) Consume promise to delete
        return response.data.data
    }
)

/**
 ** ======================================================
 ** Reducer Slice [User]
 ** ======================================================
 */
//Default state
const defaultState: {
    isLoading: {
        fetch: boolean
        update: boolean
        delete: boolean
        create: boolean
    }
    errors: {
        fetch: string
        update: string
        delete: string
        create: string
    }
    data: Array<IUser>
} = {
    isLoading: {
        fetch: false,
        update: false,
        delete: false,
        create: false,
    },
    errors: {
        fetch: '',
        update: '',
        delete: '',
        create: '',
    },
    data: [],
}

//Slice
const sliceUser = createSlice({
    name: 'user',
    initialState: defaultState,
    reducers: {
        editSelectedStatus: (
            state,
            action: { payload: { ids: Array<string>; edit?: boolean } }
        ) => {
            //1) Get id and edit from payload
            const { ids, edit } = action.payload

            //2) Make changes
            const updatedData = state.data.map((user) => {
                if (ids.includes(user._id))
                    return {
                        ...user,
                        isSelected:
                            edit === undefined ? !user.isSelected : edit,
                    }
                return user
            })

            //3) Update state
            return { ...state, data: updatedData }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getUserAsync.fulfilled, (state) => {
                return {
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: { ...state.errors, fetch: '' },
                    data: state.data,
                }
            })
            .addCase(getUserAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: true },
                }
            })
            .addCase(getUserAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: false },
                    errors: {
                        ...state.errors,
                        fetch: action.payload as string,
                    },
                }
            })
            .addCase(
                getManyUserAsync.fulfilled,
                (state, action: { payload: Array<IUser> }) => {
                    //1) Get fetched users
                    const users = action.payload

                    //2) Transform
                    const updatedData = users.map((user) => ({
                        ...user,
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
            .addCase(getManyUserAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: true },
                }
            })
            .addCase(
                updateUserAsync.fulfilled,
                (state, action: { payload: IUser }) => {
                    //1) Get user
                    const user = action.payload

                    //2) Transform
                    const updatedData = state.data.map((curruser) => {
                        if (curruser._id === user._id)
                            return { ...user, isSelected: false }
                        return curruser
                    })

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, update: false },
                        errors: { ...state.errors, update: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(updateUserAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, update: true },
                }
            })
            .addCase(updateUserAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, update: false },
                    errors: {
                        ...state.errors,
                        update: action.payload as string,
                    },
                }
            })
            .addCase(createUserAsync.fulfilled, (state, action) => {
                //1) Get created users
                const user = action.payload

                //2) Update state
                return {
                    isLoading: { ...state.isLoading, create: false },
                    errors: { ...state.errors, create: '' },
                    data: [...state.data, { ...user, isSelected: false }],
                }
            })
            .addCase(createUserAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, create: true },
                }
            })
            .addCase(createUserAsync.rejected, (state, action) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, create: false },
                    errors: {
                        ...state.errors,
                        create: action.payload as string,
                    },
                }
            })
            .addCase(
                searchUserAsync.fulfilled,
                (state, action: { payload: Array<IUser> }) => {
                    //1) Get searched users
                    const users = action.payload

                    //2) Transform
                    const updatedData = users.map((user) => ({
                        ...user,
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
            .addCase(searchUserAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: true },
                }
            })
            .addCase(
                deleteUserAsync.fulfilled,
                (state, action: { payload: Array<string> }) => {
                    //1) Get ids of deleted users
                    const deletedUsersId = action.payload

                    //2) Filter out deleted users
                    const updatedData = state.data.filter(
                        (user) => !deletedUsersId.includes(user._id)
                    )

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(deleteUserAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, delete: true },
                }
            }),
})

/**
 ** ======================================================
 ** Export
 ** ======================================================
 */
//extract actions & reducer from slice
const { actions, reducer } = sliceUser

//export actions
export const { editSelectedStatus } = actions

//export reducer
export default reducer