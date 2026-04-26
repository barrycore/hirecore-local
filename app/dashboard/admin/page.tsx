import type { ComponentType } from 'react'
import Link from 'next/link'
import { Activity, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Plus, Users } from 'lucide-react'
import { mockTasks, mockUsers, mockWorkforceApplications } from '@/lib/mock-data'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'

function Stat({ label, value, helper, icon: Icon }: { label: string; value: string | number; helper: string; icon: ComponentType<{ className?: string }> }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">{label}</p>
        <Icon className="h-4 w-4 text-violet-200" />
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-white/45">{helper}</p>
    </article>
  )
}

export default function AdminDashboardPage() {
  const openTasks = mockTasks.filter((t) => t.status === 'OPEN')
  const workforceCount = mockUsers.filter((u) => u.role === 'workforce').length
  const pendingApplications = mockWorkforceApplications.filter((a) => a.status === 'pending').length

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-transparent p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Operations Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">Control center for task operations</h1>
            <p className="mt-2 text-sm text-white/65">Track jobs, workforce health, and fulfillment velocity from one place.</p>
          </div>
          <Link href="/dashboard/admin/tasks/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold hover:bg-violet-400">
            <Plus className="h-4 w-4" /> New Task
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Open Tasks" value={openTasks.length} helper="Ready for matching" icon={BriefcaseBusiness} />
        <Stat label="Total Tasks" value={mockTasks.length} helper="Across all statuses" icon={Activity} />
        <Stat label="Workforce" value={workforceCount} helper="Verified professionals" icon={Users} />
        <Stat label="Pending Reviews" value={pendingApplications} helper="Need admin action" icon={CheckCircle2} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest Task Activity</h2>
            <Link href="/dashboard/admin/tasks" className="text-xs text-violet-200 hover:text-violet-100">View all</Link>
          </div>
          <div className="space-y-3">
            {mockTasks.slice(0, 5).map((task) => (
              <Link key={task.id} href={`/dashboard/admin/tasks/${task.id}`} className="flex items-center justify-between rounded-xl border border-white/10 p-3 hover:bg-white/5">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-white/55">{task.location} · {formatRelativeDate(task.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(task.pay)}</p>
                  <p className="text-xs text-violet-200">{task.status.replace('_', ' ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Workforce Pipeline</h2>
            <Link href="/dashboard/admin/applications" className="text-xs text-violet-200 hover:text-violet-100">Review queue</Link>
          </div>
          <div className="space-y-3">
            {mockWorkforceApplications.map((application) => (
              <div key={application.id} className="rounded-xl border border-white/10 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{application.full_name}</p>
                    <p className="text-xs text-white/55">{application.location}</p>
                  </div>
                  <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-100">{application.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/60">
            <ArrowUpRight className="mr-1 inline h-3.5 w-3.5" /> Conversion rate is trending +12% week-over-week.
          </div>
        </article>
      </section>
    </div>
  )
}
