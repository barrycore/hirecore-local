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
import type { Task, TaskCategory } from '@/types'

export default function EditTaskClient({ task }: { task: Task }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    pay: String(task.pay),
    location: task.location,
    category: task.category as TaskCategory,
  })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || !form.pay || !form.location || !form.category) {
      toast({ variant: 'destructive', title: 'Please fill in all required fields.' })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: form.title,
          description: form.description,
          pay: Number(form.pay),
          location: form.location,
          category: form.category,
        })
        .eq('id', task.id)

      if (error) throw error

      toast({ title: 'Task updated!' })
      router.push(`/dashboard/admin/tasks/${task.id}`)
      router.refresh()
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Update failed', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <Link
        href={`/dashboard/admin/tasks/${task.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Task
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Task</h1>
        <p className="text-sm text-muted-foreground mt-1">Update the details for this task listing.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pay">Pay (GHS) *</Label>
              <Input
                id="pay"
                type="number"
                min="1"
                step="0.01"
                value={form.pay}
                onChange={e => setForm(p => ({ ...p, pay: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={val => setForm(p => ({ ...p, category: val as TaskCategory }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              required
            />
          </div>

          <div className="flex gap-3 pt-2 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href={`/dashboard/admin/tasks/${task.id}`}>Cancel</Link>
            </Button>
            <Button type="submit" variant="brand" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
