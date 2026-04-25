import fs from 'fs'
import path from 'path'
import type { User, APKMetadata, AnalysisReport } from '@/lib/types'

const DB_FILE = path.join(process.cwd(), 'data.json')

interface Database {
  users: User[]
  apks: APKMetadata[]
  reports: AnalysisReport[]
}

import { scryptSync, randomBytes } from 'crypto'

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

function initDB(): Database {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData: Database = {
      users: [
        {
          id: 'demo-analyst',
          email: 'analyst@example.com',
          name: 'Sarah Chen',
          role: 'security_analyst',
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo-dev',
          email: 'dev@example.com',
          name: 'Alex Kumar',
          role: 'developer',
          createdAt: new Date().toISOString()
        }
      ],
      // Store password hashes instead of plaintext
      apks: [],
      reports: []
    }
    
    ;(defaultData.users[0] as any).password = hashPassword('demo123')
    ;(defaultData.users[1] as any).password = hashPassword('demo123')
    
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2))
    return defaultData
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(data)
}

function saveDB(data: Database) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

export function dbRead(): Database {
  return initDB()
}

export function dbWrite(data: Database) {
  saveDB(data)
}
