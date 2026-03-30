'use client'

import { Title } from 'react-admin'
import { RevenueCard } from './widgets/RevenueCard'
import { AttendanceList } from './widgets/AttendanceList'

export function Dashboard() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <Title title="Dashboard" />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827' }}>
        Dashboard
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <RevenueCard period="week" label="Revenue This Week" />
        <RevenueCard period="month" label="Revenue This Month" />
      </div>
      <AttendanceList />
    </div>
  )
}
