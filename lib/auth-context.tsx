'use client'

// ============================================
// Authentication Context
// JWT-based auth with role management
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User, UserRole } from '@/lib/types'
import { 
  findUserByEmail, 
  createUser, 
  validateUserCredentials,
  initializeDemoData 
} from '@/lib/services/database'

// JWT simulation - in production use real JWT library
function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

function decodeToken(token: string): { id: string; email: string; role: UserRole; exp: number } | null {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_TOKEN_KEY = 'apk_shield_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from stored token
  useEffect(() => {
    async function init() {
      await initializeDemoData()
      
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (token) {
        const decoded = decodeToken(token)
        if (decoded && decoded.exp > Date.now()) {
          // Token is valid, restore user session
          const userData = await validateUserCredentials(decoded.email, '')
          if (userData) {
            setUser(userData)
          } else {
            // Try to find user by email
            const foundUser = await findUserByEmail(decoded.email)
            if (foundUser) {
              setUser(foundUser)
            } else {
              localStorage.removeItem(AUTH_TOKEN_KEY)
            }
          }
        } else {
          // Token expired
          localStorage.removeItem(AUTH_TOKEN_KEY)
        }
      }
      setIsLoading(false)
    }
    init()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const userData = await validateUserCredentials(email, password)
      
      if (userData) {
        const token = generateToken(userData)
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        setUser(userData)
        return { success: true }
      }
      
      return { success: false, error: 'Invalid email or password' }
    } catch {
      return { success: false, error: 'An error occurred during login' }
    }
  }, [])

  const signup = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ) => {
    try {
      // Check if user already exists
      const existingUser = await findUserByEmail(email)
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' }
      }
      
      // Create new user
      const newUser = await createUser({ email, password, name, role })
      const token = generateToken(newUser)
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      setUser(newUser)
      
      return { success: true }
    } catch {
      return { success: false, error: 'An error occurred during signup' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
