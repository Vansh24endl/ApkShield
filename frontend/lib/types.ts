// ============================================
// APK Shield - Type Definitions
// ============================================

// User roles for authorization
export type UserRole = 'security_analyst' | 'developer'

// User model
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  isVerified?: boolean
}

// Authentication payload
export interface AuthPayload {
  user: User
  token: string
}

// APK metadata stored in database
export interface APKMetadata {
  id: string
  userId: string
  fileName: string
  fileSize: number
  packageName: string
  versionName: string
  versionCode: number
  minSdkVersion: number
  targetSdkVersion: number
  uploadedAt: string
  status: 'pending' | 'analyzing' | 'completed' | 'failed'
}

// Severity levels for vulnerabilities
export type Severity = 'low' | 'medium' | 'high' | 'critical'

// Individual vulnerability finding
export interface Vulnerability {
  id: string
  type: string
  severity: Severity
  title: string
  description: string
  location: string
  recommendation: string
  cweId?: string
}

// Permission analysis result
export interface PermissionAnalysis {
  permission: string
  isRisky: boolean
  riskLevel: Severity
  description: string
  protectionLevel: string
}

// AndroidManifest.xml parsed data
export interface ManifestData {
  packageName: string
  versionName: string
  versionCode: number
  minSdkVersion: number
  targetSdkVersion: number
  permissions: string[]
  activities: string[]
  services: string[]
  receivers: string[]
  providers: string[]
  exported: {
    activities: string[]
    services: string[]
    receivers: string[]
    providers: string[]
  }
  debuggable: boolean
  allowBackup: boolean
}

// Complete analysis report
export interface AnalysisReport {
  id: string
  apkId: string
  userId: string
  createdAt: string
  completedAt: string
  status: 'completed' | 'failed'
  summary: {
    totalVulnerabilities: number
    critical: number
    high: number
    medium: number
    low: number
    riskScore: number
  }
  manifest: ManifestData
  permissions: PermissionAnalysis[]
  vulnerabilities: Vulnerability[]
}

// Dashboard statistics
export interface DashboardStats {
  totalScans: number
  totalVulnerabilities: number
  criticalFindings: number
  highFindings: number
  averageRiskScore: number
  recentScans: APKMetadata[]
}

// Analysis progress state
export interface AnalysisProgress {
  stage: 'uploading' | 'extracting' | 'parsing' | 'analyzing' | 'generating' | 'complete'
  progress: number
  message: string
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Chart data types
export interface VulnerabilityChartData {
  name: string
  value: number
  fill: string
}

export interface TimelineData {
  date: string
  scans: number
  vulnerabilities: number
}
