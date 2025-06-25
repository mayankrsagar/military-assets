'use client'
import useSWR from 'swr';

import fetcher from '@/services/fetcher';

export default function Purchases() {
  const { data, error } = useSWR('/api/purchases', fetcher)
  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Purchases</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr><th className="p-2">Date</th><th className="p-2">Type</th><th className="p-2">Qty</th></tr>
        </thead>
        <tbody>
          {data.map(tx => (
            <tr key={tx._id} className="border-t">
              <td className="p-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
              <td className="p-2">{tx.equipmentType}</td>
              <td className="p-2">{tx.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
