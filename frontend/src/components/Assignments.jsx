// src/components/Assignments.js
'use client'
import { useState } from 'react';

import useSWR from 'swr';

import fetcher from '@/services/fetcher';

export default function Assignments() {
  const [activeTab, setActiveTab] = useState('ASSIGN'); // 'ASSIGN' or 'EXPEND'
  const [personnel, setPersonnel] = useState('')
  const [equipmentTypeId, setEquipmentTypeId] = useState('')
  const [quantity, setQuantity] = useState(0)
  
  const { data: assignments, error, mutate } = useSWR('/api/assignments', fetcher)
  const { data: equipmentTypes } = useSWR('/api/equipment-types', fetcher) // New endpoint needed

  const handleAssignment = async e => {
    e.preventDefault()
    await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personnelId: personnel, equipmentTypeId, quantity })
    })
    setPersonnel(''); setEquipmentTypeId(''); setQuantity(0)
    mutate()
  }


  


  const handleExpenditure = async e => {
    e.preventDefault()
    await fetch('/api/assignments/expend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipmentTypeId, quantity })
    })
    setEquipmentTypeId(''); setQuantity(0)
    mutate()
    alert('Expenditure recorded successfully!')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Assignments & Expenditures</h1>
      
      {/* Tab Selection */}
      <div className="flex mb-6 border-b">
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
        <form onSubmit={handleAssignment} className="mb-6 p-4 bg-white shadow rounded">
          <div className="flex space-x-2 mb-2">
            <input 
              placeholder="Personnel ID" 
              value={personnel} 
              onChange={e => setPersonnel(e.target.value)} 
              className="border p-2 flex-1" 
              required 
            />
            <select
              value={equipmentTypeId}
              onChange={e => setEquipmentTypeId(e.target.value)}
              className="border p-2 flex-1"
              required
            >
              <option value="">Select Equipment</option>
              {equipmentTypes?.map(et => (
                <option key={et._id} value={et._id}>{et.name}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mb-2">
            <input 
              type="number" 
              placeholder="Quantity" 
              value={quantity} 
              onChange={e => setQuantity(+e.target.value)} 
              className="border p-2 w-24" 
              min="1" 
              required 
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Assign
          </button>
        </form>
      )}

      {/* Expenditure Form */}
      {activeTab === 'EXPEND' && (
        <form onSubmit={handleExpenditure} className="mb-6 p-4 bg-white shadow rounded">
          <div className="flex space-x-2 mb-2">
            <select
              value={equipmentTypeId}
              onChange={e => setEquipmentTypeId(e.target.value)}
              className="border p-2 flex-1"
              required
            >
              <option value="">Select Equipment</option>
              {equipmentTypes?.map(et => (
                <option key={et._id} value={et._id}>{et.name}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Quantity" 
              value={quantity} 
              onChange={e => setQuantity(+e.target.value)} 
              className="border p-2 w-24" 
              min="1" 
              required 
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">
            Record Expenditure
          </button>
        </form>
      )}

      {/* Assignments Table */}
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Personnel</th>
            <th className="p-2">Equipment</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {assignments?.map(asg => (
            <tr key={asg._id} className="border-t">
              <td className="p-2">{new Date(asg.createdAt).toLocaleDateString()}</td>
              <td className="p-2">{asg.personnelId?.name || asg.personnelId}</td>
              <td className="p-2">{asg.equipmentType?.name || asg.equipmentType}</td>
              <td className="p-2">{asg.quantity}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  asg.status === 'ASSIGNED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {asg.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}