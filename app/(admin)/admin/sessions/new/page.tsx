'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SessionForm } from '@/components/sessions/SessionForm'

export default function NewSessionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: Record<string, unknown>) {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to create session')
        return
      }
      toast.success('Session created')
      router.push('/admin/sessions')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">New Session</h1>
      <SessionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
