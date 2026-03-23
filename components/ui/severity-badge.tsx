import { cn } from '@/lib/utils'
import type { Severity } from '@/lib/types'

interface SeverityBadgeProps {
  severity: Severity
  className?: string
  showLabel?: boolean
}

const severityConfig: Record<Severity, { bg: string; text: string; border: string; label: string }> = {
  critical: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'Critical',
  },
  high: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    label: 'High',
  },
  medium: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    label: 'Medium',
  },
  low: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    label: 'Low',
  },
}

export function SeverityBadge({ severity, className, showLabel = true }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', {
        'bg-red-400': severity === 'critical',
        'bg-orange-400': severity === 'high',
        'bg-yellow-400': severity === 'medium',
        'bg-blue-400': severity === 'low',
      })} />
      {showLabel && config.label}
    </span>
  )
}
