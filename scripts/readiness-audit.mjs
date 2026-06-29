/**
 * SavvyTrip readiness audit — run against local dev server.
 * Usage: node scripts/readiness-audit.mjs
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:5173'
const OUT_DIR = join(process.cwd(), 'qa-screenshots', 'readiness-audit')
mkdirSync(OUT_DIR, { recursive: true })

const findings = []
let shotIdx = 0

function finding(severity, category, title, details) {
  findings.push({ severity, category, title, details })
}

async function shot(page, name) {
  shotIdx += 1
  const file = `audit-${String(shotIdx).padStart(2, '0')}-${name}.png`
  await page.screenshot({ path: join(OUT_DIR, file), fullPage: false }).catch(() => {})
  return file
}

const PROTECTED_ROUTES = [
  '/',
  '/search',
  '/routes',
  '/routes/cheapest',
  '/saved',
  '/deals',
  '/trending',
  '/wallet',
  '/apps',
  '/feed',
  '/combos',
  '/ezstay',
  '/final10',
  '/aigo',
  '/rewards',
  '/assistant',
  '/alerts',
  '/alerts/new',
  '/scout-report',
  '/scout-goals',
]

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback']

async function collectPageHealth(page, path, label) {
  const consoleErrors = []
  const networkFailures = []
  const handler = (msg) => {
    if (msg.type() === 'error' && !/favicon|fonts\.googleapis/i.test(msg.text())) {
      consoleErrors.push(msg.text())
    }
  }
  const failHandler = (req) => {
    if (req.url().includes('/api/')) {
      networkFailures.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText || 'failed'}`)
    }
  }
  page.on('console', handler)
  page.on('requestfailed', failHandler)

  const start = Date.now()
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  const loadMs = Date.now() - start

  const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 500) || '')
  const hasMain = await page.locator('main').count()
  const h1Count = await page.locator('h1').count()
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
  }))

  page.off('console', handler)
  page.off('requestfailed', failHandler)

  return { path, label, loadMs, consoleErrors, networkFailures, bodyText, hasMain, h1Count, overflow, url: page.url() }
}

async function mockAuthenticatedSession(page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'savvy_universe_token',
      'audit-mock-jwt-token-for-readiness-testing-only',
    )
  })

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        _id: 'audit-user',
        username: 'audit_traveler',
        email: 'audit@savvytrip.test',
        savvyPoints: 12500,
        firstName: 'Audit',
        lastName: 'Traveler',
      }),
    })
  })

  await page.route('**/api/auth/providers', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ google: true, apple: false }),
    })
  })
}

const browser = await chromium.launch({ headless: true })
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })

console.log('=== SavvyTrip Readiness Audit ===')
console.log('Target:', BASE)

// --- 1. Protected routes (logged out) ---
for (const path of PROTECTED_ROUTES) {
  await desktop.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {})
  await desktop.waitForTimeout(800)
  const url = desktop.url()
  if (!url.includes('/login')) {
    finding('critical', 'Protected routes', `Unauthenticated access to ${path}`, `Landed on ${url}`)
    await shot(desktop, `leak-${path.replace(/\//g, 'root')}`)
  }
}

// --- 2. Auth pages load ---
for (const path of AUTH_ROUTES) {
  const health = await collectPageHealth(desktop, path, 'auth')
  if (health.h1Count === 0 && !health.bodyText.includes('Signing')) {
    finding('high', 'Authentication', `Auth page missing h1: ${path}`, health.bodyText.slice(0, 120))
  }
}

// --- 3. Invalid login ---
await desktop.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await desktop.fill('#login-email', 'invalid@savvytrip.test')
await desktop.fill('#login-password', 'WrongPassword!123')
await desktop.click('button[type="submit"]')
await desktop.waitForTimeout(4000)
const loginAlert = await desktop.locator('[role="alert"]').textContent().catch(() => null)
const stillOnLogin = desktop.url().includes('/login')
if (!stillOnLogin) {
  finding('critical', 'Authentication', 'Invalid login navigates away', desktop.url())
} else if (!loginAlert) {
  finding('high', 'Authentication', 'Invalid login shows no error alert', 'No role=alert after bad credentials')
} else if (/session expired/i.test(loginAlert)) {
  finding('high', 'Authentication', 'Invalid login shows misleading session-expired copy', loginAlert)
}

// --- 4. Empty login submit ---
await desktop.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await desktop.click('button[type="submit"]')
await desktop.waitForTimeout(500)
const validation = await desktop.evaluate(() => {
  const email = document.querySelector('#login-email')
  return email?.validationMessage || ''
})
if (!validation) {
  finding('medium', 'Authentication', 'HTML5 validation may not fire on empty login', 'No validationMessage')
}

// --- 5. Forgot password ---
await desktop.goto(`${BASE}/forgot-password`, { waitUntil: 'networkidle' })
await desktop.fill('#forgot-email', 'audit@savvytrip.test')
await desktop.click('button[type="submit"]')
await desktop.waitForTimeout(5000)
const forgotStatus = await desktop.locator('[role="status"], [role="alert"]').first().textContent().catch(() => null)
if (!forgotStatus) {
  finding('high', 'Authentication', 'Forgot password shows no feedback', desktop.url())
}

// --- 6. Mock auth — all protected screens ---
await mockAuthenticatedSession(desktop)
await mockAuthenticatedSession(mobile)

