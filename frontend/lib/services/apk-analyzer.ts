// ============================================
// APK Analyzer Service
// Simulates APK analysis with realistic vulnerability detection
// ============================================

import type { 
  ManifestData, 
  PermissionAnalysis, 
  Vulnerability, 
  AnalysisReport,
  Severity 
} from '@/lib/types'
import { generateId } from './database'

// ============================================
// Risky Permissions Database
// ============================================

const DANGEROUS_PERMISSIONS: Record<string, { 
  riskLevel: Severity
  description: string 
}> = {
  'android.permission.READ_SMS': {
    riskLevel: 'high',
    description: 'Can read all SMS messages, potentially exposing 2FA codes and sensitive communications'
  },
  'android.permission.SEND_SMS': {
    riskLevel: 'high',
    description: 'Can send SMS messages without user interaction, risk of premium rate fraud'
  },
  'android.permission.READ_CONTACTS': {
    riskLevel: 'high',
    description: 'Access to all contact information, privacy risk for user and contacts'
  },
  'android.permission.WRITE_CONTACTS': {
    riskLevel: 'medium',
    description: 'Can modify contact data, risk of data corruption or injection'
  },
  'android.permission.ACCESS_FINE_LOCATION': {
    riskLevel: 'high',
    description: 'Precise GPS location tracking, significant privacy implications'
  },
  'android.permission.ACCESS_COARSE_LOCATION': {
    riskLevel: 'medium',
    description: 'Approximate location access, moderate privacy concern'
  },
  'android.permission.CAMERA': {
    riskLevel: 'medium',
    description: 'Camera access could enable unauthorized photo/video capture'
  },
  'android.permission.RECORD_AUDIO': {
    riskLevel: 'high',
    description: 'Microphone access could enable audio surveillance'
  },
  'android.permission.READ_CALL_LOG': {
    riskLevel: 'high',
    description: 'Access to call history reveals communication patterns'
  },
  'android.permission.READ_PHONE_STATE': {
    riskLevel: 'medium',
    description: 'Access to phone identity (IMEI, phone number)'
  },
  'android.permission.READ_EXTERNAL_STORAGE': {
    riskLevel: 'medium',
    description: 'Can read files from external storage including photos and documents'
  },
  'android.permission.WRITE_EXTERNAL_STORAGE': {
    riskLevel: 'medium',
    description: 'Can modify or delete files on external storage'
  },
  'android.permission.INTERNET': {
    riskLevel: 'low',
    description: 'Network access - required for most apps but enables data exfiltration'
  },
  'android.permission.RECEIVE_BOOT_COMPLETED': {
    riskLevel: 'low',
    description: 'App starts on device boot, persistence mechanism'
  },
  'android.permission.SYSTEM_ALERT_WINDOW': {
    riskLevel: 'high',
    description: 'Can draw over other apps, enables clickjacking attacks'
  },
  'android.permission.REQUEST_INSTALL_PACKAGES': {
    riskLevel: 'critical',
    description: 'Can install other applications, high malware distribution risk'
  },
  'android.permission.BIND_ACCESSIBILITY_SERVICE': {
    riskLevel: 'critical',
    description: 'Full screen access and input simulation, complete device control possible'
  },
  'android.permission.BIND_DEVICE_ADMIN': {
    riskLevel: 'critical',
    description: 'Device administrator privileges, can lock/wipe device'
  },
}

// ============================================
// Simulated APK Package Names
// ============================================

const SAMPLE_PACKAGES = [
  'com.example.shopping',
  'com.finance.banking',
  'com.social.messenger',
  'com.utility.flashlight',
  'com.game.adventure',
  'com.health.tracker',
  'com.news.reader',
  'com.weather.forecast'
]

// ============================================
// Manifest Parser Service
// Simulates parsing AndroidManifest.xml
// ============================================

