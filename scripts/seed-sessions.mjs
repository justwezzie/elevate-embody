import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function nextWeekday(dayOfWeek, hour, minute = 0) {
  // dayOfWeek: 0=Sun, 1=Mon, ..., 6=Sat
  const now = new Date('2026-03-25T00:00:00')
  const diff = (dayOfWeek - now.getDay() + 7) % 7
  const date = new Date(now)
  date.setDate(now.getDate() + diff)
  date.setHours(hour, minute, 0, 0)
  return date
}

function addWeeks(date, weeks) {
  const d = new Date(date)
  d.setDate(d.getDate() + weeks * 7)
  return d
}

const WEEKS = 4
const CAPACITY = 10
const PRICE_CENTS = 2000

const templates = [
  {
    title: 'Evening Yoga',
    type: 'yoga',
    description: 'A mindful evening flow to release tension and build strength. Suitable for all levels.',
    instructor_name: 'Lisa',
    dayOfWeek: 3, // Wednesday
    hour: 18,
    duration_mins: 60,
  },
  {
    title: 'Boxing',
    type: 'boxing',
    description: 'High-energy boxing session focused on technique, footwork, and conditioning.',
    instructor_name: 'Lisa',
    dayOfWeek: 4, // Thursday
    hour: 18,
    duration_mins: 60,
  },
  {
    title: 'Morning Yoga',
    type: 'yoga',
    description: 'Start your weekend right with an energising morning yoga practice.',
    instructor_name: 'Lisa',
    dayOfWeek: 6, // Saturday
    hour: 10,
    duration_mins: 60,
  },
]

const sessions = []

for (const t of templates) {
  const base = nextWeekday(t.dayOfWeek, t.hour)
  for (let w = 0; w < WEEKS; w++) {
    const dt = addWeeks(base, w)
    sessions.push({
      title: t.title,
      type: t.type,
      description: t.description,
      instructor_name: t.instructor_name,
      datetime: dt.toISOString(),
      duration_mins: t.duration_mins,
      capacity: CAPACITY,
      spots_remaining: CAPACITY,
      price_cents: PRICE_CENTS,
      is_published: true,
    })
  }
}

const { data, error } = await supabase.from('sessions').insert(sessions).select('id, title, datetime')

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

console.log(`Created ${data.length} sessions:`)
data.forEach(s => console.log(` - ${s.title} @ ${new Date(s.datetime).toLocaleString('en-GB')}`))
