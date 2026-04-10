'use client'

import { useSessionAvailability } from '@/hooks/useSessionAvailability'
import { Badge } from '@/components/ui/badge'

interface Props {
  sessionId: string
  initialSpots: number
  capacity: number
}

export function SpotsRemaining({ sessionId, initialSpots, capacity }: Props) {
  const spots = useSessionAvailability(sessionId, initialSpots)

  if (spots === 0) {
    return <Badge variant="destructive">Fully Booked</Badge>
  }

  const isLow = spots <= 3
  const pct = (spots / capacity) * 100

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
        isLow ? 'text-orange-600' : 'text-foreground'
      }`}
    >
      {isLow && (
        <span aria-hidden="true" className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
        </span>
      )}
      {spots} {spots === 1 ? 'spot' : 'spots'} remaining
      {pct <= 25 && ' — book fast'}
    </span>
  )
}
