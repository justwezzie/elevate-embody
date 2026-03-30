import type { NextRequest } from 'next/server'
import { createMiddlewareAuthClient } from '@/lib/supabase/server'

export default async function proxy(req: NextRequest) {
  const { supabase, response } = createMiddlewareAuthClient(req)
  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
