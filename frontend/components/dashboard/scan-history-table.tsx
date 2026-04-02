'use client'

import Link from 'next/link'
import { FileIcon, Clock, ExternalLink, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { APKMetadata } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ScanHistoryTableProps {
  scans: APKMetadata[]
  showActions?: boolean
}

export function ScanHistoryTable({ scans, showActions = true }: ScanHistoryTableProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getStatusBadge = (status: APKMetadata['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        )
      case 'analyzing':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-xs font-medium text-blue-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Analyzing
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 text-xs font-medium text-red-400">
            <AlertTriangle className="h-3 w-3" />
            Failed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
    }
  }

  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">No scans yet</h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Upload your first APK to get started
        </p>
        <Link href="/upload" className="mt-4">
          <Button>Upload APK</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">File</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Scanned</th>
            {showActions && (
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr 
              key={scan.id} 
              className={cn(
                'border-b border-border/50 transition-colors hover:bg-muted/50',
                scan.status === 'analyzing' && 'bg-blue-500/5'
              )}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium truncate max-w-[200px]">{scan.fileName}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                  {scan.packageName || 'Pending...'}
                </code>
              </td>
              <td className="py-4 px-4 text-sm text-muted-foreground">
                {formatFileSize(scan.fileSize)}
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(scan.status)}
              </td>
              <td className="py-4 px-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(scan.uploadedAt), { addSuffix: true })}
                </div>
              </td>
              {showActions && (
                <td className="py-4 px-4 text-right">
                  {scan.status === 'completed' && (
                    <Link href={`/report/${scan.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        View Report
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
