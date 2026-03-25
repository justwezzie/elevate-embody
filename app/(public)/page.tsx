import { redirect } from 'next/navigation'

// The landing page at "/" is served by the root app/page.tsx.
// This redirect ensures this route group does not conflict.
export default function PublicRootRedirect() {
  redirect('/sessions')
}
