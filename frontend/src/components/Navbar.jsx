'use client'

import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function Navbar() {
  // Pull role from Redux auth slice
  const role = useSelector(state => state.auth.role)

  return (
    <nav className="bg-white p-4 shadow">
      <ul className="flex space-x-4">
        <li><Link href="/dashboard">Dashboard</Link></li>

        {['ADMIN', 'LOGISTICS'].includes(role) && (
          <li><Link href="/purchases">Purchases</Link></li>
        )}

        <li><Link href="/transfers">Transfers</Link></li>
        <li><Link href="/assignments">Assignments</Link></li>
      </ul>
    </nav>
  )
}
