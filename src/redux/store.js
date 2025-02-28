import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import snackbarReducer from './snackbarSlice'
import authReducer from './authSlide'
import loadingReducer from './loadingSlide'

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    cart: cartReducer,
    snackbar: snackbarReducer,
    auth: authReducer
  }
})
