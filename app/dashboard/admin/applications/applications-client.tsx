"use client"

import { useState } from 'react'
import { Check, X, ChevronDown, ChevronUp, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { cn, formatDate, getApplicationStatusColor } from '@/lib/utils'
import EmptyState from '@/components/shared/empty-state'
import type { WorkforceApplication, WorkforceApplicationStatus } from '@/types'

const statusTabs: { label: string; value: WorkforceApplicationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

interface ApplicationsClientProps {
  initialApplications: (WorkforceApplication & { users?: { email: string } })[]
}

export default function ApplicationsClient({ initialApplications }: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [activeTab, setActiveTab] = useState<WorkforceApplicationStatus | 'all'>('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const supabase = createClient()

  const filtered = activeTab === 'all'
    ? applications
    : applications.filter(a => a.status === activeTab)

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  const handleDecision = async (
    appId: string,
    userId: string,
    decision: 'approved' | 'rejected'
  ) => {
    setProcessingId(appId)
    try {
      // Update application status
      const { error: appError } = await supabase
        .from('workforce_applications')
        .update({ status: decision })
        .eq('id', appId)

      if (appError) throw appError

      // If approved, update user role
      if (decision === 'approved') {
        await supabase
          .from('users')
          .update({ role: 'workforce' })
          .eq('id', userId)
      } else {
        // If rejected, revert role back to guest
        await supabase
          .from('users')
          .update({ role: 'guest' })
          .eq('id', userId)
      }

      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: decision } : a)
      )

      toast({
        title: decision === 'approved' ? 'Application approved!' : 'Application rejected',
        description: decision === 'approved'
          ? 'The applicant has been added to the workforce.'
          : 'The applicant has been notified.',
      })
    } catch (err) {
      toast({ variant: 'destructive', title: 'Action failed', description: 'Please try again.' })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workforce Applications</h1>
        <p className="text-sm text-muted-foreground">Review and manage workforce applicants</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {counts[tab.value] > 0 && (
              <span className={cn(
                "ml-1.5 rounded-full px-1.5 py-0.5 text-xs",
                tab.value === 'pending' ? "bg-yellow-100 text-yellow-800" : "bg-muted"
              )}>
                {counts[tab.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'all' ? '' : activeTab} applications`}
          description="Applications will appear here as workers apply."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <Card key={app.id} className="overflow-hidden">
              {/* Header row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {app.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{app.full_name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.location}</span>
                    {app.users?.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.users.email}</span>}
                    <span>{formatDate(app.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", getApplicationStatusColor(app.status))}>
                    {app.status}
                  </span>
                  {app.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-green-300 text-green-700 hover:bg-green-50"
                        disabled={processingId === app.id}
                        onClick={e => { e.stopPropagation(); handleDecision(app.id, app.user_id, 'approved') }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-red-300 text-red-700 hover:bg-red-50"
                        disabled={processingId === app.id}
                        onClick={e => { e.stopPropagation(); handleDecision(app.id, app.user_id, 'rejected') }}
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {expandedId === app.id
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === app.id && (
                <div className="px-4 pb-4 pt-0 border-t bg-muted/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {app.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Location</p>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {app.location}
                      </p>
                    </div>
                    <div className="col-span-full">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {app.skills.map(skill => (
                          <span key={skill} className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {app.notes && (
                      <div className="col-span-full">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm">{app.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
