'use client'

import { useEffect, useRef, useState } from 'react'

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 2.5)
}

const DELAY_MS = 700
const DURATION_MS = 6000

export function InkDropSplash() {
  const ellipseRef = useRef<SVGEllipseElement>(null)
  const turbRef = useRef<SVGFETurbulenceElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
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

        const vw = window.innerWidth
        const vh = window.innerHeight

        // Grow ellipse from center outward
        const ellipse = ellipseRef.current
        if (ellipse) {
          const rx = vw * 1.7 * progress
          const ry = vh * 1.7 * progress
          ellipse.setAttribute('cx', String(vw / 2))
          ellipse.setAttribute('cy', String(vh / 2))
          ellipse.setAttribute('rx', String(rx))
          ellipse.setAttribute('ry', String(ry))
        }

        // Slowly drift turbulence baseFrequency to make ink feel alive
        const turb = turbRef.current
        if (turb) {
          const freq = 0.012 + progress * 0.006
          turb.setAttribute('baseFrequency', String(freq))
        }

        // Fade text out early — gone by 25% through animation
        const text = textRef.current
        if (text) {
          const textOpacity = Math.max(0, 1 - progress / 0.22)
          text.style.opacity = String(textOpacity)
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

      {/* SVG: dark green overlay, ink hole expands from center */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <filter id="ink-filter" x="-40%" y="-40%" width="180%" height="180%"
            color-interpolation-filters="linearRGB">
            {/*
              1. Turbulence — fractal noise gives the organic ink surface
              2. DisplacementMap — warps the ellipse edge into organic tendrils
              3. Small blur — softens before thresholding
              4. ColorMatrix threshold — turns soft gradient into hard ink edge
                 (high alpha multiplier + negative bias = sharp organic boundary)
            */}
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="5"
              seed="14"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="90"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="4" result="blurred" />
            {/* Threshold: turns the blurred shape into sharp ink tendrils */}
            <feColorMatrix
              in="blurred"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -9"
            />
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

      {/* Name + tagline on green — fades out early as ink begins spreading */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
      >
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
