/**
 * screenshot.mjs
 *
 * Takes full-page screenshots of every public page in both light and dark
 * mode, at desktop (1440px) and mobile (375px) widths.
 *
 * Saves to:  screenshots/YYYY-MM-DD_HH-MM-SS/
 *
 * Run once:       npm run screenshot
 * Run on a timer: npm run screenshot:watch   (every 30 minutes)
 *
 * Requires the dev server to be running: npm run dev
 */

import { chromium } from '@playwright/test'
import { mkdirSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const BASE_URL = 'http://localhost:3000'
const SCREENSHOTS_DIR = join(ROOT, 'screenshots')
const MAX_SNAPSHOTS_TO_KEEP = 20   // oldest folders auto-deleted after this

const PAGES = [
  { name: 'home',      path: '/' },
  { name: 'portfolio', path: '/portfolio' },
  { name: 'about',     path: '/about' },
  { name: 'services',  path: '/services' },
  { name: 'contact',   path: '/contact' },
  { name: 'privacy',   path: '/privacy' },
]

const VIEWPORTS = [
  { label: 'desktop', width: 1440, height: 900,  isMobile: false },
  { label: 'mobile',  width: 375,  height: 812,  isMobile: true  },
]

async function takeSnapshots() {
  const now = new Date()
  const timestamp = now
    .toISOString()
    .replace('T', '_')
    .replace(/:/g, '-')
    .slice(0, 19)

  const outDir = join(SCREENSHOTS_DIR, timestamp)
  mkdirSync(outDir, { recursive: true })

  console.log(`\n📸  ${timestamp}`)
  console.log(`    → screenshots/${timestamp}/\n`)

  const browser = await chromium.launch()

  for (const mode of ['light', 'dark']) {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
      })

      for (const { name, path: pagePath } of PAGES) {
        const page = await context.newPage()

        // Pre-set localStorage so cookie banner is dismissed and theme is applied
        await page.addInitScript(
          ({ theme }) => {
            localStorage.setItem('julie-cookie-consent', 'accepted')
            localStorage.setItem('julie-theme', theme)
          },
          { theme: mode }
        )

        await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle' })

        // Give ThemeProvider a moment to read localStorage and apply the attribute
        await page.waitForTimeout(400)

        const filename = `${name}_${viewport.label}_${mode}.png`
        await page.screenshot({ path: join(outDir, filename), fullPage: true })
        process.stdout.write(`    ✓  ${filename}\n`)

        await page.close()
      }

      await context.close()
    }
  }

  await browser.close()

  // Prune oldest snapshot folders if over limit
  pruneOldSnapshots()

  const count = PAGES.length * VIEWPORTS.length * 2
  console.log(`\n    Done — ${count} screenshots saved.\n`)

  return outDir
}

function pruneOldSnapshots() {
  try {
    const folders = readdirSync(SCREENSHOTS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort() // ISO timestamps sort chronologically

    const toDelete = folders.slice(0, Math.max(0, folders.length - MAX_SNAPSHOTS_TO_KEEP))
    for (const folder of toDelete) {
      const fullPath = join(SCREENSHOTS_DIR, folder)
      // rimraf-style removal via shell — avoids importing a dep
      import('child_process').then(({ execSync }) => {
        execSync(`rm -rf "${fullPath}"`)
        console.log(`    🗑  Pruned old snapshot: ${folder}`)
      })
    }
  } catch {
    // Non-fatal — just skip pruning
  }
}

// ─── Interval mode ────────────────────────────────────────────────────────────

const INTERVAL_MINUTES = parseInt(process.env.SCREENSHOT_INTERVAL_MINUTES ?? '30', 10)
const watchMode = process.argv.includes('--watch')

if (watchMode) {
  console.log(`\n⏱   Watch mode — screenshot every ${INTERVAL_MINUTES} minutes`)
  console.log('    Press Ctrl+C to stop.\n')

  // Take one immediately, then on the interval
  takeSnapshots().catch(console.error)
  setInterval(() => takeSnapshots().catch(console.error), INTERVAL_MINUTES * 60 * 1000)
} else {
  takeSnapshots().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
