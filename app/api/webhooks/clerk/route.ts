export const dynamic = 'force-dynamic'

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import type { WebhookEvent } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) return new Response('Missing webhook secret', { status: 500 })

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)
  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses[0]?.email_address

    if (!email) return new Response('No email', { status: 400 })

    await supabase.from('users').upsert(
      {
        clerk_id: id,
        email,
        full_name: [first_name, last_name].filter(Boolean).join(' ') || null,
        avatar_url: image_url || null,
      },
      { onConflict: 'clerk_id' }
    )
  }

  if (event.type === 'user.deleted' && event.data.id) {
    await supabase.from('users').delete().eq('clerk_id', event.data.id)
  }

  return new Response('OK', { status: 200 })
}