const screenResults = []
for (const path of PROTECTED_ROUTES) {
  const d = await collectPageHealth(desktop, path, 'desktop')
  const m = await collectPageHealth(mobile, path, 'mobile')
  screenResults.push({ path, desktop: d, mobile: m })

  if (d.consoleErrors.length) {
    finding('high', 'Console errors', `Console errors on ${path} (desktop)`, d.consoleErrors.slice(0, 3).join(' | '))
  }
  if (m.overflow.overflow) {
    finding('medium', 'Mobile layout', `Horizontal overflow on ${path}`, `scroll ${m.overflow.scrollWidth} > ${m.overflow.innerWidth}`)
    await shot(mobile, `overflow-${path.replace(/\//g, 'root')}`)
  }
  if (d.loadMs > 5000) {
    finding('medium', 'Performance', `Slow load on ${path}`, `${d.loadMs}ms`)
  }
  if (d.hasMain === 0) {
    finding('high', 'Navigation', `Missing <main> on ${path}`, d.url)
  }
}

// --- 7. Navigation links (authenticated desktop) ---
await desktop.goto(`${BASE}/`, { waitUntil: 'networkidle' })
const navLinks = await desktop.locator('nav[aria-label="Primary"] a').all()
if (navLinks.length < 10) {
  finding('medium', 'Navigation', 'Desktop nav link count low', String(navLinks.length))
}

// --- 8. Mobile menu + logout ---
await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await mobile.click('button[aria-controls="mobile-nav"]')
await mobile.waitForTimeout(400)
const mobileNavVisible = await mobile.locator('#mobile-nav').isVisible()
if (!mobileNavVisible) {
  finding('high', 'Mobile layout', 'Mobile nav menu does not open', mobile.url())
} else {
  await mobile.locator('#mobile-nav button:has-text("Sign out")').click()
  await mobile.waitForTimeout(1000)
  if (!mobile.url().includes('/login')) {
    finding('high', 'Authentication', 'Sign out does not redirect to login', mobile.url())
  }
}

// --- 10. Invalid token hydration ---
await desktop.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await desktop.evaluate(() => localStorage.setItem('savvy_universe_token', 'bad-token'))
await desktop.unroute('**/api/auth/me')
await desktop.route('**/api/auth/me', (route) =>
  route.fulfill({ status: 401, body: JSON.stringify({ code: 'INVALID_TOKEN', message: 'Authentication required' }) }),
)
await desktop.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await desktop.waitForTimeout(1500)
if (!desktop.url().includes('/login')) {
  finding('critical', 'Authentication', 'Invalid token does not redirect to login', desktop.url())
}

// --- 11. API failure on login ---
await desktop.unroute('**/api/auth/me')
await desktop.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await desktop.route('**/api/auth/login', (route) =>
  route.fulfill({ status: 503, body: JSON.stringify({ message: 'Service unavailable' }) }),
)
await desktop.fill('#login-email', 'test@gmail.com')
await desktop.fill('#login-password', 'SomePassword123!')
await desktop.click('button[type="submit"]')
await desktop.waitForTimeout(3000)
const apiFailAlert = await desktop.locator('[role="alert"]').textContent().catch(() => null)
if (!apiFailAlert) {
  finding('high', 'Error handling', '503 login shows no user-visible error', 'No alert')
}

// --- 12. Accessibility basics on login ---
await desktop.unroute('**/api/auth/login')
await desktop.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
const a11y = await desktop.evaluate(() => {
  const pwd = document.querySelector('#login-password')
  const pwdLabel = document.querySelector('label[for="login-password"]')
  const focusable = document.querySelectorAll('a, button, input, select, textarea').length
  return {
    passwordHasLabel: Boolean(pwdLabel),
    passwordAriaLabel: pwd?.getAttribute('aria-label'),
    lang: document.documentElement.lang,
    focusableCount: focusable,
  }
})
if (!a11y.passwordHasLabel && !a11y.passwordAriaLabel) {
  finding('medium', 'Accessibility', 'Login password field lacks accessible name', 'No label or aria-label')
}

// --- 13. Authenticated user on /login (should redirect) ---
await mockAuthenticatedSession(desktop)
await desktop.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await desktop.waitForTimeout(1000)
if (desktop.url().includes('/login')) {
  finding('medium', 'Authentication', 'Logged-in user can still view /login', 'No redirect to app home')
}

// --- 14. OAuth callback without token ---
await desktop.goto(`${BASE}/auth/callback`, { waitUntil: 'networkidle' })
await desktop.waitForTimeout(1500)
if (!desktop.url().includes('/login')) {
  finding('high', 'Authentication', 'OAuth callback without token does not reach login', desktop.url())
}

// --- 15. Performance snapshot ---
const perf = await desktop.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
const timing = await desktop.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0]
  return nav
    ? {
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
        loadEvent: Math.round(nav.loadEventEnd),
        transferSize: nav.transferSize,
      }
    : null
})

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE,
  findings,
  screenResults: screenResults.map((s) => ({
    path: s.path,
    desktopLoadMs: s.desktop.loadMs,
    mobileOverflow: s.mobile.overflow.overflow,
    desktopConsoleErrors: s.desktop.consoleErrors.length,
    mobileConsoleErrors: s.mobile.consoleErrors.length,
  })),
  perf,
  timing,
}

writeFileSync(join(process.cwd(), 'scripts', 'readiness-audit-result.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify({ findingCount: findings.length, perf: timing }, null, 2))

await browser.close()
process.exit(findings.filter((f) => f.severity === 'critical').length > 0 ? 1 : 0)
