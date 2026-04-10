import type { Metadata } from 'next'
import Link from 'next/link'
import { getAppUrl } from '@/lib/app-url'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'

const faqItems = [
  {
    question: 'How do I book a class?',
    answer:
      'Classes can be booked directly through the website. Visit the sessions page, choose your preferred yoga or boxing session, and complete checkout online.',
  },
  {
    question: 'Can I cancel or reschedule a booking?',
    answer:
      'Bookings are non-refundable, but sessions can be rescheduled up to 48 hours before the class start time.',
  },
  {
    question: 'What should I bring to class?',
    answer:
      'Bring comfortable clothing suitable for movement, water, and anything you usually use for exercise. Session-specific details can be checked on the class page before booking.',
  },
  {
    question: 'Where is Elevate + Embody based?',
    answer:
      'Elevate + Embody is based in Staffordshire and offers yoga and boxing sessions for people looking for group or 1 to 1 coaching.',
  },
  {
    question: 'Who teaches the sessions?',
    answer:
      'Sessions are taught by Lisa, a qualified yoga, fitness and wellness coach.',
  },
  {
    question: 'What classes and services are offered?',
    answer:
      'Elevate + Embody offers group and 1 to 1 yoga and boxing sessions. Upcoming group sessions are published on the site and can be booked directly online.',
  },
  {
    question: 'How much do classes cost?',
    answer:
      'Sessions are designed to stay affordable and are priced at less than £15 per session.',
  },
  {
    question: 'Are classes suitable for beginners?',
    answer:
      'Yes. Elevate + Embody welcomes a range of experience levels and focuses on clear instruction, mindful pacing, and supportive coaching.',
  },
]

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about booking, cancellations, class suitability, location, pricing, and what to bring to Elevate + Embody sessions.',
  alternates: {
    canonical: '/faq',
  },
}

export default function FaqPage() {
  const appUrl = getAppUrl()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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
        name: 'FAQ',
        item: `${appUrl}/faq`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            FAQ
          </p>
          <h1 className="text-4xl font-bold text-primary">Frequently asked questions</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Quick answers about booking, pricing, cancellations, what to bring, class suitability,
            and how Elevate + Embody works in Staffordshire.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-accent bg-card px-6 py-5"
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
        </div>
        <div className="my-8 flex justify-center">
          <Link
            href="/sessions"
            className={cn(buttonVariants({ size: 'lg' }), 'h-[44px] min-h-[44px] max-h-[44px] bg-accent hover:bg-primary text-accent-foreground rounded-lg px-8')}
          >
            Book Sessions
          </Link>
        </div>
      </div>
    </>
  )
}
