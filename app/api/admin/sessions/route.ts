import { requireAdmin } from '@/lib/auth'
import { getSessionIndexNowUrls, submitIndexNowUrls } from '@/lib/indexnow'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  const body = await req.json()
  const { title, type, description, address, instructor_name, datetime, duration_mins, capacity, price_cents, is_published } = body

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      title,
      type,
      description: description || null,
      address: address || null,
      instructor_name,
      datetime,
      duration_mins,
      capacity,
      spots_remaining: capacity,
      price_cents,
      is_published,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  if (data?.id) {
    await submitIndexNowUrls(getSessionIndexNowUrls(data.id))
  }

  return Response.json({ session: data }, { status: 201 })
}
