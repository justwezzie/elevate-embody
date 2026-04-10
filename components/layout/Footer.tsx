import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4 text-sm text-muted-foreground">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-12 text-center md:flex-row md:items-start md:justify-center md:gap-16 md:text-center">

          <div className="flex flex-col items-center">
            <p className="font-semibold text-primary text-base">Elevate + Embody</p>
          </div>

          <nav aria-label="Footer pages" className="flex flex-col items-center gap-2">
            <p className="font-semibold text-foreground mb-1">Pages</p>
            <Link href="/sessions" className="touch-target hover:text-foreground transition-colors">Sessions</Link>
            <Link href="/faq" className="touch-target hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/dashboard" className="touch-target hover:text-foreground transition-colors">My Bookings</Link>
            <Link href="/sessions" className="touch-target hover:text-foreground transition-colors">Cancellation Policy</Link>
          </nav>

          <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-foreground mb-1">Contact</p>
            <a
              href="https://www.instagram.com/elevatingandembodywellness"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="touch-target justify-center gap-2 hover:text-accent transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              @elevatingandembodywellness
            </a>
            <a
              href="mailto:elevateandembodywellness@yahoo.com"
              className="touch-target justify-center gap-2 hover:text-accent transition-colors"
            >
              elevateandembodywellness@yahoo.com
            </a>
          </div>

        </div>

        <div className="mx-auto mt-10 w-full max-w-4xl border-t border-border pt-6 text-center">
          <a
            href="https://creatovationstudio.com"
            target="_blank"
            rel="noreferrer"
            className="touch-target hover:text-foreground transition-colors"
          >
            Built by creatovationstudio.com
          </a>
        </div>
      </div>
    </footer>
  )
}
