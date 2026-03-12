'use client'

import { useEffect, useRef, useState } from 'react'

// Easing function — ease-in-out cubic
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function InkDropSplash() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<SVGSVGElement>(null)
  const ellipseRef = useRef<SVGEllipseElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Check if user has already passed the splash (e.g. on back navigation)
    const alreadySeen = sessionStorage.getItem('julie-splash-done')
    if (alreadySeen) {
      setDone(true)
      return
    }

    const section = sectionRef.current
    const ellipse = ellipseRef.current
    if (!section || !ellipse) return

    const splashHeight = section.getBoundingClientRect().height

    function update() {
      if (!section || !ellipse) return
      const scrollY = window.scrollY
      const raw = Math.min(scrollY / splashHeight, 1)
      const progress = easeInOut(raw)

      const vw = window.innerWidth
      const vh = window.innerHeight

      // Ellipse starts small at bottom-centre, expands to cover viewport
      const maxRx = vw * 0.9
      const maxRy = vh * 1.2

      const rx = maxRx * progress
      const ry = maxRy * progress

      // cy starts below viewport and rises to centre as progress increases
      const startCy = vh + 50
      const endCy = vh * 0.5
      const cy = startCy - (startCy - endCy) * progress

      ellipse.setAttribute('rx', String(rx))
      ellipse.setAttribute('ry', String(ry))
      ellipse.setAttribute('cx', String(vw / 2))
      ellipse.setAttribute('cy', String(cy))

      if (progress >= 1) {
        sessionStorage.setItem('julie-splash-done', '1')
        setDone(true)
        window.removeEventListener('scroll', update)
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // run once on mount in case page is already scrolled

    return () => window.removeEventListener('scroll', update)
  }, [])

  if (done) return null

  return (
    <div
      ref={sectionRef}
      // Tall section gives scroll room for the reveal
      className="relative"
      style={{ height: '160vh' }}
    >
      {/* Content behind the overlay — name + tagline */}
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: '#f5f2ee' }}
      >
        <h1
          className="font-seasons font-light text-6xl md:text-8xl tracking-wide mb-4"
          style={{ color: '#3a2e1e' }}
        >
          Julie
        </h1>
        <p
          className="font-seasons italic text-xl md:text-2xl tracking-wide"
          style={{ color: '#8a7560' }}
        >
          Your story, told with care.
        </p>
      </div>

      {/* SVG overlay with ink-drop mask */}
      <svg
        ref={overlayRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 50 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial gradient for soft/feathered ink edge */}
          <radialGradient id="inkGradient" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <mask id="inkMask">
            {/* White rect = show overlay everywhere */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black (via gradient) ellipse = cut the hole */}
            <ellipse
              ref={ellipseRef}
              cx="50%"
              cy="110%"
              rx="0"
              ry="0"
              fill="url(#inkGradient)"
            />
          </mask>
        </defs>

        {/* Dark green overlay, masked by the ink-drop ellipse */}
        <rect
          width="100%"
          height="100%"
          fill="#1a3a2a"
          mask="url(#inkMask)"
        />
      </svg>
    </div>
  )
}
