import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

//Apis
import { deleteMedia, getMedia, searchMedia, updateMedia } from '../api/media'

/*
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
    uploaded_by: {
        name: string
        email: string
    }
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
export const getMediaAsync = createAsyncThunk('get/media', async () => {
    //1) Send http request
    const response = await axios(getMedia())

    //2) Return response
    return response.data.data
})

/** ======================================================
 ** Thunk [updateMediaAsync]
 ** ======================================================
 */
export const updateMediaAsync = createAsyncThunk(
    'update/media',
    async ({
        id,
        data,
    }: {
        id: string
        data: {
            title: string
            description: string
            caption: string
        }
    }) => {
        //1) Send http request
        const response = await axios(updateMedia({ id, data }))

        //2) Return response
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
        Promise.all(deleteRequests)
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

/*
 ** **
 ** ** ** REDUCER SLICE
 ** **
 */
//Default state
const defaultState: Array<IMedia> = []

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
            const updatedState = state.map((media) => {
                if (media._id === id) {
                    return {
                        ...media,
                        title: { ...media.title, edit: !media.title.edit },
                    }
                }

                return media
            })

            //3) Update state
            return updatedState
        },
        updateTitle: (
            state,
            action: { type: string; payload: { id: string; value: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id
            const value = action.payload.value

            //2) Make changes
            const updatedState = state.map((media) => {
                if (media._id === id)
                    return { ...media, title: { ...media.title, value } }
                return media
            })

            //3) Update State
            return updatedState
        },
        editDescriptionStatus: (
            state,
            action: { type: string; payload: { id: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id

            //2) Make changes
            const updatedState = state.map((media) => {
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
            return updatedState
        },
        updateDescription: (
            state,
            action: { type: string; payload: { id: string; value: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id
            const value = action.payload.value

            console.log(id, value)

            //2) Make changes
            const updatedState = state.map((media) => {
                if (media._id === id)
                    return {
                        ...media,
                        description: { ...media.description, value },
                    }
                return media
            })

            //3) Update State
            return updatedState
        },
        editCaptionStatus: (
            state,
            action: { type: string; payload: { id: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id

            //2) Make changes
            const updatedState = state.map((media) => {
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
            return updatedState
        },
        updateCaption: (
            state,
            action: { type: string; payload: { id: string; value: string } }
        ) => {
            //1) Get id from payload
            const id = action.payload.id
            const value = action.payload.value

            //2) Make changes
            const updatedState = state.map((media) => {
                if (media._id === id)
                    return { ...media, caption: { ...media.caption, value } }
                return media
            })

            //3) Update State
            return updatedState
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
            const id = action.payload.id
            const bulkSelectActive = action.payload.bulkSelectActive
            const edit = action.payload.edit

            const updatedState = state.map((media) => {
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

            return updatedState
        },
        clearSelection: (state) => {
            return state.map((media) => ({ ...media, isSelected: false }))
        },
        deleteSelection: (state) => {
            return state.filter((media) => !media.isSelected)
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
                    return items
                }
            )
            .addCase(
                updateMediaAsync.fulfilled,
                (state, action: { payload: IMediaDatabase }) => {
                    //1) Find index by id
                    const ind = state.findIndex(
                        (media) => media._id === action.payload._id
                    )

                    //2) Set new values
                    state[ind].title.value = action.payload.title
                    state[ind].description.value = action.payload.description
                    state[ind].caption.value = action.payload.caption

                    //3) Make editable false
                    state[ind].title.edit = false
                    state[ind].description.edit = false
                    state[ind].caption.edit = false
                }
            )
            .addCase(deleteMediaAsync.fulfilled, (state) => {
                // Filter out deleted media files
                return state.filter((media) => !media.isSelected)
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
                    return items
                }
            )
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
    updateTitle,
    editDescriptionStatus,
    updateDescription,
    editCaptionStatus,
    updateCaption,
    editSelectedStatus,
    clearSelection,
    deleteSelection,
} = actions

//Export reducer
export default reducer
