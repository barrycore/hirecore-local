import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Tag, Clock, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import TaskApplyButton from './apply-button'
import { createClient } from '@/lib/supabase/server'
import { cn, formatCurrency, formatDate, getTaskStatusColor, getTaskStatusLabel } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskDetailPageProps {
  params: { id: string }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const supabase = createClient()

  const { data: task, error } = await supabase
    .from('tasks')
    .select('*, users(email, full_name)')
    .eq('id', params.id)
    .single<Task>()

  if (error || !task) notFound()

  // Get current user and their status
  const { data: { user: authUser } } = await supabase.auth.getUser()

  let userRole: string | null = null
  let hasApplied = false

  if (authUser) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', authUser.id)
      .single()
    userRole = profile?.role || null

    if (userRole === 'workforce') {
      const { data: existing } = await supabase
        .from('task_applications')
        .select('id')
        .eq('task_id', task.id)
        .eq('user_id', authUser.id)
        .single()
      hasApplied = !!existing
    }
  }

  const isOpen = task.status === 'OPEN'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap items-start gap-3 mb-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex-1">{task.title}</h1>
                  <span className={cn(
                    "text-sm font-semibold px-3 py-1 rounded-full border shrink-0",
                    getTaskStatusColor(task.status)
                  )}>
                    {getTaskStatusLabel(task.status)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    {task.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {task.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Posted {formatDate(task.created_at)}
                  </span>
                </div>
              </div>

              <Card className="p-6">
                <h2 className="font-semibold mb-3">Task Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {task.description.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
              </Card>

              {/* Requirements hint */}
              <Card className="p-5 bg-accent/30 border-accent">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Requirements</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      To apply for this task, you must be an approved HireCore Workforce member.
                      {!authUser && ' Please sign in or create an account first.'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Pay card */}
              <Card className="p-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Pay for this task</p>
                  <p className="text-3xl font-bold gradient-text">{formatCurrency(task.pay)}</p>
                </div>

                {isOpen ? (
                  <TaskApplyButton
                    taskId={task.id}
                    userRole={userRole}
                    isLoggedIn={!!authUser}
                    hasApplied={hasApplied}
                  />
                ) : (
                  <div className="flex items-center gap-2 justify-center p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    This task is {getTaskStatusLabel(task.status).toLowerCase()}
                  </div>
                )}
              </Card>

              {/* Task details */}
              <Card className="p-5">
                <h3 className="font-semibold text-sm mb-3">Task Details</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium mt-0.5">{task.category}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium mt-0.5">{task.location}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="mt-0.5">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", getTaskStatusColor(task.status))}>
                        {getTaskStatusLabel(task.status)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Posted</dt>
                    <dd className="font-medium mt-0.5">{formatDate(task.created_at)}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
