import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="text-5xl">🎉</div>
        <h1 className="text-3xl font-bold text-primary">You&apos;re booked!</h1>
        <p className="text-muted-foreground">
          Your spot is confirmed. A confirmation email is on its way — check your inbox
          (and your spam folder if needed).
        </p>
        <p className="text-sm text-muted-foreground">
          Remember: cancellations must be made at least 48 hours before the session for a full refund.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/dashboard" className={buttonVariants()}>
            View my bookings
          </Link>
          <Link href="/sessions" className={cn(buttonVariants({ variant: 'outline' }))}>
            Browse more sessions
          </Link>
        </div>
      </div>
    </div>
  )
}
