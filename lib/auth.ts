import { type User } from '@supabase/supabase-js'
import type { DbUser } from '@/types'
import { createServerAuthClient, createServiceClient } from '@/lib/supabase/server'

export class AuthError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

type AuthContext = {
  authUser: User
  appUser: DbUser
}

function getDisplayName(user: User): string | null {
  const fullName = user.user_metadata.full_name
  return typeof fullName === 'string' && fullName.trim().length > 0 ? fullName.trim() : null
}

async function syncUserRecord(authUser: User): Promise<DbUser> {
  const service = createServiceClient()
  const email = authUser.email

  if (!email) {
    throw new AuthError('Authenticated user is missing an email address', 400)
  }

  const payload = {
    clerk_id: authUser.id,
    email,
    full_name: getDisplayName(authUser),
    avatar_url: null,
  }

  async function findByAuthId() {
    const { data } = await service
      .from('users')
      .select('*')
      .eq('clerk_id', authUser.id)
      .maybeSingle()

    return (data as DbUser | null) ?? null
  }

  const existingByAuthId = await findByAuthId()

  if (existingByAuthId) {
    const { data, error } = await service
      .from('users')
      .update(payload)
      .eq('id', existingByAuthId.id)
      .select('*')
      .single()

    if (error || !data) {
      throw new AuthError(error?.message ?? 'Failed to sync user record', 500)
    }

    return data as DbUser
  }

  const { data: existingByEmail } = await service
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (existingByEmail) {
    const { data, error } = await service
      .from('users')
      .update(payload)
      .eq('id', existingByEmail.id)
      .select('*')
      .single()

    if (error) {
      if (error.code === '23505') {
        const linkedUser = await findByAuthId()
        if (linkedUser) return linkedUser
      }
      throw new AuthError(error.message ?? 'Failed to attach auth account to existing user', 500)
    }

    if (!data) {
      throw new AuthError('Failed to attach auth account to existing user', 500)
    }

    return data as DbUser
  }

  const { data, error } = await service
    .from('users')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      const linkedUser = await findByAuthId()
      if (linkedUser) return linkedUser
    }
    throw new AuthError(error?.message ?? 'Failed to create user record', 500)
  }

  if (!data) {
    throw new AuthError('Failed to create user record', 500)
  }

  return data as DbUser
}

export async function getCurrentAuthUser(): Promise<User | null> {
  const supabase = await createServerAuthClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

export async function getCurrentAppUser(): Promise<AuthContext | null> {
  const authUser = await getCurrentAuthUser()
  if (!authUser) return null

  const appUser = await syncUserRecord(authUser)
  return { authUser, appUser }
}

export async function requireAppUser(): Promise<AuthContext> {
  const context = await getCurrentAppUser()
  if (!context) {
    throw new AuthError('Unauthorized', 401)
  }
  return context
}

export async function requireAdmin(): Promise<AuthContext> {
  const context = await requireAppUser()
  if (context.appUser.role !== 'admin') {
    throw new AuthError('Forbidden', 403)
  }
  return context
}
