"use client"

import { useState } from 'react'
import { Search, MapPin, Phone, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import EmptyState from '@/components/shared/empty-state'
import { formatDate } from '@/lib/utils'

interface WorkforceMember {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  workforce_applications: {
    full_name: string
    phone: string
    location: string
    skills: string[]
    status: string
  }[]
}

export default function WorkforceClient({ initialMembers }: { initialMembers: WorkforceMember[] }) {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = initialMembers.filter(m => {
    const q = search.toLowerCase()
    const app = m.workforce_applications?.[0]
    return (
      (m.full_name || '').toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (app?.location || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No workforce members found"
          description={search ? "Try a different search term." : "Approved applicants will appear here."}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(member => {
            const app = member.workforce_applications?.[0]
            return (
              <Card key={member.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {(member.full_name || member.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{member.full_name || 'Unnamed'}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="h-3 w-3 shrink-0" />{member.email}
                    </p>
                  </div>
                </div>

                {app && (
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{app.location}</p>
                    <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{app.phone}</p>
                  </div>
                )}

                {expandedId === member.id && app?.skills?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {app.skills.map(skill => (
                        <span key={skill} className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Joined {formatDate(member.created_at)}</p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
