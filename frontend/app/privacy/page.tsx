import { Header } from '@/components/layout/header'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-card p-8 text-muted-foreground">
            <p className="mb-4">Last Updated: July 2026</p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Data Collection</h2>
            <p className="mb-4">When you use APK Shield to analyze your Android applications, we temporarily collect and process the APK files you upload strictly for security analysis purposes.</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Data Security & Storage</h2>
            <p className="mb-4">Uploaded APKs are analyzed in heavily sandboxed environments. After the analysis is completed, all binary files are securely deleted from our servers.</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Information</h2>
            <p className="mb-4">Account details, email addresses, and scan reports are encrypted and stored safely. We do not sell or share your personal information with any third-party advertisers.</p>
          </div>
        </div>
      </div>
    </>
  )
}