export function parseManifest(fileName: string): ManifestData {
  // Generate realistic manifest data based on filename
  const hash = fileName.split('').reduce((a, b) => {
    return a + b.charCodeAt(0)
  }, 0)
  
  const packageIndex = hash % SAMPLE_PACKAGES.length
  const baseName = fileName.replace('.apk', '').replace(/[^a-zA-Z]/g, '')
  
  // Generate permissions based on hash for reproducibility
  const allPermissions = Object.keys(DANGEROUS_PERMISSIONS)
  const numPermissions = 5 + (hash % 10)
  const selectedPermissions: string[] = []
  
  for (let i = 0; i < numPermissions; i++) {
    const permIndex = (hash + i * 7) % allPermissions.length
    if (!selectedPermissions.includes(allPermissions[permIndex])) {
      selectedPermissions.push(allPermissions[permIndex])
    }
  }
  
  // Generate components
  const activities = [
    `${SAMPLE_PACKAGES[packageIndex]}.MainActivity`,
    `${SAMPLE_PACKAGES[packageIndex]}.LoginActivity`,
    `${SAMPLE_PACKAGES[packageIndex]}.SettingsActivity`,
  ]
  
  if (hash % 2 === 0) {
    activities.push(`${SAMPLE_PACKAGES[packageIndex]}.WebViewActivity`)
  }
  
  const services = [
    `${SAMPLE_PACKAGES[packageIndex]}.SyncService`,
  ]
  
  if (hash % 3 === 0) {
    services.push(`${SAMPLE_PACKAGES[packageIndex]}.BackgroundService`)
  }
  
  const receivers = [
    `${SAMPLE_PACKAGES[packageIndex]}.BootReceiver`,
  ]
  
  const providers: string[] = []
  if (hash % 4 === 0) {
    providers.push(`${SAMPLE_PACKAGES[packageIndex]}.DataProvider`)
  }
  
  // Determine exported components (potential attack surface)
  const exported = {
    activities: hash % 2 === 0 ? [activities[0]] : [],
    services: hash % 3 === 0 ? [services[0]] : [],
    receivers: [receivers[0]],
    providers: hash % 4 === 0 ? providers : [],
  }
  
  return {
    packageName: `${SAMPLE_PACKAGES[packageIndex]}.${baseName.toLowerCase().slice(0, 8)}`,
    versionName: `${1 + (hash % 5)}.${hash % 10}.${hash % 100}`,
    versionCode: 100 + hash % 900,
    minSdkVersion: 21 + (hash % 5),
    targetSdkVersion: 30 + (hash % 4),
    permissions: selectedPermissions,
    activities,
    services,
    receivers,
    providers,
    exported,
    debuggable: hash % 10 === 0, // 10% chance of debuggable
    allowBackup: hash % 3 !== 0, // 66% chance of backup allowed
  }
}

// ============================================
// Permission Analyzer Service
// ============================================

export function analyzePermissions(permissions: string[]): PermissionAnalysis[] {
  return permissions.map(permission => {
    const permInfo = DANGEROUS_PERMISSIONS[permission]
    
    if (permInfo) {
      return {
        permission,
        isRisky: true,
        riskLevel: permInfo.riskLevel,
        description: permInfo.description,
        protectionLevel: permInfo.riskLevel === 'critical' ? 'signature' : 'dangerous',
      }
    }
    
    // Unknown or normal permissions
    return {
      permission,
      isRisky: false,
      riskLevel: 'low' as Severity,
      description: 'Standard permission with minimal security implications',
      protectionLevel: 'normal',
    }
  })
}

// ============================================
// Vulnerability Detection Engine
// ============================================

