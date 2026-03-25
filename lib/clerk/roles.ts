import { auth } from '@clerk/nextjs/server'

export async function isAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  return role === 'admin'
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Forbidden: admin access required')
}
