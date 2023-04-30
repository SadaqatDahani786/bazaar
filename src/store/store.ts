import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import mediaReducer from './mediaReducer'

//Redux Store
const store = configureStore({
    reducer: combineReducers({
        media: mediaReducer,
    }),
})

//export redux hooks
export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<
    ReturnType<typeof store.getState>
> = useSelector

//exprot redux store
export default store