export async function detectVulnerabilities(manifest: ManifestData): Promise<Vulnerability[]> {
  const vulnerabilities: Vulnerability[] = []
  
  // Check for debuggable flag
  if (manifest.debuggable) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Configuration',
      severity: 'critical',
      title: 'Application is Debuggable',
      description: 'The android:debuggable flag is set to true. This allows attackers to attach a debugger, extract sensitive data, and modify application behavior at runtime.',
      location: 'AndroidManifest.xml - application tag',
      recommendation: 'Set android:debuggable="false" in production builds. Use build variants to ensure debug mode is never enabled in release builds.',
      cweId: 'CWE-489',
    })
  }
  
  // Check for backup vulnerability
  if (manifest.allowBackup) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Data Security',
      severity: 'medium',
      title: 'Application Data Backup Enabled',
      description: 'The android:allowBackup flag is true, allowing users to backup application data via ADB. Sensitive data could be extracted from device backups.',
      location: 'AndroidManifest.xml - application tag',
      recommendation: 'Set android:allowBackup="false" or implement a custom BackupAgent that excludes sensitive data.',
      cweId: 'CWE-530',
    })
  }
  
  // Check exported components
  for (const activity of manifest.exported.activities) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Component Security',
      severity: 'high',
      title: 'Exported Activity Without Permission',
      description: `Activity "${activity}" is exported and accessible by any application. This could allow malicious apps to launch this activity with crafted intents.`,
      location: `AndroidManifest.xml - ${activity}`,
      recommendation: 'Add android:permission attribute to restrict access or set android:exported="false" if external access is not required.',
      cweId: 'CWE-926',
    })
  }
  
  for (const service of manifest.exported.services) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Component Security',
      severity: 'high',
      title: 'Exported Service Without Permission',
      description: `Service "${service}" is exported and can be bound by any application. This could allow unauthorized access to service functionality.`,
      location: `AndroidManifest.xml - ${service}`,
      recommendation: 'Protect the service with a custom permission or set android:exported="false".',
      cweId: 'CWE-926',
    })
  }
  
  for (const receiver of manifest.exported.receivers) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Component Security',
      severity: 'medium',
      title: 'Exported Broadcast Receiver',
      description: `Receiver "${receiver}" is exported and can receive broadcasts from any application. Verify that this is intentional and input is properly validated.`,
      location: `AndroidManifest.xml - ${receiver}`,
      recommendation: 'Consider using LocalBroadcastManager for internal broadcasts or add permission protection.',
      cweId: 'CWE-925',
    })
  }
  
  for (const provider of manifest.exported.providers) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Data Exposure',
      severity: 'critical',
      title: 'Exported Content Provider',
      description: `Content Provider "${provider}" is exported without proper protection. This could expose sensitive application data to other apps.`,
      location: `AndroidManifest.xml - ${provider}`,
      recommendation: 'Set android:exported="false" or implement proper permission and path-permission protection.',
      cweId: 'CWE-200',
    })
  }
  
  // Check for dangerous permission combinations
  const hasInternet = manifest.permissions.includes('android.permission.INTERNET')
  const hasSms = manifest.permissions.some(p => p.includes('SMS'))
  const hasContacts = manifest.permissions.includes('android.permission.READ_CONTACTS')
  const hasLocation = manifest.permissions.some(p => p.includes('LOCATION'))
  
  if (hasInternet && hasSms) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Privacy Risk',
      severity: 'high',
      title: 'SMS Access with Network Permission',
      description: 'The application has both SMS access and internet permission. This combination could allow exfiltration of SMS data including 2FA codes.',
      location: 'Permission combination',
      recommendation: 'Review the necessity of SMS permissions. Consider using SMS Retriever API for OTP verification instead.',
      cweId: 'CWE-359',
    })
  }
  
  if (hasInternet && hasContacts) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Privacy Risk',
      severity: 'medium',
      title: 'Contact Access with Network Permission',
      description: 'The application can access contacts and has internet permission. User contact data could potentially be transmitted to remote servers.',
      location: 'Permission combination',
      recommendation: 'Ensure contact access is justified and implement proper data handling policies.',
      cweId: 'CWE-359',
    })
  }
  
  if (hasInternet && hasLocation) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Privacy Risk',
      severity: 'medium',
      title: 'Location Tracking Capability',
      description: 'The application has location and network permissions. This enables continuous location tracking and transmission.',
      location: 'Permission combination',
      recommendation: 'Use location permission only when necessary and prefer coarse location when possible.',
      cweId: 'CWE-359',
    })
  }
  
  // Check for low SDK version
  if (manifest.minSdkVersion < 23) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Compatibility Risk',
      severity: 'low',
      title: 'Low Minimum SDK Version',
      description: `The app targets SDK ${manifest.minSdkVersion}, which lacks security features like runtime permissions and network security configuration defaults.`,
      location: 'AndroidManifest.xml - uses-sdk',
      recommendation: 'Consider raising minSdkVersion to at least 23 (Android 6.0) for better security defaults.',
      cweId: 'CWE-693',
    })
  }
  
  // Simulated code analysis vulnerabilities
  const codeVulnerabilities = await generateCodeVulnerabilities(manifest)
  vulnerabilities.push(...codeVulnerabilities)
  
  return vulnerabilities
}

// ============================================
// Simulated Code Analysis
// ============================================

