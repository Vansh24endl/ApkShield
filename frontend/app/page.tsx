import Link from 'next/link'
import { Shield, Bug, FileSearch, Lock, Zap, BarChart3, Users } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { HeroActions } from '@/components/hero-actions'
import { CtaActions } from '@/components/cta-actions'
import { TeamMemberPhoto } from '@/components/team-member-photo'

export default function HomePage() {
  const features = [
    {
      icon: FileSearch,
      title: 'APK Extraction',
      description: 'Automatically extract and analyze APK contents including AndroidManifest.xml and resources',
    },
    {
      icon: Lock,
      title: 'Permission Analysis',
      description: 'Identify dangerous permissions that could compromise user privacy and security',
    },
    {
      icon: Bug,
      title: 'Vulnerability Detection',
      description: 'Detect common security flaws including exported components and insecure configurations',
    },
    {
      icon: BarChart3,
      title: 'Risk Scoring',
      description: 'Get a comprehensive risk score based on detected vulnerabilities and their severity',
    },
  ]

  const stats = [
    { value: '1000+', label: 'APKs Analyzed' },
    { value: '5000+', label: 'Vulnerabilities Found' },
    { value: '99.9%', label: 'Detection Rate' },
    { value: '<30s', label: 'Average Scan Time' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Static Analysis for Android Security
            </div>

            {/* Heading */}
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Detect Security Vulnerabilities
              <br />
              <span className="text-primary">Before They Exploit You</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              APK Shield provides comprehensive static analysis for Android applications.
              Identify dangerous permissions, exposed components, and security misconfigurations
              in seconds.
            </p>

            {/* CTA Buttons - Using Client Component Island */}
            <div className="mt-10">
              <HeroActions />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comprehensive Security Analysis
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Our analysis engine examines every aspect of your APK to identify potential security risks
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-border/50 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Three simple steps to identify security vulnerabilities in your Android applications
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Upload APK', desc: 'Drag and drop your APK file or browse to select' },
              { step: '02', title: 'Automatic Analysis', desc: 'Our engine extracts and analyzes the application' },
              { step: '03', title: 'Review Report', desc: 'Get detailed findings with remediation guidance' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/20 p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
            <div className="relative">
              <Shield className="mx-auto mb-6 h-16 w-16 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Secure Your Applications?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Start analyzing your APK files today and discover vulnerabilities before attackers do.
              </p>
              <div className="mt-8">
                <CtaActions />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      <section id="team" className="py-24 bg-muted/30 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              The dedicated minds behind APK Shield
            </p>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-12">
            {[
              {
                name: 'Vansh Dhumal',
                role: 'Team Leader',
                description: 'Full Stack Developer & Security Architect leading the technical vision.',
                imageSrc: '/team/TeamLeader.png'
              },
              {
                name: 'Aaryesh Namdeo',
                role: 'Security Researcher',
                description: 'Backend Developer specializing in static and dynamic analysis workflows.',
                imageSrc: '/team/CoLeader.png'
              },
              {
                name: 'Nupur Barskar',
                role: 'UI/UX Designer',
                description: 'Frontend Developer crafting intuitive and responsive user experiences.',
                imageSrc: '/team/nupur.jpeg'
              },
              {
                name: 'Kanak Patil',
                role: 'QA & Cloud Engineer',
                description: 'Ensuring seamless deployment, database management, and testing.',
                imageSrc: '/team/kanak.jpeg'
              },
            ].map((member) => (
              <div
                key={member.name}
                className="group relative flex w-64 flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:z-10 hover:-translate-y-6 hover:scale-110 hover:border-primary/50 hover:bg-card/90 hover:shadow-2xl"
              >
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                  <TeamMemberPhoto src={member.imageSrc} alt={member.name} />
                </div>
                <h3 className="mb-1 text-lg font-semibold transition-all duration-300 group-hover:text-primary">{member.name}</h3>
                <p className="mb-3 text-sm font-medium text-primary transition-all duration-300">{member.role}</p>
                <p className="text-sm text-muted-foreground transition-opacity duration-300 group-hover:opacity-100">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
