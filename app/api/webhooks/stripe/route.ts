export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { createServiceClient } from '@/lib/supabase/server'
import { sendBookingConfirmation } from '@/lib/resend/client'
import type { BookingWithRelations } from '@/types'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) return new Response('Missing stripe-signature', { status: 400 })

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { booking_id, session_id } = session.metadata ?? {}

    if (!booking_id || !session_id) {
      return new Response('Missing metadata', { status: 400 })
    }

    const { error: rpcError } = await supabase.rpc('decrement_spots', { session_id })
    if (rpcError) {
      console.error('decrement_spots failed:', rpcError.message)
      return new Response('Failed to decrement spots', { status: 500 })
    }

    await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq('id', booking_id)

    const { data: booking } = await supabase
      .from('bookings')
      .select('*, users(email, full_name, clerk_id), sessions(*)')
      .eq('id', booking_id)
      .single()

    if (booking) {
      await sendBookingConfirmation(booking as BookingWithRelations)
    }
  }

  if (event.type === 'checkout.session.expired') {
    const { booking_id } = event.data.object.metadata ?? {}
    if (booking_id) {
      await supabase.from('bookings').delete().eq('id', booking_id).eq('status', 'pending')
    }
  }

  return new Response('OK', { status: 200 })
}
