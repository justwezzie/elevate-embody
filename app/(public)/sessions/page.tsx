import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SessionCard } from '@/components/sessions/SessionCard'
import { SessionFilters } from '@/components/sessions/SessionFilters'
import { Skeleton } from '@/components/ui/skeleton'
import { getAppUrl } from '@/lib/app-url'
import { getPublishedSessions } from '@/lib/public-sessions'
import type { DbSession, SessionType } from '@/types'

interface Props {
  searchParams: Promise<{ type?: string }>
}

export const metadata: Metadata = {
  title: 'Staffordshire Yoga and Boxing Sessions',
  description:
    'Browse upcoming Staffordshire group yoga and boxing sessions with Lisa, with direct website booking and affordable pricing under £15 per session.',
  alternates: {
    canonical: '/sessions',
  },
}

export default async function SessionsPage({ searchParams }: Props) {
  const { type } = await searchParams
  const sessions = await getPublishedSessions(
    type === 'yoga' || type === 'boxing' ? (type as SessionType) : undefined
  )
  const appUrl = getAppUrl()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Upcoming Elevate + Embody sessions',
    itemListElement: sessions.map((session, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${appUrl}/sessions/${session.id}`,
      item: {
        '@type': 'Event',
        name: session.title,
        startDate: session.datetime,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        description:
          session.description ??
          `${session.type} class in Staffordshire with ${session.instructor_name} lasting ${session.duration_mins} minutes.`,
        location: {
          '@type': 'Place',
          name: session.address ?? 'Elevate + Embody, Staffordshire',
          address: session.address ?? 'Staffordshire, GB',
        },
        offers: {
          '@type': 'Offer',
          price: Number((session.price_cents / 100).toFixed(2)),
          priceCurrency: 'GBP',
          availability:
            session.spots_remaining > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/SoldOut',
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-primary">Upcoming Sessions</h1>
          <p className="w-full text-muted-foreground leading-relaxed">
            Explore upcoming group yoga and boxing sessions from Elevate + Embody in Staffordshire. Each listing includes the class type, instructor, schedule, price, and live availability so you can choose the right session and book directly through the website.
          </p>
          <Suspense fallback={null}>
            <SessionFilters />
          </Suspense>
        </div>

        {!sessions || sessions.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 gap-10 max-w-lg mx-auto">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-primary">No group sessions right now</h2>
              <p className="text-muted-foreground leading-relaxed">
                Want to move sooner? Book a private 1:1 session with Lisa and train on your schedule.
              </p>
              <a
                href="mailto:elevateandembodywellness@yahoo.com"
                className="inline-flex items-center justify-center h-[44px] min-h-[44px] max-h-[44px] rounded-lg px-6 bg-primary text-primary-foreground text-sm font-medium hover:bg-[#BC4E70] transition-colors"
              >
                Book a 1:1 session
              </a>
            </div>

            <div className="w-full border-t border-border" />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">Help shape the schedule</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We&apos;re launching group classes soon and want to hear from you — what classes, locations, and times would work best?
              </p>
              <a
                href="mailto:elevateandembodywellness@yahoo.com?subject=Class%20Suggestions"
                className="inline-flex items-center justify-center h-[44px] min-h-[44px] max-h-[44px] rounded-lg px-6 bg-accent text-accent-foreground text-sm font-medium hover:bg-primary transition-colors"
              >
                Share your preferences
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session: DbSession) => (
                <Suspense key={session.id} fallback={<Skeleton className="h-64 rounded-xl" />}>
                  <SessionCard session={session} />
                </Suspense>
              ))}
            </div>

            <section className="mx-auto mt-14 w-full max-w-5xl space-y-4">
              {[
                {
                  title: 'Best for',
                  body: 'People who want group yoga or boxing sessions in Staffordshire, flexible pay-per-class booking, and clear session details before committing.',
                },
                {
                  title: 'What each listing tells you',
                  body: 'Every session card shows the class type, date, time, price, remaining spots, and booking path so you can compare options quickly. Sessions are designed to stay affordable, at less than £15 each.',
                },
                {
                  title: 'How to choose',
                  body: 'Filter by yoga or boxing, then open the session page to review Lisa as the coach, the location, duration, and current availability before booking directly through the site.',
                },
              ].map((item) => (
                <details
                  key={item.title}
                  className="group rounded-2xl border border-accent bg-card px-6 py-5 text-left"
                >
                  <summary className="touch-target flex w-full list-none cursor-pointer items-center justify-between gap-4 text-left text-xl font-semibold text-primary marker:hidden">
                    <span className="flex-1">{item.title}</span>
                    <span
                      aria-hidden="true"
                      className="ml-4 shrink-0 text-2xl leading-none text-accent transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pt-4 text-muted-foreground leading-relaxed">{item.body}</p>
                </details>
              ))}
            </section>
          </>
        )}
      </div>
    </>
  )
}
