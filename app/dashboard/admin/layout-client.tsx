"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Briefcase, Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { cn, getInitials, getRoleLabel, getRoleBadgeColor } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface AdminLayoutClientProps {
  children: React.ReactNode
  navItems: NavItem[]
  profile: { role: string; full_name?: string | null; email: string }
  dashboardType: 'admin' | 'super-admin'
}

export default function AdminLayoutClient({
  children,
  navItems,
  profile,
  dashboardType,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href: string) => {
    if (href === `/dashboard/${dashboardType}`) return pathname === href
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold gradient-text">HireCore Local</p>
          <p className="text-xs text-muted-foreground capitalize">{dashboardType.replace('-', ' ')}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
            {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4 opacity-60" />}
          </Link>
        ))}

        {/* Super admin link from admin */}
        {profile.role === 'super_admin' && dashboardType === 'admin' && (
          <Link
            href="/dashboard/super-admin"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors mt-2"
          >
            <span className="h-4 w-4 shrink-0 text-center text-xs">★</span>
            Super Admin
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs gradient-brand text-white">
              {getInitials(profile.full_name || profile.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile.full_name || profile.email.split('@')[0]}</p>
            <p className={cn("text-xs rounded-full px-1.5 py-0.5 inline-block mt-0.5", getRoleBadgeColor(profile.role as any))}>
              {getRoleLabel(profile.role as any)}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-background border-r z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded gradient-brand">
              <Briefcase className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-sm gradient-text">HireCore</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
