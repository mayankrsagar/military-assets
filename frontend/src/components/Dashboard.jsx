'use client'
import { useState } from 'react';

import { format } from 'date-fns';
import useSWR from 'swr';

import fetcher from '@/services/fetcher';

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [baseId, setBaseId] = useState('');
  const [equipmentTypeId, setEquipmentTypeId] = useState('');
  const [showNetDetail, setShowNetDetail] = useState(false);
  // Fetch bases and equipment types
  const { data: bases } = useSWR('/api/bases', fetcher);
  const { data: equipmentTypes } = useSWR('/api/equipment-types', fetcher);
  
  // Build query string
  // const query = `?date=${format(date, 'yyyy-MM-dd')}&baseId=${baseId}&equipmentTypeId=${equipmentTypeId}`;
  // const { data, error } = useSWR(`/api/dashboard${query}`, fetcher);
const { data, error } = useSWR(`/api/dashboard`, fetcher);
  if (error) { 
    console.log("inside dashboard");
  console.log(error);
  return <div>Error loading dashboard</div>;
  
  }
    if (!data) return <div>Loading...</div>;


  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={format(date, 'yyyy-MM-dd')}
            onChange={e => setDate(new Date(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Base</label>
          <select
            value={baseId}
            onChange={e => setBaseId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All Bases</option>
            {bases?.map(base => (
              <option key={base._id} value={base._id}>{base.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Equipment Type</label>
          <select
            value={equipmentTypeId}
            onChange={e => setEquipmentTypeId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All Equipment</option>
            {equipmentTypes?.map(et => (
              <option key={et._id} value={et._id}>{et.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-medium">Opening Balance</h3>
          <p className="text-2xl">{data.opening}</p>
        </div>
        
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-medium">Purchased</h3>
          <p className="text-2xl">{data.purchased}</p>
        </div>
        
        <div 
          className="bg-white p-4 shadow rounded cursor-pointer"
          onClick={() => setShowNetDetail(true)}
        >
          <h3 className="font-medium">Net Movement</h3>
          <p className="text-2xl">{data.net}</p>
        </div>
        
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-medium">Assigned</h3>
          <p className="text-2xl">{data.assigned}</p>
        </div>
        
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-medium">Closing Balance</h3>
          <p className="text-2xl">{data.closing}</p>
        </div>
      </div>

      {/* Net Movement Detail Modal */}
      {showNetDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Net Movement Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Purchases:</span>
                <span>{data.purchased}</span>
              </div>
              <div className="flex justify-between">
                <span>Transfers In:</span>
                <span>{data.transferIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Transfers Out:</span>
                <span>{data.transferOut}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Net Movement:</span>
                <span>{data.net}</span>
              </div>
            </div>
            <button
              onClick={() => setShowNetDetail(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}