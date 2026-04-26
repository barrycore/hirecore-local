import TaskCard from '@/components/shared/task-card'
import EmptyState from '@/components/shared/empty-state'
import { TASK_CATEGORIES } from '@/lib/utils'
import { mockTasks } from '@/lib/mock-data'

interface TasksPageProps {
  searchParams: {
    q?: string
    category?: string
    status?: string
  }
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  const q = searchParams.q?.trim().toLowerCase() ?? ''
  const category = searchParams.category ?? 'all'
  const status = searchParams.status ?? 'OPEN'

  const tasks = mockTasks.filter((task) => {
    const statusMatch = status === 'all' ? true : task.status === status
    const categoryMatch = category === 'all' ? true : task.category === category
    const queryMatch =
      !q ||
      [task.title, task.description, task.location, task.category].some((entry) =>
        entry.toLowerCase().includes(q)
      )

    return statusMatch && categoryMatch && queryMatch
  })

  return (
    <div className="min-h-screen px-6 pb-16 pt-32 text-white">
      <section className="mx-auto w-full max-w-7xl space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_-55px_rgba(114,96,255,.8)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-violet-200/90">Task Marketplace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Find premium, verified opportunities</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65 md:text-base">
            Explore curated local work with transparent pay, professional workflows, and trusted client briefs.
          </p>

          <form className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <input
              name="q"
              defaultValue={searchParams.q}
              placeholder="Search title, location, or category"
              className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
            />

            <select
              name="category"
              defaultValue={category}
              className="h-12 rounded-xl border border-white/10 bg-white/5 px-3 text-sm focus:border-violet-400 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {TASK_CATEGORIES.map((item) => (
                <option key={item} value={item} className="text-black">
                  {item}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={status}
              className="h-12 rounded-xl border border-white/10 bg-white/5 px-3 text-sm focus:border-violet-400 focus:outline-none"
            >
              <option value="OPEN">Open Now</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAID">Paid</option>
              <option value="all">All Statuses</option>
            </select>

            <button className="h-12 rounded-xl bg-violet-500 px-6 text-sm font-semibold transition hover:bg-violet-400">Apply Filters</button>
          </form>
        </div>

        {tasks.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <EmptyState title="No matching tasks" description="Try a broader search or clear some filters." />
        )}
      </section>
    </div>
  )
}
