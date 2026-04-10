import { requireAdmin } from '@/lib/auth'
import { getSessionIndexNowUrls, submitIndexNowUrls } from '@/lib/indexnow'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  const { id } = await params
  const supabase = createServiceClient()
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !session) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ session })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { title, type, description, address, instructor_name, datetime, duration_mins, capacity, price_cents, is_published } = body

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('sessions')
    .update({
      title,
      type,
      description: description || null,
      address: address || null,
      instructor_name,
      datetime,
      duration_mins,
      capacity,
      price_cents,
      is_published,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  if (data?.id) {
    await submitIndexNowUrls(getSessionIndexNowUrls(data.id))
  }

  return Response.json({ session: data })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  const { id } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('sessions').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await submitIndexNowUrls(getSessionIndexNowUrls(id))

  return new Response(null, { status: 204 })
}
