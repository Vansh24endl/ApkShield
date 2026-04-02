'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, Filter, Trash } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ScanHistoryTable } from '@/components/dashboard/scan-history-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import { getAPKsByUserId, clearAllScans } from '@/lib/services/database'
import type { APKMetadata } from '@/lib/types'

export default function HistoryPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [scans, setScans] = useState<APKMetadata[]>([])
  const [filteredScans, setFilteredScans] = useState<APKMetadata[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isClearing, setIsClearing] = useState(false)

  const loadScans = async () => {
    if (!user) return
    const userScans = await getAPKsByUserId(user.id)
    setScans(userScans)
    if (statusFilter === 'all') {
      setFilteredScans(userScans)
    } else {
      setFilteredScans(userScans.filter(s => s.status === statusFilter))
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      loadScans()
    }
  }, [user])

  const handleClearScans = async () => {
    if (confirm('Are you sure you want to clear all scan history? Space will be freed.')) {
      setIsClearing(true)
      try {
        await clearAllScans()
        await loadScans()
      } catch (error) {
        console.error('Failed to clear scans:', error)
      } finally {
        setIsClearing(false)
      }
    }
  }

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredScans(scans)
    } else {
      setFilteredScans(scans.filter(s => s.status === statusFilter))
    }
  }, [statusFilter, scans])

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Scan History</h1>
              <p className="text-sm text-muted-foreground">
                {scans.length} total scans
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scans</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="analyzing">Analyzing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleClearScans} 
              disabled={isClearing || scans.length === 0}
            >
              <Trash className="mr-2 h-4 w-4" />
              {isClearing ? 'Clearing...' : 'Clear All'}
            </Button>
            <Button onClick={() => router.push('/upload')}>
              New Scan
            </Button>
          </div>
        </div>

        {/* Scans Table */}
        <div className="rounded-xl border border-border bg-card">
          <ScanHistoryTable scans={filteredScans} />
        </div>

        {/* Stats Summary */}
        {scans.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {scans.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {scans.filter(s => s.status === 'analyzing').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {scans.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {scans.filter(s => s.status === 'failed').length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
