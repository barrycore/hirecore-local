import Link from 'next/link'
import { MapPin, Tag, Clock, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn, formatCurrency, formatRelativeDate, getTaskStatusColor, getTaskStatusLabel } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  className?: string
}

const categoryColors: Record<string, string> = {
  Delivery: 'bg-sky-500/15 text-sky-100 border-sky-300/30',
  Cleaning: 'bg-teal-500/15 text-teal-100 border-teal-300/30',
  Moving: 'bg-orange-500/15 text-orange-100 border-orange-300/30',
  'Tech Support': 'bg-violet-500/15 text-violet-100 border-violet-300/30',
  'Event Staff': 'bg-fuchsia-500/15 text-fuchsia-100 border-fuchsia-300/30',
  Construction: 'bg-amber-500/15 text-amber-100 border-amber-300/30',
  Gardening: 'bg-emerald-500/15 text-emerald-100 border-emerald-300/30',
  Security: 'bg-slate-500/15 text-slate-100 border-slate-300/30',
  Catering: 'bg-rose-500/15 text-rose-100 border-rose-300/30',
  Admin: 'bg-indigo-500/15 text-indigo-100 border-indigo-300/30',
  Other: 'bg-zinc-500/15 text-zinc-100 border-zinc-300/30',
}

export default function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`} className="block [perspective:1400px]">
      <Card
        className={cn(
          'group premium-card relative overflow-hidden rounded-3xl border border-white/10 p-5 text-white',
          'bg-gradient-to-br from-[#1a1630] via-[#171325] to-[#0f0d17]',
          'shadow-[0_20px_40px_-25px_rgba(87,74,255,0.8),0_4px_20px_rgba(10,9,17,0.45)]',
          'transition duration-500 ease-out [transform-style:preserve-3d] hover:-translate-y-1 hover:[transform:rotateX(5deg)_rotateY(-6deg)]',
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,116,255,0.35),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.24),transparent_38%)] opacity-35" />

        <div className="relative mb-4 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 flex-1 text-base font-semibold tracking-tight text-white/95 group-hover:text-white">
            {task.title}
          </h3>
          <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-semibold', getTaskStatusColor(task.status))}>
            {getTaskStatusLabel(task.status)}
          </span>
        </div>

        <div className="relative mb-4 flex items-center justify-between">
          <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium', categoryColors[task.category] || categoryColors.Other)}>
            <Tag className="h-3 w-3" />
            {task.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-white/60">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            Premium match
          </span>
        </div>

        <div className="relative space-y-2.5 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-200" />
            <span className="truncate">{task.location}</span>
          </div>
          {task.created_at && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-violet-200" />
              <span>{formatRelativeDate(task.created_at)}</span>
            </div>
          )}
        </div>

        <div className="relative mt-5 flex items-end justify-between">
          <p className="text-2xl font-bold tracking-tight gradient-text">{formatCurrency(task.pay)}</p>
          <span className="text-xs font-semibold text-violet-200 transition group-hover:text-white">View details →</span>
        </div>
      </Card>
    </Link>
  )
}

export function TaskCardSkeleton() {
  return (
    <Card className="premium-card rounded-3xl p-5 space-y-3 bg-[#141124] text-white/80">
      <div className="flex justify-between">
        <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
        <div className="h-5 w-16 bg-white/15 rounded-full animate-pulse" />
      </div>
      <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
      <div className="space-y-1.5">
        <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
    </Card>
  )
}
