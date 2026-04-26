import { Users, ClipboardList, UserCheck, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import StatCard from '@/components/shared/stat-card'
import { createClient } from '@/lib/supabase/server'
import { cn, formatCurrency, formatRelativeDate, getTaskStatusColor, getTaskStatusLabel, getApplicationStatusColor } from '@/lib/utils'
import type { Task, WorkforceApplication } from '@/types'

export default async function AdminDashboardPage() {
  const supabase = createClient()

  const [
    { count: totalTasks },
    { count: openTasks },
    { count: totalWorkforce },
    { count: pendingApps },
    { data: recentTasks },
    { data: recentApplications },
  ] = await Promise.all([
    supabase.from('tasks').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'OPEN'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'workforce'),
    supabase.from('workforce_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('tasks').select('id, title, pay, status, location, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('workforce_applications').select('id, full_name, location, status, created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your workforce and tasks</p>
        </div>
        <Button variant="brand" size="sm" asChild>
          <Link href="/dashboard/admin/tasks/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks ?? 0}
          icon={ClipboardList}
          color="blue"
          subtitle="All time"
        />
        <StatCard
          title="Open Tasks"
          value={openTasks ?? 0}
          icon={TrendingUp}
          color="green"
          subtitle="Available now"
        />
        <StatCard
          title="Workforce Members"
          value={totalWorkforce ?? 0}
          icon={Users}
          color="purple"
          subtitle="Approved workers"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingApps ?? 0}
          icon={UserCheck}
          color={pendingApps && pendingApps > 0 ? 'yellow' : 'default'}
          subtitle="Awaiting approval"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Tasks</h2>
            <Link href="/dashboard/admin/tasks" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentTasks && recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task: any) => (
                <Link
                  key={task.id}
                  href={`/dashboard/admin/tasks/${task.id}`}
                  className="flex items-center justify-between rounded-lg p-2.5 hover:bg-muted transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeDate(task.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-sm font-semibold">{formatCurrency(task.pay)}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", getTaskStatusColor(task.status))}>
                      {getTaskStatusLabel(task.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No tasks yet.</p>
          )}
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/dashboard/admin/tasks/new">Create First Task</Link>
            </Button>
          </div>
        </Card>

        {/* Pending Applications */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Pending Applications</h2>
            <Link href="/dashboard/admin/applications" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map((app: any) => (
                <Link
                  key={app.id}
                  href={`/dashboard/admin/applications`}
                  className="flex items-center justify-between rounded-lg p-2.5 hover:bg-muted transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{app.full_name}</p>
                    <p className="text-xs text-muted-foreground">{app.location} · {formatRelativeDate(app.created_at)}</p>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ml-2", getApplicationStatusColor(app.status))}>
                    {app.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No pending applications.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
