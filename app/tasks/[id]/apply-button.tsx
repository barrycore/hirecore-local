"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

interface TaskApplyButtonProps {
  taskId: string
  userRole: string | null
  isLoggedIn: boolean
  hasApplied: boolean
}

export default function TaskApplyButton({
  taskId,
  userRole,
  isLoggedIn,
  hasApplied: initialHasApplied,
}: TaskApplyButtonProps) {
  const [hasApplied, setHasApplied] = useState(initialHasApplied)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="space-y-2">
        <Button variant="brand" className="w-full" asChild>
          <Link href={`/auth/login?redirect=/tasks/${taskId}`}>Sign in to Apply</Link>
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          New here?{' '}
          <Link href="/apply-workforce" className="text-primary hover:underline">
            Join the workforce
          </Link>
        </p>
      </div>
    )
  }

  // Not workforce (guest, applicant)
  if (userRole !== 'workforce' && userRole !== 'admin' && userRole !== 'super_admin') {
    return (
      <div className="space-y-2">
        <Button variant="brand" className="w-full" asChild>
          <Link href="/apply-workforce">Apply to Join Workforce</Link>
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          You need to be an approved workforce member to apply for tasks.
        </p>
      </div>
    )
  }

  // Already applied
  if (hasApplied) {
    return (
      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4" />
        Application Submitted
      </div>
    )
  }

  const handleApply = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('task_applications')
        .insert({
          task_id: taskId,
          user_id: user.id,
          status: 'pending',
        })

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Already applied', description: 'You have already applied for this task.' })
          setHasApplied(true)
        } else {
          throw error
        }
      } else {
        setHasApplied(true)
        toast({
          variant: 'success' as any,
          title: 'Application submitted!',
          description: 'The admin will review your application shortly.',
        })
        router.refresh()
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Application failed',
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="brand"
      className="w-full"
      loading={loading}
      onClick={handleApply}
    >
      <Send className="mr-2 h-4 w-4" />
      Apply for This Task
    </Button>
  )
}
