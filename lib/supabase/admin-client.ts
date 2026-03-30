import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client authenticated with a Clerk JWT.
 * Uses the anon key so all queries go through RLS — the Clerk JWT
 * identifies the user and grants admin-level access via RLS policies.
 */
export function createAdminClient(clerkToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  )
}
