"use client"

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Tag, Trash2, Eye, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import EmptyState from '@/components/shared/empty-state'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { cn, formatCurrency, formatRelativeDate, getTaskStatusColor, getTaskStatusLabel, TASK_CATEGORIES } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'

const ALL_STATUSES: TaskStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'PAID']

interface AdminTasksClientProps {
  initialTasks: any[]
}

export default function AdminTasksClient({ initialTasks }: AdminTasksClientProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const filtered = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus)

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setUpdatingId(taskId)
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      toast({ title: 'Status updated', description: `Task status changed to ${getTaskStatusLabel(newStatus)}.` })
    } catch {
      toast({ variant: 'destructive', title: 'Update failed' })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)
      if (error) throw error
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast({ title: 'Task deleted' })
    } catch {
      toast({ variant: 'destructive', title: 'Delete failed' })
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...ALL_STATUSES] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filterStatus === status
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            {status === 'all' ? 'All' : getTaskStatusLabel(status)}
            <span className="ml-1.5 opacity-60">
              {status === 'all' ? tasks.length : tasks.filter(t => t.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Create your first task to get started."
          action={{ label: 'Create Task', href: '/dashboard/admin/tasks/new' }}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{task.title}</h3>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", getTaskStatusColor(task.status))}>
                      {getTaskStatusLabel(task.status)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.location}</span>
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{task.category}</span>
                    <span>{formatRelativeDate(task.created_at)}</span>
                    {task.task_applications?.[0]?.count > 0 && (
                      <span className="text-primary font-medium">
                        {task.task_applications[0].count} applicant{task.task_applications[0].count !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-base font-bold">{formatCurrency(task.pay)}</span>
                  <div className="flex items-center gap-1">
                    <Select
                      value={task.status}
                      onValueChange={(val) => handleStatusChange(task.id, val as TaskStatus)}
                      disabled={updatingId === task.id}
                    >
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_STATUSES.map(s => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {getTaskStatusLabel(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/tasks/${task.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/dashboard/admin/tasks/${task.id}/edit`}><Edit className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
