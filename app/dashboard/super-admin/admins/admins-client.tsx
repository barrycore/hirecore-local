"use client"

import { useState } from 'react'
import { Shield, ShieldOff, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { cn, formatDate, getRoleBadgeColor, getRoleLabel } from '@/lib/utils'
import type { UserRole } from '@/types'

interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

interface AdminsClientProps {
  initialAdmins: User[]
  potentialAdmins: User[]
}

export default function AdminsClient({ initialAdmins, potentialAdmins: initialPotential }: AdminsClientProps) {
  const [admins, setAdmins] = useState(initialAdmins)
  const [potentialAdmins, setPotentialAdmins] = useState(initialPotential)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const supabase = createClient()

  const promoteToAdmin = async (user: User) => {
    setProcessingId(user.id)
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id)
      if (error) throw error

      const promoted = { ...user, role: 'admin' as UserRole }
      setAdmins(prev => [promoted, ...prev])
      setPotentialAdmins(prev => prev.filter(u => u.id !== user.id))
      toast({ title: 'Admin promoted', description: `${user.full_name || user.email} is now an admin.` })
    } catch {
      toast({ variant: 'destructive', title: 'Promotion failed' })
    } finally {
      setProcessingId(null)
    }
  }

  const demoteAdmin = async (user: User) => {
    if (user.role === 'super_admin') {
      toast({ variant: 'destructive', title: 'Cannot demote super admin' })
      return
    }
    if (!confirm(`Remove admin access from ${user.full_name || user.email}?`)) return

    setProcessingId(user.id)
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'workforce' })
        .eq('id', user.id)
      if (error) throw error

      const demoted = { ...user, role: 'workforce' as UserRole }
      setAdmins(prev => prev.filter(u => u.id !== user.id))
      setPotentialAdmins(prev => [demoted, ...prev])
      toast({ title: 'Admin demoted', description: `${user.full_name || user.email} is now a workforce member.` })
    } catch {
      toast({ variant: 'destructive', title: 'Demotion failed' })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Current Admins */}
      <div className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-600" />
          Current Admins ({admins.length})
        </h2>
        {admins.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">No admins yet.</Card>
        ) : (
          admins.map(user => (
            <Card key={user.id} className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
                {(user.full_name || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.full_name || '—'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getRoleBadgeColor(user.role))}>
                  {getRoleLabel(user.role)}
                </span>
                {user.role !== 'super_admin' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
                    disabled={processingId === user.id}
                    onClick={() => demoteAdmin(user)}
                  >
                    <ShieldOff className="h-3 w-3 mr-1" /> Remove
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Promote from Workforce */}
      <div className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-blue-600" />
          Promote Workforce Member ({potentialAdmins.length})
        </h2>
        {potentialAdmins.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">No workforce members to promote.</Card>
        ) : (
          potentialAdmins.map(user => (
            <Card key={user.id} className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {(user.full_name || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.full_name || '—'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50 shrink-0"
                disabled={processingId === user.id}
                onClick={() => promoteToAdmin(user)}
              >
                <Shield className="h-3 w-3 mr-1" /> Make Admin
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
