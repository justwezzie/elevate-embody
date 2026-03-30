'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const redirectTo = searchParams.get('redirect_url') ?? '/dashboard'
  const supabase = createClient()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          toast.error(error.message)
          return
        }

        router.push(redirectTo)
        router.refresh()
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.session) {
        router.push(redirectTo)
        router.refresh()
        return
      }

      setMessage('Account created. Check your email to confirm your account before signing in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-bold text-primary">
          {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === 'sign-in'
            ? 'Sign in to manage bookings and access the admin area.'
            : 'Create an account to book sessions and manage your classes.'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === 'sign-up' && (
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </div>

        {message && (
          <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
            {message}
          </p>
        )}

        <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
          {isSubmitting
            ? mode === 'sign-in'
              ? 'Signing in...'
              : 'Creating account...'
            : mode === 'sign-in'
              ? 'Sign in'
              : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === 'sign-in' ? 'Need an account?' : 'Already have an account?'}{' '}
        <Link
          href={
            mode === 'sign-in'
              ? `/sign-up?redirect_url=${encodeURIComponent(redirectTo)}`
              : `/sign-in?redirect_url=${encodeURIComponent(redirectTo)}`
          }
          className="text-primary underline underline-offset-2"
        >
          {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </div>
  )
}
