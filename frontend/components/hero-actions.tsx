'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export function HeroActions() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/dashboard">
          <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Go to Dashboard
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Link href="/signup">
        <Button 
          size="lg" 
          className="group relative overflow-hidden bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] border-none"
        >
          <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 ease-out group-hover:translate-y-0" />
          <span className="relative z-10 flex items-center gap-2">
            Start Free Analysis
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45" />
          </span>
        </Button>
      </Link>
      <Link href="/login">
        <Button size="lg" variant="outline" className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute inset-0 translate-y-full bg-muted/50 transition-transform duration-300 ease-out group-hover:translate-y-0" />
          <span className="relative z-10 flex items-center gap-2">
            Sign In
          </span>
        </Button>
      </Link>
    </div>
  )
}

// export function HeroDemoText() {
//   const { isAuthenticated } = useAuth()
  
  // if (isAuthenticated) return null;
  
  // return (
  //   <p className="mt-4 text-sm text-muted-foreground">
  //     Demo: analyst@example.com / demo123
  //   </p>
  // )
// }
