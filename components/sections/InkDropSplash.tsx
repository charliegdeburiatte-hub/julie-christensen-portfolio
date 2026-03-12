'use client'

import { useEffect, useRef, useState } from 'react'

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const DELAY_MS = 600
const DURATION_MS = 3800

export function InkDropSplash() {
  const ellipseRef = useRef<SVGEllipseElement>(null)
  const [done, setDone] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('julie-splash-done')) {
      setDone(true)
      return
    }

    const delay = setTimeout(() => {
      function tick(timestamp: number) {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const elapsed = timestamp - startTimeRef.current
        const raw = Math.min(elapsed / DURATION_MS, 1)
        const progress = easeOut(raw)

        const ellipse = ellipseRef.current
        if (ellipse) {
          const vw = window.innerWidth
          const vh = window.innerHeight

          // Grows from center outward — needs to overshoot viewport edges
          const rx = vw * 1.6 * progress
          const ry = vh * 1.6 * progress

          ellipse.setAttribute('cx', String(vw / 2))
          ellipse.setAttribute('cy', String(vh / 2))
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

      {/* SVG: dark green overlay with ink hole growing from center */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          {/* Turbulence displaces the ellipse edge to look like spreading ink */}
          <filter id="ink-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025"
              numOctaves="4"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="55"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="10" />
          </filter>

          <mask id="ink-mask">
            <rect width="100%" height="100%" fill="white" />
            <ellipse
              ref={ellipseRef}
              cx="0"
              cy="0"
              rx="0"
              ry="0"
              fill="black"
              filter="url(#ink-filter)"
            />
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="#1a3a2a"
          mask="url(#ink-mask)"
        />
      </svg>

      {/* Name + tagline on top of the green — fades out as hole engulfs them */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
        <h1
          className="font-seasons font-light tracking-widest"
          style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', color: '#f0ebe3' }}
        >
          Julie
        </h1>
        <p
          className="font-seasons italic tracking-wide"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#a89070' }}
        >
          Your story, told with care.
        </p>
      </div>

    </div>
  )
}
