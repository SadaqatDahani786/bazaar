import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, GenericFormData } from 'axios'

//Apis
import {
    deleteMedia,
    getMedia,
    searchMedia,
    updateMedia,
    uploadMedia,
} from '../api/media'

//Redux
import { IUserDatabase } from './userReducer'

/*s
 ** **
 ** ** ** INTERFACES
 ** **
 */
/** ======================================================
 ** Interface [IMediaSuper]
 ** ======================================================
 */
interface IMediaSuper {
    _id: string
    filename: string
    url: string
    size: string
    uploaded_by: IUserDatabase
    created_at: string
    dimensions: {
        width: number
        height: number
    }
}

/** ======================================================
 ** Interface [IMedia]
 ** ======================================================
 */
export interface IMedia extends IMediaSuper {
    title: {
        value: string
        edit: boolean
    }
    description: {
        value: string
        edit: boolean
    }
    caption: {
        value: string
        edit: boolean
    }
    isSelected: boolean
}

/** ======================================================
 ** Interface [IMediaDatabase]
 ** ======================================================
 */
export interface IMediaDatabase extends IMediaSuper {
    title: string
    description: string
    caption: string
}

/*
 ** **
 ** ** ** THUNKS MIDDLEWARES
 ** **
 */
/** ======================================================
 ** Thunk [getMediaAsync]
 ** ======================================================
 */
export const getMediaAsync = createAsyncThunk(
    'get/media',
    async (_, { rejectWithValue }) => {
        try {
            //1) Send http request
            const response = await axios(getMedia())

            //2) Return response
            return response.data.data
        } catch (err) {
            if (err instanceof AxiosError)
                return rejectWithValue(err.response?.data.message)
        }
    }
)

/** ======================================================
 ** Thunk [updateMediaAsync]
 ** ======================================================
 */
export const updateMediaAsync = createAsyncThunk(
    'update/media',
    async ({
        id,
        data,
        cb,
    }: {
        id: string
        data: {
            title: string
            description: string
            caption: string
        }
        cb: () => void
    }) => {
        //1) Send http request
        const response = await axios(updateMedia({ id, data }))

        //2) Callback
        cb()

        //3) Return response
        return response.data.data
    }
)

/** ======================================================
 ** Thunk [deleteMediaAsync]
 ** ======================================================
 */
export const deleteMediaAsync = createAsyncThunk(
    'delete/media',
    async (ids: Array<string>) => {
        //1) Create requests from ids to delete
        const deleteRequests = ids.map((id) => axios(deleteMedia(id)))

        //2) Consume promise to delete
        return Promise.all(deleteRequests).then(() => ids)
    }
)

/** ======================================================
 ** Thunk [searchMediaAsync]
 ** ======================================================
 */
export const searchMediaAsync = createAsyncThunk(
    'search/media',
    async (query: string) => {
        //1) Send http request
        const response = await axios(searchMedia(query))

        //2) Return response
        return response.data.data
    }
)

/** ======================================================
 ** Thunk [uploadMediaAsync]
 ** ======================================================
 */
export const uploadMediaAsync = createAsyncThunk(
    'upload/media',
    async ({
        data,
        cb,
    }: {
        data: GenericFormData
        cb: (uploadedFiles: Array<IMediaDatabase>) => void
    }) => {
        //1) Send http request
        const response = await axios(uploadMedia(data))

        //2) Callback
        cb(response.data.data)

        //3) Return response
        return response.data.data
    }
)

/*
 ** **
 ** ** ** REDUCER SLICE
 ** **
 */
//Default state
const defaultState: {
    isLoading: {
        fetch: boolean
        delete: boolean
        update: boolean
        create: boolean
    }
    errors: {
        fetch: string
        delete: string
        update: string
        create: string
    }
    data: Array<IMedia>
} = {
    isLoading: {
        fetch: false,
        delete: false,
        update: false,
        create: false,
    },
    errors: {
        fetch: '',
        delete: '',
        update: '',
        create: '',
    },
    data: [],
}

