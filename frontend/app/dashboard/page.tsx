'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Scan, 
  Bug, 
  AlertTriangle, 
  TrendingUp, 
  Upload,
  Activity,
  ShieldAlert,
  Clock,
  Trash,
  Zap,
  Settings,
  HelpCircle
}
from 'lucide-react'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ScanHistoryTable } from '@/components/dashboard/scan-history-table'
import { SeverityChart } from '@/components/dashboard/severity-chart'
import { DashboardTour } from '@/components/dashboard/dashboard-tour'
import { Button } from '@/components/ui/button'
import { GlassActionsPanel } from '@/components/ui/glass-actions'
import { Skeleton } from '@/components/ui/skeleton'
import Background3D from '@/components/Background-3D'
import { useAuth } from '@/lib/auth-context'
import { getAPKsByUserId, getDashboardStats, getReportsByUserId, clearAllScans } from '@/lib/services/database'
import type { APKMetadata, AnalysisReport } from '@/lib/types'

export default function DashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [scans, setScans] = useState<APKMetadata[]>([])
  const [stats, setStats] = useState({
    totalScans: 0,
    totalVulnerabilities: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0,
    avgRiskScore: 0,
  })
  const [recentActivity, setRecentActivity] = useState<AnalysisReport[]>([])
  const [isClearing, setIsClearing] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const loadDashboardData = async () => {
    if (!user) return
    // Fetch all dashboard data concurrently
    const [userScans, dashStats, userReports] = await Promise.all([
      getAPKsByUserId(user.id),
      getDashboardStats(user.id),
      getReportsByUserId(user.id),
    ]);
    
    setScans(userScans);
    setStats(dashStats);
    setRecentActivity(userReports.slice(0, 5));
    setIsDataLoading(false);
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const handleClearScans = async () => {
    if (!user) return
    if (confirm('Are you sure you want to clear all scan history? Space will be freed.')) {
      setIsClearing(true)
      try {
        await clearAllScans(user.id)
        await loadDashboardData()
      } catch (error) {
        console.error('Failed to clear scans:', error)
      } finally {
        setIsClearing(false)
      }
    }
  }

  const renderSkeleton = () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
             <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  )

  if (authLoading || isDataLoading) {
    return renderSkeleton()
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background/80 relative overflow-hidden">
      <Background3D />
      <Header />
      <DashboardTour />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {"Here's an overview of your security analysis activity"}
            </p>
          </div>
          <Link href="/upload" id="tour-upload-btn">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload APK
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div id="tour-stats-grid" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Scans"
            value={stats.totalScans}
            icon={Scan}
            variant="primary"
          />
          <StatsCard
            title="Vulnerabilities Found"
            value={stats.totalVulnerabilities}
            icon={Bug}
            variant="warning"
          />
          <StatsCard
            title="Critical / High"
            value={`${stats.criticalFindings} / ${stats.highFindings}`}
            icon={AlertTriangle}
            variant="danger"
          />
          <StatsCard
            title="Avg Risk Score"
            value={stats.avgRiskScore || 'N/A'}
            icon={TrendingUp}
            variant={stats.avgRiskScore >= 50 ? 'danger' : 'success'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Recent Scans & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div id="tour-recent-scans" className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold">Recent Scans</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearScans} 
                    disabled={isClearing || scans.length === 0} 
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash className="h-4 w-4 mr-1.5" />
                    {isClearing ? 'Clearing...' : 'Clear All'}
                  </Button>
                  <Link href="/history">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </div>
              <ScanHistoryTable scans={scans.slice(0, 5)} />
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <Activity className="h-5 w-5 text-muted-foreground" />
                Recent Activity
              </h2>
              {recentActivity.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {recentActivity.map((report) => (
                    <Link
                      key={report.id}
                      href={`/report/${report.apkId}`}
                      className="block rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {report.manifest?.packageName?.split('.').pop() || 'Unknown App'}
                        </span>
                        <span className={`text-xs font-medium ${
                          report.summary.riskScore >= 50 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          Score: {report.summary.riskScore}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {report.summary.totalVulnerabilities} vulnerabilities found
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="/upload" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Upload className="h-4 w-4" />
                    Upload New APK
                  </Button>
                </Link>
                <Link href="/history" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Clock className="h-4 w-4" />
                    View Scan History
                  </Button>
                </Link>
                <Link href="/settings" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 transition-colors hover:border-primary/50 hover:bg-primary/5">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => window.dispatchEvent(new Event('start-dashboard-tour'))}
                >
                  <HelpCircle className="h-4 w-4" />
                  Replay Dashboard Tour
                </Button>
              </div>
            </div>



            {/* Vulnerability Distribution Chart */}
            <div id="tour-vuln-chart">
              <SeverityChart 
                critical={stats.criticalFindings}
                high={stats.highFindings}
                medium={stats.mediumFindings}
                low={stats.lowFindings}
              />
            </div>

            {/* Security Tips */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <h2 className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <ShieldAlert className="h-5 w-5" />
                Security Tip
              </h2>
              <p className="text-sm text-muted-foreground">
                Always review exported components in your AndroidManifest.xml. 
                Unprotected activities and services can be exploited by malicious apps.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
