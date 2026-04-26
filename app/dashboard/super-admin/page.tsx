import type { ComponentType } from 'react'
import { BarChart3, ShieldCheck, UsersRound, Workflow } from 'lucide-react'
import { mockTasks, mockUsers } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

function Metric({ label, value, icon: Icon }: { label: string; value: string | number; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between text-white/60">
        <p className="text-sm">{label}</p>
        <Icon className="h-4 w-4 text-violet-200" />
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  )
}

export default function SuperAdminPage() {
  const admins = mockUsers.filter((u) => u.role === 'admin' || u.role === 'super_admin').length
  const workforce = mockUsers.filter((u) => u.role === 'workforce').length

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-transparent p-6 lg:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200">Executive Console</p>
        <h1 className="mt-2 text-3xl font-semibold">System-wide visibility and governance</h1>
        <p className="mt-2 text-sm text-white/65">Monitor platform growth, role distribution, and operational reliability at a glance.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Users" value={mockUsers.length} icon={UsersRound} />
        <Metric label="Admin Team" value={admins} icon={ShieldCheck} />
        <Metric label="Active Workforce" value={workforce} icon={Workflow} />
        <Metric label="Total Tasks" value={mockTasks.length} icon={BarChart3} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold">Recent User Activity</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/65">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-white/75">{user.role.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-white/55">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
