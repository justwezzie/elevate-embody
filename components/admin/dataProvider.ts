import type { DataProvider, RaRecord } from 'react-admin'
import { createAdminClient } from '@/lib/supabase/admin-client'

type ClerkWindow = typeof window & {
  Clerk?: {
    session?: {
      getToken: (opts: { template: string }) => Promise<string | null>
    }
  }
}

export async function getSupabaseClient() {
  const clerk = (window as ClerkWindow).Clerk
  const token = await clerk?.session?.getToken({ template: 'supabase' })
  if (!token) throw new Error('No Clerk session')
  return createAdminClient(token)
}

const JOINED_SELECTS: Record<string, string> = {
  bookings: '*, users(id, email, full_name), sessions(id, title, type, datetime, price_cents)',
}

function buildSelect(resource: string): string {
  return JOINED_SELECTS[resource] ?? '*'
}

function flattenJoins(resource: string, rows: RaRecord[]): RaRecord[] {
  if (resource !== 'bookings') return rows
  return rows.map((row) => {
    const users = row.users as Record<string, unknown> | null
    const sessions = row.sessions as Record<string, unknown> | null
    return {
      ...row,
      customer_name: users?.full_name ?? null,
      customer_email: users?.email ?? null,
      session_title: sessions?.title ?? null,
      session_datetime: sessions?.datetime ?? null,
      session_type: sessions?.type ?? null,
      session_price_cents: sessions?.price_cents ?? null,
    }
  })
}

function buildCreatePayload(resource: string, data: Record<string, unknown>): Record<string, unknown> {
  if (resource === 'sessions') return { ...data, spots_remaining: data.capacity }
  return data
}

function buildUpdatePayload(resource: string, data: Record<string, unknown>): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, ...rest } = data
  if (resource === 'sessions') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { spots_remaining, ...sessionRest } = rest
    return sessionRest
  }
  return rest
}

// Using `as unknown as DataProvider` because DataProvider uses invariant generics
// that conflict with a dynamic Supabase implementation. All methods are correctly shaped.
export const dataProvider = {
  getList: async (resource: string, params: Record<string, unknown>) => {
    const supabase = await getSupabaseClient()
    const pagination = params.pagination as { page: number; perPage: number } | undefined
    const sort = params.sort as { field: string; order: string } | undefined
    const filter = params.filter as Record<string, unknown> | undefined
    const page = pagination?.page ?? 1
    const perPage = pagination?.perPage ?? 25
    const field = sort?.field ?? 'created_at'
    const order = sort?.order ?? 'DESC'
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from(resource)
      .select(buildSelect(resource), { count: 'exact' })
      .order(field, { ascending: order === 'ASC' })
      .range(from, to)

    for (const [key, value] of Object.entries(filter ?? {})) {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, String(value))
      }
    }

    const { data, error, count } = await query
    if (error) throw error
    return { data: flattenJoins(resource, (data as unknown as RaRecord[]) ?? []), total: count ?? 0 }
  },

  getOne: async (resource: string, params: { id: string | number }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from(resource)
      .select(buildSelect(resource))
      .eq('id', params.id)
      .single()
    if (error) throw error
    return { data: flattenJoins(resource, [data as unknown as RaRecord])[0] }
  },

  getMany: async (resource: string, params: { ids: (string | number)[] }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from(resource)
      .select(buildSelect(resource))
      .in('id', params.ids)
    if (error) throw error
    return { data: flattenJoins(resource, (data as unknown as RaRecord[]) ?? []) }
  },

  getManyReference: async (resource: string, params: Record<string, unknown>) => {
    const supabase = await getSupabaseClient()
    const pagination = params.pagination as { page: number; perPage: number } | undefined
    const sort = params.sort as { field: string; order: string } | undefined
    const filter = params.filter as Record<string, unknown> | undefined
    const page = pagination?.page ?? 1
    const perPage = pagination?.perPage ?? 25
    const field = sort?.field ?? 'created_at'
    const order = sort?.order ?? 'DESC'
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from(resource)
      .select(buildSelect(resource), { count: 'exact' })
      .eq(params.target as string, params.id as string)
      .order(field, { ascending: order === 'ASC' })
      .range(from, to)

    for (const [key, value] of Object.entries(filter ?? {})) {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, String(value))
      }
    }

    const { data, error, count } = await query
    if (error) throw error
    return { data: flattenJoins(resource, (data as unknown as RaRecord[]) ?? []), total: count ?? 0 }
  },

  create: async (resource: string, params: { data: Record<string, unknown> }) => {
    const supabase = await getSupabaseClient()
    const payload = buildCreatePayload(resource, params.data)
    const { data, error } = await supabase.from(resource).insert(payload).select().single()
    if (error) throw error
    return { data: data as unknown as RaRecord }
  },

  update: async (resource: string, params: { id: string | number; data: Record<string, unknown> }) => {
    const supabase = await getSupabaseClient()
    const payload = buildUpdatePayload(resource, params.data)
    const { data, error } = await supabase.from(resource).update(payload).eq('id', params.id).select().single()
    if (error) throw error
    return { data: data as unknown as RaRecord }
  },

  updateMany: async (resource: string, params: { ids: (string | number)[]; data: Record<string, unknown> }) => {
    const supabase = await getSupabaseClient()
    const payload = buildUpdatePayload(resource, params.data)
    const { error } = await supabase.from(resource).update(payload).in('id', params.ids)
    if (error) throw error
    return { data: params.ids }
  },

  delete: async (resource: string, params: { id: string | number }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.from(resource).delete().eq('id', params.id).select().single()
    if (error) throw error
    return { data: data as unknown as RaRecord }
  },

  deleteMany: async (resource: string, params: { ids: (string | number)[] }) => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.from(resource).delete().in('id', params.ids)
    if (error) throw error
    return { data: params.ids }
  },
} as unknown as DataProvider
