'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('julie-cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('julie-cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('julie-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary border-t border-border-color px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-text-secondary max-w-prose">
          This site uses cookies to remember your preferences (like light or dark mode). No
          tracking or advertising cookies are used.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" onClick={handleAccept}>
            Got it
          </Button>
          <Button variant="ghost" onClick={handleDecline}>
            No thanks
          </Button>
        </div>
      </div>
    </div>
  )
}
