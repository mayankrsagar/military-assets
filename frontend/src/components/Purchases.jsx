'use client'
import { useState } from 'react';

import useSWR, { mutate } from 'swr';

import fetcher from '@/services/fetcher';

export default function Purchases() {
  const [baseId, setBaseId] = useState('');
  const [equipmentTypeId, setEquipmentTypeId] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Fetch data
  const { data: purchases } = useSWR('/api/purchases', fetcher);
  const { data: bases } = useSWR('/api/bases', fetcher);
  const { data: equipmentTypes } = useSWR('/api/equipment-types', fetcher);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetcher('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseId, equipmentTypeId, quantity })
      });
      mutate('/api/purchases');
      setBaseId('');
      setEquipmentTypeId('');
      setQuantity(1);
    } catch (err) {
      console.error('Purchase failed', err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Purchases</h1>
      
      {/* New Purchase Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow rounded">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base</label>
            <select
              value={baseId}
              onChange={e => setBaseId(e.target.value)}
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
          
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Record Purchase
            </button>
          </div>
        </div>
      </form>

      {/* Purchases Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Base</th>
              <th className="p-3 text-left">Equipment</th>
              <th className="p-3 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {purchases?.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{p.baseTo?.name || p.baseTo}</td>
                <td className="p-3">{p.equipmentType?.name || p.equipmentType}</td>
                <td className="p-3">{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}