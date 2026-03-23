import mongoose, { Schema } from 'mongoose'

const AnalysisReportSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    apkId: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: String, required: true },
    completedAt: { type: String, required: true },
    status: { type: String, enum: ['completed', 'failed'], required: true },
    summary: {
      totalVulnerabilities: { type: Number, required: true },
      critical: { type: Number, required: true },
      high: { type: Number, required: true },
      medium: { type: Number, required: true },
      low: { type: Number, required: true },
      riskScore: { type: Number, required: true },
    },
    manifest: { type: Schema.Types.Mixed, required: true },
    permissions: [{ type: Schema.Types.Mixed }],
    vulnerabilities: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: false }
)

export default mongoose.models.AnalysisReport || mongoose.model('AnalysisReport', AnalysisReportSchema)
