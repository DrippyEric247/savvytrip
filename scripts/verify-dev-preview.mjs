import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const url = 'http://localhost:5173/'
const screenshotPath = join(process.cwd(), 'savvy-trip-home-verification.png')
const consoleErrors = []
const pageErrors = []

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => pageErrors.push(err.message))

const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForURL(/\/login$/, { timeout: 10000 })
await page.waitForSelector('h1', { timeout: 10000 })
await page.screenshot({ path: screenshotPath, fullPage: false })

const checks = {
  status: response?.status() ?? 0,
  title: await page.title(),
  hasSavvyTripBrand: (await page.locator('text=SavvyTrip').count()) > 0,
  loginRedirectOk: /\/login$/.test(page.url()),
  hasLoginHeading: (await page.getByRole('heading', { name: 'Welcome back' }).count()) > 0,
  hasSignInButton: (await page.getByRole('button', { name: 'Sign in' }).count()) > 0,
  routesProtectedOk: false,
  consoleErrors,
  pageErrors,
  screenshotPath,
}

await page.goto(`${url}routes`, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForURL(/\/login$/, { timeout: 10000 })
checks.routesProtectedOk = true

writeFileSync(join(process.cwd(), 'scripts', 'verify-dev-preview-result.json'), JSON.stringify(checks, null, 2))
console.log(JSON.stringify(checks, null, 2))

await browser.close()
const ok =
  checks.hasSavvyTripBrand &&
  checks.loginRedirectOk &&
  checks.hasLoginHeading &&
  checks.hasSignInButton &&
  checks.routesProtectedOk &&
  checks.consoleErrors.length === 0 &&
  checks.pageErrors.length === 0
process.exit(ok ? 0 : 1)
