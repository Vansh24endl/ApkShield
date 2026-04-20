import { Header } from '@/components/layout/header'
import { Shield } from 'lucide-react'

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Terms and Conditions</h1>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-card p-8 text-muted-foreground">
            <p className="mb-4">Welcome to APK Shield.</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Usage Agreement</h2>
            <p className="mb-4">By accessing or using our platform, you agree to comply with our security protocols. You must only upload applications that you have the legal right to analyze.</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Illicit Usage</h2>
            <p className="mb-4">The APK Shield platform must not be used to reverse-engineer software for malicious intentions. Any abuse of our analysis engine may result in a permanent ban and possible legal actions from the respective parties.</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Limitation of Liability</h2>
            <p className="mb-4">While we strive for accurate vulnerability detection, APK Shield is provided "as is". We are not liable for any undiscovered security flaws in your applications after scanning or any direct/indirect damages arising from the usage of our tool.</p>
          </div>
        </div>
      </div>
    </>
  )
}
