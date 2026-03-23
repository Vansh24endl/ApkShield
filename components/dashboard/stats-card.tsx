import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'primary' | 'warning' | 'danger' | 'success'
  className?: string
}

const variantStyles = {
  default: {
    icon: 'bg-muted text-muted-foreground',
    border: 'border-border',
  },
  primary: {
    icon: 'bg-primary/10 text-primary',
    border: 'border-primary/30',
  },
  warning: {
    icon: 'bg-yellow-500/10 text-yellow-400',
    border: 'border-yellow-500/30',
  },
  danger: {
    icon: 'bg-red-500/10 text-red-400',
    border: 'border-red-500/30',
  },
  success: {
    icon: 'bg-green-500/10 text-green-400',
    border: 'border-green-500/30',
  },
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatsCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:bg-card/80',
      styles.border,
      className
    )}>
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          
          {trend && (
            <p className={cn(
              'mt-2 text-xs font-medium',
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last week
            </p>
          )}
        </div>
        
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
