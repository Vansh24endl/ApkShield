'use client'

import { cn } from '@/lib/utils'

interface RiskScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RiskScoreGauge({ score, size = 'md', className }: RiskScoreGaugeProps) {
  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 75) return { stroke: '#ef4444', text: 'text-red-400', label: 'Critical' }
    if (score >= 50) return { stroke: '#f97316', text: 'text-orange-400', label: 'High' }
    if (score >= 25) return { stroke: '#eab308', text: 'text-yellow-400', label: 'Medium' }
    return { stroke: '#22c55e', text: 'text-green-400', label: 'Low' }
  }

  const config = getColor(score)
  
  const sizeConfig = {
    sm: { container: 'h-24 w-24', text: 'text-xl', label: 'text-[10px]' },
    md: { container: 'h-32 w-32', text: 'text-3xl', label: 'text-xs' },
    lg: { container: 'h-40 w-40', text: 'text-4xl', label: 'text-sm' },
  }

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={cn('relative flex items-center justify-center', sizeConfig[size].container, className)}>
      <svg className="absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={config.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${config.stroke})`,
          }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={cn('font-bold font-mono', sizeConfig[size].text, config.text)}>
          {score}
        </span>
        <span className={cn('font-medium uppercase tracking-wider', sizeConfig[size].label, config.text)}>
          {config.label}
        </span>
      </div>
    </div>
  )
}
