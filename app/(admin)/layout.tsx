import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  return (
    <div style={{ height: '100vh' }}>
      {children}
    </div>
  )
}
