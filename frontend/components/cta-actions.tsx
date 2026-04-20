'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export function CtaActions() {
  const { isAuthenticated } = useAuth()
  
  return (
    <Link href={isAuthenticated ? '/upload' : '/signup'}>
      <Button 
        size="lg" 
        className="group relative overflow-hidden bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] border-none"
      >
        <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 ease-out group-hover:translate-y-0" />
        <span className="relative z-10 flex items-center gap-2">
          <Eye className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          {isAuthenticated ? 'Upload APK Now' : 'Get Started Free'}
        </span>
      </Button>
    </Link>
  )
}
