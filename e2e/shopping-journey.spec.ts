import { test, expect } from '@playwright/test'

/**
 * Simple E2E Test Examples for Learning Playwright
 *
 * This file contains simple, focused examples that demonstrate:
 * - Basic page navigation
 * - Element interaction
 * - Assertions
 * - Common patterns
 */

const username = 'mor_2314'
const password = '83r5^_'
const name = 'John'

test.describe('Playwright E2E Examples', () => {
  // Example 1: Basic Page Load Test
  test('should load homepage successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/TokoTok/i)

    // Verify page loaded by checking for main content
    await expect(page.locator('main')).toBeVisible()
  })

  // Example 2: Search Functionality Test
  test('should perform product search', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load completely
    await page.waitForTimeout(2000)

    // Find search input using different selectors
    const searchInput = page.locator('input[placeholder*="Search"]').first()

    // Type in search box
    await searchInput.fill('Acer')

    // Press Enter to search
    await searchInput.press('Enter')

    // Wait a moment for results
    await page.waitForTimeout(2000)

    // Check if class suggestion-item is visible
    expect(page.locator('[class*=suggestion-item]')).toBeVisible()
  })

  // Example 3: Click and Navigate Test
  test('should navigate to product details', async ({ page }) => {
    await page.goto('/')

    // Wait for products to load
    await page.waitForSelector('.product-card', {
      timeout: 5000
    })

    // Click first product card
    const firstProduct = page.locator('.product-card').first()
    await firstProduct.click()

    await page.waitForTimeout(2000)

    // Verify we're on a product page
    expect(page.url()).toMatch(/\/product\/\d+/)
  })

  // Example 4: Form Interaction Test
  test('should interact with login form', async ({ page }) => {
    await page.goto('/login')

    // Fill email field
    const emailInput = page.locator('#username')
    await emailInput.fill('test@example.com')

    // Fill password field
    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('password123')

    // Click login button
    const loginButton = page.locator('button[type="submit"]')
    await loginButton.click()

    // Check for redirect or error message
    await page.waitForLoadState('networkidle')
  })

  // Example 5: Shopping Cart Test
  test('should add item to cart', async ({ page }) => {
    await page.goto('/')

    // Navigate to first product
    const firstProduct = page.locator('.product-card').first()
    await firstProduct.click()

    await page.waitForTimeout(2000)

    // Verify we're on a product page
    expect(page.url()).toMatch(/\/product\/\d+/)

    // Check if "Add to Cart" button exists
    const addToCartButton = page.locator('button:has-text("Add to Cart")')
    expect(addToCartButton).toBeVisible()

    // Click "Add to Cart"
    await addToCartButton.click()

    // Verify item added to cart
    const cartCount = page.locator('.cart-count')
    await expect(cartCount).toHaveText('1')
  })

  // Example 6: Modal/Popup Interaction
  test('should open and close shopping cart modal', async ({ page }) => {
    await page.goto('/')

    // Look for cart button/icon
    const cartButton = page
      .locator('[data-testid="cart-button"], .cart-icon')
      .first()

    if (await cartButton.isVisible()) {
      // Open cart
      await cartButton.click()

      // Verify modal/dropdown opened
      await expect(
        page.locator('.cart-modal, [data-testid="shopping-cart"]')
      ).toBeVisible()

      // Close cart (by clicking outside or close button)
      const closeButton = page
        .locator('[data-testid="close-cart"], .close-button')
        .first()
      if (await closeButton.isVisible()) {
        await closeButton.click()
      } else {
        // Click outside modal
        await page.click('body')
      }
    }
  })

  // Example 7: Mobile Responsive Test
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Check mobile navigation
    const mobileMenu = page.locator('.mobile-menu, [data-testid="mobile-menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()

      // Verify menu opened
      await expect(
        page.locator('.mobile-nav, [data-testid="mobile-nav"]')
      ).toBeVisible()
    }
  })

  // Example 8: Error Handling Test
  test('should handle 404 page', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    expect(page.locator('h1')).toHaveText('404')

    expect(page.locator('h2')).toContainText('Page not found')
  })

  // Example 9: Wait for Dynamic Content
  test('should wait for dynamic content to load', async ({ page }) => {
    await page.goto('/')

    // Wait for specific element to appear
    await page.waitForSelector('.product-grid', {
      timeout: 10000
    })

    // Wait for network to be idle
    await page.waitForLoadState('networkidle')

    // Check content loaded
    const products = page.locator('.product-card')
    const count = await products.count()
    expect(count).toBeGreaterThan(0)
  })

  // Example 10: Text Content Verification
  test('should verify page content', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    // Check text contains certain words
    await expect(page.locator('h1').getByText('TokoTok').first()).toBeVisible()

    // check if Filter is present
    await expect(page.locator('h3').getByText('Filter').first()).toBeVisible()

    // check if Sort is present
    await expect(page.locator('label').getByText('Sort').first()).toBeVisible()
  })
})
