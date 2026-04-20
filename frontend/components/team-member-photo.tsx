'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'

export function TeamMemberPhoto({ src, alt }: { src: string, alt: string }) {
  const [error, setError] = useState(false)
  
  if (error || !src) {
    return <Users className="h-10 w-10 text-primary" />
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className="h-full w-full object-cover"
      onError={() => setError(true)} 
    />
  )
}
