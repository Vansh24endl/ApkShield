'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-[42px] w-[42px] rounded-2xl bg-muted/40 animate-pulse border border-border/50" />
    )
  }

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative flex h-[42px] w-[42px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl 
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_8px_20px_rgba(0,0,0,0.1)] 
        backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95
        ${isDark ? 'bg-slate-900 border border-slate-700/50' : 'bg-white/80 border border-border/40'}
      `}
      aria-label="Toggle Theme"
    >
      {/* Background Liquid/Light Effect inspired by image */}
      <div 
        className={`absolute inset-0 opacity-60 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark 
            ? 'bg-gradient-to-t from-blue-500/40 via-blue-900/10 to-transparent translate-y-1' 
            : 'bg-gradient-to-t from-primary/30 via-orange-300/10 to-transparent translate-y-0'
        }`}
      />
      
      {/* Premium Glass Glossy Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-white/20 point-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
      
      {/* Animating Icon */}
      <div className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center ${isDark ? '-rotate-12 scale-100' : 'rotate-12 scale-100'}`}>
        {isDark ? (
           <Moon className="h-5 w-5 text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
        ) : (
           <Sun className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(214,93,69,0.5)] flex" />
        )}
      </div>
    </button>
  )
}

