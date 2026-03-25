'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSessionAvailability(sessionId: string, initialSpots: number) {
  const [spotsRemaining, setSpotsRemaining] = useState(initialSpots)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`session-availability-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          setSpotsRemaining((payload.new as { spots_remaining: number }).spots_remaining)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  return spotsRemaining
}
