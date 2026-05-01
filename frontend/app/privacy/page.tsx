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
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-card p-8 text-muted-foreground space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Overview</h2>
              <p>
                APK Shield respects user privacy and is committed to protecting personal and application data. This Privacy Policy explains how data is collected, used, and protected.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <p>APK Shield may collect the following types of data:</p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">a. Uploaded APK Data</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>APK file metadata (name, size, permissions)</li>
                    <li>Code patterns and structure (for analysis)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">b. Device Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Device type and OS version</li>
                    <li>App usage statistics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">c. Log Data</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Error logs</li>
                    <li>Performance metrics</li>
                  </ul>
                </div>
              </div>

              <p className="mt-4 italic text-sm">Good news: We are not interested in your selfies, chats, or dramatic WhatsApp fights.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Information</h2>
              <p>Collected data is used for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Performing APK security analysis</li>
                <li>Improving detection algorithms</li>
                <li>Enhancing user experience</li>
                <li>Debugging and fixing issues</li>
              </ul>
              <p className="mt-4 italic text-sm">No shady selling of data. This isn’t that kind of project.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Storage and Security</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Data is processed locally or securely stored (depending on implementation)</li>
                <li>Reasonable security measures are used to prevent unauthorized access</li>
                <li>No system is completely secure, but basic protection is implemented</li>
              </ul>
              <p className="mt-4 italic text-sm">So yes, it’s safe… but not CIA-level infrastructure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Sharing</h2>
              <p>APK Shield does <strong>not sell, trade, or rent user data</strong>.</p>
              <p className="mt-4">Data may only be shared:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>If required by law</li>
                <li>For academic demonstration purposes (anonymized)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. User Rights</h2>
              <p>Users have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Know what data is being collected</li>
                <li>Request deletion of their data (if stored)</li>
                <li>Stop using the application anytime</li>
              </ul>
              <p className="mt-4 italic text-sm">Which is refreshing compared to apps that behave like clingy exes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Third-Party Services</h2>
              <p>APK Shield may use third-party libraries/tools for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Analysis</li>
                <li>Logging</li>
                <li>Performance monitoring</li>
              </ul>
              <p className="mt-4">These services may have their own privacy policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Children’s Privacy</h2>
              <p>APK Shield is not intended for users under the age of 13.</p>
              <p className="mt-4">No intentional data collection from minors is performed.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">9. Updates to Privacy Policy</h2>
              <p>This Privacy Policy may be updated periodically.</p>
              <p className="mt-4">Users are advised to review it regularly for any changes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact Information</h2>
              <p>For any queries regarding Terms or Privacy Policy:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Developer Name:</strong> Vansh Dhumal</li>
                <li><strong>Project:</strong> APK Shield</li>
                <li><strong>Academic Purpose Only</strong></li>
              </ul>
            </section>

            <hr className="my-10 border-border" />

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Conclusion</h2>
              <p>
                APK Shield is an academic tool designed to promote awareness of Android application security. While it provides useful insights, users should exercise independent judgment and not rely solely on automated analysis.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
