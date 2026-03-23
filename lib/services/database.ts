'use server'

import type { User, APKMetadata, AnalysisReport } from '@/lib/types'
import connectToDatabase from '@/lib/mongodb'
import UserModel from '@/lib/models/User'
import APKMetadataModel from '@/lib/models/APKMetadata'
import AnalysisReportModel from '@/lib/models/AnalysisReport'
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

// -- SECURITY HELPERS --
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
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
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
  })
  
  const userObj = newUser.toObject() as any
  delete userObj.password
  delete userObj._id
  delete userObj.__v
  return sanitize(userObj) as User
}

export async function validateUserCredentials(email: string, password: string): Promise<User | null> {
  await connectToDatabase()
  const user = await UserModel.findOne({ email }).lean() as any
  
  if (user && user.password && verifyPassword(password, user.password)) {
    const { password: _, _id, __v, ...userData } = user
    return sanitize(userData) as User
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
  const apk = await APKMetadataModel.findOne({ id }, { _id: 0, __v: 0 }).lean()
  return sanitize(apk) as (APKMetadata | undefined)
}

export async function getAPKsByUserId(userId: string): Promise<APKMetadata[]> {
  await connectToDatabase()
  const apks = await APKMetadataModel.find({ userId }, { _id: 0, __v: 0 })
    .sort({ uploadedAt: -1 })
    .lean()
  return sanitize(apks) as APKMetadata[]
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
  const report = await AnalysisReportModel.findOne({ apkId }, { _id: 0, __v: 0 }).lean()
  return sanitize(report) as (AnalysisReport | undefined)
}

export async function getReportsByUserId(userId: string): Promise<AnalysisReport[]> {
  await connectToDatabase()
  const reports = await AnalysisReportModel.find({ userId }, { _id: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .lean()
  return sanitize(reports) as AnalysisReport[]
}

export async function getAllReports(): Promise<AnalysisReport[]> {
  await connectToDatabase()
  const reports = await AnalysisReportModel.find({}, { _id: 0, __v: 0 }).lean()
  return sanitize(reports) as AnalysisReport[]
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
  
  const query = userId ? { userId } : {}
  const reports = await AnalysisReportModel.find(query).lean() as any[]
  
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
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo-dev',
          email: 'dev@example.com',
          name: 'Alex Kumar',
          password: hashPassword('demo123'),
          role: 'developer',
          createdAt: new Date().toISOString()
        }
      ], { ordered: false })
    } catch (error: any) {
      if (error.code !== 11000) {
        console.error('Failed to initialize demo data:', error)
      }
    }
  }
}
