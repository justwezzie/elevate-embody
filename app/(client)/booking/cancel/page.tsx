import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'

export default function BookingCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="text-5xl">↩️</div>
        <h1 className="text-3xl font-bold text-primary">Payment cancelled</h1>
        <p className="text-muted-foreground">
          No charge was made. Your spot has been released. You can try booking again whenever you&apos;re ready.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/sessions" className={buttonVariants()}>
            Back to sessions
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: 'outline' }))}>
            My bookings
          </Link>
        </div>
      </div>
    </div>
  )
}
