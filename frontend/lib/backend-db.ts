import fs from 'fs'
import path from 'path'
import type { User, APKMetadata, AnalysisReport } from '@/lib/types'

const DB_FILE = path.join(process.cwd(), 'data.json')

interface Database {
  users: User[]
  apks: APKMetadata[]
  reports: AnalysisReport[]
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
      // We store password hashes in memory for demo here securely if we want, but for simplicity let's store passwords directly in users array for demo.
      apks: [],
      reports: []
    }
    // For demo, we attach passwords inline since they aren't typed in User.
    // In production we would hash them.
    ;(defaultData.users[0] as any).password = 'demo123'
    ;(defaultData.users[1] as any).password = 'demo123'
    
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
