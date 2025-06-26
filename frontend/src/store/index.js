import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';

let preloadedState = {};
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const baseId = localStorage.getItem('baseId');

  preloadedState = {
    auth: {
      token,
      role,
      baseId,
    },
  };
}

const store = configureStore({
  reducer: { auth: authReducer },
  preloadedState,
});

// ⬇️ Subscribe to store updates
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const { token, role, baseId } = store.getState().auth;
    localStorage.setItem('token', token || '');
    localStorage.setItem('role', role || '');
    localStorage.setItem('baseId', baseId || '');
  });
}


export default store;