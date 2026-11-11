const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const result = await page.evaluate(() => ({
    title: document.title,
    language: document.documentElement.lang,
    pageCount: document.querySelectorAll('#pages article.page').length,
    robotNavAvailable: typeof window.RobotNav !== 'undefined',
    robotNavVersion: window.RobotNav && window.RobotNav.inspect ? window.RobotNav.inspect().version : null,
    bookPresent: !!document.querySelector('.book3d'),
    robotPresent: !!document.querySelector('.robot3d'),
    backgroundCanvasPresent: !!document.querySelector('#bgc')
  }));
  await browser.close();
  console.log(JSON.stringify({ ...result, errors }, null, 2));
  if (!result.title.includes('v2.9.1') || result.pageCount < 1 || !result.robotNavAvailable || !result.bookPresent || !result.robotPresent || errors.length) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
