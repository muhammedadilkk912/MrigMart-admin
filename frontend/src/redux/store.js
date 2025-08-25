import loadingReducer from './loadeSlic'
import authReducer from './authSlice'
import { configureStore } from '@reduxjs/toolkit'

  export const store=configureStore({
    reducer:{
        loading:loadingReducer,
        auth:authReducer
    },
})