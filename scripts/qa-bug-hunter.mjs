/**
 * Final10 QA Bug Hunter — automated smoke tests against live + optional local.
 * Run: node scripts/qa-bug-hunter.mjs
 */
import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const LIVE = 'https://www.final10.app';
const LOCAL = process.env.QA_LOCAL_URL || 'http://localhost:3000';
const API = 'https://api.final10.app';
const MOBILE = { width: 390, height: 844, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1280, height: 800 };

const bugs = [];
let screenshotIdx = 0;

function bug(entry) {
  bugs.push({ id: `BUG-${String(bugs.length + 1).padStart(3, '0')}`, ...entry });
}

async function shot(page, label) {
  screenshotIdx += 1;
  const name = `qa-screenshot-${String(screenshotIdx).padStart(2, '0')}-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
  const path = join(dirname(fileURLToPath(import.meta.url)), '..', 'qa-screenshots', name);
  try {
    await page.screenshot({ path, fullPage: false });
    return `qa-screenshots/${name}`;
  } catch {
    return `(screenshot failed: ${label})`;
  }
}

async function waitForApp(page, timeout = 15000) {
  await page.waitForFunction(
    () => document.body && document.body.innerText.length > 50,
    { timeout }
  ).catch(() => {});
  await new Promise((r) => setTimeout(r, 1200));
}

async function getText(page) {
  return page.evaluate(() => document.body?.innerText || '');
}

async function testProtectedRoutes(page, base, env) {
  const protectedPaths = [
    '/profile',
    '/alerts',
    '/perk-machine',
    '/battle-pass',
    '/daily-streak',
    '/admin',
    '/shield-dashboard',
    '/owner-control',
  ];

  for (const path of protectedPaths) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    await waitForApp(page);
    const url = page.url();
    const text = await getText(page);
    const isAdmin = path.includes('admin') || path.includes('shield') || path.includes('owner');

    if (!url.includes('/login') && !url.includes('/onboarding')) {
      const adminLeak = isAdmin && (text.includes('Admin') || text.includes('Shield') || text.includes('Owner Control'));
      if (adminLeak || (!isAdmin && text.length > 200)) {
        bug({
          title: `[${env}] Unauthenticated user can reach protected route ${path}`,
          steps: `1. Open incognito session\n2. Navigate to ${base}${path}\n3. Observe page without logging in`,
          expected: 'Redirect to /login (admin routes may redirect to / after login gate)',
          actual: `Landed on ${url}. Body preview: ${text.slice(0, 180).replace(/\n/g, ' ')}`,
          severity: isAdmin ? 'Critical' : 'High',
          screenshot: await shot(page, `${env}-protected-${path.replace(/\//g, '')}`),
          fix: 'Ensure ProtectedRoute/InternalRoute redirect unauthenticated users before rendering sensitive UI. Verify server-side auth on API calls.',
          area: 'Protected routes',
        });
      }
    }
  }
}

