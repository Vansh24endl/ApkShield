'use server'

import connectToDatabase from '@/lib/mongodb'
import UserModel from '@/lib/models/User'
import nodemailer from 'nodemailer'
import type { User } from '@/lib/types'

let _transporter: nodemailer.Transporter | null = null

async function getTransporter() {
  if (_transporter) return _transporter

  // If real credentials exist, use them
  if (process.env.EMAIL_PASS || process.env.SMTP_PASS) {
    _transporter = nodemailer.createTransport({
      service: process.env.SMTP_HOST ? undefined : 'gmail',
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    })
  } else {
    // No credentials provided? Generate a dummy Ethereal account!
    console.log("No SMTP credentials found. Automatically generating a test account...")
    const testAccount = await nodemailer.createTestAccount()
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    })
  }
  return _transporter
}

function sanitize<T>(data: any): T {
  if (!data) return data
  return JSON.parse(JSON.stringify(data))
}

export async function sendOtpEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()
    
    const user = await UserModel.findOne({ email })
    if (!user) {
      return { success: false, error: 'User with this email not found' }
    }

    // Check for recent OTP requests (rate limiting to prevent email bombing)
    if (user.otpExpiry && user.otpExpiry > new Date(Date.now() + 9 * 60 * 1000)) {
      // If the current OTP was generated less than 1 minute ago, block a new request
      return { success: false, error: 'Please wait before requesting a new OTP.' }
    }

    // Generate 6-digit OTP using Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)
    const { randomInt } = await import('crypto')
    const otp = randomInt(100000, 1000000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save to user
    user.otp = otp
    user.otpExpiry = otpExpiry
    user.otpAttempts = 0
    await user.save()

    const transporter = await getTransporter()

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"APK Shield" <noreply@apkshield.com>',
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP for logging into APK Shield is: ${otp}\n\nIt is valid for 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Login to APK Shield</h2>
          <p style="color: #555;">Your one-time password (OTP) is:</p>
          <h1 style="background: #f4f4f5; padding: 15px 20px; border-radius: 8px; letter-spacing: 5px; text-align: center; color: #000;">${otp}</h1>
          <p style="color: #777; font-size: 13px;">This code will expire in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    })

    // Log the OTP and the public preview URL for developers
    if (!process.env.EMAIL_PASS && !process.env.SMTP_PASS) {
      console.log(`\n==============================================`)
      console.log(`[TESTING] OTP generated for ${email}: ${otp}`)
      console.log(`[TESTING] Preview the email here: ${nodemailer.getTestMessageUrl(info)}`)
      console.log(`==============================================\n`)
    }

    return { success: true }
  } catch (error) {
    console.error('Email send failed:', error)
    return { success: false, error: 'Failed to send OTP email. Please check server logs.' }
  }
}

export async function verifyOtpAndLogin(email: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    await connectToDatabase()
    
    // We do not use lean here because we need to call save
    const user = await UserModel.findOne({ email })
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (!user.otp || !user.otpExpiry) {
      return { success: false, error: 'No active OTP session' }
    }

    // Prevent brute-force attacks by limiting attempts
    if (user.otpAttempts && user.otpAttempts >= 5) {
      user.otp = undefined
      user.otpExpiry = undefined
      await user.save()
      return { success: false, error: 'Too many invalid attempts. Please request a new OTP.' }
    }

    if (user.otpExpiry < new Date()) {
      return { success: false, error: 'OTP has expired' }
    }

    // Constant-time comparison to mitigate timing attacks
    const { timingSafeEqual } = await import('crypto')
    const isMatch = user.otp.length === otp.length && timingSafeEqual(Buffer.from(user.otp), Buffer.from(otp))

    if (!isMatch) {
      user.otpAttempts = (user.otpAttempts || 0) + 1
      await user.save()
      return { success: false, error: 'Invalid OTP' }
    }

    // Clear OTP upon successful verification
    user.otp = undefined
    user.otpExpiry = undefined
    user.otpAttempts = 0
    user.isVerified = true
    await user.save()

    const userObj = user.toObject() as any
    delete userObj.password
    delete userObj._id
    delete userObj.__v
    delete userObj.otp
    delete userObj.otpExpiry
    delete userObj.otpAttempts
    
    return { success: true, user: sanitize(userObj) as User }
  } catch (error) {
    console.error('OTP verify failed:', error)
    return { success: false, error: 'An error occurred during verification' }
  }
}
