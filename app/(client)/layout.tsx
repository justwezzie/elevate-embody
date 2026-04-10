import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
