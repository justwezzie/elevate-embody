import Link from 'next/link'
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'

export async function Navbar() {
  const { userId } = await auth()
  const user = userId ? await currentUser() : null
  const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin'

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary tracking-tight">
          Elevate + Embody
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/sessions" className="hover:text-foreground transition-colors">
            Sessions
          </Link>
          {userId && (
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="hover:text-foreground transition-colors text-accent">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!userId ? (
            <>
<Link href="/sign-up" className={cn(buttonVariants({ size: 'sm' }), 'h-[40px] px-4 bg-accent hover:bg-accent/90 text-accent-foreground')}>
                Book a class
              </Link>
            </>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  )
}
