import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import snackbarReducer from './snackbarSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    snackbar: snackbarReducer
  }
})
