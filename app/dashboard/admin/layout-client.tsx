"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Briefcase, ChevronRight, LogOut, Menu, Search, Sparkles, X } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  iconName: 'layout' | 'tasks' | 'applications' | 'users' | 'shield' | 'admin'
}

interface AdminLayoutClientProps {
  children: React.ReactNode
  navItems: NavItem[]
  profile: { role: string; full_name?: string | null; email: string }
  dashboardType: 'admin' | 'super-admin'
}

function SidebarSection({ navItems, pathname, onClose }: { navItems: NavItem[]; pathname: string; onClose: () => void }) {
  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        const active = item.href === pathname || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
              active
                ? 'bg-violet-500/20 text-white ring-1 ring-violet-300/30'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {active ? <ChevronRight className="h-4 w-4 text-violet-200" /> : null}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminLayoutClient({ children, navItems, profile, dashboardType }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSignOut = () => router.push('/')

  return (
    <div className="flex min-h-screen bg-[#0b0915] text-white">
      {open && <button className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar" />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#0f0d1d] p-5 transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/90 shadow-lg shadow-violet-500/30">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">HireCore</p>
              <p className="text-xs text-white/50 capitalize">{dashboardType.replace('-', ' ')} Console</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-white/10 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <SidebarSection navItems={navItems} pathname={pathname} onClose={() => setOpen(false)} />

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-wider text-violet-200">Signed in as</p>
          <p className="mt-2 text-sm font-medium">{profile.full_name || profile.email}</p>
          <p className="text-xs text-white/60">{profile.role.replace('_', ' ')}</p>
        </div>

        <button onClick={handleSignOut} className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-red-500/10 hover:text-red-200">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0915]/90 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-white/10 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex md:min-w-80">
              <Search className="h-4 w-4 text-white/40" />
              <input placeholder="Search tasks, users, applications" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"><Bell className="h-4 w-4" /></button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-500/20 px-3 py-2 text-xs font-medium text-violet-100">
                <Sparkles className="h-3.5 w-3.5" /> Live Preview Mode
              </button>
              <Avatar className="h-9 w-9 border border-white/20">
                <AvatarFallback className="bg-violet-500/70 text-xs">{getInitials(profile.full_name || profile.email)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
