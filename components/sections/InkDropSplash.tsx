'use client'

import { useEffect, useRef, useState } from 'react'

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 2.5)
}

const DELAY_MS = 800
const DURATION_MS = 7000

// Central blob + organic tendrils spreading outward at irregular angles
const BLOBS = [
  // Central mass — starts immediately, grows large
  { angle: 0,   dist: 0,    delay: 0,    size: 0.7 },
  // Tendrils — staggered start, irregular angles, different reach
  { angle: 20,  dist: 0.32, delay: 0.08, size: 0.42 },
  { angle: 85,  dist: 0.38, delay: 0.14, size: 0.38 },
  { angle: 140, dist: 0.3,  delay: 0.10, size: 0.44 },
  { angle: 200, dist: 0.35, delay: 0.06, size: 0.40 },
  { angle: 255, dist: 0.4,  delay: 0.12, size: 0.36 },
  { angle: 315, dist: 0.33, delay: 0.09, size: 0.41 },
  { angle: 170, dist: 0.28, delay: 0.18, size: 0.35 },
  { angle: 50,  dist: 0.36, delay: 0.16, size: 0.37 },
]

export function InkDropSplash() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('julie-splash-done')) {
      setDone(true)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const delay = setTimeout(() => {
      function tick(timestamp: number) {
        const c = canvasRef.current
        const context = c?.getContext('2d')
        if (!c || !context) return

        if (!startRef.current) startRef.current = timestamp
        const elapsed = timestamp - startRef.current
        const raw = Math.min(elapsed / DURATION_MS, 1)

        const w = c.width
        const h = c.height
        const cx = w / 2
        const cy = h / 2
        const diag = Math.sqrt(w * w + h * h)

        // Step 1: fill canvas with dark green (the overlay)
        context.clearRect(0, 0, w, h)
        context.fillStyle = '#1a3a2a'
        context.fillRect(0, 0, w, h)

        // Step 2: cut holes via destination-out — each blob punches through
        context.globalCompositeOperation = 'destination-out'

        for (const blob of BLOBS) {
          // Each blob has its own progress timeline
          const blobRaw = blob.delay >= 1
            ? 0
            : Math.min(Math.max(raw - blob.delay, 0) / (1 - blob.delay), 1)
          const progress = easeOut(blobRaw)
          if (progress <= 0) continue

          const angleRad = (blob.angle * Math.PI) / 180
          // Blob centre drifts outward from cx/cy as progress increases
          const bx = cx + Math.sin(angleRad) * blob.dist * diag * progress
          const by = cy - Math.cos(angleRad) * blob.dist * diag * progress
          const r = blob.size * diag * progress

          // Steep gradient: mostly opaque, fades only at the very edge
          // This gives a defined ink edge rather than a soft halo
          const grad = context.createRadialGradient(bx, by, 0, bx, by, r)
          grad.addColorStop(0,   'rgba(0,0,0,1)')
          grad.addColorStop(0.75,'rgba(0,0,0,1)')
          grad.addColorStop(0.88,'rgba(0,0,0,0.85)')
          grad.addColorStop(1,   'rgba(0,0,0,0)')

          context.beginPath()
          context.arc(bx, by, r, 0, Math.PI * 2)
          context.fillStyle = grad
          context.fill()
        }

        context.globalCompositeOperation = 'source-over'

        // Fade text out before the hole reaches it
        const text = textRef.current
        if (text) {
          text.style.opacity = String(Math.max(0, 1 - raw / 0.18))
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
      window.removeEventListener('resize', resize)
    }
  }, [])

  if (done) return null

  return (
    <div className="fixed inset-0" style={{ zIndex: 100 }}>
      {/* Canvas draws the dark green overlay and erases it organically */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Text on top — fades out before the hole reaches the center */}
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