async function generateCodeVulnerabilities(manifest: ManifestData): Promise<Vulnerability[]> {
  const vulnerabilities: Vulnerability[] = []
  const hash = manifest.packageName.length
  
  // Simulate finding insecure WebView
  if (manifest.activities.some(a => a.includes('WebView')) || hash % 3 === 0) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'WebView Security',
      severity: 'high',
      title: 'JavaScript Enabled in WebView',
      description: 'WebView has JavaScript enabled without proper URL validation. This could allow JavaScript injection attacks if loading untrusted content.',
      location: `${manifest.activities[0]}.java:line 45`,
      recommendation: 'Validate URLs before loading in WebView and consider implementing a URL whitelist.',
      cweId: 'CWE-79',
    })
  }
  
  // Simulate hardcoded secrets
  if (hash % 4 === 0) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Secrets Management',
      severity: 'critical',
      title: 'Hardcoded API Key Detected',
      description: 'A potential API key or secret was found hardcoded in the application code. This could be extracted through reverse engineering.',
      location: `${manifest.packageName}.BuildConfig.java`,
      recommendation: 'Move secrets to a secure backend or use Android Keystore for sensitive credentials.',
      cweId: 'CWE-798',
    })
  }
  
  // Simulate insecure HTTP usage
  if (hash % 2 === 0) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Network Security',
      severity: 'medium',
      title: 'Cleartext HTTP Traffic Allowed',
      description: 'The application allows cleartext HTTP traffic. Network communications could be intercepted by attackers on the same network.',
      location: 'network_security_config.xml',
      recommendation: 'Use HTTPS for all network communications. Add a network security config that blocks cleartext traffic.',
      cweId: 'CWE-319',
    })
  }
  
  // Simulate SQL injection vulnerability
  if (hash % 5 === 0) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'SQL Injection',
      severity: 'high',
      title: 'Potential SQL Injection',
      description: 'Raw SQL query construction detected without parameterization. User input could manipulate database queries.',
      location: `${manifest.packageName}.DatabaseHelper.java:line 78`,
      recommendation: 'Use parameterized queries or ContentValues for database operations.',
      cweId: 'CWE-89',
    })
  }
  
  // Simulate logging sensitive data
  if (hash % 6 === 0) {
    vulnerabilities.push({
      id: await generateId(),
      type: 'Information Disclosure',
      severity: 'low',
      title: 'Sensitive Data in Logs',
      description: 'Application appears to log potentially sensitive information that could be accessed via ADB logcat.',
      location: `${manifest.activities[0]}.java:line 92`,
      recommendation: 'Remove or guard debug logs in production builds using ProGuard or BuildConfig.DEBUG checks.',
      cweId: 'CWE-532',
    })
  }
  
  return vulnerabilities
}

// ============================================
// Calculate Risk Score
// ============================================

export function calculateRiskScore(vulnerabilities: Vulnerability[]): number {
  let score = 0
  
  const weights = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3,
  }
  
  vulnerabilities.forEach(vuln => {
    score += weights[vuln.severity]
  })
  
  // Normalize to 0-100 scale
  return Math.min(Math.round(score), 100)
}

// ============================================
// Main Analysis Pipeline
// ============================================

export async function analyzeAPK(
  apkId: string,
  userId: string,
  fileName: string,
  fileSize: number,
  onProgress: (stage: string, progress: number, message: string) => void
): Promise<AnalysisReport> {
  // Stage 1: Extracting APK
  onProgress('extracting', 15, 'Extracting APK contents...')
  await simulateDelay(200)
  
  // Stage 2: Parsing Manifest
  onProgress('parsing', 35, 'Parsing AndroidManifest.xml...')
  await simulateDelay(200)
  const manifest = parseManifest(fileName)
  
  // Stage 3: Analyzing Permissions
  onProgress('analyzing', 55, 'Analyzing permissions...')
  await simulateDelay(200)
  const permissions = analyzePermissions(manifest.permissions)
  
  // Stage 4: Detecting Vulnerabilities
  onProgress('analyzing', 75, 'Running vulnerability detection...')
  await simulateDelay(300)
  const vulnerabilities = await detectVulnerabilities(manifest)
  
  // Stage 5: Generating Report
  onProgress('generating', 90, 'Generating security report...')
  await simulateDelay(100)
  
  const summary = {
    totalVulnerabilities: vulnerabilities.length,
    critical: vulnerabilities.filter(v => v.severity === 'critical').length,
    high: vulnerabilities.filter(v => v.severity === 'high').length,
    medium: vulnerabilities.filter(v => v.severity === 'medium').length,
    low: vulnerabilities.filter(v => v.severity === 'low').length,
    riskScore: calculateRiskScore(vulnerabilities),
  }
  
  const report: AnalysisReport = {
    id: await generateId(),
    apkId,
    userId,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: 'completed',
    summary,
    manifest,
    permissions,
    vulnerabilities,
  }
  
  onProgress('complete', 100, 'Analysis complete!')
  
  return report
}

// Helper to simulate processing time
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
