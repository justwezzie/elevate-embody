'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" className="h-[44px]" onClick={handleSignOut}>
      Sign out
    </Button>
  )
}
