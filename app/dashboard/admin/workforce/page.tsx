import { createClient } from '@/lib/supabase/server'
import WorkforceClient from './workforce-client'

export default async function WorkforcePage() {
  const supabase = createClient()

  const { data: workforce } = await supabase
    .from('users')
    .select(`
      id, email, full_name, role, created_at,
      workforce_applications(full_name, phone, location, skills, status)
    `)
    .eq('role', 'workforce')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workforce Members</h1>
        <p className="text-sm text-muted-foreground">All approved workforce members</p>
      </div>
      <WorkforceClient initialMembers={workforce || []} />
    </div>
  )
}
