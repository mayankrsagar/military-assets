'use client'
import { useState } from 'react';

import useSWR, { mutate } from 'swr';

import fetcher from '@/services/fetcher';

export default function Transfers() {
  const [fromBaseId, setFromBaseId] = useState('');
  const [toBaseId, setToBaseId] = useState('');
  const [equipmentTypeId, setEquipmentTypeId] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Fetch data
  const { data: transfers } = useSWR('/api/transfers', fetcher);
  const { data: bases } = useSWR('/api/bases', fetcher);
  const { data: equipmentTypes } = useSWR('/api/equipment-types', fetcher);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetcher('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromBase: fromBaseId, toBase: toBaseId, equipmentTypeId, quantity })
      });
      mutate('/api/transfers');
      setFromBaseId('');
      setToBaseId('');
      setEquipmentTypeId('');
      setQuantity(1);
    } catch (err) {
      console.error('Transfer failed', err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Transfers</h1>
      
      {/* Transfer Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow rounded">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">From Base</label>
            <select
              value={fromBaseId}
              onChange={e => setFromBaseId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Base</option>
              {bases?.map(base => (
                <option key={base._id} value={base._id}>{base.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">To Base</label>
            <select
              value={toBaseId}
              onChange={e => setToBaseId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Base</option>
              {bases?.map(base => (
                <option key={base._id} value={base._id}>{base.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Equipment</label>
            <select
              value={equipmentTypeId}
              onChange={e => setEquipmentTypeId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Equipment</option>
              {equipmentTypes?.map(et => (
                <option key={et._id} value={et._id}>{et.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-4 flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Transfer Assets
            </button>
          </div>
        </div>
      </form>

      {/* Transfers Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">From Base</th>
              <th className="p-3 text-left">To Base</th>
              <th className="p-3 text-left">Equipment</th>
              <th className="p-3 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {transfers?.map(t => (
              <tr key={t._id} className="border-t">
                <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{t.baseFrom?.name || t.baseFrom}</td>
                <td className="p-3">{t.baseTo?.name || t.baseTo}</td>
                <td className="p-3">{t.equipmentType?.name || t.equipmentType}</td>
                <td className="p-3">{t.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}