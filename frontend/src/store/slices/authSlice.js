import { clearLocalStorageOnLogout } from '@/utils/auth';
import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  token: null,
  role: null,
  baseId: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      // Now receives an object with token, role, and baseId
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.baseId = action.payload.baseId;
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.baseId = null;
      clearLocalStorageOnLogout();
    }
  }
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;