import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p className="font-semibold text-primary">Elevate + Embody</p>
        <div className="flex gap-6">
          <Link href="/sessions" className="hover:text-foreground transition-colors">Sessions</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">My Bookings</Link>
        </div>
        <p>48-hour cancellation policy &middot; Full refunds on eligible cancellations</p>
      </div>
    </footer>
  )
}
