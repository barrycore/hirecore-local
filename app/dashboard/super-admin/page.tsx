import { Users, ClipboardList, UserCheck, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StatCard from '@/components/shared/stat-card'
import { createClient } from '@/lib/supabase/server'
import { cn, formatDate, getRoleBadgeColor, getRoleLabel } from '@/lib/utils'
import type { UserRole } from '@/types'

export default async function SuperAdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalAdmins },
    { count: totalWorkforce },
    { count: totalTasks },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).in('role', ['admin', 'super_admin']),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'workforce'),
    supabase.from('tasks').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('id, email, full_name, role, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const roleDistribution = recentUsers
    ? Object.entries(
        recentUsers.reduce((acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      )
    : []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Super Admin</h1>
        <p className="text-sm text-muted-foreground">System-wide overview and control</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers ?? 0} icon={Users} color="blue" />
        <StatCard title="Admins" value={totalAdmins ?? 0} icon={Shield} color="purple" />
        <StatCard title="Workforce" value={totalWorkforce ?? 0} icon={UserCheck} color="green" />
        <StatCard title="Total Tasks" value={totalTasks ?? 0} icon={ClipboardList} color="default" />
      </div>

      {/* Recent users */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium text-muted-foreground py-2 pr-4">User</th>
                <th className="text-left font-medium text-muted-foreground py-2 pr-4">Role</th>
                <th className="text-left font-medium text-muted-foreground py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers?.map(user => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 pr-4">
                    <div>
                      <p className="font-medium">{user.full_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", getRoleBadgeColor(user.role as UserRole))}>
                      {getRoleLabel(user.role as UserRole)}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
