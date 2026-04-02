const mongoose = require('mongoose');

const VulnerabilitySchema = new mongoose.Schema({
  type: String, // e.g., 'Insecure Storage', 'Weak Crypto'
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  description: String,
  recommendation: String
});

const ApkJobSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  originalFilePath: String,
  modifiedFilePath: String,
  status: { 
    type: String, 
    enum: [
      'Pending', 
      'Validity Check Failed',
      'Assessing Security',
      'Analysis Failed',
      'Awaiting Review', 
      'Approved',
      'Rejected',
      'Injecting Layers',
      'Injection Failed',
      'Testing Compatibility',
      'Validation Failed',
      'Completed'
    ],
    default: 'Pending'
  },
  layers: [String], // e.g., ['Obfuscation', 'Anti-Tamper', 'Encryption']
  report: {
    staticAnalysis: String,
    manifestExtracted: Boolean,
    vulnerabilities: [VulnerabilitySchema]
  },
  logs: [{
    stage: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ApkJob', ApkJobSchema);
