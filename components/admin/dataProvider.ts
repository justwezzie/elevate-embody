import type { DataProvider, RaRecord } from 'react-admin'
import { createClient } from '@/lib/supabase/client'

export async function getSupabaseClient() {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  if (!data.session) throw new Error('No Supabase session')
  return supabase
}

function toError(error: unknown, context: string): Error {
  if (error instanceof Error) {
    error.message = `${context}: ${error.message}`
    return error
  }

  if (error && typeof error === 'object') {
    const value = error as {
      message?: unknown
      code?: unknown
      details?: unknown
      hint?: unknown
      status?: unknown
    }

    const parts = [
      typeof value.message === 'string' ? value.message : 'Unknown Supabase error',
      typeof value.code === 'string' ? `code=${value.code}` : null,
      typeof value.status === 'number' ? `status=${value.status}` : null,
      typeof value.details === 'string' && value.details ? value.details : null,
      typeof value.hint === 'string' && value.hint ? `hint=${value.hint}` : null,
    ].filter(Boolean)

    return new Error(`${context}: ${parts.join(' | ')}`)
  }

  return new Error(`${context}: Unknown error`)
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

function addWeeks(datetime: string, weeks: number): string {
  const date = new Date(datetime)
  date.setDate(date.getDate() + weeks * 7)
  return date.toISOString()
}

function getNormalizedAddress(data: Record<string, unknown>): string | null {
  const address = data.address
  if (typeof address !== 'string') return null
  const normalized = address.trim()
  return normalized.length > 0 ? normalized : null
}

async function persistSavedAddress(
  supabase: Awaited<ReturnType<typeof getSupabaseClient>>,
  data: Record<string, unknown>
) {
  const shouldSave = Boolean(data.save_address)
  const address = getNormalizedAddress(data)

  if (!shouldSave || !address) return

  const { error } = await supabase
    .from('saved_addresses')
    .upsert({ address }, { onConflict: 'address' })

  if (error) {
    const details =
      typeof error === 'object' && error
        ? {
            code: 'code' in error ? error.code : undefined,
            message: 'message' in error ? error.message : undefined,
          }
        : {}

    // Don't block session create/update if the optional saved_addresses table
    // hasn't been migrated yet.
    if (details.code === 'PGRST205' || details.code === '42P01') return

    throw toError(error, 'saveAddress(saved_addresses)')
  }
}

function buildSessionCreatePayload(data: Record<string, unknown>): Record<string, unknown>[] {
  const repeatWeekly = Boolean(data.repeat_weekly)
  const repeatCount = Math.max(1, Number(data.repeat_count ?? 1))
  const count = repeatWeekly ? repeatCount : 1
  const capacity = Number(data.capacity)
  const datetime = String(data.datetime)
  const normalizedAddress = getNormalizedAddress(data)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { repeat_weekly, repeat_count, save_address, saved_address, ...rest } = data

  return Array.from({ length: count }, (_, index) => ({
    ...rest,
    address: normalizedAddress,
    datetime: addWeeks(datetime, index),
    capacity,
    spots_remaining: capacity,
  }))
}

function buildCreatePayload(
  resource: string,
  data: Record<string, unknown>
): Record<string, unknown> | Record<string, unknown>[] {
  if (resource === 'sessions') return buildSessionCreatePayload(data)
  return data
}

function buildUpdatePayload(resource: string, data: Record<string, unknown>): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, ...rest } = data
  if (resource === 'sessions') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { spots_remaining, save_address, saved_address, ...sessionRest } = rest
    return {
      ...sessionRest,
      address: getNormalizedAddress(rest),
    }
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
    if (error) throw toError(error, `getList(${resource})`)
    return { data: flattenJoins(resource, (data as unknown as RaRecord[]) ?? []), total: count ?? 0 }
  },

  getOne: async (resource: string, params: { id: string | number }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from(resource)
      .select(buildSelect(resource))
      .eq('id', params.id)
      .single()
    if (error) throw toError(error, `getOne(${resource})`)
    return { data: flattenJoins(resource, [data as unknown as RaRecord])[0] }
  },

  getMany: async (resource: string, params: { ids: (string | number)[] }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from(resource)
      .select(buildSelect(resource))
      .in('id', params.ids)
    if (error) throw toError(error, `getMany(${resource})`)
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
    if (error) throw toError(error, `getManyReference(${resource})`)
    return { data: flattenJoins(resource, (data as unknown as RaRecord[]) ?? []), total: count ?? 0 }
  },

  create: async (resource: string, params: { data: Record<string, unknown> }) => {
    const supabase = await getSupabaseClient()
    if (resource === 'sessions') {
      await persistSavedAddress(supabase, params.data)
    }
    const payload = buildCreatePayload(resource, params.data)
    const query = supabase.from(resource).insert(payload).select()
    const { data, error } = await query
    if (error) throw toError(error, `create(${resource})`)
    const rows = (Array.isArray(data) ? data : [data]).filter(Boolean) as unknown as RaRecord[]
    return { data: rows[0] }
  },

  update: async (resource: string, params: { id: string | number; data: Record<string, unknown> }) => {
    const supabase = await getSupabaseClient()
    if (resource === 'sessions') {
      await persistSavedAddress(supabase, params.data)
    }
    const payload = buildUpdatePayload(resource, params.data)
    const { data, error } = await supabase.from(resource).update(payload).eq('id', params.id).select().single()
    if (error) throw toError(error, `update(${resource})`)
    return { data: data as unknown as RaRecord }
  },

  updateMany: async (resource: string, params: { ids: (string | number)[]; data: Record<string, unknown> }) => {
    const supabase = await getSupabaseClient()
    const payload = buildUpdatePayload(resource, params.data)
    const { error } = await supabase.from(resource).update(payload).in('id', params.ids)
    if (error) throw toError(error, `updateMany(${resource})`)
    return { data: params.ids }
  },

  delete: async (resource: string, params: { id: string | number }) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.from(resource).delete().eq('id', params.id).select().single()
    if (error) throw toError(error, `delete(${resource})`)
    return { data: data as unknown as RaRecord }
  },

  deleteMany: async (resource: string, params: { ids: (string | number)[] }) => {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.from(resource).delete().in('id', params.ids)
    if (error) throw toError(error, `deleteMany(${resource})`)
    return { data: params.ids }
  },
} as unknown as DataProvider
