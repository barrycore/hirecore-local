import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import AdminTasksClient from './tasks-client'

export default async function AdminTasksPage() {
  const supabase = createClient()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, task_applications(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">Create and manage all tasks</p>
        </div>
        <Button variant="brand" size="sm" asChild>
          <Link href="/dashboard/admin/tasks/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <AdminTasksClient initialTasks={tasks || []} />
    </div>
  )
}
