import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CancelButton } from './CancelButton'
import type { BookingWithSession } from '@/types'

interface Props {
  booking: BookingWithSession
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  confirmed: { label: 'Confirmed', variant: 'default' },
  pending: { label: 'Pending', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

export function BookingCard({ booking }: Props) {
  const { sessions: session } = booking
  const date = new Date(session.datetime)
  const isPast = date < new Date()
  const dateStr = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const price = (session.price_cents / 100).toFixed(2)
  const status = statusConfig[booking.status] ?? { label: booking.status, variant: 'outline' }

  return (
    <Card className={isPast ? 'opacity-60' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">{session.title}</h3>
            <p className="text-sm text-muted-foreground capitalize">{session.type}</p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p>{dateStr} at {timeStr}</p>
        <p>{session.duration_mins} minutes &middot; {session.instructor_name}</p>
        <p className="font-medium text-foreground">£{price}</p>
      </CardContent>
      {booking.status === 'confirmed' && !isPast && (
        <CardFooter className="border-t pt-3">
          <CancelButton bookingId={booking.id} sessionDatetime={session.datetime} />
        </CardFooter>
      )}
    </Card>
  )
}
