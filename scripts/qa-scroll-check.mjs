import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto('https://www.final10.app/', { waitUntil: 'networkidle2' });
const scroll = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  bodyOverflow: getComputedStyle(document.body).overflowX,
  htmlOverflow: getComputedStyle(document.documentElement).overflowX,
  canScrollRight: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  scrollLeftMax: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
console.log(JSON.stringify(scroll));
await browser.close();
