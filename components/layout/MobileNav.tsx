'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

interface Props {
  isSignedIn: boolean
  isAdmin: boolean
}

export function MobileNav({ isSignedIn, isAdmin }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <div className="md:hidden relative" ref={menuRef}>
      <button
        type="button"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center h-[44px] w-[44px] rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav-menu"
            aria-label="Mobile navigation"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-2xl border border-border bg-white shadow-lg py-2"
          >
            <Link
              href="/sessions"
              className="touch-target-block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg mx-1"
            >
              Sessions
            </Link>
            <Link
              href="/faq"
              className="touch-target-block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg mx-1"
            >
              FAQ
            </Link>
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="touch-target-block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-lg mx-1"
              >
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="touch-target-block px-4 py-3 text-sm font-medium text-accent hover:bg-muted transition-colors rounded-lg mx-1"
              >
                Admin
              </Link>
            )}
          </nav>
        </>
      )}
    </div>
  )
}
