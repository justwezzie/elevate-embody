'use client'

import { useEffect, useState } from 'react'
import { Title } from 'react-admin'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useMediaQuery, useTheme } from '@mui/material'
import { getSupabaseClient } from '../dataProvider'

interface Attendee {
  id: string
  full_name: string | null
  email: string
}

interface SessionWithAttendees {
  id: string
  title: string
  type: string
  datetime: string
  attendees: Attendee[]
}

export function AttendanceList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sessions, setSessions] = useState<SessionWithAttendees[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = await getSupabaseClient()
        const { data } = await supabase
          .from('sessions')
          .select(`
            id, title, type, datetime,
            bookings(
              id, status,
              users(id, full_name, email)
            )
          `)
          .eq('is_published', true)
          .gte('datetime', new Date().toISOString())
          .order('datetime', { ascending: true })
          .limit(8)

        const mapped: SessionWithAttendees[] = (data ?? []).map((s: Record<string, unknown>) => {
          const bookings = (s.bookings as Array<{ status: string; users: Attendee | null }>) ?? []
          return {
            id: s.id as string,
            title: s.title as string,
            type: s.type as string,
            datetime: s.datetime as string,
            attendees: bookings
              .filter((b) => b.status === 'confirmed')
              .map((b) => b.users!)
              .filter(Boolean),
          }
        })
        setSessions(mapped)
      } catch {
        setSessions([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function formatDate(dt: string) {
    return new Date(dt).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <Title title="" />
      <CardHeader title="Upcoming Attendance" />
      <CardContent sx={{ padding: isMobile ? 2 : 3 }}>
        {loading ? (
          <p style={{ color: '#6b7280' }}>Loading...</p>
        ) : sessions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No upcoming sessions.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sessions.map((session, index) => (
              <div
                key={session.id}
                style={{
                  paddingBottom: '1rem',
                  borderBottom: index === sessions.length - 1 ? 'none' : '1px solid #d7e1db',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <strong style={{ fontSize: '0.95rem' }}>{session.title}</strong>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '4px',
                      background: session.type === 'boxing' ? '#ea580c' : '#166534',
                      color: '#fff',
                      textTransform: 'capitalize',
                    }}
                  >
                    {session.type}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#6b7280',
                      marginLeft: isMobile ? 0 : 'auto',
                    }}
                  >
                    {formatDate(session.datetime)}
                  </span>
                </div>
                {session.attendees.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', paddingLeft: isMobile ? 0 : '0.5rem' }}>
                    No confirmed bookings yet
                  </p>
                ) : (
                  <ul
                    style={{
                      paddingLeft: isMobile ? '0.75rem' : '1rem',
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    {session.attendees.map((a) => (
                      <li key={a.id} style={{ fontSize: '0.85rem', color: '#374151' }}>
                        {a.full_name ?? '—'}{' '}
                        <span style={{ color: '#9ca3af' }}>({a.email})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
