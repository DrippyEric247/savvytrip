/**
 * Runtime stability sweep for SavvyTrip (dev + production preview).
 * Run: node scripts/runtime-stability-check.mjs [dev|preview]
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const mode = process.argv[2] || 'dev'
const baseUrl = mode === 'preview' ? 'http://localhost:4173/' : 'http://localhost:5173/'
const STORAGE_KEY = 'savvy_universe_token'

function collectConsole(page, bucket) {
  page.on('console', (msg) => {
    const entry = { type: msg.type(), text: msg.text() }
    bucket.all.push(entry)
    if (msg.type() === 'error') bucket.errors.push(entry.text)
    if (msg.type() === 'warning') bucket.warnings.push(entry.text)
  })
  page.on('pageerror', (err) => {
    bucket.pageErrors.push(err.message)
    bucket.all.push({ type: 'pageerror', text: err.message })
  })
}

function isBenignNetworkError(text) {
  return (
    /Failed to load resource/i.test(text) ||
    /net::ERR_/i.test(text) ||
    /ECONNREFUSED/i.test(text)
  )
}

async function runChecks(page, results) {
  const bucket = { all: [], errors: [], warnings: [], pageErrors: [] }
  collectConsole(page, bucket)

  // 1. Unauthenticated home -> login redirect
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForURL(/\/login$/, { timeout: 10000 })
  results.push({
    name: 'ProtectedRoute: / redirects to /login',
    pass: /\/login$/.test(page.url()),
    url: page.url(),
  })

  // 2. Login page renders
  const loginHeading = await page.getByRole('heading', { name: 'Welcome back' }).count()
  const signInBtn = await page.getByRole('button', { name: 'Sign in' }).count()
  results.push({
    name: 'Login flow: page renders',
    pass: loginHeading > 0 && signInBtn > 0,
  })

  // 3. Register page
  bucket.errors.length = 0
  bucket.warnings.length = 0
  bucket.pageErrors.length = 0
  await page.goto(`${baseUrl}register`, { waitUntil: 'networkidle', timeout: 30000 })
  const registerHeading = await page.getByRole('heading', { name: 'Create account' }).count()
  results.push({
    name: 'Login flow: /register renders',
    pass: registerHeading > 0,
    consoleErrors: [...bucket.errors],
    pageErrors: [...bucket.pageErrors],
  })

  // 4. Protected route /routes
  bucket.errors.length = 0
  bucket.pageErrors.length = 0
  await page.goto(`${baseUrl}routes`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForURL(/\/login$/, { timeout: 10000 })
  results.push({
    name: 'ProtectedRoute: /routes redirects to /login',
    pass: /\/login$/.test(page.url()),
    consoleErrors: [...bucket.errors],
    pageErrors: [...bucket.pageErrors],
  })

  // 5. Authenticated dashboard + navigation (mocked API)
  bucket.errors.length = 0
  bucket.pageErrors.length = 0
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        email: 'stability@test.local',
        username: 'stability',
        firstName: 'Stability',
      }),
    }),
  )

  await page.addInitScript((key) => {
    localStorage.setItem(key, 'mock-stability-token')
  }, STORAGE_KEY)

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForSelector('#hero-heading', { timeout: 15000 })
  const heroOk = (await page.locator('#hero-heading').count()) > 0
  results.push({
    name: 'Dashboard: home loads when session is valid',
    pass: heroOk && !page.url().includes('/login'),
    url: page.url(),
    consoleErrors: [...bucket.errors],
    pageErrors: [...bucket.pageErrors],
  })

  // 6. Navigation
  bucket.errors.length = 0
  bucket.pageErrors.length = 0
  await page.getByRole('link', { name: 'Routes' }).first().click()
  await page.waitForURL(/\/routes$/, { timeout: 10000 })
  await page.waitForSelector('#routes-heading', { timeout: 10000 })
  const routesOk = (await page.locator('#routes-heading').count()) > 0
  results.push({
    name: 'Navigation: Routes link works',
    pass: routesOk,
    url: page.url(),
    consoleErrors: [...bucket.errors],
    pageErrors: [...bucket.pageErrors],
  })

  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await page.waitForURL(/\/wallet$/, { timeout: 10000 })
  results.push({
    name: 'Navigation: Wallet link works',
    pass: /\/wallet$/.test(page.url()),
    url: page.url(),
    consoleErrors: [...bucket.errors],
    pageErrors: [...bucket.pageErrors],
  })

  return bucket
}

async function main() {
  let previewProc = null
  if (mode === 'preview') {
    previewProc = spawn('npm', ['run', 'preview', '--', '--port', '4173'], {
      cwd: process.cwd(),
      shell: true,
      stdio: 'ignore',
    })
    await new Promise((r) => setTimeout(r, 2500))
  }

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const results = []

  try {
    const finalBucket = await runChecks(page, results)
    const report = {
      mode,
      baseUrl,
      timestamp: new Date().toISOString(),
      results,
      summary: {
        pass: results.every((r) => r.pass),
        reactPageErrors: finalBucket.pageErrors,
        consoleErrors: finalBucket.errors.filter((e) => !isBenignNetworkError(e)),
        consoleWarnings: [...new Set(finalBucket.warnings)],
      },
    }

    const outPath = join(process.cwd(), 'scripts', 'runtime-stability-check-result.json')
    writeFileSync(outPath, JSON.stringify(report, null, 2))
    console.log(JSON.stringify(report, null, 2))

    await browser.close()
    if (previewProc) previewProc.kill()

    const hardFail =
      !report.summary.pass ||
      report.summary.reactPageErrors.length > 0 ||
      report.summary.consoleErrors.length > 0
    process.exit(hardFail ? 1 : 0)
  } catch (err) {
    await browser.close()
    if (previewProc) previewProc.kill()
    console.error(err)
    process.exit(1)
  }
}

main()
