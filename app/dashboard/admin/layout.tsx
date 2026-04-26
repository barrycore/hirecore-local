import AdminLayoutClient from './layout-client'

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Overview', iconName: 'layout' as const },
  { href: '/dashboard/admin/tasks', label: 'Tasks', iconName: 'tasks' as const },
  { href: '/dashboard/admin/applications', label: 'Applications', iconName: 'applications' as const },
  { href: '/dashboard/admin/workforce', label: 'Workforce', iconName: 'users' as const },
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
