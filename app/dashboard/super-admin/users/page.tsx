import { createClient } from '@/lib/supabase/server'
import UsersClient from './users-client'

export default async function UsersPage() {
  const supabase = createClient()

  const { data: users } = await supabase
    .from('users')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
        <p className="text-sm text-muted-foreground">View and manage all platform users</p>
      </div>
      <UsersClient initialUsers={users || []} />
    </div>
  )
}
