import { createAnonClient } from '@/lib/supabase/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAnonClient()

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error || !session) {
    return Response.json({ error: 'Session not found' }, { status: 404 })
  }

  return Response.json({ session })
}
