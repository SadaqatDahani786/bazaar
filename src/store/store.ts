import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

//Reducers
import mediaReducer from './mediaReducer'
import locationReducer from './locationReducer'
import userReducer from './userReducer'
import authReducer from './authReducer'
import categoryReducer from './categoryReducer'
import reviewReducer from './reviewReducer'
import productReducer from './productReducer'
import orderReducer from './orderReducer'

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
        auth: authReducer,
        category: categoryReducer,
        review: reviewReducer,
        product: productReducer,
        order: orderReducer,
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
