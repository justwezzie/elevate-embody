import type { AuthProvider } from 'react-admin'
import { createClient } from '@/lib/supabase/client'

export const authProvider: AuthProvider = {
  async login() {
    window.location.href = '/sign-in'
    return
  },

  async logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/sign-in'
  },

  async checkAuth() {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      window.location.href = '/sign-in'
      throw new Error('Session expired')
    }
  },

  async checkError(error: { status?: number }) {
    const status = error?.status
    if (status === 401 || status === 403) throw error
  },

  async getIdentity() {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return { id: 'unknown', fullName: 'Admin' }
    return {
      id: user.id,
      fullName:
        (typeof user.user_metadata.full_name === 'string' && user.user_metadata.full_name) ||
        user.email ||
        'Admin',
    }
  },

  async getPermissions() {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return 'client'

    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('clerk_id', userData.user.id)
      .maybeSingle()

    return data?.role ?? 'client'
  },
}
