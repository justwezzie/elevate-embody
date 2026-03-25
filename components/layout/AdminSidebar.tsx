'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/sessions', label: 'Sessions', exact: false },
  { href: '/admin/bookings', label: 'Bookings', exact: false },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0">
      <nav className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/60 px-3 mb-2">
          Admin
        </p>
        {navItems.map(({ href, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
