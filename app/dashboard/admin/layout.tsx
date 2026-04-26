import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Briefcase, LayoutDashboard, Users, ClipboardList, UserCheck, LogOut, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import AdminLayoutClient from './layout-client'

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/dashboard/admin/applications', label: 'Applications', icon: UserCheck },
  { href: '/dashboard/admin/workforce', label: 'Workforce', icon: Users },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/dashboard/admin')

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/?error=unauthorized')
  }

  return (
    <AdminLayoutClient
      navItems={adminNavItems}
      profile={profile}
      dashboardType="admin"
    >
      {children}
    </AdminLayoutClient>
  )
}
