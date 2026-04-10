import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { createServiceClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ booking_id?: string }>
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { booking_id } = await searchParams

  let sessionTitle: string | null = null
  let sessionDatetime: string | null = null
  let sessionAddress: string | null = null

  if (booking_id) {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('bookings')
      .select('*, sessions(title, datetime, address)')
      .eq('id', booking_id)
      .maybeSingle()

    if (data?.sessions) {
      sessionTitle = data.sessions.title ?? null
      sessionDatetime = data.sessions.datetime ?? null
      sessionAddress = data.sessions.address ?? null
    }
  }

  const dateStr = sessionDatetime
    ? new Date(sessionDatetime).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const timeStr = sessionDatetime
    ? new Date(sessionDatetime).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <CheckCircle2
          className="h-14 w-14 text-primary mx-auto"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primary">You&apos;re booked!</h1>
          {sessionTitle && (
            <p className="text-foreground font-medium text-lg">{sessionTitle}</p>
          )}
          {dateStr && timeStr && (
            <p className="text-muted-foreground text-sm">{dateStr} at {timeStr}</p>
          )}
          {sessionAddress && (
            <p className="text-muted-foreground text-sm">{sessionAddress}</p>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          A confirmation email is on its way. If you need to reschedule, contact us at least 48 hours before the session.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/dashboard" className={cn(buttonVariants(), 'h-[44px] min-h-[44px] max-h-[44px]')}>
            View my bookings
          </Link>
          <Link href="/sessions" className={cn(buttonVariants({ variant: 'outline' }), 'h-[44px] min-h-[44px] max-h-[44px]')}>
            Browse more sessions
          </Link>
        </div>
      </div>
    </div>
  )
}
