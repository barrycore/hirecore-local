import { ClipboardList, LayoutDashboard, Shield, Users } from 'lucide-react'
import AdminLayoutClient from '../admin/layout-client'

const superAdminNavItems = [
  { href: '/dashboard/super-admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/super-admin/users', label: 'All Users', icon: Users },
  { href: '/dashboard/super-admin/admins', label: 'Manage Admins', icon: Shield },
  { href: '/dashboard/admin', label: 'Admin Panel', icon: ClipboardList },
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
