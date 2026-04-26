import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, Phone, Briefcase, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { createClient } from '@/lib/supabase/server'
import { cn, formatDate, getApplicationStatusColor, getTaskStatusColor, getTaskStatusLabel, formatCurrency, getRoleBadgeColor, getRoleLabel } from '@/lib/utils'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) redirect('/auth/login?redirect=/profile')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  const { data: workforceApp } = await supabase
    .from('workforce_applications')
    .select('*')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: taskApplications } = await supabase
    .from('task_applications')
    .select('*, tasks(id, title, pay, location, status, category)')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: taskAssignments } = await supabase
    .from('task_assignments')
    .select('*, tasks(id, title, pay, location, status, category)')
    .eq('user_id', authUser.id)
    .order('assigned_at', { ascending: false })
    .limit(5)

  if (!profile) redirect('/auth/login')

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile sidebar */}
            <div className="space-y-4">
              {/* Identity card */}
              <Card className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-2xl mb-3">
                    {(profile.full_name || profile.email).charAt(0).toUpperCase()}
                  </div>
                  <h1 className="font-bold text-lg">{profile.full_name || 'User'}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{profile.email}</p>
                  <span className={cn("mt-2 text-xs px-2.5 py-1 rounded-full font-medium", getRoleBadgeColor(profile.role))}>
                    {getRoleLabel(profile.role)}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" />
                    {profile.email}
                  </p>
                  {workforceApp?.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      {workforceApp.phone}
                    </p>
                  )}
                  {workforceApp?.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {workforceApp.location}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    Joined {formatDate(profile.created_at)}
                  </p>
                </div>
              </Card>

              {/* Workforce application status */}
              {workforceApp && (
                <Card className="p-5">
                  <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Workforce Status
                  </h2>
                  <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", getApplicationStatusColor(workforceApp.status))}>
                    {workforceApp.status.charAt(0).toUpperCase() + workforceApp.status.slice(1)}
                  </span>
                  {workforceApp.skills?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1.5">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {workforceApp.skills.map((skill: string) => (
                          <span key={skill} className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* No application yet */}
              {!workforceApp && (
                <Card className="p-5">
                  <p className="text-sm text-muted-foreground mb-3">You haven't applied to the workforce yet.</p>
                  <Link
                    href="/apply-workforce"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Apply now →
                  </Link>
                </Card>
              )}
            </div>

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assigned tasks */}
              {taskAssignments && taskAssignments.length > 0 && (
                <Card className="p-5">
                  <h2 className="font-semibold mb-4">My Assignments</h2>
                  <div className="space-y-3">
                    {taskAssignments.map((assignment: any) => (
                      <Link
                        key={assignment.id}
                        href={`/tasks/${assignment.tasks.id}`}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {assignment.tasks.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{assignment.tasks.location}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="text-sm font-semibold">{formatCurrency(assignment.tasks.pay)}</span>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", getTaskStatusColor(assignment.tasks.status))}>
                            {getTaskStatusLabel(assignment.tasks.status)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {/* Task applications */}
              <Card className="p-5">
                <h2 className="font-semibold mb-4">
                  My Applications ({taskApplications?.length || 0})
                </h2>
                {!taskApplications || taskApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-3">You haven't applied for any tasks yet.</p>
                    <Link href="/tasks" className="text-sm text-primary font-medium hover:underline">
                      Browse available tasks →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {taskApplications.map((app: any) => {
                      const appStatusColor = (s: string) =>
                        s === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                        s === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'

                      return (
                        <Link
                          key={app.id}
                          href={`/tasks/${app.tasks.id}`}
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors group"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                              {app.tasks.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{app.tasks.location}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            <span className="text-sm font-semibold">{formatCurrency(app.tasks.pay)}</span>
                            <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", appStatusColor(app.status))}>
                              {app.status}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
