import Link from 'next/link'
import { MapPin, DollarSign, Tag, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatRelativeDate, getTaskStatusColor, getTaskStatusLabel } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  className?: string
}

const categoryColors: Record<string, string> = {
  Delivery: 'bg-blue-50 text-blue-700',
  Cleaning: 'bg-teal-50 text-teal-700',
  Moving: 'bg-orange-50 text-orange-700',
  'Tech Support': 'bg-purple-50 text-purple-700',
  'Event Staff': 'bg-pink-50 text-pink-700',
  Construction: 'bg-amber-50 text-amber-700',
  Gardening: 'bg-green-50 text-green-700',
  Security: 'bg-slate-50 text-slate-700',
  Catering: 'bg-red-50 text-red-700',
  Admin: 'bg-indigo-50 text-indigo-700',
  Other: 'bg-gray-50 text-gray-700',
}

export default function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`} className="block">
      <Card className={cn(
        "group p-5 card-hover cursor-pointer border-border/60",
        "hover:border-primary/30",
        className
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {task.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full border",
              getTaskStatusColor(task.status)
            )}>
              {getTaskStatusLabel(task.status)}
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="mb-3">
          <span className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
            categoryColors[task.category] || categoryColors.Other
          )}>
            <Tag className="h-3 w-3" />
            {task.category}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{task.location}</span>
          </div>
          {task.created_at && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{formatRelativeDate(task.created_at)}</span>
            </div>
          )}
        </div>

        {/* Pay */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">
              {formatCurrency(task.pay)}
            </span>
          </div>
          <span className="text-xs text-primary font-medium group-hover:underline">
            View details →
          </span>
        </div>
      </Card>
    </Link>
  )
}

export function TaskCardSkeleton() {
  return (
    <Card className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
      </div>
      <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
      <div className="space-y-1.5">
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-7 w-24 bg-muted rounded animate-pulse" />
    </Card>
  )
}
