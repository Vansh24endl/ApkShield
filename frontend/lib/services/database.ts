'use server'

import type { User, APKMetadata, AnalysisReport } from '@/lib/types'
import connectToDatabase from '@/lib/mongodb'
import UserModel from '@/lib/models/User'
import APKMetadataModel from '@/lib/models/APKMetadata'
import AnalysisReportModel from '@/lib/models/AnalysisReport'
import FeedbackModel from '@/lib/models/Feedback'
import mongoose from 'mongoose'

const ApkJobModel = mongoose.models.ApkJob || mongoose.model('ApkJob', new mongoose.Schema({}, { strict: false, collection: 'apkjobs' }))
import { scryptSync, randomBytes, timingSafeEqual, randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'a_very_secure_fallback_secret_for_apk_shield'

export async function generateSecureToken(user: User): Promise<string> {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

// Securely encrypt passwords using Node's built-in crypto module
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

function verifyPassword(password: string, hash: string): boolean {
  if (!hash.includes(':')) {
    // Fallback for unhashed plain text passwords (like old demo ones, if any)
    return password === hash
  }
  const [salt, key] = hash.split(':')
  if (!salt || !key) return false
  const derivedKey = scryptSync(password, salt, 64)
  const keyBuffer = Buffer.from(key, 'hex')
  return timingSafeEqual(keyBuffer, derivedKey)
}

// -- DATA SANITIZATION --
// Next.js Server Actions strictly require plain JSON. Mongoose ObjectIds cause crashes.
function sanitize<T>(data: any): T {
  if (!data) return data
  return JSON.parse(JSON.stringify(data))
}

export async function generateId(): Promise<string> {
  return randomUUID()
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  await connectToDatabase()
  const user = await UserModel.findOne({ email }, { _id: 0, __v: 0 }).lean()
  return sanitize(user) as (User | undefined)
}

export async function findUserById(id: string): Promise<User | undefined> {
  await connectToDatabase()
  const user = await UserModel.findOne({ id }, { _id: 0, __v: 0 }).lean()
  return sanitize(user) as (User | undefined)
}

export async function createUser(userData: { 
  email: string
  name: string
  password: string
  role: User['role'] 
}): Promise<User> {
  await connectToDatabase()
  const newUser = await UserModel.create({
    id: await generateId(),
    email: userData.email,
    name: userData.name,
    password: hashPassword(userData.password), // ENCRYPTED
    role: userData.role,
    createdAt: new Date().toISOString(),
    isVerified: false,
  })
  
  const userObj = newUser.toObject() as any
  delete userObj.password
  delete userObj._id
  delete userObj.__v
  return sanitize(userObj) as User
}

export async function validateUserCredentials(email: string, password: string): Promise<{user: User, token: string} | null> {
  await connectToDatabase()
  const user = await UserModel.findOne({ email }).lean() as any
  
  if (user && user.password && verifyPassword(password, user.password)) {
    if (!user.isVerified) {
      throw new Error('Account not verified. Please complete OTP verification.')
    }
    const { password: _, _id, __v, ...userData } = user
    const sanitizedUser = sanitize(userData) as User
    const token = await generateSecureToken(sanitizedUser)
    return { user: sanitizedUser, token }
  }
  return null
}

export async function saveAPKMetadata(metadata: APKMetadata): Promise<APKMetadata> {
  await connectToDatabase()
  await APKMetadataModel.create(metadata)
  return sanitize(metadata) as APKMetadata
}

export async function getAPKById(id: string): Promise<APKMetadata | undefined> {
  await connectToDatabase()
  let job;
  try {
     job = await ApkJobModel.findById(id).lean() as any
  } catch (e) {
     return undefined;
  }
  if (!job) return undefined;
  
  return sanitize({
    id: job._id.toString(),
    userId: job.userId || 'demo-analyst',
    fileName: job.filename,
    fileSize: 1024,
    packageName: job.filename,
    versionName: '1.0',
    versionCode: 1,
    minSdkVersion: 21,
    targetSdkVersion: 33,
    uploadedAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    status: job.status === 'Completed' ? 'completed' : (job.status.toLowerCase().includes('fail') ? 'failed' : 'analyzing')
  }) as APKMetadata
}

export async function getAPKsByUserId(userId: string): Promise<APKMetadata[]> {
  await connectToDatabase()
  // Fetch real scanned jobs directly from the backend's 'apkjobs' collection
  const apks = await ApkJobModel.find({ userId: userId }).sort({ createdAt: -1 }).lean() as any[]
  
  return sanitize(apks.map(job => ({
    id: job._id.toString(),
    userId: userId,
    fileName: job.filename,
    fileSize: 1024,
    packageName: job.filename,
    versionName: '1.0',
    versionCode: 1,
    minSdkVersion: 21,
    targetSdkVersion: 33,
    uploadedAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    status: job.status === 'Completed' ? 'completed' : (job.status.toLowerCase().includes('fail') ? 'failed' : 'analyzing')
  }))) as APKMetadata[]
}

export async function updateAPKStatus(id: string, status: APKMetadata['status']): Promise<void> {
  await connectToDatabase()
  await APKMetadataModel.updateOne({ id }, { $set: { status } })
}

export async function getAllAPKs(): Promise<APKMetadata[]> {
  await connectToDatabase()
  const apks = await APKMetadataModel.find({}, { _id: 0, __v: 0 }).lean()
  return sanitize(apks) as APKMetadata[]
}

export async function saveReport(report: AnalysisReport): Promise<AnalysisReport> {
  await connectToDatabase()
  await AnalysisReportModel.create(report)
  return sanitize(report) as AnalysisReport
}

export async function getReportByAPKId(apkId: string): Promise<AnalysisReport | undefined> {
  await connectToDatabase()
  let job;
  try {
     job = await ApkJobModel.findById(apkId).lean() as any
  } catch (e) {
     return undefined;
  }
  if (!job || !job.report) return undefined;
  
  const vulns = job.report.vulnerabilities || []
  let critical = 0, high = 0, medium = 0, low = 0
  vulns.forEach((v: any) => {
    let sev = (v.severity || '').toLowerCase()
    if (sev === 'critical') critical++
    else if (sev === 'high') high++
    else if (sev === 'medium') medium++
    else low++
  })
  
  return sanitize({
    id: job._id.toString(),
    apkId: job._id.toString(),
    userId: job.userId || 'demo-analyst',
    createdAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: 'completed',
    summary: {
      totalVulnerabilities: vulns.length,
      critical, high, medium, low,
      riskScore: critical * 25 + high * 10 + medium * 5 + low * 1
    },
    manifest: {
      packageName: job.filename,
      versionName: '1.0',
      versionCode: 1,
      minSdkVersion: job.report.minSdkVersion || 21,
      targetSdkVersion: job.report.targetSdkVersion || 33,
      permissions: [], activities: [], services: [], receivers: [], providers: [], exported: { activities: [], services: [], receivers: [], providers: [] }, debuggable: false, allowBackup: false
    },
    permissions: [],
    vulnerabilities: vulns
  }) as AnalysisReport
}

export async function getReportsByUserId(userId: string): Promise<AnalysisReport[]> {
  await connectToDatabase()
  const jobs = await ApkJobModel.find({ userId: userId, status: 'Completed', report: { $exists: true } })
    .sort({ createdAt: -1 })
    .lean() as any[]
    
  let mappedReports = jobs.map(job => {
    const vulns = job.report?.vulnerabilities || []
    let critical = 0, high = 0, medium = 0, low = 0
    vulns.forEach((v: any) => {
      let sev = (v.severity || '').toLowerCase()
      if (sev === 'critical') critical++
      else if (sev === 'high') high++
      else if (sev === 'medium') medium++
      else low++
    })
    
    return {
      id: job._id.toString(),
      apkId: job._id.toString(),
      userId: userId,
      createdAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed',
      summary: {
        totalVulnerabilities: vulns.length,
        critical, high, medium, low,
        riskScore: critical * 25 + high * 10 + medium * 5 + low * 1
      },
      manifest: {
        packageName: job.filename,
        versionName: '1.0',
        versionCode: 1,
        minSdkVersion: job.report?.minSdkVersion || 21,
        targetSdkVersion: job.report?.targetSdkVersion || 33,
        permissions: [], activities: [], services: [], receivers: [], providers: [], exported: { activities: [], services: [], receivers: [], providers: [] }, debuggable: false, allowBackup: false
      },
      permissions: [],
      vulnerabilities: vulns
    }
  })
  return sanitize(mappedReports) as AnalysisReport[]
}

export async function getAllReports(): Promise<AnalysisReport[]> {
  await connectToDatabase()
  const reports = await AnalysisReportModel.find({}, { _id: 0, __v: 0 }).lean()
  return sanitize(reports) as AnalysisReport[]
}

export async function clearAllScans(userId: string): Promise<void> {
  await connectToDatabase()
  await ApkJobModel.deleteMany({ userId: userId })
}

export async function getDashboardStats(userId?: string): Promise<{
  totalScans: number
  totalVulnerabilities: number
  criticalFindings: number
  highFindings: number
  mediumFindings: number
  lowFindings: number
  avgRiskScore: number
}> {
  await connectToDatabase()
  
  // Reuse our mapped real reports instead of separated out AnalysisReportModel
  const reports = await getReportsByUserId(userId || '')
  
  const stats = {
    totalScans: reports.length,
    totalVulnerabilities: 0,
    criticalFindings: 0,
    highFindings: 0,
    mediumFindings: 0,
    lowFindings: 0,
    avgRiskScore: 0,
  }
  
  if (reports.length === 0) return stats
  
  let totalRiskScore = 0
  
  reports.forEach(report => {
    stats.totalVulnerabilities += report.summary.totalVulnerabilities
    stats.criticalFindings += report.summary.critical
    stats.highFindings += report.summary.high
    stats.mediumFindings += report.summary.medium
    stats.lowFindings += report.summary.low
    totalRiskScore += report.summary.riskScore
  })
  
  stats.avgRiskScore = Math.round(totalRiskScore / reports.length)
  
  return stats
}

export async function initializeDemoData(): Promise<void> {
  await connectToDatabase()
  
  const count = await UserModel.countDocuments()
  if (count === 0) {
    try {
      await UserModel.insertMany([
        {
          id: 'demo-analyst',
          email: 'analyst@example.com',
          name: 'Sarah Chen',
          password: hashPassword('demo123'),
          role: 'security_analyst',
          createdAt: new Date().toISOString(),
          isVerified: true
        },
        {
          id: 'demo-dev',
          email: 'dev@example.com',
          name: 'Alex Kumar',
          password: hashPassword('demo123'),
          role: 'developer',
          createdAt: new Date().toISOString(),
          isVerified: true
        }
      ], { ordered: false })
    } catch (error: any) {
      if (error.code !== 11000) {
        console.error('Failed to initialize demo data:', error)
      }
    }
  }
}

export async function saveFeedback(data: { name: string, email: string, message: string }) {
  await connectToDatabase()
  const feedback = await FeedbackModel.create({
    id: await generateId(),
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: new Date().toISOString()
  })
  return sanitize(feedback.toObject())
}
