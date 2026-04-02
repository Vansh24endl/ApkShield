'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, User, Users, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import type { UserRole } from '@/lib/types'

export default function SignupPage() {
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [role, setRole] = useState<UserRole>('developer')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signup, loginWithOtp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setIsLoading(true)

    const result = await signup(email, password, name, role)
    
    if (result.success && result.requireOtp) {
      toast.success('Account created! Please check your email for the OTP.')
      setStep('otp')
    } else if (result.success) {
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } else {
      toast.error(result.error || 'Signup failed')
    }
    
    setIsLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await loginWithOtp(email, otp)
    
    if (result.success) {
      toast.success('Email verified successfully! Welcome.')
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

          {step === 'details' ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Start analyzing Android applications for security vulnerabilities
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
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
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
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

                  <div className="space-y-3">
                    <Label>Role</Label>
                    <RadioGroup value={role} onValueChange={(val) => setRole(val as UserRole)} className="grid grid-cols-2 gap-4">
                      <div>
                        <RadioGroupItem value="developer" id="developer" className="peer sr-only" />
                        <Label
                          htmlFor="developer"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <User className="mb-2 h-6 w-6" />
                          <span className="text-sm font-medium">Developer</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="security_analyst" id="security_analyst" className="peer sr-only" />
                        <Label
                          htmlFor="security_analyst"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Users className="mb-2 h-6 w-6" />
                          <span className="text-sm font-medium">Security Analyst</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_var(--tw-gradient-stops))] from-accent/10 to-transparent" />
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <div className="grid grid-cols-2 gap-4">
            {['Manifest Analysis', 'Permission Scan', 'Vulnerability Detection', 'Risk Scoring'].map((feature) => (
              <div
                key={feature}
                className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-center backdrop-blur"
              >
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <h2 className="mt-8 text-center text-2xl font-bold">
            Enterprise-Grade Security
          </h2>
          <p className="mt-4 max-w-md text-center text-muted-foreground">
            Join security teams and developers who trust APK Shield for their Android security analysis
          </p>
        </div>
      </div>
    </div>
  )
}