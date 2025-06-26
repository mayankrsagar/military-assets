'use client'
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import api from '@/services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm: '', role: 'COMMANDER', base: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      return setError("Passwords don't match")
    }
    try {
      await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        base: form.role === 'COMMANDER' ? form.base : undefined
      })
      router.push('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-16 bg-white shadow rounded">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="username" placeholder="Username" required
          value={form.username} onChange={handleChange}
          className="w-full border p-2" />

        <input name="email" type="email" placeholder="Email" required
          value={form.email} onChange={handleChange}
          className="w-full border p-2" />

        <select name="role" value={form.role} onChange={handleChange}
          className="w-full border p-2">
          <option value="ADMIN">Admin</option>
          <option value="LOGISTICS">Logistics</option>
          <option value="COMMANDER">Commander</option>
        </select>

        {form.role === 'COMMANDER' && (
          <input name="base" placeholder="Base ID" required
            value={form.base} onChange={handleChange}
            className="w-full border p-2" />
        )}

        <input name="password" type="password" placeholder="Password" required
          value={form.password} onChange={handleChange}
          className="w-full border p-2" />

        <input name="confirm" type="password" placeholder="Confirm Password" required
          value={form.confirm} onChange={handleChange}
          className="w-full border p-2" />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  )
}
