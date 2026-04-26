// ============================================
// Core Database Types
// ============================================

export type UserRole = 'guest' | 'applicant' | 'workforce' | 'admin' | 'super_admin'

export type WorkforceApplicationStatus = 'pending' | 'approved' | 'rejected'

export type TaskStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID'

export type TaskApplicationStatus = 'pending' | 'accepted' | 'rejected'

export type TaskCategory =
  | 'Delivery'
  | 'Cleaning'
  | 'Moving'
  | 'Tech Support'
  | 'Event Staff'
  | 'Construction'
  | 'Gardening'
  | 'Security'
  | 'Catering'
  | 'Admin'
  | 'Other'

// ============================================
// Database Row Types
// ============================================

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  full_name?: string
  avatar_url?: string
}

export interface WorkforceApplication {
  id: string
  user_id: string
  full_name: string
  phone: string
  location: string
  skills: string[]
  notes?: string
  status: WorkforceApplicationStatus
  created_at: string
  updated_at?: string
  // Joined
  users?: User
}

export interface Task {
  id: string
  title: string
  description: string
  pay: number
  location: string
  category: TaskCategory
  status: TaskStatus
  created_by: string
  created_at: string
  updated_at?: string
  // Joined
  users?: User
  task_applications?: TaskApplication[]
  task_assignments?: TaskAssignment[]
}

export interface TaskApplication {
  id: string
  task_id: string
  user_id: string
  status: TaskApplicationStatus
  created_at: string
  // Joined
  tasks?: Task
  users?: User
}

export interface TaskAssignment {
  id: string
  task_id: string
  user_id: string
  assigned_at: string
  // Joined
  tasks?: Task
  users?: User
}

// ============================================
// Form Types
// ============================================

export interface WorkforceApplicationForm {
  full_name: string
  phone: string
  location: string
  skills: string[]
  notes?: string
}

export interface CreateTaskForm {
  title: string
  description: string
  pay: number
  location: string
  category: TaskCategory
}

export interface UpdateTaskStatusForm {
  status: TaskStatus
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
}

// ============================================
// Auth Types
// ============================================

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

// ============================================
// Dashboard Stats Types
// ============================================

export interface AdminStats {
  total_tasks: number
  open_tasks: number
  total_workforce: number
  pending_applications: number
  tasks_by_status: Record<TaskStatus, number>
}

export interface SuperAdminStats extends AdminStats {
  total_users: number
  total_admins: number
  users_by_role: Record<UserRole, number>
}