async function testLoginForm(page, base, env) {
  await page.goto(`${base}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  await waitForApp(page);

  const hasGoogle = await page.$('a[href*="google"], a:has-text("Google")').catch(() => null);
  const googleLink = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find((el) => /google/i.test(el.textContent || ''));
    return a ? { href: a.href, text: a.textContent?.trim() } : null;
  });

  if (!googleLink) {
    bug({
      title: `[${env}] Google login button missing on login page`,
      steps: `1. Open ${base}/login\n2. Look for "Continue with Google"`,
      expected: 'Visible Google OAuth button linking to API auth start URL',
      actual: 'No Google button found in DOM',
      severity: 'High',
      screenshot: await shot(page, `${env}-login-no-google`),
      fix: 'Verify SocialAuthButtons renders and buildAuthUrl("google") returns a valid href.',
      area: 'Google login',
    });
  } else if (!googleLink.href.includes('google') && !googleLink.href.includes('/auth/')) {
    bug({
      title: `[${env}] Google login href looks misconfigured`,
      steps: `1. Open ${base}/login\n2. Inspect Google button href`,
      expected: 'Href points to api.final10.app OAuth start route',
      actual: `Href: ${googleLink.href}`,
      severity: 'Medium',
      screenshot: await shot(page, `${env}-login-google-href`),
      fix: 'Check REACT_APP_API_URL and buildAuthUrl in runtimeApi.js.',
      area: 'Google login',
    });
  }

  // Invalid credentials
  await page.type('#email, input[name="email"], input[type="email"]', 'qa-invalid@final10.test', { delay: 20 });
  await page.type('#password, input[name="password"], input[type="password"]', 'WrongPassword!123', { delay: 20 });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 4000));

  const afterInvalid = await getText(page);
  const stillOnLogin = page.url().includes('/login');
  const hasError = /failed|invalid|incorrect|wrong|error/i.test(afterInvalid);

  if (!stillOnLogin) {
    bug({
      title: `[${env}] Invalid login navigates away from login page`,
      steps: '1. Enter invalid email/password\n2. Submit',
      expected: 'Stay on login with error message',
      actual: `Redirected to ${page.url()}`,
      severity: 'High',
      screenshot: await shot(page, `${env}-login-invalid-redirect`),
      fix: 'Login handler should catch API errors and not navigate on failure.',
      area: 'Email login',
    });
  } else if (!hasError) {
    bug({
      title: `[${env}] Invalid login shows no user-visible error`,
      steps: '1. Enter qa-invalid@final10.test / WrongPassword!123\n2. Submit',
      expected: 'Clear error message (role="alert")',
      actual: `Page text: ${afterInvalid.slice(0, 250).replace(/\n/g, ' ')}`,
      severity: 'Medium',
      screenshot: await shot(page, `${env}-login-no-error`),
      fix: 'Surface parseApiError message in Login.js err state.',
      area: 'Email login',
    });
  }

  // Empty submit
  await page.goto(`${base}/login`, { waitUntil: 'networkidle2' });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1000));
  const emptySubmit = await page.evaluate(() => {
    const email = document.querySelector('input[type="email"]');
    return email?.validationMessage || document.body.innerText.slice(0, 200);
  });
  if (!emptySubmit) {
    bug({
      title: `[${env}] Login form allows empty submit without validation feedback`,
      steps: '1. Open login\n2. Click Sign in without filling fields',
      expected: 'HTML5 required validation or inline error',
      actual: 'No validation message detected',
      severity: 'Low',
      screenshot: await shot(page, `${env}-login-empty`),
      fix: 'Add required attribute to email/password inputs.',
      area: 'Email login',
    });
  }
}

async function testForgotPassword(page, base, env) {
  await page.goto(`${base}/forgot-password`, { waitUntil: 'networkidle2' });
  await waitForApp(page);

  const linkFromLogin = await page.evaluate(() => {
    return [...document.querySelectorAll('a')].some((a) => /forgot/i.test(a.textContent || ''));
  });

  await page.goto(`${base}/login`, { waitUntil: 'networkidle2' });
  const hasForgotLink = await page.evaluate(() =>
    [...document.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/forgot-password')
  );
  if (!hasForgotLink) {
    bug({
      title: `[${env}] Forgot password link missing on login page`,
      steps: '1. Open /login\n2. Look for Forgot Password link',
      expected: 'Link to /forgot-password',
      actual: 'Link not found',
      severity: 'Medium',
      screenshot: await shot(page, `${env}-no-forgot-link`),
      fix: 'Restore Link to /forgot-password in Login.js',
      area: 'Forgot password',
    });
  }

  await page.goto(`${base}/forgot-password`, { waitUntil: 'networkidle2' });
  await page.type('#forgot-email, input[type="email"]', 'qa-reset-test@final10.app', { delay: 20 });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 5000));

  const text = await getText(page);
  const success = /reset instructions|sent/i.test(text);
  const error = /error|failed|something went wrong/i.test(text);

  if (error && !success) {
    bug({
      title: `[${env}] Forgot password API returns visible error for valid-format email`,
      steps: '1. Open /forgot-password\n2. Enter qa-reset-test@final10.app\n3. Submit',
      expected: 'Neutral success copy regardless of account existence',
      actual: text.slice(0, 300).replace(/\n/g, ' '),
      severity: 'High',
      screenshot: await shot(page, `${env}-forgot-error`),
      fix: 'Check POST /api/auth/forgot-password handler and client requestPasswordReset.',
      area: 'Forgot password',
    });
  }
}

async function testMobileLayout(page, base, env) {
  await page.setViewport(MOBILE);
  const paths = ['/', '/login', '/pricing', '/auctions'];
  for (const path of paths) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    await waitForApp(page);
    const issues = await page.evaluate(() => {
      const doc = document.documentElement;
      const horizontalOverflow = doc.scrollWidth > window.innerWidth + 2;
      const tinyTargets = [...document.querySelectorAll('a, button')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 40 && r.width < 40;
      }).length;
      return { horizontalOverflow, tinyTargets, scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth };
    });

    if (issues.horizontalOverflow) {
      bug({
        title: `[${env}] Horizontal scroll on mobile at ${path}`,
        steps: `1. Set viewport 390x844\n2. Open ${path}`,
        expected: 'No horizontal overflow',
        actual: `scrollWidth ${issues.scrollWidth} > innerWidth ${issues.innerWidth}`,
        severity: path === '/' ? 'Medium' : 'Low',
        screenshot: await shot(page, `${env}-mobile-overflow-${path.replace(/\//g, 'root')}`),
        fix: 'Audit overflow-x, fixed widths, and padding on container/main.',
        area: 'Mobile layout',
      });
    }
  }
  await page.setViewport(DESKTOP);
}

