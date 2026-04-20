'use client'

import { useCallback, useState } from 'react'
import { Upload, FileIcon, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  isUploading?: boolean
  className?: string
}

export function FileDropzone({ onFileSelect, isUploading = false, className }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    setError(null)
    
    // Check file extension
    if (!file.name.toLowerCase().endsWith('.apk')) {
      setError('Please select a valid APK file (.apk extension)')
      return false
    }
    
    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size exceeds 100MB limit')
      return false
    }
    
    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className={cn('w-full group', className)}>
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-all duration-500 ease-out cursor-pointer overflow-hidden',
            isDragging
              ? 'border-primary bg-primary/10 scale-105 shadow-[0_0_40px_rgba(var(--primary),0.2)]'
              : 'border-border/50 hover:border-primary hover:bg-muted/50 hover:shadow-2xl',
            error && 'border-destructive bg-destructive/5'
          )}
        >
          <input
            type="file"
            accept=".apk"
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
            disabled={isUploading}
          />
          
          <div className={cn(
            'flex h-20 w-20 items-center justify-center rounded-2xl mb-6 transition-all duration-500 z-10',
            isDragging 
              ? 'bg-primary text-primary-foreground shadow-lg scale-110 rotate-12' 
              : 'bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 group-hover:-translate-y-2'
          )}>
            <Upload className="h-10 w-10" />
          </div>
          
          <h3 className="text-xl font-bold mb-2 tracking-tight z-10 transition-colors">
            {isDragging ? 'Release to upload APK...' : 'Drag & Drop your APK here'}
          </h3>
          <p className="text-sm border-b border-transparent text-muted-foreground mb-6 z-10 group-hover:border-primary/30 pb-1 transition-all">
            or click to browse from your computer
          </p>
          <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-muted-foreground z-10">
            Supported: .apk files up to 100MB
          </span>
          
          {/* Animated background effects */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          {isDragging && (
            <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-5 w-full">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-sm ring-1 ring-primary/30">
                <FileIcon className="h-7 w-7" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-lg truncate w-[90%] text-foreground">{selectedFile.name}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="bg-background px-2 py-0.5 rounded shadow-sm">{formatFileSize(selectedFile.size)}</span>
                  {!isUploading && <span className="text-primary font-medium flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Ready</span>}
                </div>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="h-9 w-9 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all rounded-full shrink-0 absolute -top-2 -right-2 opacity-50 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isUploading && (
            <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
               <div className="h-full bg-primary w-full origin-left animate-[pulse_1s_ease-in-out_infinite] scale-x-50"></div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  )
}
