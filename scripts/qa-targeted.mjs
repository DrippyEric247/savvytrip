import puppeteer from 'puppeteer';

const LIVE = 'https://www.final10.app';

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const results = [];

  // 1. Invalid login - check alert specifically
  await page.goto(`${LIVE}/login`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'qa-invalid@final10.test', { delay: 10 });
  await page.type('input[type="password"]', 'WrongPassword!123', { delay: 10 });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 5000));
  const loginCheck = await page.evaluate(() => ({
    url: location.href,
    alert: document.querySelector('[role="alert"]')?.textContent?.trim() || null,
    h1: document.querySelector('h1')?.textContent?.trim() || null,
  }));
  results.push({ test: 'invalid_login', ...loginCheck });

  // 2. Google button
  await page.goto(`${LIVE}/login`, { waitUntil: 'networkidle2' });
  const google = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find((el) => /google/i.test(el.textContent || ''));
    return a ? { href: a.href, visible: a.offsetParent !== null } : null;
  });
  results.push({ test: 'google_button', google });

  // 3. Protected routes redirect
  for (const path of ['/profile', '/alerts', '/perk-machine', '/battle-pass', '/daily-streak', '/admin']) {
    await page.goto(`${LIVE}${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));
    results.push({
      test: `protected_${path}`,
      finalUrl: page.url(),
      hasLoginForm: Boolean(await page.$('input[type="password"]')),
      title: await page.title(),
    });
  }

  // 4. Mobile overflow live
  await page.setViewport({ width: 390, height: 844 });
  for (const path of ['/', '/login', '/auctions']) {
    await page.goto(`${LIVE}${path}`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    }));
    results.push({ test: `mobile_${path}`, ...overflow });
  }

  // 5. Forgot password
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${LIVE}/forgot-password`, { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'qa-reset@final10.test');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 5000));
  const forgot = await page.evaluate(() => ({
    status: document.querySelector('[role="status"]')?.textContent?.trim(),
    alert: document.querySelector('[role="alert"]')?.textContent?.trim(),
    url: location.href,
  }));
  results.push({ test: 'forgot_password', ...forgot });

  // 6. Login empty validation
  await page.goto(`${LIVE}/login`, { waitUntil: 'networkidle2' });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));
  const emptyVal = await page.evaluate(() => {
    const email = document.querySelector('input[type="email"]');
    return { required: email?.required, validationMessage: email?.validationMessage };
  });
  results.push({ test: 'login_empty_validation', ...emptyVal });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
