import type { Task, User, WorkforceApplication, TaskApplicationStatus, TaskCategory, TaskStatus } from '@/types'

const now = Date.now()

export const mockUsers: User[] = [
  { id: 'super-1', email: 'ceo@hirecore.local', role: 'super_admin', full_name: 'Ava Mensah', created_at: new Date(now - 1000 * 60 * 60 * 24 * 210).toISOString() },
  { id: 'admin-1', email: 'ops@hirecore.local', role: 'admin', full_name: 'Kojo Boateng', created_at: new Date(now - 1000 * 60 * 60 * 24 * 130).toISOString() },
  { id: 'wf-1', email: 'worker1@hirecore.local', role: 'workforce', full_name: 'Ama Owusu', created_at: new Date(now - 1000 * 60 * 60 * 24 * 32).toISOString() },
  { id: 'wf-2', email: 'worker2@hirecore.local', role: 'workforce', full_name: 'Kofi Addo', created_at: new Date(now - 1000 * 60 * 60 * 24 * 21).toISOString() },
]

const catalog: Array<{title:string; category: TaskCategory; status: TaskStatus; location:string; pay:number; age:number}> = [
  { title: 'Emergency Plumbing Repair', category: 'Construction', status: 'OPEN', location: 'East Legon', pay: 850, age: 1 },
  { title: 'Restaurant Deep Cleaning', category: 'Cleaning', status: 'OPEN', location: 'Osu', pay: 520, age: 2 },
  { title: 'Executive Airport Pickup', category: 'Delivery', status: 'ASSIGNED', location: 'Airport Residential', pay: 420, age: 3 },
  { title: 'Office Network Setup', category: 'Tech Support', status: 'OPEN', location: 'Ridge', pay: 980, age: 4 },
  { title: 'Wedding Event Support Crew', category: 'Event Staff', status: 'IN_PROGRESS', location: 'Labone', pay: 740, age: 5 },
  { title: 'Home Garden Revamp', category: 'Gardening', status: 'OPEN', location: 'Trasacco', pay: 610, age: 6 },
  { title: 'Night Shift Security Detail', category: 'Security', status: 'COMPLETED', location: 'Cantonments', pay: 1300, age: 7 },
  { title: 'Corporate Lunch Catering', category: 'Catering', status: 'PAID', location: 'Roman Ridge', pay: 1500, age: 8 },
]

export const mockTasks: Task[] = catalog.map((row, index) => ({
  id: `task-${index + 1}`,
  title: row.title,
  description: `Professional support required for ${row.title.toLowerCase()}. Deliver quality, speed, and reliable communication throughout execution.`,
  pay: row.pay,
  location: row.location,
  category: row.category,
  status: row.status,
  created_by: 'admin-1',
  created_at: new Date(now - 1000 * 60 * 60 * 24 * row.age).toISOString(),
}))

export const mockWorkforceApplications: WorkforceApplication[] = [
  { id: 'wf-app-1', user_id: 'wf-1', full_name: 'Ama Owusu', phone: '+233 24 000 0000', location: 'Accra', skills: ['Cleaning', 'Driving'], status: 'pending', created_at: new Date(now - 1000 * 60 * 60 * 36).toISOString() },
  { id: 'wf-app-2', user_id: 'wf-2', full_name: 'Kofi Addo', phone: '+233 20 000 0000', location: 'Tema', skills: ['Tech Support'], status: 'approved', created_at: new Date(now - 1000 * 60 * 60 * 96).toISOString() },
]

export const mockTaskApplications: Array<{ id: string; task_id: string; user_id: string; status: TaskApplicationStatus; created_at: string }> = [
  { id: 'task-app-1', task_id: 'task-1', user_id: 'wf-1', status: 'pending', created_at: new Date(now - 1000 * 60 * 60 * 14).toISOString() },
  { id: 'task-app-2', task_id: 'task-2', user_id: 'wf-2', status: 'accepted', created_at: new Date(now - 1000 * 60 * 60 * 40).toISOString() },
]
