import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TaskDetailAdminClient from './task-detail-client'

export default async function AdminTaskDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!task) notFound()

  const { data: applications } = await supabase
    .from('task_applications')
    .select('*, users(id, email, full_name)')
    .eq('task_id', params.id)
    .order('created_at', { ascending: false })

  const { data: assignment } = await supabase
    .from('task_assignments')
    .select('*, users(id, email, full_name)')
    .eq('task_id', params.id)
    .single()

  return (
    <TaskDetailAdminClient
      task={task}
      applications={applications || []}
      assignment={assignment}
    />
  )
}
