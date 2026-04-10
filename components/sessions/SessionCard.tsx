import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/lib/button-variants'
import { SpotsRemaining } from '@/components/shared/SpotsRemaining'
import { cn } from '@/lib/utils'
import type { DbSession } from '@/types'

interface Props {
  session: DbSession
}

export function SessionCard({ session }: Props) {
  const date = new Date(session.datetime)
  const dateStr = date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const price = (session.price_cents / 100).toFixed(2)
  const isSoldOut = session.spots_remaining === 0

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow ring-1 ring-accent">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight text-xl">{session.title}</h3>
          <Badge
            className={
              session.type === 'yoga'
                ? 'bg-accent text-accent-foreground shrink-0 rounded-lg h-7 px-2.5 text-xs'
                : 'bg-primary text-primary-foreground shrink-0 rounded-lg h-7 px-2.5 text-xs'
            }
          >
            {session.type === 'yoga' ? 'Yoga' : 'Boxing'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <span className="font-medium text-foreground">{dateStr}</span>
          <span>&middot;</span>
          <span>{timeStr}</span>
          <span>&middot;</span>
          <span>{session.duration_mins}min</span>
        </div>
        {session.description && (
          <p className="text-foreground line-clamp-2">{session.description}</p>
        )}
        {session.address && (
          <p className="text-foreground text-sm">{session.address}</p>
        )}
        <SpotsRemaining
          sessionId={session.id}
          initialSpots={session.spots_remaining}
          capacity={session.capacity}
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-border bg-accent/10">
        <span className="font-bold text-lg text-primary">£{price}</span>
        {isSoldOut ? (
          <button
            disabled
            aria-disabled="true"
            className={cn(buttonVariants({ size: 'sm' }), 'opacity-50 cursor-not-allowed')}
          >
            Fully Booked
          </button>
        ) : (
          <Link
            href={`/sessions/${session.id}`}
            aria-label={`View and book ${session.title}`}
            className={cn(buttonVariants({ size: 'sm' }), 'h-[44px] min-h-[44px] max-h-[44px] rounded-lg px-5 bg-accent text-accent-foreground hover:bg-primary')}
          >
            View &amp; Book
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
