import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { set, get, del } from 'idb-keyval'

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  return await get('user')
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true
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
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload || null
      state.isAuthenticated = !!action.payload
      state.loading = false
    })
  }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
