import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { buttonVariants } from '@/lib/button-variants'
import { Badge } from '@/components/ui/badge'
import { getAppUrl } from '@/lib/app-url'
import { cn } from '@/lib/utils'
import { createAnonClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: {
    absolute: 'Elevate + Embody',
  },
  description:
    'Elevate + Embody is a Staffordshire-based yoga and boxing business offering group and 1 to 1 sessions with direct online booking.',
  alternates: {
    canonical: '/',
  },
}

async function getSiteConfig(): Promise<Record<string, string>> {
  try {
    const supabase = createAnonClient()
    const { data } = await supabase.from('site_config').select('key, value')
    if (!data) return {}
    return Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
  } catch {
    return {}
  }
}

export default async function LandingPage() {
  const cfg = await getSiteConfig()
  const appUrl = getAppUrl()

  const heroBadge      = 'Based in Staffordshire'
  const heroHeadline   = cfg.hero_headline   ?? 'Staffordshire yoga and boxing sessions\nwith Lisa'
  const heroSubline    = cfg.hero_subheadline ?? 'Group and 1 to 1 yoga and boxing sessions with direct online booking, supportive coaching, and affordable pricing under £15 per class.'
  const heroImage      = cfg.hero_image      ?? '/hero.jpg'
  const aboutHeading   = cfg.about_heading   ?? 'Meet Lisa'
  const aboutBody      = cfg.about_body      ?? 'Lisa is the heart behind Elevate + Embody — a certified yoga instructor and trained boxer who found that the two disciplines together created something transformative.'
  const aboutPhoto     = cfg.about_photo     ?? '/hero3.jpg'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Elevate + Embody',
    url: appUrl,
    logo: `${appUrl}/logo.png`,
    email: 'elevateandembodywellness@yahoo.com',
    areaServed: 'Staffordshire',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Staffordshire',
      addressCountry: 'GB',
    },
    sameAs: ['https://www.instagram.com/elevatingandembodywellness'],
    description:
      'Elevate + Embody is a Staffordshire-based business offering group and 1 to 1 yoga and boxing sessions that can be booked directly through the website.',
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Elevate + Embody services',
    itemListElement: [
      {
        '@type': 'Service',
        position: 1,
        name: 'Small-group yoga classes',
        provider: {
          '@type': 'Organization',
          name: 'Elevate + Embody',
          url: appUrl,
        },
        areaServed: 'United Kingdom',
        serviceType: 'Yoga instruction',
        description:
          'Group and 1 to 1 yoga sessions in Staffordshire led by Lisa, a qualified yoga, fitness and wellness coach.',
      },
      {
        '@type': 'Service',
        position: 2,
        name: 'Small-group boxing classes',
        provider: {
          '@type': 'Organization',
          name: 'Elevate + Embody',
          url: appUrl,
        },
        areaServed: 'United Kingdom',
        serviceType: 'Boxing instruction',
        description:
          'Group and 1 to 1 boxing sessions in Staffordshire led by Lisa, a qualified yoga, fitness and wellness coach.',
      },
    ],
  }

  const faqItems = [
    {
      question: 'How do I book a yoga or boxing class?',
      answer:
        'Browse the upcoming sessions page, choose your preferred class, and complete checkout online. You will receive a booking confirmation after payment succeeds.',
    },
    {
      question: 'Where is Elevate + Embody based?',
      answer:
        'Elevate + Embody is based in Staffordshire and offers yoga and boxing sessions for people looking for small-group or 1 to 1 coaching.',
    },
    {
      question: 'Who teaches the sessions?',
      answer:
        'Sessions are taught by Lisa, a qualified yoga, fitness and wellness coach.',
    },
    {
      question: 'How many people are in each class?',
      answer:
        'Classes are intentionally kept small, usually up to 10 people, so each student gets more attention, coaching, and space to move safely.',
    },
    {
      question: 'How much do classes cost?',
      answer:
        'Classes are designed to stay affordable, with sessions priced at less than £15 each.',
    },
    {
      question: 'Can I cancel or reschedule my booking?',
      answer:
        'Bookings are non-refundable, but sessions can be rescheduled up to 48 hours before the class start time.',
    },
    {
      question: 'Are classes suitable for beginners?',
      answer:
        'Yes. Elevate + Embody welcomes a range of experience levels and focuses on clear instruction, mindful pacing, and supportive coaching.',
    },
  ]

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden flex items-center">
          <Image
            src={heroImage}
            alt="Yoga instructor in a pose"
            fill
            sizes="100vw"
            className="object-cover object-center md:[object-position:center_-250px]"
            priority
          />
          <div className="absolute inset-0 bg-primary/40" />
          <Badge className="absolute top-10 left-1/2 -translate-x-1/2 bg-transparent text-white text-sm font-bold px-4 border-0 h-[44px] rounded-2xl">
            {heroBadge}
          </Badge>
          <div className="relative w-full max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white">
              {heroHeadline.split('\n').map((line, i) => (
                <span key={i}>{line}{i < heroHeadline.split('\n').length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="text-lg text-white max-w-xl mx-auto font-bold">
              {heroSubline}
            </p>
            <div className="flex justify-center pt-2">
              <Link
                href="/sessions"
                className={cn(buttonVariants({ size: 'lg' }), 'h-[44px] min-h-[44px] max-h-[44px] bg-accent hover:bg-primary text-accent-foreground rounded-lg px-8')}
              >
                Browse Classes
              </Link>
            </div>
          </div>
        </section>

        {/* Why section */}
        <section className="py-20 px-4 max-w-6xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Why Elevate + Embody?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Small-group sessions in Staffordshire',
                body: 'Group sessions are based in Staffordshire and kept intentionally small, with up to 10 people per class so every student gets attention, correction, and encouragement.',
              },
              {
                title: 'Yoga and boxing with Lisa',
                body: 'Lisa teaches both yoga and boxing sessions, combining mindful movement, structured coaching, and supportive guidance for a range of experience levels.',
              },
              {
                title: 'Direct booking and affordable pricing',
                body: 'Classes can be booked directly through the website, with pay-per-session pricing designed to stay under £15 and no membership commitment required.',
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="text-center space-y-3 p-6 rounded-2xl bg-card border-[1.5px] border-accent"
              >
                <h3 className="font-semibold text-lg text-primary">{title}</h3>
                <p className="text-foreground text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About section */}
        <section className="py-20 px-4 max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src={aboutPhoto}
                alt="Lisa, founder of Elevate + Embody"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">{aboutHeading}</h2>
              <p className="text-muted-foreground leading-relaxed">{aboutBody}</p>
              <p className="text-muted-foreground leading-relaxed">
                Her philosophy is simple: <span className="text-primary font-semibold">heal your body, heal your life.</span> Through mindful movement, breathwork, and the discipline of boxing, Lisa guides her students toward physical strength and inner balance in equal measure.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every session is kept small and intentional — because real transformation happens when you feel seen, supported, and challenged in the right way.
              </p>
              <Link
                href="/sessions"
                className={cn(buttonVariants({ size: 'lg' }), 'h-[44px] min-h-[44px] max-h-[44px] bg-primary hover:bg-[#BC4E70] text-primary-foreground rounded-lg px-5')}
              >
                Train with Lisa
              </Link>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="bg-primary py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-secondary-foreground mb-4">Ready to start?</h2>
          <p className="text-secondary-foreground/80 mb-6 max-w-md mx-auto">
            Sessions fill up fast. Grab your spot before it&apos;s gone.
          </p>
          <Link
            href="/sessions"
            className={cn(buttonVariants({ size: 'lg' }), 'h-[44px] min-h-[44px] max-h-[44px] bg-accent hover:bg-primary text-accent-foreground rounded-lg px-5 hover:shadow-lg hover:shadow-black/30')}
          >
            See all sessions
          </Link>
        </section>

        <section className="py-20 px-4 max-w-4xl mx-auto w-full">
          <div className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-bold text-primary">Frequently asked questions</h2>
            <p className="text-muted-foreground">
              Quick answers about booking, class size, cancellations, and whether the sessions are right for you.
            </p>
          </div>
          <div className="mx-auto w-full max-w-5xl space-y-4">
            {faqItems.map((item) => (
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
          </div>
          <div className="my-8 flex justify-center">
            <Link
              href="/sessions"
              className={cn(buttonVariants({ size: 'lg' }), 'h-[44px] min-h-[44px] max-h-[44px] bg-accent hover:bg-primary text-accent-foreground rounded-lg px-8')}
            >
              Book Sessions
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