//Slice media reducer
const slice = createSlice({
    name: 'media',
    initialState: defaultState,
    reducers: {
        editTitleStatus: (
            state,
            action: { type: string; payload: { id: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id

            //2) Make changes
            const updatedData = state.data.map((media) => {
                if (media._id === id) {
                    return {
                        ...media,
                        title: { ...media.title, edit: !media.title.edit },
                    }
                }

                return media
            })

            //3) Update state
            return { ...state, data: updatedData }
        },
        editDescriptionStatus: (
            state,
            action: { type: string; payload: { id: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id

            //2) Make changes
            const updatedData = state.data.map((media) => {
                if (media._id === id) {
                    return {
                        ...media,
                        description: {
                            ...media.description,
                            edit: !media.description.edit,
                        },
                    }
                }

                return media
            })

            //3) Update state
            return { ...state, data: updatedData }
        },
        editCaptionStatus: (
            state,
            action: { type: string; payload: { id: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id

            //2) Make changes
            const updatedData = state.data.map((media) => {
                if (media._id === id) {
                    return {
                        ...media,
                        caption: {
                            ...media.caption,
                            edit: !media.caption.edit,
                        },
                    }
                }

                return media
            })

            //3) Update state
            return { ...state, data: updatedData }
        },
        editSelectedStatus: (
            state,
            action: {
                type: string
                payload: {
                    id: string
                    bulkSelectActive: boolean
                    edit?: boolean | undefined
                }
            }
        ) => {
            //Get data
            const id = action.payload.id
            const bulkSelectActive = action.payload.bulkSelectActive
            const edit = action.payload.edit

            //Make changes
            const updatedData = state.data.map((media) => {
                if (media._id === id) {
                    return {
                        ...media,
                        isSelected: bulkSelectActive
                            ? edit === undefined
                                ? !media.isSelected
                                : edit
                            : true,
                    }
                }
                return {
                    ...media,
                    isSelected: bulkSelectActive ? media.isSelected : false,
                }
            })

            //Update state
            return { ...state, data: updatedData }
        },
        clearSelection: (state) => {
            return {
                ...state,
                data: state.data.map((media) => ({
                    ...media,
                    isSelected: false,
                })),
            }
        },
        deleteSelection: (state) => {
            return {
                ...state,
                data: state.data.filter((media) => !media.isSelected),
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                getMediaAsync.fulfilled,
                (state, action: { payload: Array<IMediaDatabase> }) => {
                    //1) Transform response
                    const items = action.payload.map((media) => ({
                        ...media,
                        uploaded_at: media.created_at,
                        title: {
                            value: media.title,
                            edit: false,
                        },
                        description: {
                            value: media.description,
                            edit: false,
                        },
                        caption: {
                            value: media.caption,
                            edit: false,
                        },
                        isSelected: false,
                    }))

                    //2) Save it
                    return {
                        isLoading: { ...state.isLoading, fetch: false },
                        errors: { ...state.errors, fetch: '' },
                        data: items,
                    }
                }
            )
            .addCase(getMediaAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: true },
                }
            })
            .addCase(getMediaAsync.rejected, (state, action) => {
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
                updateMediaAsync.fulfilled,
                (state, action: { payload: IMediaDatabase }) => {
                    //1) Find index by id
                    const id = action.payload._id

                    //2) Make changes
                    const updatedData = state.data.map((media) => {
                        if (media._id === id) {
                            return {
                                ...media,
                                title: {
                                    value: action.payload.title,
                                    edit: false,
                                },
                                description: {
                                    value: action.payload.description,
                                    edit: false,
                                },
                                caption: {
                                    value: action.payload.caption,
                                    edit: false,
                                },
                            }
                        }

                        return media
                    })

                    //3) Update state
                    return {
                        isLoading: { ...state.isLoading, update: false },
                        errors: { ...state.errors, update: '' },
                        data: updatedData,
                    }
                }
            )
            .addCase(updateMediaAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, update: true },
                }
            })
            .addCase(
                deleteMediaAsync.fulfilled,
                (state, action: { payload: Array<string> }) => {
                    //1) Get ids of deleted files
                    const ids = action.payload

                    //2) Filter out deleted media files
                    return {
                        isLoading: { ...state.isLoading, delete: false },
                        errors: { ...state.errors, delete: '' },
                        data: state.data.filter(
                            (media) => !ids.includes(media._id)
                        ),
                    }
                }
            )
            .addCase(deleteMediaAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, delete: true },
                }
            })
            .addCase(
                searchMediaAsync.fulfilled,
                (state, action: { payload: Array<IMediaDatabase> }) => {
                    //1) Transform response
                    const items = action.payload.map((media) => ({
                        ...media,
                        uploaded_at: media.created_at,
                        title: {
                            value: media.title,
                            edit: false,
                        },
                        description: {
                            value: media.description,
                            edit: false,
                        },
                        caption: {
                            value: media.caption,
                            edit: false,
                        },
                        isSelected: false,
                    }))

                    //2) Save it
                    return {
                        isLoading: { ...state.isLoading, fetch: false },
                        errors: { ...state.errors, fetch: '' },
                        data: items,
                    }
                }
            )
            .addCase(searchMediaAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, fetch: true },
                }
            })
            .addCase(
                uploadMediaAsync.fulfilled,
                (state, action: { payload: Array<IMediaDatabase> }) => {
                    //1) Transform response
                    const items = action.payload.map((media) => ({
                        ...media,
                        uploaded_at: media.created_at,
                        title: {
                            value: media.title,
                            edit: false,
                        },
                        description: {
                            value: media.description,
                            edit: false,
                        },
                        caption: {
                            value: media.caption,
                            edit: false,
                        },
                        isSelected: false,
                    }))

                    //2) Save it
                    return {
                        isLoading: { ...state.isLoading, create: false },
                        errors: { ...state.errors, create: '' },
                        data: items,
                    }
                }
            )
            .addCase(uploadMediaAsync.pending, (state) => {
                return {
                    ...state,
                    isLoading: { ...state.isLoading, create: true },
                }
            })
    },
})

//actions and reducers
const { actions, reducer } = slice

/*
 ** **
 ** ** ** EXPORTS
 ** **
 */
//Export actions
export const {
    editTitleStatus,
    editDescriptionStatus,
    editCaptionStatus,
    editSelectedStatus,
    clearSelection,
    deleteSelection,
} = actions

//Export reducer
export default reducer
