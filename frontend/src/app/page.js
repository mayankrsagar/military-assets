'use client'
import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Home() {
  const token = useSelector(state => state.auth.token)
  const router = useRouter()

  useEffect(() => {
    if (token) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [token,router])
  
  // return router.push("/dashboard");
}
