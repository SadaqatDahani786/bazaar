import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

//Reducers
import mediaReducer from './mediaReducer'
import locationReducer from './locationReducer'
import userReducer from './userReducer'

/**
 ** ======================================================
 ** Redux store
 ** ======================================================
 */
const store = configureStore({
    reducer: combineReducers({
        media: mediaReducer,
        location: locationReducer,
        user: userReducer,
    }),
})

/**
 ** ======================================================
 ** Expose custom hooks with correct types
 ** ======================================================
 */
export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<
    ReturnType<typeof store.getState>
> = useSelector

/**
 ** ======================================================
 ** Export [store]
 ** ======================================================
 */
export default store
