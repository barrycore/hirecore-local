import Link from 'next/link'
import { Briefcase } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-brand">
                <Briefcase className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="gradient-text">HireCore Local</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A verified workforce marketplace connecting skilled workers with local opportunities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tasks" className="hover:text-foreground transition-colors">Browse Tasks</Link></li>
              <li><Link href="/apply-workforce" className="hover:text-foreground transition-colors">Join Workforce</Link></li>
              <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Delivery & Logistics</li>
              <li>Cleaning & Maintenance</li>
              <li>Events & Hospitality</li>
              <li>Tech & Admin Support</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HireCore Local. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
