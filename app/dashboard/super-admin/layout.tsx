import AdminLayoutClient from '../admin/layout-client'

const superAdminNavItems = [
  { href: '/dashboard/super-admin', label: 'Overview', iconName: 'layout' as const },
  { href: '/dashboard/super-admin/users', label: 'All Users', iconName: 'users' as const },
  { href: '/dashboard/super-admin/admins', label: 'Manage Admins', iconName: 'shield' as const },
  { href: '/dashboard/admin', label: 'Admin Panel', iconName: 'admin' as const },
]

const demoProfile = {
  role: 'super_admin',
  full_name: 'Ava Mensah',
  email: 'ceo@hirecore.local',
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutClient navItems={superAdminNavItems} profile={demoProfile} dashboardType="super-admin">
      {children}
    </AdminLayoutClient>
  )
}
