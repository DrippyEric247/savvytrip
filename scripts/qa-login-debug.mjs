import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
const loginCalls = [];
page.on('response', async (r) => {
  if (r.url().includes('/auth/login') && r.request().method() === 'POST') {
    loginCalls.push({ status: r.status(), body: await r.text().catch(() => '') });
  }
});
page.on('pageerror', (e) => loginCalls.push({ pageerror: e.message }));

await page.goto('https://www.final10.app/login', { waitUntil: 'networkidle2' });
await page.click('input[type="email"]', { clickCount: 3 });
await page.keyboard.press('Backspace');
await page.type('input[type="email"]', 'qa-invalid@final10.test', { delay: 15 });
await page.type('input[type="password"]', 'WrongPassword!123', { delay: 15 });
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 6000));

const reactErr = await page.evaluate(() => ({
  alert: document.querySelector('[role="alert"]')?.textContent,
  busy: document.querySelector('button[type="submit"]')?.textContent,
  redBorders: [...document.querySelectorAll('div')].filter((d) => /red/i.test(d.className)).map((d) => d.textContent?.trim()),
}));

console.log(JSON.stringify({ loginCalls, reactErr }, null, 2));
await browser.close();
