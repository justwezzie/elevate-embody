import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { getCurrentAppUser } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { SignOutButton } from './SignOutButton'
import { MobileNav } from './MobileNav'

export async function Navbar() {
  const currentUser = await getCurrentAppUser()
  const user = currentUser?.authUser ?? null
  const appUser = currentUser?.appUser ?? null
  const isAdmin = appUser?.role === 'admin'

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="touch-target font-bold text-xl text-primary tracking-tight">
          Elevate + Embody
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/sessions" className="touch-target hover:text-foreground transition-colors">
            Sessions
          </Link>
          <Link href="/faq" className="touch-target hover:text-foreground transition-colors">
            FAQ
          </Link>
          {user && (
            <Link href="/dashboard" className="touch-target hover:text-foreground transition-colors">
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="touch-target hover:text-foreground transition-colors text-accent">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/sign-up" className={cn(buttonVariants({ size: 'sm' }), 'hidden md:inline-flex h-[44px] px-4 bg-accent hover:bg-primary text-accent-foreground')}>
                Book a class
              </Link>
              <MobileNav isSignedIn={false} isAdmin={false} />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-muted-foreground">
                {appUser?.full_name ?? user.email}
              </span>
              <SignOutButton />
              <MobileNav isSignedIn={true} isAdmin={isAdmin} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
