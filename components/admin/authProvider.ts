import type { AuthProvider } from 'react-admin'

type ClerkWindow = typeof window & {
  Clerk?: {
    session?: {
      getToken: (opts: { template: string }) => Promise<string | null>
    }
    user?: {
      id: string
      fullName: string | null
      imageUrl: string
      emailAddresses?: Array<{ emailAddress: string }>
    }
    signOut: () => Promise<void>
  }
}

async function getClerkToken(): Promise<string | null> {
  const clerk = (window as ClerkWindow).Clerk
  if (!clerk?.session) return null
  return clerk.session.getToken({ template: 'supabase' })
}

export const authProvider: AuthProvider = {
  async login() {
    // Clerk handles login — this is never called since loginPage={false}
    return
  },

  async logout() {
    const clerk = (window as ClerkWindow).Clerk
    if (clerk?.signOut) await clerk.signOut()
  },

  async checkAuth() {
    const token = await getClerkToken()
    if (!token) {
      window.location.href = '/sign-in'
      throw new Error('Session expired')
    }
  },

  async checkError(error: { status?: number }) {
    const status = error?.status
    if (status === 401 || status === 403) throw error
  },

  async getIdentity() {
    const clerk = (window as ClerkWindow).Clerk
    const user = clerk?.user
    if (!user) return { id: 'unknown', fullName: 'Admin' }
    return {
      id: user.id,
      fullName: user.fullName ?? user.emailAddresses?.[0]?.emailAddress ?? 'Admin',
      avatar: user.imageUrl,
    }
  },

  async getPermissions() {
    return 'admin'
  },
}
