'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { sendOtpEmail } from '@/lib/services/otp'

export default function LoginPage() {
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, loginWithOtp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      toast.success('Welcome back!')
      router.push('/dashboard')
    } else {
      if (result.error?.includes('Account not verified')) {
        toast.info('Account not verified. Sending OTP...')
        const otpResult = await sendOtpEmail(email)
        if (otpResult.success) {
          toast.success('Verification OTP sent to your email.')
          setStep('otp')
        } else {
          toast.error(otpResult.error || 'Failed to send OTP')
        }
      } else {
        toast.error(result.error || 'Login failed')
      }
    }
    
    setIsLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await loginWithOtp(email, otp)
    
    if (result.success) {
      toast.success('Email verified successfully! Welcome back.')
      router.push('/dashboard')
    } else {
      toast.error(result.error || 'Invalid OTP')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">APK Shield</span>
          </Link>

          {step === 'login' ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to your account to continue analyzing APKs
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="analyst@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Create one
                </Link>
              </p>

              {/* Demo credentials */}
              <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-xs font-medium text-muted-foreground">Demo Credentials</p>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <p>analyst@example.com / demo123</p>
                  <p>dev@example.com / demo123</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">Verify Email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We've sent a 6-digit verification code to <span className="font-medium text-foreground">{email}</span>
              </p>

              <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10 text-center text-lg tracking-widest font-mono"
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Verify & Continue
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or wait a minute.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <Shield className="h-24 w-24 text-primary drop-shadow-[0_0_30px_var(--neon-glow)]" />
          <h2 className="mt-8 text-center text-3xl font-bold">
            Secure Your Android Apps
          </h2>
          <p className="mt-4 max-w-md text-center text-muted-foreground">
            Professional static analysis to identify vulnerabilities before they become threats
          </p>
        </div>
      </div>
    </div>
  )
}
