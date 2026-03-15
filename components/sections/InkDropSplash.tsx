'use client'

import { useEffect, useRef, useState } from 'react'

// Full-screen quad — covers the entire viewport
const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// Fragment shader — domain-warped fractal noise creates genuine ink tendrils
// Technique: fbm(fbm(fbm(p))) warps space so heavily it produces complex
// branching shapes that look like ink dispersing in water
const FRAG = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_progress;
  uniform float u_time;

  // Gradient noise
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0,0)), f - vec2(0,0)),
          dot(hash(i + vec2(1,0)), f - vec2(1,0)), u.x),
      mix(dot(hash(i + vec2(0,1)), f - vec2(0,1)),
          dot(hash(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y
    );
  }

  // Fractal Brownian Motion — 6 octaves for fine ink detail
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p  = rot * p * 2.1 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // UV centred, aspect-corrected
    vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);

    float t    = u_progress;
    float flow = u_time * 0.12; // slow drift — ink moves, doesn't teleport

    // Three layers of domain warping (fbm of fbm of fbm)
    // Each warp makes the boundary more complex and ink-like
    vec2 q = vec2(
      fbm(uv * 2.8 + vec2(flow, flow * 0.6)),
      fbm(uv * 2.8 + vec2(5.2 + flow * 0.7, 1.3))
    );
    vec2 r = vec2(
      fbm(uv * 2.8 + 2.2 * q + vec2(1.7, 9.2) + flow * 0.35),
      fbm(uv * 2.8 + 2.2 * q + vec2(8.3, 2.8) + flow * 0.28)
    );
    float f = fbm(uv * 2.0 + 2.8 * r + flow * 0.18);

    // Distance from centre, warped by noise field.
    // Base warp of 0.35 is always present so the shape is never a perfect circle —
    // it starts as an irregular blob and grows increasingly complex as t increases.
    float dist = length(uv);
    float warp = f * (0.35 + 0.65 * smoothstep(0.0, 0.6, t));
    float warped = dist - warp;

    // Ink front expands from 0 → 1.6 (overshoots screen edges)
    float radius = t * 1.55;

    // Sharp threshold — this is what makes it look like ink not fog
    // 0.025 spread keeps a very tight organic edge
    float ink = 1.0 - smoothstep(radius - 0.025, radius + 0.025, warped);

    // Dark green overlay (#1a3a2a) fades out where ink has spread
    gl_FragColor = vec4(0.102, 0.227, 0.165, 1.0 - ink);
  }
`

const DELAY_MS    = 800
const DURATION_MS = 8000

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
}

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  if (!gl) return null

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null

  const prog = gl.createProgram()
  if (!prog) return null
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
  const pos = gl.getAttribLocation(prog, 'a_pos')
  gl.enableVertexAttribArray(pos)
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  return {
    gl,
    uRes:      gl.getUniformLocation(prog, 'u_res'),
    uProgress: gl.getUniformLocation(prog, 'u_progress'),
    uTime:     gl.getUniformLocation(prog, 'u_time'),
  }
}

export function InkDropSplash() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('julie-splash-done')) { setDone(true); return }

    const canvas = canvasRef.current
    if (!canvas) return

    const glCtx = initGL(canvas)
    if (!glCtx) { setDone(true); return } // WebGL unavailable — skip splash

    const { gl, uRes, uProgress, uTime } = glCtx
    const cv = canvas

    const resize = () => {
      cv.width  = window.innerWidth
      cv.height = window.innerHeight
      gl.viewport(0, 0, cv.width, cv.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // Draw first frame immediately (all green, progress=0) — canvas now covers
    // the site so it's safe to remove the wrapper's CSS background fallback
    gl.uniform2f(uRes, cv.width, cv.height)
    gl.uniform1f(uProgress, 0)
    gl.uniform1f(uTime, 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    // Canvas is now fully green — wrapper background no longer needed.
    // Clearing it means transparent WebGL pixels show the real site, not green.
    const wrapper = wrapperRef.current
    if (wrapper) wrapper.style.backgroundColor = 'transparent'

    let startTime: number | null = null
    let rafId: number

    const delay = setTimeout(() => {
      function tick(ts: number) {
        if (!startTime) startTime = ts
        const elapsed  = ts - startTime
        const raw      = Math.min(elapsed / DURATION_MS, 1)
        const progress = easeInOut(raw)

        gl.uniform2f(uRes, cv.width, cv.height)
        gl.uniform1f(uProgress, progress)
        gl.uniform1f(uTime, elapsed / 1000)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        // Text fades out in the first 15% of the animation
        const text = textRef.current
        if (text) text.style.opacity = String(Math.max(0, 1 - raw / 0.15))

        if (raw < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          sessionStorage.setItem('julie-splash-done', '1')
          setDone(true)
        }
      }
      rafId = requestAnimationFrame(tick)
    }, DELAY_MS)

    return () => {
      clearTimeout(delay)
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  if (done) return null

  return (
    <div ref={wrapperRef} className="fixed inset-0" style={{ zIndex: 100, backgroundColor: '#1a3a2a' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

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
