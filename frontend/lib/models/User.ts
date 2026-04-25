import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // Should be hashed in production
    role: { type: String, enum: ['security_analyst', 'developer'], required: true },
    createdAt: { type: String, required: true },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
    otpAttempts: { type: Number, required: false, default: 0 },
    isVerified: { type: Boolean, required: false, default: false },
    avatar: { type: String, required: false },
  },
  { timestamps: false }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
