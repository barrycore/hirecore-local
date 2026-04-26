"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, X, UserPlus, MapPin, Tag, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { cn, formatCurrency, formatDate, formatRelativeDate, getTaskStatusColor, getTaskStatusLabel } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'

interface Applicant {
  id: string
  status: string
  created_at: string
  users: { id: string; email: string; full_name: string | null }
}

interface Assignment {
  id: string
  assigned_at: string
  users: { id: string; email: string; full_name: string | null }
}

interface Props {
  task: Task
  applications: Applicant[]
  assignment: Assignment | null
}

const ALL_STATUSES: TaskStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'PAID']

export default function TaskDetailAdminClient({ task: initialTask, applications: initialApps, assignment: initialAssignment }: Props) {
  const [task, setTask] = useState(initialTask)
  const [applications, setApplications] = useState(initialApps)
  const [assignment, setAssignment] = useState(initialAssignment)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [processingAppId, setProcessingAppId] = useState<string | null>(null)
  const [assigning, setAssigning] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setUpdatingStatus(true)
    try {
      await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id)
      setTask(t => ({ ...t, status: newStatus }))
      toast({ title: 'Status updated' })
    } catch {
      toast({ variant: 'destructive', title: 'Update failed' })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAppDecision = async (appId: string, decision: 'accepted' | 'rejected') => {
    setProcessingAppId(appId)
    try {
      await supabase.from('task_applications').update({ status: decision }).eq('id', appId)
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: decision } : a))
      toast({ title: decision === 'accepted' ? 'Application accepted' : 'Application rejected' })
    } catch {
      toast({ variant: 'destructive', title: 'Action failed' })
    } finally {
      setProcessingAppId(null)
    }
  }

  const handleAssign = async (userId: string) => {
    setAssigning(true)
    try {
      // Remove existing assignment if any
      if (assignment) {
        await supabase.from('task_assignments').delete().eq('task_id', task.id)
      }

      const { data, error } = await supabase
        .from('task_assignments')
        .insert({ task_id: task.id, user_id: userId })
        .select('*, users(id, email, full_name)')
        .single()

      if (error) throw error

      // Update task status to ASSIGNED
      await supabase.from('tasks').update({ status: 'ASSIGNED' }).eq('id', task.id)
      setTask(t => ({ ...t, status: 'ASSIGNED' }))
      setAssignment(data)
      toast({ title: 'Worker assigned!', description: 'Task status updated to Assigned.' })
    } catch {
      toast({ variant: 'destructive', title: 'Assignment failed' })
    } finally {
      setAssigning(false)
    }
  }

  const appStatusColor = (status: string) => {
    if (status === 'accepted') return 'bg-green-100 text-green-800 border-green-200'
    if (status === 'rejected') return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <Link href="/dashboard/admin/tasks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Tasks
      </Link>

      {/* Task header */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{task.title}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{task.location}</span>
              <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{task.category}</span>
              <span className="font-semibold text-foreground">{formatCurrency(task.pay)}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{task.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Select value={task.status} onValueChange={val => handleStatusChange(val as TaskStatus)} disabled={updatingStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{getTaskStatusLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/admin/tasks/${task.id}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>

        {/* Assignment */}
        {assignment && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm">
            <UserPlus className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Assigned to:</span>
            <span className="font-medium">{assignment.users.full_name || assignment.users.email}</span>
            <span className="text-muted-foreground text-xs">· {formatDate(assignment.assigned_at)}</span>
          </div>
        )}
      </Card>

      {/* Applicants */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">
          Applicants ({applications.length})
        </h2>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {(app.users.full_name || app.users.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{app.users.full_name || app.users.email}</p>
                    <p className="text-xs text-muted-foreground">{app.users.email} · {formatRelativeDate(app.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-xs px-2.5 py-0.5 rounded-full border font-medium", appStatusColor(app.status))}>
                    {app.status}
                  </span>
                  {app.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50"
                        disabled={processingAppId === app.id}
                        onClick={() => handleAppDecision(app.id, 'accepted')}
                      >
                        <Check className="h-3 w-3 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-red-300 text-red-700 hover:bg-red-50"
                        disabled={processingAppId === app.id}
                        onClick={() => handleAppDecision(app.id, 'rejected')}
                      >
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {app.status === 'accepted' && (!assignment || assignment.users.id !== app.users.id) && (
                    <Button
                      size="sm"
                      variant="brand"
                      className="h-7 text-xs"
                      disabled={assigning}
                      onClick={() => handleAssign(app.users.id)}
                    >
                      <UserPlus className="h-3 w-3 mr-1" /> Assign
                    </Button>
                  )}
                  {assignment?.users.id === app.users.id && (
                    <span className="text-xs text-primary font-medium">✓ Assigned</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