async function testFeaturePagesReachability(page, base, env) {
  // Logged-out: should redirect to login, not crash
  const featurePaths = ['/perk-machine', '/battle-pass', '/daily-streak', '/alerts'];
  for (const path of featurePaths) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    await waitForApp(page);
    const crashed = await page.evaluate(() =>
      /something went wrong|error boundary|application error/i.test(document.body?.innerText || '')
    );
    if (crashed) {
      bug({
        title: `[${env}] Error boundary shown on ${path} (logged out)`,
        steps: `1. Visit ${path} without auth`,
        expected: 'Clean redirect to /login',
        actual: 'Error boundary or crash UI visible',
        severity: 'High',
        screenshot: await shot(page, `${env}-crash-${path.replace(/\//g, '')}`),
        fix: 'Guard feature pages with ProtectedRoute before data hooks run.',
        area: path.replace('/', ''),
      });
    }
  }
}

async function testApiHealth() {
  const endpoints = [
    { path: '/api/health', expectOk: true },
    { path: '/api/auth/providers', expectOk: true },
    { path: '/api/auth/me', expectOk: false, expectStatus: [401, 403] },
    { path: '/api/admin/hub', expectOk: false, expectStatus: [401, 403, 404] },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${API}${ep.path}`, { method: 'GET' });
      const status = res.status;
      if (ep.expectOk && !res.ok) {
        bug({
          title: `[API] ${ep.path} returned ${status}`,
          steps: `GET ${API}${ep.path}`,
          expected: '200 OK',
          actual: `HTTP ${status}`,
          severity: ep.path.includes('auth/providers') ? 'High' : 'Medium',
          screenshot: `Response body: ${(await res.text()).slice(0, 200)}`,
          fix: 'Verify Railway deployment and route registration.',
          area: 'API',
        });
      }
      if (!ep.expectOk && res.ok) {
        bug({
          title: `[API] ${ep.path} accessible without auth`,
          steps: `GET ${API}${ep.path} with no Authorization header`,
          expected: `HTTP ${ep.expectStatus?.join(' or ')}`,
          actual: `HTTP ${status} with body: ${(await res.text()).slice(0, 200)}`,
          severity: 'Critical',
          screenshot: 'N/A — API log',
          fix: 'Add auth middleware to sensitive endpoints.',
          area: 'Protected routes',
        });
      }
    } catch (err) {
      bug({
        title: `[API] ${ep.path} request failed`,
        steps: `GET ${API}${ep.path}`,
        expected: 'Successful response',
        actual: String(err.message || err),
        severity: 'High',
        screenshot: 'Network error',
        fix: 'Check DNS, CORS, and API uptime.',
        area: 'API',
      });
    }
  }

  // Providers payload
  try {
    const res = await fetch(`${API}/api/auth/providers`);
    const data = await res.json();
    if (!data.google && !data.apple) {
      bug({
        title: '[API] No social auth providers configured',
        steps: 'GET /api/auth/providers',
        expected: 'google: true when OAuth env vars set',
        actual: JSON.stringify(data),
        severity: 'High',
        screenshot: 'API JSON response',
        fix: 'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL on Railway.',
        area: 'Google login',
      });
    }
  } catch {
    /* covered above */
  }
}

async function testGoogleOAuthStart() {
  try {
    const res = await fetch(`${API}/api/auth/google`, { redirect: 'manual' });
    const status = res.status;
    if (status !== 302 && status !== 301) {
      const body = await res.text();
      bug({
        title: '[API] Google OAuth start does not redirect',
        steps: `GET ${API}/api/auth/google`,
        expected: '302 redirect to accounts.google.com',
        actual: `HTTP ${status}: ${body.slice(0, 200)}`,
        severity: 'High',
        screenshot: 'API response',
        fix: 'Configure Google OAuth routes and env vars on server.',
        area: 'Google login',
      });
    }
  } catch (err) {
    bug({
      title: '[API] Google OAuth start unreachable',
      steps: `GET ${API}/api/auth/google`,
      expected: '302 redirect',
      actual: String(err.message || err),
      severity: 'High',
      screenshot: 'Network error',
      fix: 'Verify auth router mounted at /api/auth/google.',
      area: 'Google login',
    });
  }
}

async function runEnv(browser, base, env) {
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  await page.setViewport(DESKTOP);

  const consoleErrors = [];
  const networkFailures = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('requestfailed', (req) => {
    networkFailures.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });

  try {
    await testProtectedRoutes(page, base, env);
    await testLoginForm(page, base, env);
    await testForgotPassword(page, base, env);
    await testFeaturePagesReachability(page, base, env);
    await testMobileLayout(page, base, env);

    await page.goto(`${base}/`, { waitUntil: 'networkidle2' });
    await waitForApp(page);
    const criticalConsole = consoleErrors.filter(
      (e) => !/favicon|analytics|gtag|third-party|ResizeObserver/i.test(e)
    );
    if (criticalConsole.length > 3) {
      bug({
        title: `[${env}] Multiple console errors on dashboard load`,
        steps: `1. Open ${base}/\n2. Inspect browser console`,
        expected: 'No critical JS errors',
        actual: criticalConsole.slice(0, 5).join(' | '),
        severity: 'Medium',
        screenshot: await shot(page, `${env}-console-errors`),
        fix: 'Fix failing imports, API calls, or undefined references.',
        area: 'General',
      });
    }

    const apiFails = networkFailures.filter((f) => f.includes('api.final10.app') || f.includes('localhost:5000'));
    if (apiFails.length > 0) {
      bug({
        title: `[${env}] API network failures on load`,
        steps: `1. Open ${base}\n2. Check network tab`,
        expected: 'API calls succeed or fail gracefully',
        actual: apiFails.slice(0, 4).join(' | '),
        severity: 'High',
        screenshot: await shot(page, `${env}-network-fail`),
        fix: 'Check CORS, API URL config, and backend health.',
        area: 'API',
      });
    }
  } finally {
    await page.close();
  }
}

async function isLocalUp() {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 3000);
    const res = await fetch(LOCAL, { signal: c.signal });
    clearTimeout(t);
    return res.ok || res.status === 304;
  } catch {
    return false;
  }
}

async function main() {
  const { mkdirSync } = await import('fs');
  const shotDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'qa-screenshots');
  mkdirSync(shotDir, { recursive: true });

  console.log('=== Final10 QA Bug Hunter ===');
  await testApiHealth();
  await testGoogleOAuthStart();

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log(`Testing LIVE: ${LIVE}`);
  await runEnv(browser, LIVE, 'LIVE');

  const localUp = await isLocalUp();
  if (localUp) {
    console.log(`Testing LOCAL: ${LOCAL}`);
    await runEnv(browser, LOCAL, 'LOCAL');
  } else {
    console.log(`LOCAL not available at ${LOCAL} — skipping`);
  }

  await browser.close();

  const reportPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'QA_BUG_REPORT.md');
  const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  bugs.sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9));

  const md = [
    '# Final10 QA Bug Report',
    '',
    `**Generated:** ${new Date().toISOString()}`,
    `**Targets:** ${LIVE}${localUp ? `, ${LOCAL}` : ' (local unavailable)'}`,
    `**API:** ${API}`,
    '',
    '## Test scope (priority order)',
    '',
    '1. Protected routes & admin-only controls (unauthenticated access)',
    '2. API auth boundary (`/api/auth/me`, admin endpoints)',
    '3. Google OAuth configuration & redirect',
    '4. Email login error handling',
    '5. Forgot password flow',
    '6. Perk Machine / Battle Pass / Daily Streak / Alerts reachability',
    '7. Mobile horizontal overflow',
    '8. Console & network errors on dashboard',
    '9. Savvy balance (requires authenticated session — manual follow-up)',
    '10. Login streak claim flow (requires authenticated session — manual follow-up)',
    '',
    `## Summary`,
    '',
    `| Severity | Count |`,
    `|----------|-------|`,
    ...['Critical', 'High', 'Medium', 'Low'].map((s) => {
      const n = bugs.filter((b) => b.severity === s).length;
      return `| ${s} | ${n} |`;
    }),
    '',
    `**Total bugs found:** ${bugs.length}`,
    '',
    '## Bugs',
    '',
  ];

  if (bugs.length === 0) {
    md.push('_No automated bugs detected in this pass. Manual authenticated testing still recommended for Savvy balance, Perk Machine spins, Eggs hatch, Battle Pass XP, and login streak claims._');
  } else {
    for (const b of bugs) {
      md.push(
        `### ${b.id}: ${b.title}`,
        '',
        `**Area:** ${b.area || 'General'}  `,
        `**Severity:** ${b.severity}`,
        '',
        '#### Steps to reproduce',
        b.steps,
        '',
        '#### Expected result',
        b.expected,
        '',
        '#### Actual result',
        b.actual,
        '',
        '#### Screenshot / log notes',
        b.screenshot || 'N/A',
        '',
        '#### Recommended fix',
        b.fix,
        '',
        '---',
        ''
      );
    }
  }

  md.push(
    '',
    '## Manual test gaps',
    '',
    '- **Savvy balance:** Requires signed-in user; verify profile `#savvy-balance` matches API `/api/auth/me` savvyPoints.',
    '- **Perk Machine / Eggs:** Requires auth + Savvy balance; test spin, egg hatch modal, insufficient-funds state.',
    '- **Battle Pass:** Verify XP bar, tier rewards, premium track lock.',
    '- **Login streak:** Sign in twice same day vs consecutive days; verify shield and redirect to `/daily-streak`.',
    '- **Alerts:** Create/edit/delete alert rules; verify push/email toggles persist.',
    '- **Admin panels:** Sign in as non-admin; confirm `/admin`, `/shield-dashboard` redirect to `/` in production.',
    ''
  );

  writeFileSync(reportPath, md.join('\n'));
  console.log(`\nReport written: ${reportPath}`);
  console.log(`Bugs found: ${bugs.length}`);
  process.exit(bugs.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
