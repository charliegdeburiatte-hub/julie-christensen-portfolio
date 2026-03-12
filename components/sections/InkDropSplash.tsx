'use client'

import { useEffect, useRef, useState } from 'react'

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const DELAY_MS = 500    // pause before ink starts spreading
const DURATION_MS = 2000 // total animation length

export function InkDropSplash() {
  const ellipseRef = useRef<SVGEllipseElement>(null)
  const [done, setDone] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Skip splash if already seen this session
    if (sessionStorage.getItem('julie-splash-done')) {
      setDone(true)
      return
    }

    const delay = setTimeout(() => {
      function tick(timestamp: number) {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const elapsed = timestamp - startTimeRef.current
        const raw = Math.min(elapsed / DURATION_MS, 1)
        const progress = easeInOut(raw)

        const ellipse = ellipseRef.current
        if (ellipse) {
          const vw = window.innerWidth
          const vh = window.innerHeight

          // Ellipse grows from below viewport upward and outward
          const rx = vw * 1.4 * progress
          const ry = vh * 1.5 * progress
          const cx = vw / 2
          const startCy = vh + 80
          const endCy = vh * 0.45
          const cy = startCy - (startCy - endCy) * progress

          ellipse.setAttribute('cx', String(cx))
          ellipse.setAttribute('cy', String(cy))
          ellipse.setAttribute('rx', String(rx))
          ellipse.setAttribute('ry', String(ry))
        }

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          sessionStorage.setItem('julie-splash-done', '1')
          setDone(true)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }, DELAY_MS)

    return () => {
      clearTimeout(delay)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (done) return null

  return (
    <div className="fixed inset-0" style={{ zIndex: 100 }}>

      {/* Warm background — visible through the growing ink hole */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: '#f5f2ee' }}
      >
        <h1
          className="font-seasons font-light tracking-widest"
          style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', color: '#3a2e1e' }}
        >
          Julie
        </h1>
        <p
          className="font-seasons italic tracking-wide"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: '#8a7560' }}
        >
          Your story, told with care.
        </p>
      </div>

      {/* Dark green overlay with growing ink-drop hole */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          {/* Blur gives the soft feathered ink-bleed edge */}
          <filter id="splash-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="22" />
          </filter>

          <mask id="splash-mask">
            {/* White = show overlay (green) */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black ellipse = cut hole through overlay, soft edge via blur */}
            <ellipse
              ref={ellipseRef}
              cx="0"
              cy="0"
              rx="0"
              ry="0"
              fill="black"
              filter="url(#splash-blur)"
            />
          </mask>
        </defs>

        {/* The green overlay — hole grows as ellipse expands */}
        <rect
          width="100%"
          height="100%"
          fill="#1a3a2a"
          mask="url(#splash-mask)"
        />
      </svg>

    </div>
  )
}
