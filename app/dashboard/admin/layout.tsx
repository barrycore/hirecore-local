import { ClipboardList, LayoutDashboard, UserCheck, Users } from 'lucide-react'
import AdminLayoutClient from './layout-client'

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/dashboard/admin/applications', label: 'Applications', icon: UserCheck },
  { href: '/dashboard/admin/workforce', label: 'Workforce', icon: Users },
]

const demoAdminProfile = {
  role: 'admin',
  full_name: 'Kojo Boateng',
  email: 'ops@hirecore.local',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutClient navItems={adminNavItems} profile={demoAdminProfile} dashboardType="admin">
      {children}
    </AdminLayoutClient>
  )
}
