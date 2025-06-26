// src/components/Assignments.js
'use client'
import { useState } from 'react';

import useSWR, { mutate } from 'swr';

import fetcher from '@/services/fetcher';

export default function Assignments() {
  const [activeTab, setActiveTab] = useState('ASSIGN');
  const [personnelId, setPersonnelId] = useState('');
  const [equipmentTypeId, setEquipmentTypeId] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Fetch data
  const { data: assignments } = useSWR('/api/assignments', fetcher);
  const { data: personnel } = useSWR('/api/users?role=COMMANDER', fetcher);
  const { data: equipmentTypes } = useSWR('/api/equipment-types', fetcher);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await fetcher('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personnelId, equipmentTypeId, quantity })
      });
      mutate('/api/assignments');
      setPersonnelId('');
      setEquipmentTypeId('');
      setQuantity(1);
    } catch (err) {
      console.error('Assignment failed', err);
    }
  };

  const handleExpend = async (e) => {
    e.preventDefault();
    try {
      await fetcher('/api/assignments/expend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentTypeId, quantity })
      });
      mutate('/api/assignments');
      setEquipmentTypeId('');
      setQuantity(1);
    } catch (err) {
      console.error('Expenditure failed', err);
    }
  };

  const handleReturn = async (assignmentId) => {
    try {
      await fetcher(`/api/assignments/${assignmentId}/return`, {
        method: 'PATCH'
      });
      mutate('/api/assignments');
    } catch (err) {
      console.error('Return failed', err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Assignments & Expenditures</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'ASSIGN' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('ASSIGN')}
        >
          Assign Assets
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'EXPEND' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('EXPEND')}
        >
          Record Expenditure
        </button>
      </div>
      
      {/* Assignment Form */}
      {activeTab === 'ASSIGN' && (
        <form onSubmit={handleAssign} className="mb-6 p-4 bg-white shadow rounded">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Personnel</label>
              <select
                value={personnelId}
                onChange={e => setPersonnelId(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Personnel</option>
                {personnel?.map(p => (
                  <option key={p._id} value={p._id}>{p.username}</option>
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
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* Expenditure Form */}
      {activeTab === 'EXPEND' && (
        <form onSubmit={handleExpend} className="mb-6 p-4 bg-white shadow rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="w-full bg-red-600 text-white p-2 rounded"
              >
                Record Expenditure
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* Assignments Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Personnel</th>
              <th className="p-3 text-left">Equipment</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments?.map(a => (
              <tr key={a._id} className="border-t">
                <td className="p-3">{a.personnelId?.username || a.personnelId}</td>
                <td className="p-3">{a.equipmentType?.name || a.equipmentType}</td>
                <td className="p-3">{a.quantity}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    a.status === 'ASSIGNED' ? 'bg-green-100 text-green-800' : 
                    a.status === 'RETURNED' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-3">
                  {a.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleReturn(a._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}