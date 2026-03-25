import type { Metadata } from 'next'
import { Lustria, Mulish } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const lustria = Lustria({ variable: '--font-heading', weight: '400', subsets: ['latin'] })
const mulish = Mulish({ variable: '--font-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elevate + Embody',
  description: 'Book yoga and boxing sessions with Elevate + Embody. Mindful movement, powerful results.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${lustria.variable} ${mulish.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
