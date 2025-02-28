import { createSlice } from '@reduxjs/toolkit'
import { set, get, del } from 'idb-keyval'

const loadUserFromDB = async () => await get('user')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: await loadUserFromDB() || null,
    isAuthenticated: !!(await loadUserFromDB())
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      set('user', action.payload)
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      del('user')
    }
  }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
