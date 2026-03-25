import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const role = (user?.publicMetadata as { role?: string })?.role
  if (role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <AdminSidebar />
        <main className="flex-1 bg-background text-foreground rounded-2xl p-6 min-h-[80vh]">
          {children}
        </main>
      </div>
    </div>
  )
}
