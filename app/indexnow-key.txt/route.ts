import { getIndexNowKey } from '@/lib/indexnow'

export const dynamic = 'force-static'

export async function GET() {
  const key = getIndexNowKey()

  if (!key) {
    return new Response('IndexNow key not configured', { status: 404 })
  }

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
