import Link from 'next/link'
import { SignUp } from '@clerk/nextjs'
import { X } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <Link
        href="/"
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </Link>
      <SignUp />
    </div>
  )
}
