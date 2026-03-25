import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/lib/button-variants'
import { Badge } from '@/components/ui/badge'
import type { DbSession } from '@/types'

export default async function AdminSessionsPage() {
  const supabase = createServiceClient()
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('datetime', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Sessions</h1>
        <Link href="/admin/sessions/new" className={buttonVariants({ size: 'sm' })}>
          + New session
        </Link>
      </div>

      {!sessions || sessions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No sessions yet.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session: DbSession) => {
            const date = new Date(session.datetime)
            const isPast = date < new Date()
            return (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 rounded-xl border border-border bg-card gap-4 ${
                  isPast ? 'opacity-50' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">{session.title}</span>
                    <Badge variant={session.type === 'yoga' ? 'default' : 'secondary'}>
                      {session.type}
                    </Badge>
                    {!session.is_published && (
                      <Badge variant="outline" className="text-xs">Draft</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {date.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    &middot; {session.spots_remaining}/{session.capacity} spots &middot; £
                    {(session.price_cents / 100).toFixed(2)}
                  </p>
                </div>
                <Link
                  href={`/admin/sessions/${session.id}/edit`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Edit
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
