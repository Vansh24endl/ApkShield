'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, FileArchive, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { FileDropzone } from '@/components/upload/file-dropzone'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { saveAPKMetadata, generateId } from '@/lib/services/database'
import { toast } from 'sonner'
import type { APKMetadata } from '@/lib/types'

export default function UploadPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('apk', selectedFile)
      formData.append('layers', JSON.stringify(['Obfuscation', 'Anti-Tamper'])) // Demo mock layers
      if (user?.id) {
          formData.append('userId', user.id)
      }

      const response = await fetch('http://localhost:5000/api/apk/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload request failed')

      const data = await response.json()
      
      toast.success('APK uploaded successfully!')
      
      // Navigate to analysis pipeline page
      router.push(`/pipeline/${data.jobId}`)
    } catch (error) {
      toast.error('Upload failed. Please ensure the backend is running.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileArchive className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Upload APK for Analysis
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload your Android application package to scan for security vulnerabilities
          </p>
        </div>

        {/* Upload Area */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <FileDropzone 
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
          />
          
          {selectedFile && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="gap-2"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Start Analysis
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-medium">Manifest Analysis</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Parse and analyze AndroidManifest.xml for misconfigurations
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-medium">Permission Scan</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Identify dangerous and risky permission combinations
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-medium">Vulnerability Detection</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Detect security flaws and potential attack vectors
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-primary">Secure Processing</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your APK files are processed securely and are not stored permanently. 
              Analysis is performed locally in your browser for maximum privacy.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
