'use client'

import { useEffect, useState } from 'react'
import { Joyride, CallBackProps, STATUS, Step } from 'react-joyride'
import { useTheme } from 'next-themes'

export function DashboardTour() {
  const [run, setRun] = useState(false)
  const { theme } = useTheme()

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Welcome to APK Shield! 🛡️</h3>
          <p className="text-sm">Let\'s take a quick tour of your security dashboard to get you started.</p>
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '#tour-upload-btn',
      content: 'Click here to upload your Android APK file for a comprehensive static security analysis.',
      skipBeacon: true,
    },
    {
      target: '#tour-stats-grid',
      content: 'Here you can see a high-level summary of all your scans, including the total number of vulnerabilities and your average risk score.',
    },
    {
      target: '#tour-vuln-chart',
      content: 'This chart visualizes the distribution of vulnerabilities across different severity levels. Keep the red and orange sections as small as possible!',
    },
    {
      target: '#tour-recent-scans',
      content: 'Your most recent analysis reports will appear here. You can click on any scan to view the detailed vulnerability breakdown.',
    }
  ]

  useEffect(() => {
    // Only run tour once per user by checking localStorage
    const hasCompletedTour = localStorage.getItem('apksheld_tour_completed')
    if (!hasCompletedTour) {
      // Set it immediately so a page refresh doesn't trigger it again
      localStorage.setItem('apksheld_tour_completed', 'true')
      
      // Delay slightly to ensure UI is fully rendered
      const timer = setTimeout(() => {
        setRun(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Allow manual triggering of the tour
    const handleStartTour = () => setRun(true)
    window.addEventListener('start-dashboard-tour', handleStartTour)
    return () => window.removeEventListener('start-dashboard-tour', handleStartTour)
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      localStorage.setItem('apksheld_tour_completed', 'true')
    }
  }

  const isDark = theme === 'dark' || 
    (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#10b981', // green-500 equivalent (or use primary hex)
          textColor: isDark ? '#f8fafc' : '#0f172a',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          overlayColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: '6px',
        },
        buttonBack: {
          color: isDark ? '#cbd5e1' : '#64748b',
        },
        buttonSkip: {
          color: isDark ? '#cbd5e1' : '#64748b',
        }
      }}
    />
  )
}
