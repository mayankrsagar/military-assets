'use client';

import { useSelector } from 'react-redux';

import Navbar from '@/components/Navbar';
import { useAuthHydration } from '@/hooks/useAuthHydration';

export default function NavbarWrapper() {
  useAuthHydration();

  const token = useSelector((state) => state.auth.token);
  return token ? <Navbar /> : null;
}
