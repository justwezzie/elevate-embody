import { Resend } from 'resend'
import { BookingConfirmationEmail } from '@/emails/BookingConfirmation'
import { BookingCancellationEmail } from '@/emails/BookingCancellation'
import type { BookingWithRelations } from '@/types'

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM_EMAIL = 'Elevate + Embody <bookings@elevateandembody.com>'

export async function sendBookingConfirmation(booking: BookingWithRelations): Promise<void> {
  const resend = getResend()
  await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.users.email,
    subject: `Booking Confirmed: ${booking.sessions.title}`,
    react: BookingConfirmationEmail({ booking }),
  })
}

export async function sendBookingCancellation(booking: BookingWithRelations): Promise<void> {
  const resend = getResend()
  await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.users.email,
    subject: `Booking Cancelled: ${booking.sessions.title}`,
    react: BookingCancellationEmail({ booking }),
  })
}
