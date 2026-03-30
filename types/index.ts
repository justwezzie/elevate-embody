export type SessionType = 'yoga' | 'boxing'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type UserRole = 'client' | 'admin'

export interface DbUser {
  id: string
  clerk_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface DbSession {
  id: string
  title: string
  type: SessionType
  description: string | null
  address: string | null
  instructor_name: string
  datetime: string
  duration_mins: number
  capacity: number
  spots_remaining: number
  price_cents: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface DbBooking {
  id: string
  user_id: string
  session_id: string
  status: BookingStatus
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  created_at: string
  updated_at: string
}

export interface BookingWithRelations extends DbBooking {
  users: Pick<DbUser, 'email' | 'full_name' | 'clerk_id'>
  sessions: DbSession
}

export interface BookingWithSession extends DbBooking {
  sessions: DbSession
}
