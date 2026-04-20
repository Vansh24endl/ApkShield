import { Header } from '@/components/layout/header'
import { Shield, Mail, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Contact Information</h1>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>contact@apkshield.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+91 72489 79986</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>123 Security Ave, Indore City</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
              <p className="text-sm text-muted-foreground mb-4">Have questions? Reach out directly via our email or call our support line.</p>
              <a href="mailto:support@apkshield.com" className="inline-flex items-center justify-center w-full rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 font-medium mt-4 transition-colors hover:bg-primary/90">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
