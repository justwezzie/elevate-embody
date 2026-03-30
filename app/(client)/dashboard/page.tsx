import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAppUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { BookingCard } from '@/components/bookings/BookingCard'
import type { BookingWithSession } from '@/types'

export default async function DashboardPage() {
  const currentUser = await getCurrentAppUser()
  if (!currentUser) redirect('/sign-in')

  const supabase = createServiceClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, sessions(*)')
    .eq('user_id', currentUser.appUser.id)
    .neq('status', 'pending')
    .order('created_at', { ascending: false })

  const now = new Date()
  const upcoming = (bookings ?? []).filter(
    (b: BookingWithSession) => b.status === 'confirmed' && new Date(b.sessions.datetime) >= now
  )
  const past = (bookings ?? []).filter(
    (b: BookingWithSession) =>
      b.status === 'cancelled' || new Date(b.sessions.datetime) < now
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">My Bookings</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No upcoming bookings.{' '}
            <Link href="/sessions" className="text-accent underline underline-offset-2">
              Browse sessions →
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((booking: BookingWithSession) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Past &amp; Cancelled</h2>
          <div className="space-y-4">
            {past.map((booking: BookingWithSession) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
