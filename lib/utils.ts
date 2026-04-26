import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TaskStatus, UserRole, WorkforceApplicationStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

export function getTaskStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    OPEN: 'bg-green-100 text-green-800 border-green-200',
    ASSIGNED: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    COMPLETED: 'bg-purple-100 text-purple-800 border-purple-200',
    PAID: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

export function getApplicationStatusColor(status: WorkforceApplicationStatus): string {
  const colors: Record<WorkforceApplicationStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    guest: 'bg-gray-100 text-gray-700',
    applicant: 'bg-yellow-100 text-yellow-800',
    workforce: 'bg-blue-100 text-blue-800',
    admin: 'bg-purple-100 text-purple-800',
    super_admin: 'bg-red-100 text-red-800',
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    guest: 'Guest',
    applicant: 'Applicant',
    workforce: 'Workforce',
    admin: 'Admin',
    super_admin: 'Super Admin',
  }
  return labels[role] || role
}

export function getTaskStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    OPEN: 'Open',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    PAID: 'Paid',
  }
  return labels[status] || status
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Skill presets for workforce application
export const SKILL_OPTIONS = [
  'Driving',
  'Heavy Lifting',
  'Cleaning',
  'Cooking',
  'Electrical',
  'Plumbing',
  'Carpentry',
  'IT Support',
  'Event Management',
  'Security',
  'Customer Service',
  'Data Entry',
  'Teaching',
  'Photography',
  'Video Editing',
  'Social Media',
  'Accounting',
  'Welding',
  'Painting',
  'Landscaping',
]

export const TASK_CATEGORIES = [
  'Delivery',
  'Cleaning',
  'Moving',
  'Tech Support',
  'Event Staff',
  'Construction',
  'Gardening',
  'Security',
  'Catering',
  'Admin',
  'Other',
] as const
