import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { buttonVariants } from '@/lib/button-variants'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { createAnonClient } from '@/lib/supabase/server'

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

  const heroBadge      = cfg.hero_badge      ?? 'Yoga & Boxing'
  const heroHeadline   = cfg.hero_headline   ?? 'Mindful movement.\nPowerful results.'
  const heroSubline    = cfg.hero_subheadline ?? 'Intimate small-group yoga and boxing sessions at Elevate + Embody. Real technique, real community, real transformation.'
  const heroImage      = cfg.hero_image      ?? '/hero.jpg'
  const aboutHeading   = cfg.about_heading   ?? 'Meet Lisa'
  const aboutBody      = cfg.about_body      ?? 'Lisa is the heart behind Elevate + Embody — a certified yoga instructor and trained boxer who found that the two disciplines together created something transformative.'
  const aboutPhoto     = cfg.about_photo     ?? '/hero3.jpg'

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden flex items-center">
          <Image
            src={heroImage}
            alt="Yoga instructor in a pose"
            fill
            className="object-cover object-center md:[object-position:center_-250px]"
            priority
          />
          <div className="absolute inset-0 bg-primary/40" />
          <Badge className="absolute top-10 left-1/2 -translate-x-1/2 bg-transparent text-white text-sm font-bold px-4 border-0 h-[40px] rounded-2xl">
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
                className={cn(buttonVariants({ size: 'lg' }), 'bg-accent hover:bg-accent/90 text-accent-foreground h-[40px] rounded-[8px] px-8')}
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
                title: 'Small groups',
                body: 'Max 10 people per session. Every student gets attention, correction, and encouragement.',
              },
              {
                title: 'Two disciplines',
                body: 'Flow with yoga for strength and flexibility, then power up with boxing for cardio and confidence.',
              },
              {
                title: 'Transparent pricing',
                body: 'Pay per session. No memberships, no commitments. Book what you need, when you need it.',
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="text-center space-y-3 p-6 rounded-2xl bg-card border border-border"
              >
                <h3 className="font-semibold text-lg text-primary">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
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
                className={cn(buttonVariants({ size: 'lg' }), 'bg-primary hover:bg-primary/90 text-primary-foreground h-[40px] rounded-[8px] inline-flex px-5')}
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
            className={cn(buttonVariants({ size: 'lg' }), 'bg-accent hover:bg-accent/90 text-accent-foreground h-[40px] rounded-[8px] px-5')}
          >
            See all sessions
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
