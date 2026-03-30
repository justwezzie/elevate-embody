'use client'

import { useEffect, useState } from 'react'
import { Title } from 'react-admin'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { getSupabaseClient } from '../dataProvider'

interface RevenueCardProps {
  period: 'week' | 'month'
  label: string
}

export function RevenueCard({ period, label }: RevenueCardProps) {
  const [revenue, setRevenue] = useState<number | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const supabase = await getSupabaseClient()
        const fn = period === 'week' ? 'get_weekly_revenue' : 'get_monthly_revenue'
        const { data, error } = await supabase.rpc(fn)
        if (error) throw error
        setRevenue(data as number)
      } catch {
        setError(true)
      }
    }
    load()
  }, [period])

  return (
    <Card>
      <Title title="" />
      <CardHeader title={label} />
      <CardContent>
        <span style={{ fontSize: '2.25rem', fontWeight: 700, color: '#166534' }}>
          {error ? '—' : revenue === null ? '...' : `£${revenue.toFixed(2)}`}
        </span>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
          confirmed bookings
        </p>
      </CardContent>
    </Card>
  )
}
