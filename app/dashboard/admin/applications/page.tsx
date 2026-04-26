import { createClient } from '@/lib/supabase/server'
import ApplicationsClient from './applications-client'

export default async function ApplicationsPage() {
  const supabase = createClient()

  const { data: applications } = await supabase
    .from('workforce_applications')
    .select('*, users(email)')
    .order('created_at', { ascending: false })

  return <ApplicationsClient initialApplications={applications || []} />
}
