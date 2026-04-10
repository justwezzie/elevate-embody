import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { SpotsRemaining } from '@/components/shared/SpotsRemaining'
import { SessionBookingButton } from '@/components/sessions/SessionBookingButton'
import { getAppUrl } from '@/lib/app-url'
import { getPublishedSessionById } from '@/lib/public-sessions'

interface Props {
  params: Promise<{ id: string }>
}

function getSessionDescription(session: {
  title: string
  type: string
  instructor_name: string
  duration_mins: number
  address: string | null
  description: string | null
}) {
  return (
    session.description ??
    `${session.title} is a ${session.type} session with ${session.instructor_name}, a qualified yoga, fitness and wellness coach. ` +
      `${session.duration_mins} minute session${session.address ? ` at ${session.address}` : ' in Staffordshire'}.`
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const session = await getPublishedSessionById(id)

  if (!session) {
    return {
      title: 'Session not found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const appUrl = getAppUrl()
  const url = `${appUrl}/sessions/${session.id}`
  const date = new Date(session.datetime)
  const dateLabel = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return {
    title: session.title,
    description: getSessionDescription(session),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${session.title} | Elevate + Embody`,
      description: `${dateLabel} with ${session.instructor_name}. Book your place online.`,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${session.title} | Elevate + Embody`,
      description: `${dateLabel} with ${session.instructor_name}. Book your place online.`,
    },
  }
}

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getPublishedSessionById(id)

  if (!session) {
    notFound()
  }

  const date = new Date(session.datetime)
  const dateStr = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const price = (session.price_cents / 100).toFixed(2)
  const isSoldOut = session.spots_remaining === 0
  const appUrl = getAppUrl()
  const sessionUrl = `${appUrl}/sessions/${session.id}`

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: session.title,
    description: getSessionDescription(session),
    startDate: session.datetime,
    endDate: new Date(
      new Date(session.datetime).getTime() + session.duration_mins * 60 * 1000
    ).toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    url: sessionUrl,
    image: [`${appUrl}/hero.jpg`],
    location: {
      '@type': 'Place',
      name: session.address ?? 'Elevate + Embody',
      address: session.address ?? undefined,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Elevate + Embody',
      url: appUrl,
    },
    performer: {
      '@type': 'Person',
      name: session.instructor_name,
    },
    offers: {
      '@type': 'Offer',
      url: sessionUrl,
      price: Number(price),
      priceCurrency: 'GBP',
      availability: isSoldOut
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: appUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sessions',
        item: `${appUrl}/sessions`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: session.title,
        item: sessionUrl,
      },
    ],
  }

  const pageFaqItems = [
    {
      question: 'What information can I check before booking?',
      answer:
        'You can review the class title, instructor, date, time, duration, address, price, and current availability before starting checkout.',
    },
    {
      question: 'Who teaches this session?',
      answer:
        'This session is taught by Lisa, a qualified yoga, fitness and wellness coach.',
    },
    {
      question: 'What happens if the class is full?',
      answer:
        'If all spaces are taken, the session is marked as fully booked and checkout is disabled.',
    },
    {
      question: 'How much does this session cost?',
      answer:
        'Sessions are designed to stay affordable and are priced at less than £15 each.',
    },
    {
      question: 'Can I reschedule this session?',
      answer:
        'Bookings are non-refundable, but sessions can be rescheduled up to 48 hours before the class start time.',
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/sessions" className="hover:text-foreground transition-colors">Sessions</a></li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{session.title}</li>
          </ol>
        </nav>

        <div className="rounded-2xl border border-accent/40 bg-accent/5 px-6 py-5 space-y-2 text-sm text-foreground">
          <p>
            <span className="font-semibold">Please note:</span> Bookings are non-refundable, but we will kindly reschedule your booking up to 48 hours before.
          </p>
          <p>Please ensure you have read and understood the age guidelines before booking.</p>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary">{session.title}</h1>
            <p className="text-muted-foreground mt-1">with {session.instructor_name}</p>
          </div>
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

        <div className="rounded-2xl border border-border p-6 space-y-4 bg-card">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Date</dt>
              <dd className="font-medium">{dateStr}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Time</dt>
              <dd className="font-medium">{timeStr}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="font-medium">{session.duration_mins} minutes</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="font-medium">{session.address ?? 'Address shared after booking'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Availability</dt>
              <dd>
                <SpotsRemaining
                  sessionId={session.id}
                  initialSpots={session.spots_remaining}
                  capacity={session.capacity}
                />
              </dd>
            </div>
          </dl>

          {session.description && (
            <p className="text-sm text-muted-foreground border-t pt-4">{session.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border p-6 bg-card">
          <div>
            <p className="text-sm text-muted-foreground">Price per session</p>
            <p className="text-3xl font-bold text-primary">£{price}</p>
          </div>
          <SessionBookingButton sessionId={session.id} isSoldOut={isSoldOut} />
        </div>

        <section className="mx-auto w-full max-w-5xl space-y-4">
          {[
            {
              title: 'Who this session suits',
              body: `This ${session.type} session is designed for people who want guided instruction, a smaller class size, and a clear booking process in Staffordshire.`,
            },
            {
              title: 'Who teaches this session',
              body: 'This page confirms that Lisa, a qualified yoga, fitness and wellness coach, is leading the session.',
            },
            {
              title: 'Booking expectations',
              body: 'Once you complete payment, your place is confirmed and you will receive booking confirmation by email. Sessions can be booked directly through the site.',
            },
          ].map((item) => (
            <details
              key={item.title}
              className="group rounded-2xl border border-accent bg-card px-6 py-5 text-left"
            >
              <summary className="touch-target flex w-full list-none cursor-pointer items-center justify-between gap-4 text-left text-lg font-semibold text-primary marker:hidden">
                <span className="flex-1">{item.title}</span>
                <span
                  aria-hidden="true"
                  className="ml-4 shrink-0 text-2xl leading-none text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pt-4 text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </details>
          ))}
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-4">
          <h2 className="text-2xl font-bold text-primary">Booking questions</h2>
          {pageFaqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-accent bg-card px-6 py-5 text-left"
            >
              <summary className="touch-target flex w-full list-none cursor-pointer items-center justify-between gap-4 text-left text-lg font-semibold text-primary marker:hidden">
                <span className="flex-1">{item.question}</span>
                <span
                  aria-hidden="true"
                  className="ml-4 shrink-0 text-2xl leading-none text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pt-4 text-muted-foreground leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </section>
      </div>
    </>
  )
}
