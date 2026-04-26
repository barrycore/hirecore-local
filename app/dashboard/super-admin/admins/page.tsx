import { createClient } from '@/lib/supabase/server'
import AdminsClient from './admins-client'

export default async function AdminsPage() {
  const supabase = createClient()

  const { data: admins } = await supabase
    .from('users')
    .select('id, email, full_name, role, created_at')
    .in('role', ['admin', 'super_admin'])
    .order('created_at', { ascending: false })

  const { data: potentialAdmins } = await supabase
    .from('users')
    .select('id, email, full_name, role')
    .eq('role', 'workforce')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Admins</h1>
        <p className="text-sm text-muted-foreground">Promote workforce members to admin role</p>
      </div>
      <AdminsClient initialAdmins={admins || []} potentialAdmins={potentialAdmins || []} />
    </div>
  )
}
