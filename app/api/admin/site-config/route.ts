import { requireAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  const body = await req.json()
  const values = body?.values as Record<string, string | null> | undefined

  if (!values || typeof values !== 'object') {
    return Response.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const rows = Object.entries(values).map(([key, value]) => ({ key, value }))
  const supabase = createServiceClient()
  for (const row of rows) {
    const { error } = await supabase
      .from('site_config')
      .update({ value: row.value })
      .eq('key', row.key)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
  }

  return Response.json({ ok: true })
}
