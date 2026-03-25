/**
 * Navigation tests — desktop nav links go to the right pages,
 * mobile menu opens/closes and its links work.
 */

import { test, expect } from '@playwright/test'

const navLinks = [
  { label: 'Work',     href: '/portfolio' },
  { label: 'About',    href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact',  href: '/contact' },
]

test.describe('Desktop navigation', () => {
  for (const { label, href } of navLinks) {
    test(`"${label}" link navigates to ${href}`, async ({ page }) => {
      await page.goto('/')
      // Desktop nav is hidden on mobile — use the visible one
      const link = page.locator(`nav a[href="${href}"]`).first()
      await link.click()
      await expect(page).toHaveURL(new RegExp(href))
    })
  }

  test('wordmark navigates back to home from inner page', async ({ page }) => {
    await page.goto('/about')
    await page.getByRole('link', { name: /julie christensen/i }).first().click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('hamburger button opens mobile menu', async ({ page }) => {
    await page.goto('/')
    // The mobile menu button should exist and be visible at 375px
    // Use exact label from MobileMenu.tsx — avoids matching Next.js dev tools button
  const hamburger = page.getByRole('button', { name: 'Open navigation' })
    await expect(hamburger).toBeVisible()
    await hamburger.click()
    // Scope to header to avoid matching the footer Contact link
    await expect(page.locator('header').getByRole('link', { name: 'Contact' })).toBeVisible()
  })

  test('mobile menu link navigates and menu closes', async ({ page }) => {
    await page.goto('/')
    // Use exact label from MobileMenu.tsx — avoids matching Next.js dev tools button
  const hamburger = page.getByRole('button', { name: 'Open navigation' })
    await hamburger.click()
    await page.locator('header').getByRole('link', { name: 'Contact' }).click()
    await expect(page).toHaveURL('/contact')
  })
})
