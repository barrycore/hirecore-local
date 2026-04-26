import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditTaskClient from './edit-task-client'

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: task, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !task) notFound()

  return <EditTaskClient task={task} />
}
