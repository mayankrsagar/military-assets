import jwtDecode from 'jwt-decode';

// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  role: null,
  baseId: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      const token = action.payload
      state.token = token

      if (token) {
        try {
          const decoded = jwtDecode(token)
          // assuming your JWT payload has { role, base }
          state.role = decoded.role || null
          state.baseId = decoded.base || null
        } catch (err) {
          console.error('Invalid JWT:', err)
          state.role = null
          state.baseId = null
        }
      } else {
        state.role = null
        state.baseId = null
      }
    },
    clearToken(state) {
      state.token = null
      state.role = null
      state.baseId = null
    }
  }
})

export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer
