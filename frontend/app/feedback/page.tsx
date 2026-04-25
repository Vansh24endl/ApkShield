'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Shield, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { saveFeedback } from '@/lib/services/database'

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      await saveFeedback({
        name: formData.name,
        email: formData.email,
        message: formData.message
      })
      
      toast.success('Thank you! Your feedback has been submitted successfully.')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  suppressHydrationWarning
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="Your Name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  suppressHydrationWarning
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="your.email@example.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  suppressHydrationWarning
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="Tell us what you think..."
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                suppressHydrationWarning
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
