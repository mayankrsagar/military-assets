'use client'
import { useState } from 'react';

import useSWR from 'swr';

import fetcher from '@/services/fetcher';

export default function Transfers() {
  const { data, error, mutate } = useSWR('/api/transfers', fetcher)
  const [fromBase, setFromBase] = useState('')
  const { data: equipmentTypes } = useSWR('/api/equipment-types', fetcher);
  const [toBase, setToBase] = useState('')
  const [equipmentType, setEquipmentType] = useState('')
  const [quantity, setQuantity] = useState(0)

  const handleSubmit = async e => {
    e.preventDefault()
    await fetch('/api/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromBase, toBase, equipmentType, quantity })
    })
    setFromBase(''); setToBase(''); setEquipmentType(''); setQuantity(0)
    mutate()
  }

  if (error) return <div>Error loading transfers</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Transfers</h1>
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow rounded">
        <div className="flex space-x-2 mb-2">
          <input placeholder="From Base" value={fromBase} onChange={e=>setFromBase(e.target.value)} className="border p-2 flex-1" required />
          <input placeholder="To Base"   value={toBase}   onChange={e=>setToBase(e.target.value)}   className="border p-2 flex-1" required />
        </div>
        <div className="flex space-x-2 mb-2">
          <input placeholder="Equipment Type" value={equipmentType} onChange={e=>setEquipmentType(e.target.value)} className="border p-2 flex-1" required />
          <input type="number" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(+e.target.value)} className="border p-2 w-24" min="1" required />
        </div>
        <select value={equipmentTypeId} onChange={e => setEquipmentTypeId(e.target.value)}>
  {equipmentTypes?.map(et => (
    <option key={et._id} value={et._id}>{et.name}</option>
  ))}
</select>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Transfer</button>
      </form>
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr><th className="p-2">Date</th><th className="p-2">From</th><th className="p-2">To</th><th className="p-2">Type</th><th className="p-2">Qty</th></tr>
        </thead>
        <tbody>
          {data.map(tx => (
            <tr key={tx._id} className="border-t">
              <td className="p-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
              <td className="p-2">{tx.fromBase}</td>
              <td className="p-2">{tx.toBase}</td>
              <td className="p-2">{tx.equipmentType}</td>
              <td className="p-2">{tx.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
