"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { TASK_CATEGORIES } from '@/lib/utils'
import type { TaskCategory } from '@/types'

interface FormState {
  title: string
  description: string
  pay: string
  location: string
  category: TaskCategory | ''
}

export default function NewTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    pay: '',
    location: '',
    category: '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const supabase = createClient()

  const validate = () => {
    const newErrors: Partial<FormState> = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.pay || isNaN(Number(form.pay)) || Number(form.pay) <= 0) newErrors.pay = 'Enter a valid pay amount'
    if (!form.location.trim()) newErrors.location = 'Location is required'
    if (!form.category) newErrors.category = 'Category is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: form.title,
          description: form.description,
          pay: Number(form.pay),
          location: form.location,
          category: form.category,
          status: 'OPEN',
          created_by: user.id,
        })
        .select('id')
        .single()

      if (error) throw error

      toast({ title: 'Task created!', description: 'The task is now live and visible to workers.' })
      router.push('/dashboard/admin/tasks')
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Failed to create task', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <Link
        href="/dashboard/admin/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Task</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details for the new task listing.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Office Cleaning — Accra Central"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              error={errors.title}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail — what needs to be done, any requirements, time commitment, etc."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={5}
              error={errors.description}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pay">Pay (GHS) *</Label>
              <Input
                id="pay"
                type="number"
                placeholder="150"
                min="1"
                step="0.01"
                value={form.pay}
                onChange={e => setForm(p => ({ ...p, pay: e.target.value }))}
                error={errors.pay}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={val => setForm(p => ({ ...p, category: val as TaskCategory }))}
              >
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g. Accra, Osu"
              value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              error={errors.location}
            />
          </div>

          <div className="flex gap-3 pt-2 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/admin/tasks">Cancel</Link>
            </Button>
            <Button type="submit" variant="brand" loading={loading}>
              Publish Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
