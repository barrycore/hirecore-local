"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { cn, formatDate, getRoleBadgeColor, getRoleLabel } from '@/lib/utils'
import type { UserRole } from '@/types'

const ALL_ROLES: UserRole[] = ['guest', 'applicant', 'workforce', 'admin', 'super_admin']

interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchesSearch = (u.full_name || '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId)
    try {
      const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId)
      if (error) throw error
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      toast({ title: 'Role updated', description: `User role changed to ${getRoleLabel(newRole)}.` })
    } catch {
      toast({ variant: 'destructive', title: 'Update failed' })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterRole} onValueChange={v => setFilterRole(v as UserRole | 'all')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{getRoleLabel(r)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left font-medium text-muted-foreground p-3">User</th>
                <th className="text-left font-medium text-muted-foreground p-3">Current Role</th>
                <th className="text-left font-medium text-muted-foreground p-3">Joined</th>
                <th className="text-left font-medium text-muted-foreground p-3">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-muted-foreground">No users found.</td></tr>
              ) : filtered.map(user => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{user.full_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", getRoleBadgeColor(user.role))}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{formatDate(user.created_at)}</td>
                  <td className="p-3">
                    <Select
                      value={user.role}
                      onValueChange={val => handleRoleChange(user.id, val as UserRole)}
                      disabled={updatingId === user.id}
                    >
                      <SelectTrigger className="h-8 w-[140px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_ROLES.map(r => (
                          <SelectItem key={r} value={r} className="text-xs">{getRoleLabel(r)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} of {users.length} users</p>
    </div>
  )
}
