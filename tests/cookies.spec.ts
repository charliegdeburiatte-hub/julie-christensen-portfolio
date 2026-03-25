/**
 * Cookie banner tests — appears on first visit, disappears on accept/decline,
 * does not reappear after preference is stored.
 */

import { test, expect } from '@playwright/test'

test.describe('Cookie banner', () => {
  test('banner is visible on first visit (no stored consent)', async ({ page }) => {
    await page.goto('/')
    // Banner text from CookieBanner.tsx
    await expect(page.getByText(/this site uses cookies/i)).toBeVisible()
  })

  test('accept button hides the banner', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /got it/i }).click()
    await expect(page.getByText(/this site uses cookies/i)).not.toBeVisible()
  })

  test('decline button hides the banner', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /no thanks/i }).click()
    await expect(page.getByText(/this site uses cookies/i)).not.toBeVisible()
  })

  test('after accepting, banner does not reappear on reload', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /got it/i }).click()
    await page.reload()
    await expect(page.getByText(/this site uses cookies/i)).not.toBeVisible()
  })

  test('after declining, banner does not reappear on reload', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /no thanks/i }).click()
    await page.reload()
    await expect(page.getByText(/this site uses cookies/i)).not.toBeVisible()
  })

  test('accept stores "accepted" in localStorage', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /got it/i }).click()
    const stored = await page.evaluate(() => localStorage.getItem('julie-cookie-consent'))
    expect(stored).toBe('accepted')
  })

  test('decline stores "declined" in localStorage', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /no thanks/i }).click()
    const stored = await page.evaluate(() => localStorage.getItem('julie-cookie-consent'))
    expect(stored).toBe('declined')
  })

  test('banner does not appear on navigate to another page after accepting', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /got it/i }).click()
    await page.goto('/about')
    await expect(page.getByText(/this site uses cookies/i)).not.toBeVisible()
  })
})
