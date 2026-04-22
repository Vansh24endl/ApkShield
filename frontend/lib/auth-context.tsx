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

import jwt from 'jsonwebtoken'

export function decodeToken(token: string): any {
  try {
    return jwt.decode(token)
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
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
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
        if (decoded && decoded.exp * 1000 > Date.now()) {
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
      const result = await validateUserCredentials(email, password)
      
      if (result && result.user && result.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, result.token)
        setUser(result.user)
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
      
      if (result.success && result.user && result.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, result.token)
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

  const loginWithGoogle = useCallback(async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth')
      const { auth, googleProvider } = await import('@/lib/firebase')

      // Optional: Check if Firebase is actually configured
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        console.warn('Firebase API key missing. Simulating Google Login with Demo account...')
        const mockUser = await findUserByEmail('analyst@example.com')
        if (mockUser) {
           const { generateSecureToken } = await import('@/lib/services/database')
           const token = await generateSecureToken(mockUser)
           localStorage.setItem(AUTH_TOKEN_KEY, token)
           setUser(mockUser)
           return { success: true }
        }
        return { success: false, error: 'Firebase configuration is missing in .env.local file.' }
      }

      const result = await signInWithPopup(auth, googleProvider)
      const email = result.user.email
      const name = result.user.displayName || 'Google User'

      if (!email) {
         return { success: false, error: 'Google did not provide an email address.' }
      }

      // Ensure user is in our local DB
      let dbUser = await findUserByEmail(email)
      
      if (!dbUser) {
        // Create an account automatically for new Google users
        const mockPassword = Math.random().toString(36).slice(-10) + 'A1!'
        dbUser = await createUser({ email, name, password: mockPassword, role: 'security_analyst' })
      }

      const { generateSecureToken } = await import('@/lib/services/database')
      const token = await generateSecureToken(dbUser)
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      setUser(dbUser)
      
      return { success: true }
    } catch (error: any) {
      console.error('Google login error:', error)
      return { success: false, error: error.message || 'Google Login process was interrupted.' }
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
        loginWithGoogle,
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
