import { Suspense } from 'react'
import { createAnonClient } from '@/lib/supabase/server'
import { SessionCard } from '@/components/sessions/SessionCard'
import { SessionFilters } from '@/components/sessions/SessionFilters'
import { Skeleton } from '@/components/ui/skeleton'
import type { DbSession, SessionType } from '@/types'

interface Props {
  searchParams: Promise<{ type?: string }>
}

export default async function SessionsPage({ searchParams }: Props) {
  const { type } = await searchParams
  const supabase = createAnonClient()

  let query = supabase
    .from('sessions')
    .select('*')
    .eq('is_published', true)
    .gte('datetime', new Date().toISOString())
    .order('datetime', { ascending: true })

  if (type === 'yoga' || type === 'boxing') {
    query = query.eq('type', type as SessionType)
  }

  const { data: sessions } = await query

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary">Upcoming Sessions</h1>
        <Suspense fallback={null}>
          <SessionFilters />
        </Suspense>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No sessions available right now.</p>
          <p className="text-sm mt-2">Check back soon — new sessions are added regularly.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session: DbSession) => (
            <Suspense key={session.id} fallback={<Skeleton className="h-64 rounded-xl" />}>
              <SessionCard session={session} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  )
}
