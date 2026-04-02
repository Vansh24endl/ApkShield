'use client'

import { Check, Loader2, FileArchive, FileCode, Shield, Bug, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface AnalysisProgressProps {
  stage: string
  progress: number
  message: string
}

const stages = [
  { id: 'uploading', label: 'Uploading', icon: FileArchive },
  { id: 'extracting', label: 'Extracting', icon: FileArchive },
  { id: 'parsing', label: 'Parsing Manifest', icon: FileCode },
  { id: 'analyzing', label: 'Analyzing', icon: Shield },
  { id: 'generating', label: 'Generating Report', icon: FileText },
  { id: 'complete', label: 'Complete', icon: Check },
]

export function AnalysisProgress({ stage, progress, message }: AnalysisProgressProps) {
  const currentStageIndex = stages.findIndex(s => s.id === stage)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{message}</span>
          <span className="text-sm font-mono text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Stage Indicators */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        {/* Stages */}
        <div className="space-y-6">
          {stages.map((stageItem, index) => {
            const Icon = stageItem.icon
            const isComplete = index < currentStageIndex
            const isCurrent = index === currentStageIndex
            const isPending = index > currentStageIndex

            return (
              <div key={stageItem.id} className="relative flex items-center gap-4">
                {/* Icon Circle */}
                <div
                  className={cn(
                    'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500',
                    isComplete && 'border-primary bg-primary/10 text-primary',
                    isCurrent && 'border-primary bg-primary text-primary-foreground animate-pulse',
                    isPending && 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  
                  {/* Glow effect for current stage */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <div>
                  <p
                    className={cn(
                      'font-medium transition-colors',
                      isComplete && 'text-primary',
                      isCurrent && 'text-foreground',
                      isPending && 'text-muted-foreground'
                    )}
                  >
                    {stageItem.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      In progress...
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Security Animation */}
      {stage !== 'complete' && (
        <div className="mt-12 flex justify-center">
          <div className="relative">
            <Bug className="h-16 w-16 text-muted-foreground/30" />
            <Shield className="absolute inset-0 h-16 w-16 text-primary animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full border border-primary/30 animate-ping" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
