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
await page.waitForSelector('#hero-heading', { timeout: 10000 })
await page.screenshot({ path: screenshotPath, fullPage: false })

const checks = {
  status: response?.status() ?? 0,
  title: await page.title(),
  hasSavvyTripBrand: (await page.locator('text=SavvyTrip').count()) > 0,
  hasHeroHeading: (await page.locator('#hero-heading').count()) > 0,
  hasStartSmartSearch: (await page.getByRole('button', { name: 'Start smart search' }).count()) > 0,
  routesPageOk: false,
  consoleErrors,
  pageErrors,
  screenshotPath,
}

await page.goto(`${url}routes`, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForSelector('#routes-heading', { timeout: 10000 })
checks.routesPageOk = true

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

writeFileSync(join(process.cwd(), 'scripts', 'verify-dev-preview-result.json'), JSON.stringify(checks, null, 2))
console.log(JSON.stringify(checks, null, 2))

await browser.close()
process.exit(checks.consoleErrors.length || checks.pageErrors.length || !checks.hasSavvyTripBrand ? 1 : 0)
