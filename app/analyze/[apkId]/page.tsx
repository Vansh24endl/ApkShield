'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, XCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { AnalysisProgress } from '@/components/analysis/analysis-progress'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { getAPKById, updateAPKStatus, saveReport } from '@/lib/services/database'
import { analyzeAPK } from '@/lib/services/apk-analyzer'
import type { APKMetadata, AnalysisReport } from '@/lib/types'

interface PageProps {
  params: Promise<{ apkId: string }>
}

export default function AnalyzePage({ params }: PageProps) {
  const { apkId } = use(params)
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [apk, setApk] = useState<APKMetadata | null>(null)
  const [stage, setStage] = useState<string>('uploading')
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('Preparing analysis...')
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<AnalysisReport | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (!user || !apkId) return

    const loadData = async () => {
      const apkData = await getAPKById(apkId)
      if (!apkData) {
        setError('APK not found')
        return
      }
      
      if (apkData.userId !== user.id) {
        setError('Unauthorized access')
        return
      }

      setApk(apkData)
      
      // Start analysis if status is pending
      if (apkData.status === 'pending') {
        startAnalysis(apkData)
      } else if (apkData.status === 'completed') {
        setIsComplete(true)
        setStage('complete')
        setProgress(100)
        setMessage('Analysis complete!')
      }
    }
    loadData()
  }, [user, apkId])

  const startAnalysis = async (apkData: APKMetadata) => {
    try {
      // Update status to analyzing
      await updateAPKStatus(apkData.id, 'analyzing')
      
      // Run analysis with progress updates
      const analysisReport = await analyzeAPK(
        apkData.id,
        apkData.userId,
        apkData.fileName,
        apkData.fileSize,
        (newStage, newProgress, newMessage) => {
          setStage(newStage)
          setProgress(newProgress)
          setMessage(newMessage)
        }
      )
      
      // Save report
      await saveReport(analysisReport)
      setReport(analysisReport)
      
      // Update APK status and metadata
      await updateAPKStatus(apkData.id, 'completed')
      
      setIsComplete(true)
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Analysis failed. Please try again.')
      await updateAPKStatus(apkData.id, 'failed')
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Analysis Error</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => router.push('/upload')}>Try Again</Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {isComplete ? (
              <CheckCircle className="h-8 w-8 text-primary" />
            ) : (
              <Shield className="h-8 w-8 text-primary animate-pulse" />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {isComplete ? 'Analysis Complete' : 'Analyzing APK'}
          </h1>
          {apk && (
            <p className="mt-2 text-muted-foreground">
              <span className="font-mono text-sm">{apk.fileName}</span>
            </p>
          )}
        </div>

        {/* Progress or Results */}
        <div className="rounded-2xl border border-border bg-card p-8">
          {!isComplete ? (
            <AnalysisProgress 
              stage={stage}
              progress={progress}
              message={message}
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              
              {report && (
                <div className="mb-8">
                  <div className="mb-4 grid grid-cols-4 gap-4">
                    <div className="rounded-lg bg-red-500/10 p-4">
                      <div className="text-2xl font-bold text-red-400">{report.summary.critical}</div>
                      <div className="text-xs text-muted-foreground">Critical</div>
                    </div>
                    <div className="rounded-lg bg-orange-500/10 p-4">
                      <div className="text-2xl font-bold text-orange-400">{report.summary.high}</div>
                      <div className="text-xs text-muted-foreground">High</div>
                    </div>
                    <div className="rounded-lg bg-yellow-500/10 p-4">
                      <div className="text-2xl font-bold text-yellow-400">{report.summary.medium}</div>
                      <div className="text-xs text-muted-foreground">Medium</div>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-4">
                      <div className="text-2xl font-bold text-blue-400">{report.summary.low}</div>
                      <div className="text-xs text-muted-foreground">Low</div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{report.summary.totalVulnerabilities}</span> vulnerabilities 
                    with a risk score of <span className={`font-semibold ${report.summary.riskScore >= 50 ? 'text-red-400' : 'text-green-400'}`}>{report.summary.riskScore}</span>
                  </p>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Button onClick={() => router.push(`/report/${apkId}`)}>
                  View Full Report
                </Button>
                <Button variant="outline" onClick={() => router.push('/upload')}>
                  Analyze Another
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tips while analyzing */}
        {!isComplete && (
          <div className="mt-8 rounded-xl border border-border/50 bg-muted/30 p-6">
            <h3 className="font-medium mb-3">What we are checking:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- AndroidManifest.xml configuration</li>
              <li>- Dangerous permission combinations</li>
              <li>- Exported components without protection</li>
              <li>- Insecure network configurations</li>
              <li>- Hardcoded secrets and API keys</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
