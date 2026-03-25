/**
 * Contact form tests — required field validation, email format validation,
 * file size limit, submit button state.
 */

import { test, expect } from '@playwright/test'

test.describe('Contact form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    // Dismiss cookie banner so it doesn't overlap inputs
    const banner = page.getByRole('button', { name: /got it/i })
    if (await banner.isVisible()) await banner.click()
  })

  test('page has the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /let's talk/i })).toBeVisible()
  })

  test('submitting empty form shows all required field errors', async ({ page }) => {
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/please enter your name/i)).toBeVisible()
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
    await expect(page.getByText(/please tell me a little about your project/i)).toBeVisible()
  })

  test('shows error for invalid email format', async ({ page }) => {
    await page.fill('#name', 'Test User')
    await page.fill('#email', 'not-an-email')
    await page.fill('#description', 'Test project description.')
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
  })

  test('no error shown when email is valid', async ({ page }) => {
    await page.fill('#name', 'Test User')
    await page.fill('#email', 'test@example.com')
    await page.fill('#description', 'Test project description.')
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/please enter a valid email/i)).not.toBeVisible()
  })

  test('name field error clears after filling in', async ({ page }) => {
    // Trigger errors first
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/please enter your name/i)).toBeVisible()
    // Fill name
    await page.fill('#name', 'Julie')
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/please enter your name/i)).not.toBeVisible()
  })

  test('file upload shows 10MB limit note', async ({ page }) => {
    await expect(page.getByText(/max 10mb/i)).toBeVisible()
  })

  test('file input accepts only video and pdf types', async ({ page }) => {
    const accept = await page.locator('#file').getAttribute('accept')
    expect(accept).toContain('video/*')
    expect(accept).toContain('.pdf')
  })

  test('send button is disabled while submitting (shows Sending…)', async ({ page }) => {
    // Fill valid data — form will try to submit but Formspree ID is not set in test env
    await page.fill('#name', 'Test User')
    await page.fill('#email', 'test@example.com')
    await page.fill('#description', 'Test project description.')

    // Intercept the fetch so it hangs — we just want to check the loading state
    await page.route('**/formspree.io/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    })

    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByRole('button', { name: /sending/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sending/i })).toBeDisabled()
  })

  test('all optional fields accept input without error', async ({ page }) => {
    await page.fill('#phone', '+47 123 45 678')
    await page.selectOption('#projectType', 'long-form')
    await page.fill('#deadline', 'End of April')
    await page.selectOption('#preferredContact', 'email')
    // No errors should appear just from filling optional fields
    await expect(page.getByText(/please enter/i)).not.toBeVisible()
  })
})
