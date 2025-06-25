'use client'

import { useState } from 'react';

import { useSelector } from 'react-redux';
import useSWR from 'swr';

import fetcher from '@/services/fetcher';

export default function Dashboard() {
  // 1. State for date picker
  const [date, setDate] = useState(new Date())
  const formattedDate = date.toISOString().slice(0, 10)

  // 2. Pull baseId from Redux
  const baseId = useSelector(state => state.auth.baseId)

  // 3. Fetch dashboard data
  const { data, error } = useSWR(
    `/api/dashboard?date=${formattedDate}&baseId=${baseId}`,
    fetcher
  )

  if (error) return <div>Error loading dashboard</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      <label className="block mb-2">
        <span className="text-gray-700">Select Date:</span>
        <input
          type="date"
          className="ml-2 p-1 border rounded"
          value={formattedDate}
          onChange={e => setDate(new Date(e.target.value))}
        />
      </label>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-white shadow rounded">Opening: {data.opening}</div>
        <div className="p-4 bg-white shadow rounded">Purchased: {data.purchased}</div>
        <div className="p-4 bg-white shadow rounded">Net: {data.net}</div>
      </div>
    </div>
  )
}
