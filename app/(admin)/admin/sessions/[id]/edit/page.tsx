'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SessionForm } from '@/components/sessions/SessionForm'
import { Skeleton } from '@/components/ui/skeleton'
import type { DbSession } from '@/types'

export default function EditSessionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [session, setSession] = useState<DbSession | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/sessions/${id}`)
      .then((r) => r.json())
      .then((data) => setSession(data.session))
      .catch(() => toast.error('Failed to load session'))
  }, [id])

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to update session')
        return
      }
      toast.success('Session updated')
      router.push('/admin/sessions')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="space-y-4 max-w-lg">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Edit Session</h1>
      <SessionForm session={session} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
