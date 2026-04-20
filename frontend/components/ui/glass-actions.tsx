'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Zap, Shield, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  activeColor?: 'blue' | 'red' | 'orange';
  isActive?: boolean;
}

export function GlassButton({ 
  icon, 
  label, 
  activeColor = 'blue',
  isActive = false,
  className,
  ...props 
}: GlassButtonProps) {
  
  const getGlowColor = () => {
    switch (activeColor) {
      case 'blue': return 'rgba(59, 130, 246, 0.4)';
      case 'red': return 'rgba(239, 68, 68, 0.4)';
      case 'orange': return 'rgba(249, 115, 22, 0.4)';
      default: return 'rgba(255,255,255,0.1)';
    }
  }

  return (
    <button
      className={cn(
        "relative flex items-center justify-between w-full h-16 px-6 rounded-full overflow-hidden transition-all duration-500 group outline-none",
        "border border-white/10 backdrop-blur-xl",
        // 3D Glass effects (highlights & shadows)
        "shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.4)]",
        "hover:scale-[1.02] active:scale-[0.98] text-foreground",
        !isActive && "bg-white/5",
        className
      )}
      style={{
        backgroundColor: isActive ? getGlowColor() : undefined,
        boxShadow: isActive ? `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.5), 0 10px 30px ${getGlowColor()}` : undefined
      }}
      {...props}
    >
      {/* Inner top highlight for strong 3D effect */}
      <div className="absolute inset-x-4 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-full opacity-70" />
      
      {/* Inner bottom shadow */}
      <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-black/50 to-transparent rounded-b-full" />
      
      <div className="relative flex items-center gap-4 z-10 w-full">
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 transition-colors duration-300 drop-shadow-md",
          isActive ? "text-white" : "text-muted-foreground group-hover:text-white"
        )}>
          {icon}
        </div>
        
        {/* Label */}
        <span className={cn(
          "font-semibold text-[15px] tracking-wide flex-grow text-left transition-colors duration-300 drop-shadow-md",
          isActive ? "text-white" : "text-muted-foreground group-hover:text-white"
        )}>
          {label}
        </span>

        {/* 3 Dots */}
        <div className={cn(
          "flex space-x-1 transition-opacity duration-300 pl-2",
          isActive ? "opacity-100" : "opacity-30 group-hover:opacity-70"
        )}>
          <div className="w-1 h-1 rounded-full bg-current"></div>
          <div className="w-1 h-1 rounded-full bg-current"></div>
          <div className="w-1 h-1 rounded-full bg-current"></div>
        </div>
      </div>
    </button>
  )
}

export function GlassActionsPanel() {
  const [activeMode, setActiveMode] = React.useState('stealth');
  const router = useRouter(); // Use the imported router

  const handleModeClick = (mode: string) => {
    setActiveMode(mode);
    // Short delay to show the nice glow animation before navigating
    setTimeout(() => {
      router.push(`/upload?mode=${mode}`);
    }, 400);
  };

  return (
    <div className="relative p-6 rounded-[2.5rem] border border-white/5 bg-black/20 backdrop-blur-3xl shadow-2xl flex flex-col gap-5 max-w-sm mt-4">
       <GlassButton 
        icon={<Search className="w-5 h-5" />}
        label="Deep Scan"
        activeColor="blue"
        isActive={activeMode === 'deep'}
        onClick={() => handleModeClick('deep')}
       />
       <GlassButton 
        icon={<Shield className="w-5 h-5" />}
        label="Stealth Mode"
        activeColor="red"
        isActive={activeMode === 'stealth'}
        onClick={() => handleModeClick('stealth')}
       />
       <GlassButton 
        icon={<Zap className="w-5 h-5" />}
        label="Quick Scan"
        activeColor="orange"
        isActive={activeMode === 'quick'}
        onClick={() => handleModeClick('quick')}
       />
    </div>
  )
}
