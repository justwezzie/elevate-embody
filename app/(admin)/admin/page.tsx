import { createServiceClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function AdminOverviewPage() {
  const supabase = createServiceClient()

  const [
    { count: totalBookings },
    { count: confirmedBookings },
    { count: upcomingSessions },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed'),
    supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
      .gte('datetime', new Date().toISOString()),
  ])

  const stats = [
    { label: 'Total bookings', value: totalBookings ?? 0 },
    { label: 'Confirmed bookings', value: confirmedBookings ?? 0 },
    { label: 'Upcoming sessions', value: upcomingSessions ?? 0 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Overview</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-1">
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
