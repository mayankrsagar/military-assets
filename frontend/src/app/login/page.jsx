'use client'
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import axios from '@/services/api';
import { setToken } from '@/store/slices/authSlice';

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post('/auth/login', { username, password })
    dispatch(setToken(res.data.token))
    router.push('/dashboard')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded">
        <h2 className="text-xl mb-4">Login</h2>
        <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="mb-2 p-2 border" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="mb-4 p-2 border" />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">Sign In</button>
      </form>
    </div>
  )
}