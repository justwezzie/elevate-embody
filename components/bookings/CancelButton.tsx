'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface Props {
  bookingId: string
  sessionDatetime: string
}

export function CancelButton({ bookingId, sessionDatetime }: Props) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const hoursUntil = (new Date(sessionDatetime).getTime() - Date.now()) / (1000 * 60 * 60)
  const canCancel = hoursUntil >= 48

  async function handleCancel() {
    setIsPending(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong')
        return
      }

      toast.success('Booking cancelled. Refund issued.')
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  if (!canCancel) {
    return (
      <p className="text-xs text-muted-foreground">
        Cancellation window has passed (48hr policy)
      </p>
    )
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="sm" disabled={isPending}>
          {isPending ? 'Cancelling...' : 'Cancel booking'}
        </Button>
      }
      title="Cancel this booking?"
      description="A full refund will be issued to your original payment method within 5–10 business days. This cannot be undone."
      confirmLabel="Yes, cancel"
      onConfirm={handleCancel}
    />
  )
}
