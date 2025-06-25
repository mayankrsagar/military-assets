'use client'
import { useSelector } from 'react-redux';

import Navbar from '@/components/Navbar';

export default function NavbarWrapper() {
  const token = useSelector((state) => state.auth.token)
  return token ? <Navbar /> : null
}
