/**
 * Smoke tests — every public route loads without crashing,
 * returns a meaningful page title, and has the nav wordmark visible.
 */

import { test, expect } from '@playwright/test'

const routes = [
  { path: '/',          titleFragment: 'Julie Christensen' },
  { path: '/portfolio', titleFragment: 'Julie Christensen' },
  { path: '/about',     titleFragment: 'Julie Christensen' },
  { path: '/services',  titleFragment: 'Julie Christensen' },
  { path: '/contact',   titleFragment: 'Julie Christensen' },
  { path: '/privacy',   titleFragment: 'Julie Christensen' },
]

for (const { path, titleFragment } of routes) {
  test(`${path} loads and has correct title`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBeLessThan(400)
    await expect(page).toHaveTitle(new RegExp(titleFragment, 'i'))
  })

  test(`${path} shows nav wordmark`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('link', { name: /julie christensen/i }).first()).toBeVisible()
  })
}

test('404 page renders for unknown route', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist-xyz')
  // Next.js returns 404 HTML, not a redirect
  expect(response?.status()).toBe(404)
  // Custom not-found.tsx uses "Nothing here." as the heading
  await expect(page.getByText(/nothing here/i)).toBeVisible()
})
