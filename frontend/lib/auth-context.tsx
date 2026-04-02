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
import { verifyOtpAndLogin, sendOtpEmail } from '@/lib/services/otp'

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
  loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string; requireOtp?: boolean }>
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
      // Run demo initialization in the background to avoid blocking the user session restore
      initializeDemoData().catch(console.error)
      
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (token) {
        const decoded = decodeToken(token)
        if (decoded && decoded.exp > Date.now()) {
          try {
            // Directly find the user by email instead of validating empty passwords
            const foundUser = await findUserByEmail(decoded.email)
            if (foundUser && foundUser.isVerified !== false) {
              setUser(foundUser)
            } else {
              localStorage.removeItem(AUTH_TOKEN_KEY)
            }
          } catch (error) {
            console.error('Session restore failed:', error)
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
    } catch (e: any) {
      return { success: false, error: e.message || 'An error occurred during login' }
    }
  }, [])

  const loginWithOtp = useCallback(async (email: string, otp: string) => {
    try {
      const result = await verifyOtpAndLogin(email, otp)
      
      if (result.success && result.user) {
        const token = generateToken(result.user)
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        setUser(result.user)
        return { success: true }
      }
      
      return { success: false, error: result.error || 'Invalid OTP' }
    } catch {
      return { success: false, error: 'An error occurred during OTP verification' }
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
      
      // Create new user (unverified by default)
      const newUser = await createUser({ email, password, name, role })
      
      // Automatically send OTP email for account verification
      const otpResult = await sendOtpEmail(email)
      if (!otpResult.success) {
        return { success: false, error: otpResult.error || 'Account created but failed to send OTP email' }
      }
      
      // Do not login the user yet!
      return { success: true, requireOtp: true }
    } catch (e: any) {
      // If error is related to existing email in DB
      if (e.code === 11000) {
        return { success: false, error: 'An account with this email already exists' }
      }
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
        loginWithOtp,
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
