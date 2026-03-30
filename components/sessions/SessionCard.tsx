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
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight">{session.title}</h3>
          <Badge
            className={
              session.type === 'yoga'
                ? 'bg-primary text-primary-foreground shrink-0 rounded-[8px]'
                : 'bg-accent text-accent-foreground shrink-0 rounded-[8px]'
            }
          >
            {session.type === 'yoga' ? 'Yoga' : 'Boxing'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-medium text-foreground">{dateStr}</span>
          <span>&middot;</span>
          <span>{timeStr}</span>
          <span>&middot;</span>
          <span>{session.duration_mins}min</span>
        </div>
        {session.description && (
          <p className="text-muted-foreground line-clamp-2">{session.description}</p>
        )}
        {session.address && (
          <p className="text-muted-foreground text-sm">{session.address}</p>
        )}
        <SpotsRemaining
          sessionId={session.id}
          initialSpots={session.spots_remaining}
          capacity={session.capacity}
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-border">
        <span className="font-bold text-lg text-primary">£{price}</span>
        {isSoldOut ? (
          <span className={cn(buttonVariants({ size: 'sm' }), 'pointer-events-none opacity-50')}>
            Fully Booked
          </span>
        ) : (
          <Link href={`/sessions/${session.id}`} className={cn(buttonVariants({ size: 'sm' }), 'h-[40px] rounded-[8px] px-5')}>
            View &amp; Book
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
