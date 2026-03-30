'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SpotsRemaining } from '@/components/shared/SpotsRemaining'
import { useSupabaseUser } from '@/hooks/useSupabaseUser'
import type { DbSession } from '@/types'

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isSignedIn, isLoaded } = useSupabaseUser()
  const [session, setSession] = useState<DbSession | null>(null)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    fetch(`/api/sessions/${id}`)
      .then((r) => r.json())
      .then((data) => setSession(data.session))
      .catch(() => toast.error('Failed to load session'))
  }, [id])

  async function handleBook() {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=/sessions/${id}`)
      return
    }

    setIsBooking(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong')
        return
      }

      window.location.href = data.url
    } finally {
      setIsBooking(false)
    }
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  const date = new Date(session.datetime)
  const dateStr = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const price = (session.price_cents / 100).toFixed(2)
  const isSoldOut = session.spots_remaining === 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">{session.title}</h1>
          <p className="text-muted-foreground mt-1">with {session.instructor_name}</p>
        </div>
        <Badge
          className={
            session.type === 'yoga'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground'
          }
        >
          {session.type === 'yoga' ? 'Yoga' : 'Boxing'}
        </Badge>
      </div>

      <div className="rounded-2xl border border-border p-6 space-y-4 bg-card">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{dateStr}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Time</p>
            <p className="font-medium">{timeStr}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium">{session.duration_mins} minutes</p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">{session.address ?? 'Address shared after booking'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Availability</p>
            <SpotsRemaining
              sessionId={session.id}
              initialSpots={session.spots_remaining}
              capacity={session.capacity}
            />
          </div>
        </div>

        {session.description && (
          <p className="text-sm text-muted-foreground border-t pt-4">{session.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border p-6 bg-card">
        <div>
          <p className="text-sm text-muted-foreground">Price per session</p>
          <p className="text-3xl font-bold text-primary">£{price}</p>
        </div>
        <Button
          size="lg"
          onClick={handleBook}
          disabled={isSoldOut || isBooking || !isLoaded}
          className="min-w-32"
        >
          {isSoldOut
            ? 'Fully Booked'
            : isBooking
            ? 'Redirecting...'
            : !isSignedIn
            ? 'Sign in to book'
            : 'Book now'}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        48-hour cancellation policy &middot; Full refund if cancelled at least 48 hours before the session
      </p>
    </div>
  )
}
