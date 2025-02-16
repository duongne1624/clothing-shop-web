import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, selectedColor, selectedSize } = action.payload
      if (!selectedColor || !selectedSize) {
        alert('Vui lòng chọn màu sắc và kích thước!')
        return
      }

      const existingIndex = state.cart.findIndex(
        (item) => item.id === product._id && item.color === selectedColor.name && item.size === selectedSize
      )

      if (existingIndex !== -1) {
        state.cart[existingIndex].quantity += quantity
      } else {
        state.cart.push({
          id: product._id,
          name: product.name,
          price: product.price,
          color: selectedColor.name,
          size: selectedSize,
          image: selectedColor.images[0],
          quantity
        })
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    clearCart: (state) => {
      state.cart = []
      localStorage.removeItem('cart')
    }
  }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
