'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DbSession } from '@/types'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  type: z.enum(['yoga', 'boxing']),
  description: z.string().optional(),
  address: z.string().optional(),
  instructor_name: z.string().min(2, 'Instructor name is required'),
  datetime: z.string().min(1, 'Date and time are required'),
  duration_mins: z.coerce.number().min(15).max(180),
  capacity: z.coerce.number().min(1).max(100),
  price_pounds: z.coerce.number().min(0.01, 'Price must be > 0'),
  is_published: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  session?: DbSession
  onSubmit: (data: FormValues & { price_cents: number }) => Promise<void>
  isSubmitting?: boolean
}

export function SessionForm({ session, onSubmit, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as import('react-hook-form').Resolver<FormValues>,
    defaultValues: session
      ? {
          title: session.title,
          type: session.type,
          description: session.description ?? '',
          address: session.address ?? '',
          instructor_name: session.instructor_name,
          datetime: new Date(session.datetime).toISOString().slice(0, 16),
          duration_mins: session.duration_mins,
          capacity: session.capacity,
          price_pounds: session.price_cents / 100,
          is_published: session.is_published,
        }
      : {
          type: 'yoga',
          duration_mins: 60,
          capacity: 10,
          is_published: true,
        },
  })
  const sessionType = useWatch({ control, name: 'type' })

  async function handleFormSubmit(values: FormValues) {
    await onSubmit({ ...values, price_cents: Math.round(values.price_pounds * 100) })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="title">Session title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Type</Label>
        <Select
          value={sessionType}
          onValueChange={(v) => setValue('type', v as 'yoga' | 'boxing')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yoga">Yoga</SelectItem>
            <SelectItem value="boxing">Boxing</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-destructive text-xs">{errors.type.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="instructor_name">Instructor</Label>
        <Input id="instructor_name" {...register('instructor_name')} />
        {errors.instructor_name && (
          <p className="text-destructive text-xs">{errors.instructor_name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="datetime">Date &amp; time</Label>
        <Input id="datetime" type="datetime-local" {...register('datetime')} />
        {errors.datetime && <p className="text-destructive text-xs">{errors.datetime.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="duration_mins">Duration (mins)</Label>
          <Input id="duration_mins" type="number" {...register('duration_mins')} />
          {errors.duration_mins && (
            <p className="text-destructive text-xs">{errors.duration_mins.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" type="number" {...register('capacity')} />
          {errors.capacity && (
            <p className="text-destructive text-xs">{errors.capacity.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="price_pounds">Price (£)</Label>
        <Input id="price_pounds" type="number" step="0.01" {...register('price_pounds')} />
        {errors.price_pounds && (
          <p className="text-destructive text-xs">{errors.price_pounds.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={3} {...register('description')} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register('address')} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_published"
          type="checkbox"
          {...register('is_published')}
          className="h-4 w-4 accent-primary"
        />
        <Label htmlFor="is_published">Published (visible to clients)</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : session ? 'Update session' : 'Create session'}
      </Button>
    </form>
  )
}
