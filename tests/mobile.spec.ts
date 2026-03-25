/**
 * Mobile layout tests — 375px viewport.
 * Key content must be visible, desktop nav must be hidden,
 * touch targets must be large enough.
 */

import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

const routes = ['/', '/portfolio', '/about', '/services', '/contact']

for (const route of routes) {
  test(`${route} renders without horizontal scroll at 375px`, async ({ page }) => {
    await page.goto(route)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2) // 2px tolerance for borders
  })

  test(`${route} shows key heading at 375px`, async ({ page }) => {
    await page.goto(route)
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })
}

test('desktop nav is hidden at 375px', async ({ page }) => {
  await page.goto('/')
  // Desktop nav has class "hidden md:flex" — should not be visible
  const desktopNav = page.locator('nav.hidden')
  // It should be in the DOM but not visible
  const isVisible = await desktopNav.isVisible()
  expect(isVisible).toBe(false)
})

test('mobile menu button is visible at 375px', async ({ page }) => {
  await page.goto('/')
  // Use exact label from MobileMenu.tsx aria-label — avoids matching Next.js dev tools button
  const hamburger = page.getByRole('button', { name: 'Open navigation' })
  await expect(hamburger).toBeVisible()
})

test('contact form inputs are at least 44px tall on mobile', async ({ page }) => {
  await page.goto('/contact')
  const banner = page.getByRole('button', { name: /got it/i })
  if (await banner.isVisible()) await banner.click()

  const inputHeight = await page.locator('#name').evaluate((el) => {
    return el.getBoundingClientRect().height
  })
  expect(inputHeight).toBeGreaterThanOrEqual(44)
})

test('send button is full width on mobile', async ({ page }) => {
  await page.goto('/contact')
  const banner = page.getByRole('button', { name: /got it/i })
  if (await banner.isVisible()) await banner.click()

  const btn = page.getByRole('button', { name: /send message/i })
  const btnBox = await btn.boundingBox()
  const viewportWidth = page.viewportSize()?.width ?? 375

  // Full-width means it takes up most of the viewport (allowing padding)
  expect(btnBox?.width ?? 0).toBeGreaterThan(viewportWidth * 0.8)
})
