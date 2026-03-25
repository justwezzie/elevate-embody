import { createServiceClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import type { BookingWithRelations } from '@/types'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
}

export default async function AdminBookingsPage() {
  const supabase = createServiceClient()
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, users(email, full_name, clerk_id), sessions(*)')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">All Bookings</h1>

      {!bookings || bookings.length === 0 ? (
        <p className="text-muted-foreground text-sm">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Client</th>
                <th className="pb-2 pr-4 font-medium">Session</th>
                <th className="pb-2 pr-4 font-medium">Date</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 font-medium">Booked</th>
              </tr>
            </thead>
            <tbody>
              {(bookings as BookingWithRelations[]).map((booking) => (
                <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{booking.users.full_name ?? '—'}</p>
                    <p className="text-muted-foreground text-xs">{booking.users.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p>{booking.sessions.title}</p>
                    <p className="text-muted-foreground text-xs capitalize">{booking.sessions.type}</p>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {new Date(booking.sessions.datetime).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusVariant[booking.status] ?? 'outline'}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(booking.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
