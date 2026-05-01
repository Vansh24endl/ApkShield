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
            <h1 className="text-3xl font-bold tracking-tight">Terms & Conditions</h1>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-card p-8 text-muted-foreground space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p>
                Welcome to <strong>APK Shield</strong>, a mobile application developed as part of a minor academic project. APK Shield is designed to analyze Android applications (APK files) and identify potential security vulnerabilities, malicious behaviors, and risks.
              </p>
              <p className="mt-4">
                By downloading, installing, or using APK Shield, you agree to comply with and be bound by these Terms and Conditions and Privacy Policy. If you do not agree, you should not use this application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Application</strong> refers to APK Shield.</li>
                <li><strong>User</strong> refers to any individual using the application.</li>
                <li><strong>Data</strong> refers to any information collected during usage.</li>
                <li><strong>Service</strong> refers to APK analysis and vulnerability detection features.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Scope of Service</h2>
              <p>APK Shield provides the following functionalities:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Static analysis of Android APK files</li>
                <li>Detection of vulnerabilities and malicious patterns</li>
                <li>Security risk assessment reports</li>
                <li>Informational recommendations for safer usage</li>
              </ul>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-3">Important reality check:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>This app is <strong>not a replacement for professional security tools</strong></li>
                  <li>Results are <strong>indicative, not guaranteed</strong></li>
                  <li>It does <strong>not guarantee 100% malware detection</strong> (nothing does, despite what shady antivirus ads say)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. User Responsibilities</h2>
              <p>When using APK Shield, users agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Use the application only for <strong>legal and ethical purposes</strong></li>
                <li>Not upload or analyze APKs for malicious exploitation</li>
                <li>Not attempt to reverse-engineer or modify the application</li>
                <li>Ensure that analyzed APK files are legally obtained</li>
              </ul>
              <p className="mt-4 italic text-sm">Basically, don’t do illegal stuff and then act surprised when consequences exist.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Intellectual Property Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>APK Shield is developed as an academic project and retains all intellectual property rights.</li>
                <li>Users are <strong>not allowed to copy, modify, distribute, or reproduce</strong> any part of the application without permission.</li>
                <li>Any third-party libraries used remain the property of their respective owners.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p>APK Shield is provided <strong>“as-is”</strong>, without any warranties.</p>
              <p className="mt-4">The developers shall not be held responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Incorrect analysis results</li>
                <li>Damage caused by malicious APKs</li>
                <li>Data loss or system issues</li>
                <li>Misuse of the application</li>
              </ul>
              <p className="mt-4 italic text-sm">Translation: if you ignore warnings and install shady APKs anyway, that’s on you.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Termination of Access</h2>
              <p>The application reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Restrict or terminate access</li>
                <li>Block users violating terms</li>
                <li>Update or discontinue features without prior notice</li>
              </ul>
              <p className="mt-4 italic text-sm">Because maintaining absolute stability forever is a fantasy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Changes to Terms</h2>
              <p>These Terms & Conditions may be updated periodically.</p>
              <p className="mt-4">Users are responsible for reviewing updates. Continued use of the application implies acceptance of revised terms.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
