import mongoose, { Schema } from 'mongoose'

const APKMetadataSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    packageName: { type: String, default: '' },
    versionName: { type: String, default: '' },
    versionCode: { type: Number, default: 0 },
    minSdkVersion: { type: Number, default: 0 },
    targetSdkVersion: { type: Number, default: 0 },
    uploadedAt: { type: String, required: true },
    status: { type: String, enum: ['pending', 'analyzing', 'completed', 'failed'], required: true },
  },
  { timestamps: false }
)

export default mongoose.models.APKMetadata || mongoose.model('APKMetadata', APKMetadataSchema)
