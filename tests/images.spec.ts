/**
 * Image tests — every next/image on each page loads successfully
 * (no 404s, no broken alt text, no missing src).
 */

import { test, expect } from '@playwright/test'

const routes = ['/', '/portfolio', '/about', '/services', '/contact', '/privacy']

for (const route of routes) {
  test(`no broken images on ${route}`, async ({ page }) => {
    const brokenImages: string[] = []

    // Intercept image responses and flag any failures
    page.on('response', (response) => {
      const url = response.url()
      const isImage = /\.(png|jpg|jpeg|gif|svg|webp|avif)(\?|$)/i.test(url)
        || response.request().resourceType() === 'image'
      if (isImage && response.status() >= 400) {
        brokenImages.push(`${response.status()} — ${url}`)
      }
    })

    await page.goto(route)
    // Wait for network to settle
    await page.waitForLoadState('networkidle')

    expect(brokenImages, `Broken images on ${route}: ${brokenImages.join(', ')}`).toHaveLength(0)
  })

  test(`all <img> elements on ${route} have non-empty alt text`, async ({ page }) => {
    await page.goto(route)
    await page.waitForLoadState('networkidle')

    const missingAlt = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
      return imgs
        .filter((img) => !img.alt || img.alt.trim() === '')
        .map((img) => img.src)
    })

    expect(
      missingAlt,
      `Images missing alt text on ${route}: ${missingAlt.join(', ')}`
    ).toHaveLength(0)
  })
}
