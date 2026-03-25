import { requireAdmin } from '@/lib/clerk/roles'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  const body = await req.json()
  const { title, type, description, instructor_name, datetime, duration_mins, capacity, price_cents, is_published } = body

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      title,
      type,
      description: description || null,
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
  return Response.json({ session: data }, { status: 201 })
}
