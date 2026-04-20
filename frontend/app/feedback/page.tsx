import { Header } from '@/components/layout/header'
import { Shield } from 'lucide-react'

export default function FeedbackPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="text-muted-foreground mb-6">We value your feedback to improve APK Shield. Please fill out the form below to let us know your thoughts.</p>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="your.email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-32" placeholder="Tell us what you think..."></textarea>
              </div>
              <button type="button" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 font-medium transition-colors hover:bg-primary/90">
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
