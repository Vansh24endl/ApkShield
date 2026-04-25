'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { 
  User, 
  Bell, 
  Shield as ShieldIcon, 
  Key, 
  Moon, 
  Sun,
  Smartphone,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth()
  const { theme: currentTheme, setTheme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setAvatar(user.avatar || '')
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) return null

  const handleSave = async () => {
    setIsSaving(true)
    
    if (activeTab === 'profile') {
      const result = await updateProfile({ name, avatar })
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        alert('Error saving: ' + result.error)
      }
    } else {
      // Fake save for other tabs
      setTimeout(() => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }, 800)
    }
    
    setIsSaving(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // If file is smaller than 500KB, just use it directly without resizing
      if (file.size < 500 * 1024) {
        const reader = new FileReader()
        reader.onloadend = () => setAvatar(reader.result as string)
        reader.readAsDataURL(file)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 256
          let width = img.width
          let height = img.height

          if (width > height && width > MAX_SIZE) {
            height = Math.round(height * (MAX_SIZE / width))
            width = MAX_SIZE
          } else if (height > MAX_SIZE) {
            width = Math.round(width * (MAX_SIZE / height))
            height = MAX_SIZE
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height)
             const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
             setAvatar(compressedBase64)
          } else {
             setAvatar(reader.result as string)
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account preferences, security, and developer settings.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-col space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="flex-1 max-w-3xl">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 min-h-[500px] shadow-lg">
              
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
                    <p className="text-sm text-muted-foreground mb-6">Update your account details and public profile.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* DP Uploader */}
                    <div className="flex items-center gap-6 pb-4 border-b border-border/50">
                      <div className="relative group">
                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center relative">
                          {avatar ? (
                            <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-10 w-10 text-muted-foreground" />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground mb-2">Upload a cool new DP for your account.</p>
                        <Button type="button" variant="outline" size="sm" className="relative cursor-pointer">
                          Upload Image
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleAvatarChange}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input 
                        type="email" 
                        className="flex h-10 w-full rounded-md border border-input bg-input/20 px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={user?.email || ''} 
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email addresses cannot be changed directly.</p>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Current Role</label>
                      <div className="capitalize font-medium text-primary bg-primary/10 w-fit px-4 py-1.5 rounded-full text-sm border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.1)]">
                        {user?.role.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Security & Authentication</h2>
                    <p className="text-sm text-muted-foreground mb-6">Manage your password and security preferences.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-lg border border-border p-5 bg-muted/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            Two-Factor Authentication
                            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/30 animate-pulse">Recommended</span>
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security using OTP.</p>
                        </div>
                        <Button variant="outline" size="sm" className="whitespace-nowrap">Enable 2FA</Button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-medium text-lg">Change Password</h3>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input type="password" placeholder="••••••••" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input type="password" placeholder="••••••••" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Notification Preferences</h2>
                    <p className="text-sm text-muted-foreground mb-6">Control how and when you receive alerts.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'Scan Completions', desc: 'Get notified when an APK analysis finishes.' },
                      { title: 'Critical Vulnerabilities', desc: 'Immediate alerts for high/critical risks found.' },
                      { title: 'Weekly Reports', desc: 'Summary of your workspace activity and trends.' },
                      { title: 'Security Updates', desc: 'Platform updates and security announcements.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 bg-background/30 hover:bg-muted/30 transition-all duration-300">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-foreground after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Developer API Settings */}
              {activeTab === 'api' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Developer & API</h2>
                    <p className="text-sm text-muted-foreground mb-6">Manage API keys for remote CI/CD integrations.</p>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-500 mb-1">Secret Keys</h4>
                        <p className="text-sm text-amber-500/90 leading-relaxed">
                          Keep your API keys completely secure. Never share them in publicly accessible areas, client-side code, or version control repositories.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">Active API Keys</h3>
                      <Button size="sm" variant="outline" className="border-primary/50 hover:bg-primary/10 hover:text-primary">
                        <Key className="h-4 w-4 mr-2" />
                        Generate New Key
                      </Button>
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden bg-background/50">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                          <tr>
                            <th className="px-4 py-3">Key Name</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-4 font-medium flex items-center gap-2">
                              <ShieldIcon className="h-4 w-4 text-primary" />
                              CI/CD Pipeline
                            </td>
                            <td className="px-4 py-4 text-muted-foreground">Oct 24, 2025</td>
                            <td className="px-4 py-4 text-right">
                              <button className="text-destructive font-medium hover:underline text-xs">Revoke</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Appearance</h2>
                    <p className="text-sm text-muted-foreground mb-6">Customize how the dashboard looks on your device.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'system', label: 'System Default', icon: Smartphone },
                    ].map((themeOpt) => {
                      const Icon = themeOpt.icon
                      const isActive = currentTheme === themeOpt.id
                      
                      return (
                        <button 
                          key={themeOpt.id}
                          onClick={() => setTheme(themeOpt.id)}
                          className={cn(
                            "w-full border-2 rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.02]",
                            isActive 
                              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.15)]" 
                              : "border-border hover:border-primary/50 bg-background/50"
                          )}
                        >
                          <Icon className={cn("h-8 w-8", isActive ? "text-primary" : "text-foreground")} />
                          <span className="font-medium">{themeOpt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-4">
                {saved && (
                  <span className="flex items-center gap-2 text-sm font-medium text-green-500 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="h-5 w-5" />
                    Settings applied!
                  </span>
                )}
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="gap-2 min-w-[140px] shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
