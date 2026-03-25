export const dynamic = 'force-dynamic'

import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { sendBookingCancellation } from '@/lib/resend/client'
import type { BookingWithRelations } from '@/types'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const supabase = createServiceClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, users!inner(clerk_id, email, full_name), sessions(*)')
    .eq('id', id)
    .single()

  if (!booking) return Response.json({ error: 'Not found' }, { status: 404 })
  if (booking.users.clerk_id !== userId) return new Response('Forbidden', { status: 403 })
  if (booking.status !== 'confirmed') {
    return Response.json({ error: 'Booking is not cancellable' }, { status: 400 })
  }

  const sessionDatetime = new Date(booking.sessions.datetime)
  const hoursUntilSession = (sessionDatetime.getTime() - Date.now()) / (1000 * 60 * 60)

  if (hoursUntilSession < 48) {
    return Response.json(
      { error: 'Cancellations must be made at least 48 hours before the session.' },
      { status: 422 }
    )
  }

  if (booking.stripe_payment_intent_id) {
    await stripe.refunds.create({ payment_intent: booking.stripe_payment_intent_id })
  }

  await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
  await supabase.rpc('restore_spot', { session_id: booking.session_id })

  await sendBookingCancellation(booking as BookingWithRelations)

  return Response.json({ success: true })
}
