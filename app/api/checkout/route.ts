export const dynamic = 'force-dynamic'

import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe/client'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { sessionId } = await req.json()
  if (!sessionId) return Response.json({ error: 'sessionId required' }, { status: 400 })

  const supabase = createServiceClient()

  const { data: yogaSession } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('is_published', true)
    .single()

  if (!yogaSession) {
    return Response.json({ error: 'Session not found' }, { status: 404 })
  }
  if (yogaSession.spots_remaining < 1) {
    return Response.json({ error: 'Session is fully booked' }, { status: 409 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('clerk_id', userId)
    .single()

  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  const { data: booking, error } = await supabase
    .from('bookings')
    .upsert(
      { user_id: user.id, session_id: sessionId, status: 'pending' },
      { onConflict: 'user_id,session_id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: yogaSession.price_cents,
          product_data: { name: yogaSession.title },
        },
        quantity: 1,
      },
    ],
    metadata: {
      booking_id: booking.id,
      session_id: sessionId,
      user_id: user.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?booking_id=${booking.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel?booking_id=${booking.id}`,
  })

  await supabase
    .from('bookings')
    .update({ stripe_checkout_session_id: checkoutSession.id })
    .eq('id', booking.id)

  return Response.json({ url: checkoutSession.url })
}
