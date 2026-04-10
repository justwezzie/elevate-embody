'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { SessionType } from '@/types'

const TYPES: { value: SessionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sessions' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'boxing', label: 'Boxing' },
]

export function SessionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('type') ?? 'all'

  function setFilter(type: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (type === 'all') {
      params.delete('type')
    } else {
      params.set('type', type)
    }
    router.push(`/sessions?${params.toString()}`)
  }

  return (
    <div role="group" aria-label="Filter sessions by type" className="flex gap-2 flex-wrap">
      {TYPES.map(({ value, label }) => (
        <Button
          key={value}
          variant={current === value ? 'default' : 'outline'}
          size="sm"
          aria-pressed={current === value}
          className="h-[44px] px-4"
          onClick={() => setFilter(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
