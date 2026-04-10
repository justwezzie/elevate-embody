'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useSupabaseUser } from '@/hooks/useSupabaseUser'

interface Props {
  sessionId: string
  isSoldOut: boolean
}

export function SessionBookingButton({ sessionId, isSoldOut }: Props) {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useSupabaseUser()
  const [isBooking, setIsBooking] = useState(false)

  async function handleBook() {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=/sessions/${sessionId}`)
      return
    }

    setIsBooking(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json()

      if (!res.ok) {
        const message =
          res.status === 409
            ? 'This session is now fully booked.'
            : res.status === 404
            ? 'This session is no longer available.'
            : res.status === 401
            ? 'Please sign in to book.'
            : data.error ?? 'Something went wrong. Please try again.'

        toast.error(message)
        return
      }

      window.location.href = data.url
    } catch {
      toast.error('Network error. Check your connection and try again.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleBook}
      disabled={isSoldOut || isBooking || !isLoaded}
      aria-disabled={isSoldOut || isBooking || !isLoaded}
      className="min-w-[11rem]"
    >
      {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      {isSoldOut
        ? 'Fully Booked'
        : isBooking
        ? 'Redirecting...'
        : !isSignedIn
        ? 'Sign in to book'
        : 'Book now'}
    </Button>
  )
}
