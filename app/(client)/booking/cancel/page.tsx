import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ booking_id?: string }>
}

export default async function BookingCancelPage({ searchParams }: Props) {
  const { booking_id } = await searchParams

  let sessionId: string | null = null

  if (booking_id) {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('bookings')
      .select('session_id')
      .eq('id', booking_id)
      .maybeSingle()

    sessionId = data?.session_id ?? null
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="text-5xl" aria-hidden="true">↩️</div>
        <h1 className="text-3xl font-bold text-primary">Payment cancelled</h1>
        <p className="text-muted-foreground">
          No charge was made. Your spot is not confirmed until payment is complete.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          {sessionId ? (
            <Link
              href={`/sessions/${sessionId}`}
              className={cn(buttonVariants(), 'h-[44px] min-h-[44px] max-h-[44px]')}
            >
              Try again
            </Link>
          ) : null}
          <Link
            href="/sessions"
            className={cn(buttonVariants({ variant: sessionId ? 'outline' : 'default' }), 'h-[44px] min-h-[44px] max-h-[44px]')}
          >
            Back to sessions
          </Link>
        </div>
      </div>
    </div>
  )
}
