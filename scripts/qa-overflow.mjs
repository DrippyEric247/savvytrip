import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });

const paths = ['/', '/login', '/auctions', '/build-wars'];
for (const path of paths) {
  await page.goto(`https://www.final10.app${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  const overflow = await page.evaluate(() => {
    const offenders = [];
    const vw = window.innerWidth;
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 && r.width > 0 && r.height > 0) {
        offenders.push({
          tag: el.tagName,
          class: el.className?.toString?.().slice(0, 80),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: vw,
      offenders: offenders.slice(0, 8),
    };
  });
  console.log(path, JSON.stringify(overflow));
}

// Google OAuth redirect target
await page.goto('https://www.final10.app/login', { waitUntil: 'networkidle2' });
const google = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find((el) => /google/i.test(el.textContent || ''));
  return a?.href;
});
console.log('google_href', google);

// API hosts used on page load
const apiHosts = new Set();
page.on('request', (r) => {
  try {
    const u = new URL(r.url());
    if (u.pathname.includes('/api/')) apiHosts.add(u.origin);
  } catch {}
});
await page.reload({ waitUntil: 'networkidle2' });
console.log('api_hosts', [...apiHosts]);

await browser.close();
