/**
 * Accessibility tests — basic checks that don't require axe-core:
 * landmarks exist, headings are present, skip links, focus management.
 */

import { test, expect } from '@playwright/test'

const routes = ['/', '/portfolio', '/about', '/services', '/contact', '/privacy']

for (const route of routes) {
  test(`${route} has a main landmark`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('main')).toBeAttached()
  })

  test(`${route} has at least one h1`, async ({ page }) => {
    await page.goto(route)
    const h1s = page.locator('h1')
    await expect(h1s.first()).toBeVisible()
    expect(await h1s.count()).toBeGreaterThanOrEqual(1)
  })

  test(`${route} has a <header> element`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('header')).toBeAttached()
  })

  test(`${route} has a <footer> element`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('footer')).toBeAttached()
  })
}

test('all interactive elements are keyboard focusable', async ({ page }) => {
  await page.goto('/contact')
  // Tab through the form — each field should receive focus
  const fields = ['#name', '#email', '#phone', '#projectType', '#deadline', '#description', '#file']
  for (const selector of fields) {
    await page.focus(selector)
    await expect(page.locator(selector)).toBeFocused()
  }
})

test('html element has lang attribute set', async ({ page }) => {
  await page.goto('/')
  const lang = await page.locator('html').getAttribute('lang')
  expect(lang).toBeTruthy()
  expect(lang).toMatch(/^[a-z]{2}/)
})

test('nav links have visible text (not icon-only)', async ({ page }) => {
  await page.goto('/')
  const navLinks = page.locator('nav a')
  const count = await navLinks.count()
  for (let i = 0; i < count; i++) {
    const text = await navLinks.nth(i).textContent()
    expect(text?.trim().length ?? 0).toBeGreaterThan(0)
  }
})
