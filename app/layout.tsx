import type { Metadata } from 'next'
import { Lustria, Mulish } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import { createAnonClient } from '@/lib/supabase/server'
import './globals.css'

const lustria = Lustria({ variable: '--font-heading', weight: '400', subsets: ['latin'] })
const mulish = Mulish({ variable: '--font-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elevate + Embody',
  description: 'Book yoga and boxing sessions with Elevate + Embody. Mindful movement, powerful results.',
}

async function getSiteColors(): Promise<{ primary: string | null; accent: string | null }> {
  try {
    const supabase = createAnonClient()
    const { data } = await supabase
      .from('site_config')
      .select('key, value')
      .in('key', ['color_primary', 'color_accent'])
    if (!data) return { primary: null, accent: null }
    const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
    return { primary: map.color_primary ?? null, accent: map.color_accent ?? null }
  } catch {
    return { primary: null, accent: null }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const colors = await getSiteColors()

  const colorOverrides = [
    colors.primary ? `--primary: ${colors.primary};` : '',
    colors.accent ? `--accent: ${colors.accent};` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ClerkProvider>
      <html lang="en" className={`${lustria.variable} ${mulish.variable} h-full antialiased`}>
        {colorOverrides && (
          <style precedence="default" href="site-config-colors">{`:root { ${colorOverrides} }`}</style>
        )}
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
