import Link from 'next/link'
import { Shield, Github, Linkedin, Mail, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">ApkShield</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Finding vulnerabilities, dangerous permissions, and all other information regarding the security of Android apps is made easy with APK Shield.
            </p>
            {/* MacOS Dock Animation for Social Links */}
            <div className="group/dock mt-6 inline-flex items-center gap-3 rounded-2xl border border-border/50 bg-card/50 px-4 py-3 shadow-lg backdrop-blur-md">
              <Link href="https://github.com/Vansh24endl/ApkShield" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground origin-bottom transition-all duration-200 hover:-translate-y-[15px] hover:scale-[1.7] hover:text-primary hover:z-10">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground origin-bottom transition-all duration-200 hover:-translate-y-[15px] hover:scale-[1.7] hover:text-primary hover:z-10">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="mailto:contact@apkshield.com" className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground origin-bottom transition-all duration-200 hover:-translate-y-[15px] hover:scale-[1.7] hover:text-primary hover:z-10">
                <Mail className="h-6 w-6" />
              </Link>
              <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground origin-bottom transition-all duration-200 hover:-translate-y-[15px] hover:scale-[1.7] hover:text-primary hover:z-10">
                <Globe className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Pages</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/upload" className="text-muted-foreground hover:text-foreground transition-colors">Upload APK</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/history" className="text-muted-foreground hover:text-foreground transition-colors">Scan History</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Security Guidelines</Link></li>
              <li><Link href="/feedback" className="text-muted-foreground hover:text-foreground transition-colors">Feedback</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Information</Link></li>
              <li><Link href="mailto:admin@apkshield.com" className="text-muted-foreground hover:text-foreground transition-colors">Contact Admin</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#team" className="text-muted-foreground hover:text-foreground transition-colors">Team</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy and Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms and Conditions</Link></li>
              <li><Link href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">Linkedin</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>© 2026 APK Shield. All rights reserved. Made for Android Developers & Security Analysts. v1.0.0</p>
        </div>
      </div>
    </footer>
  )
}
