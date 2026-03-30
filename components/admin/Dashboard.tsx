'use client'

import { useMediaQuery, useTheme } from '@mui/material'
import { Title } from 'react-admin'
import { RevenueCard } from './widgets/RevenueCard'
import { AttendanceList } from './widgets/AttendanceList'

export function Dashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <div style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
      <Title title="Dashboard" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: isMobile ? '1.25rem' : '2rem',
        }}
      >
        <RevenueCard period="week" label="Revenue This Week" />
        <RevenueCard period="month" label="Revenue This Month" />
      </div>
      <AttendanceList />
    </div>
  )
}
