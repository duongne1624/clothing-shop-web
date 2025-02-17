import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  totalQuantity: 0,
  totalPrice: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, selectedColor, selectedSize, slug } = action.payload
      if (!selectedColor || !selectedSize) {
        alert('Vui lòng chọn màu sắc và kích thước!')
        return
      }

      const existingIndex = state.cart.findIndex(
        (item) => item.id === product._id && item.color === selectedColor.name && item.size === selectedSize
      )

      if (existingIndex === -1) {
        state.cart.push({
          id: product._id,
          name: product.name,
          price: product.price,
          color: selectedColor.name,
          size: selectedSize,
          image: selectedColor.images[0],
          slug: slug,
          quantity
        })
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    editquantity: (state, action) => {
      const { productId, newquantity, color, size } = action.payload

      const existingIndex = state.cart.findIndex(
        (item) => item.id === productId && item.color === color && item.size === size
      )
      if (existingIndex !== -1) {
        state.cart[existingIndex].quantity = newquantity
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    removeFromCart: (state, action) => {
      const { productId, color, size } = action.payload

      state.cart = state.cart.filter(
        (item) => !(item.id === productId && item.color === color && item.size === size)
      )
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    clearCart: (state) => {
      state.cart = []
      localStorage.removeItem('cart')
    }
  }
})

export const { addToCart, editquantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
