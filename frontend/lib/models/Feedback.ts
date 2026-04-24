import mongoose, { Schema } from 'mongoose'

const FeedbackSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: String, required: true }
  },
  { timestamps: false }
)

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)
