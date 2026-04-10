import { cache } from 'react'
import { createAnonClient } from '@/lib/supabase/server'
import type { DbSession, SessionType } from '@/types'

export const getPublishedSessionById = cache(async (id: string): Promise<DbSession | null> => {
  const supabase = createAnonClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  return session ?? null
})

export const getPublishedSessions = cache(async (type?: SessionType): Promise<DbSession[]> => {
  const supabase = createAnonClient()

  let query = supabase
    .from('sessions')
    .select('*')
    .eq('is_published', true)
    .gte('datetime', new Date().toISOString())
    .order('datetime', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data } = await query

  return data ?? []
})

export const getSitemapSessions = cache(async (): Promise<DbSession[]> => {
  const supabase = createAnonClient()

  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  return data ?? []
})
