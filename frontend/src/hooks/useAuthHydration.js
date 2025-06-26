import { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { setToken } from '@/store/slices/authSlice';

export const useAuthHydration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const baseId = localStorage.getItem('baseId');

    if (token || role || baseId) {
      dispatch(setToken({ token, role, baseId }));
    }
  }, [dispatch]);
};
