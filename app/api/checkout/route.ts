export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { stripe } from '@/lib/stripe/client'
import { requireAppUser } from '@/lib/auth'
import { getAppUrl } from '@/lib/app-url'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    let currentUser
    try {
      currentUser = await requireAppUser()
    } catch {
      return new Response('Unauthorized', { status: 401 })
    }

    const { sessionId } = await req.json()
    if (!sessionId) return Response.json({ error: 'sessionId required' }, { status: 400 })

    const supabase = createServiceClient()
    const appUrl = getAppUrl()

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

    const { data: booking, error } = await supabase
      .from('bookings')
      .upsert(
        { user_id: currentUser.appUser.id, session_id: sessionId, status: 'pending' },
        { onConflict: 'user_id,session_id', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: currentUser.appUser.email,
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
        user_id: currentUser.appUser.id,
      },
      success_url: `${appUrl}/booking/success?booking_id=${booking.id}`,
      cancel_url: `${appUrl}/booking/cancel?booking_id=${booking.id}`,
    })

    await supabase
      .from('bookings')
      .update({ stripe_checkout_session_id: checkoutSession.id })
      .eq('id', booking.id)

    return Response.json({ url: checkoutSession.url })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Stripe checkout could not be created'
    return Response.json({ error: message }, { status: 500 })
  }
}
