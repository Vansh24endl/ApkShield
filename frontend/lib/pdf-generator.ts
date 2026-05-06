// ============================================
// PDF Report Generator
// Generates downloadable PDF reports using browser APIs
// ============================================

import type { AnalysisReport, APKMetadata } from '@/lib/types'

export function generatePDFReport(report: AnalysisReport, apk: APKMetadata): void {
  // Create a printable HTML document
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>APK Security Report - ${apk.fileName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .header { 
      border-bottom: 2px solid #00d4aa;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo { 
      font-size: 24px;
      font-weight: bold;
      color: #00d4aa;
    }
    .title { 
      font-size: 28px;
      margin-top: 10px;
      color: #1a1a1a;
    }
    .meta { 
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
    .section { 
      margin-bottom: 30px;
    }
    .section-title { 
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;
    }
    .summary-grid { 
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .summary-card { 
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-value { 
      font-size: 28px;
      font-weight: bold;
    }
    .summary-label { 
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .critical { color: #ef4444; }
    .high { color: #f97316; }
    .medium { color: #eab308; }
    .low { color: #22c55e; }
    .risk-score {
      background: #1a1a1a;
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 20px;
    }
    .risk-value {
      font-size: 48px;
      font-weight: bold;
    }
    .risk-label {
      font-size: 14px;
      color: #999;
    }
    .info-grid { 
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .info-item { 
      background: #f5f5f5;
      padding: 12px;
      border-radius: 6px;
    }
    .info-label { 
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }
    .info-value { 
      font-size: 14px;
      font-weight: 500;
      word-break: break-all;
    }
    .vuln-card { 
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .vuln-header { 
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .vuln-title { 
      font-weight: 600;
      font-size: 14px;
    }
    .vuln-type { 
      font-size: 12px;
      color: #666;
    }
    .severity-badge { 
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .severity-critical { background: #fef2f2; color: #ef4444; border: 1px solid #ef4444; }
    .severity-high { background: #fff7ed; color: #f97316; border: 1px solid #f97316; }
    .severity-medium { background: #fefce8; color: #ca8a04; border: 1px solid #ca8a04; }
    .severity-low { background: #f0fdf4; color: #22c55e; border: 1px solid #22c55e; }
    .vuln-desc { 
      font-size: 13px;
      color: #444;
      margin-bottom: 10px;
    }
    .vuln-location { 
      font-size: 12px;
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      margin-bottom: 10px;
    }
    .vuln-rec { 
      font-size: 12px;
      color: #00a080;
      padding: 10px;
      background: #f0fdf9;
      border-radius: 4px;
      border-left: 3px solid #00d4aa;
    }
    .perm-list { 
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .perm-item { 
      font-size: 12px;
      padding: 8px 12px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .perm-risky { background: #fef2f2; border: 1px solid #fecaca; }
    .perm-safe { background: #f5f5f5; border: 1px solid #e5e5e5; }
    .footer { 
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .vuln-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">APK Shield</div>
    <h1 class="title">Security Analysis Report</h1>
    <p class="meta">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="section">
    <div class="risk-score">
      <div class="risk-value ${getRiskClass(report.summary.riskScore)}">${report.summary.riskScore}</div>
      <div class="risk-label">RISK SCORE</div>
    </div>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-value critical">${report.summary.critical}</div>
        <div class="summary-label">Critical</div>
      </div>
      <div class="summary-card">
        <div class="summary-value high">${report.summary.high}</div>
        <div class="summary-label">High</div>
      </div>
      <div class="summary-card">
        <div class="summary-value medium">${report.summary.medium}</div>
        <div class="summary-label">Medium</div>
      </div>
      <div class="summary-card">
        <div class="summary-value low">${report.summary.low}</div>
        <div class="summary-label">Low</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Application Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">File Name</div>
        <div class="info-value">${apk.fileName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Package Name</div>
        <div class="info-value">${report.manifest.packageName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Version</div>
        <div class="info-value">${report.manifest.versionName} (${report.manifest.versionCode})</div>
      </div>
      <div class="info-item">
        <div class="info-label">Target SDK</div>
        <div class="info-value">API ${report.manifest.targetSdkVersion}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Min SDK</div>
        <div class="info-value">API ${report.manifest.minSdkVersion}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Debuggable</div>
        <div class="info-value">${report.manifest.debuggable ? 'Yes (!)' : 'No'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Vulnerabilities (${report.vulnerabilities.length})</h2>
    ${report.vulnerabilities.map(vuln => `
      <div class="vuln-card">
        <div class="vuln-header">
          <div>
            <div class="vuln-title">${vuln.title}</div>
            <div class="vuln-type">${vuln.type}${vuln.cweId ? ` - ${vuln.cweId}` : ''}</div>
          </div>
          <span class="severity-badge severity-${vuln.severity}">${vuln.severity}</span>
        </div>
        <div class="vuln-desc">${vuln.description}</div>
        <div class="vuln-location"><strong>Location:</strong> ${vuln.location}</div>
        <div class="vuln-rec"><strong>Recommendation:</strong> ${vuln.recommendation}</div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2 class="section-title">Permissions (${report.permissions.length})</h2>
    <div class="perm-list">
      ${report.permissions.map(perm => `
        <div class="perm-item ${perm.isRisky ? 'perm-risky' : 'perm-safe'}">
          <span>${perm.isRisky ? '!' : '+'}</span>
          <span>${perm.permission.replace('android.permission.', '')}</span>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="footer">
    <p>Generated by APK Shield Security Analysis Platform</p>
    <p>This report is for informational purposes only.</p>
  </div>
</body>
</html>
  `

  // Use browser's native print dialog which generates PDF reliably without freezing the UI
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  } else {
    alert("Please allow popups for this site to download the PDF report.")
  }
}

function getRiskClass(score: number): string {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'medium'
  return 'low'
}
