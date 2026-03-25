/**
 * Dark / light mode tests — toggle switches theme,
 * preference persists on refresh, defaults to light.
 */

import { test, expect } from '@playwright/test'

test.describe('Theme toggle', () => {
  test('defaults to light mode (no stored preference)', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    // Should NOT have data-theme="dark" by default
    await expect(html).not.toHaveAttribute('data-theme', 'dark')
  })

  test('toggle button is visible in nav', async ({ page }) => {
    await page.goto('/')
    // ThemeToggle renders a button — look for it by role
    const toggleBtn = page.getByRole('button', { name: /dark|light|theme|mode/i })
    await expect(toggleBtn).toBeVisible()
  })

  test('clicking toggle switches to dark mode', async ({ page }) => {
    await page.goto('/')
    const toggleBtn = page.getByRole('button', { name: /dark|light|theme|mode/i })
    await toggleBtn.click()
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('dark mode persists after page reload', async ({ page }) => {
    await page.goto('/')
    const toggleBtn = page.getByRole('button', { name: /dark|light|theme|mode/i })
    await toggleBtn.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('toggling back removes dark mode', async ({ page }) => {
    await page.goto('/')
    const toggleBtn = page.getByRole('button', { name: /dark|light|theme|mode/i })
    // Switch to dark
    await toggleBtn.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    // Switch back to light
    await toggleBtn.click()
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark')
  })

  test('preference is stored in localStorage under julie-theme key', async ({ page }) => {
    await page.goto('/')
    const toggleBtn = page.getByRole('button', { name: /dark|light|theme|mode/i })
    await toggleBtn.click()
    const stored = await page.evaluate(() => localStorage.getItem('julie-theme'))
    expect(stored).toBe('dark')
  })
})
