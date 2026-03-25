import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { BookingWithRelations } from '@/types'

interface Props {
  booking: BookingWithRelations
}

export function BookingConfirmationEmail({ booking }: Props) {
  const { sessions: session, users: user } = booking
  const sessionDate = new Date(session.datetime)
  const dateStr = sessionDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = sessionDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const price = (session.price_cents / 100).toFixed(2)

  return (
    <Html>
      <Head />
      <Preview>Your {session.title} booking is confirmed</Preview>
      <Body style={{ backgroundColor: '#F7F7F8', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px' }}>
          <Heading style={{ color: '#3A1078', marginBottom: '8px' }}>
            Booking Confirmed
          </Heading>
          <Text style={{ color: '#4E31AA', marginTop: 0 }}>
            Hi {user.full_name ?? 'there'}, your spot is reserved.
          </Text>
          <Hr />
          <Section>
            <Text style={{ margin: '8px 0' }}><strong>Session:</strong> {session.title}</Text>
            <Text style={{ margin: '8px 0' }}><strong>Type:</strong> {session.type === 'yoga' ? 'Yoga' : 'Boxing'}</Text>
            <Text style={{ margin: '8px 0' }}><strong>Date:</strong> {dateStr}</Text>
            <Text style={{ margin: '8px 0' }}><strong>Time:</strong> {timeStr}</Text>
            <Text style={{ margin: '8px 0' }}><strong>Duration:</strong> {session.duration_mins} minutes</Text>
            <Text style={{ margin: '8px 0' }}><strong>Instructor:</strong> {session.instructor_name}</Text>
            <Text style={{ margin: '8px 0' }}><strong>Amount paid:</strong> £{price}</Text>
          </Section>
          <Hr />
          <Text style={{ color: '#666', fontSize: '13px' }}>
            Cancellations must be made at least 48 hours before the session for a full refund.
            To cancel, visit your dashboard.
          </Text>
          <Text style={{ color: '#3795BD', fontSize: '13px' }}>
            Elevate + Embody
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmationEmail
