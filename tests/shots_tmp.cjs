const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.resolve('C:/Users/doli/AppData/Local/Temp/opencode/repo-check/docs/screenshots');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://lowgiga.github.io/AnFoVO-Lernkompendium/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, '01-home.png'), fullPage: true });
  console.log('01-home.png done');

  // Reading view: click the next-page arrow if present
  try {
    const next = page.locator('button:has-text("›"), a:has-text("›")').first();
    if (await next.count()) {
      await next.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(outDir, '02-reading.png'), fullPage: true });
      console.log('02-reading.png done');
    }
  } catch (e) { console.log('reading view skip:', e.message); }

  // Dashboard / progress: click the menu/progress area if present
  try {
    const menu = page.locator('button:has-text("Mehr"), button:has-text("☰")').first();
    if (await menu.count()) {
      await menu.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outDir, '03-dashboard.png'), fullPage: true });
      console.log('03-dashboard.png done');
    }
  } catch (e) { console.log('dashboard skip:', e.message); }

  // Android: same WebView UI, mobile viewport
  const mob = await browser.newPage({ viewport: { width: 412, height: 915 }, isMobile: true });
  await mob.goto('https://lowgiga.github.io/AnFoVO-Lernkompendium/', { waitUntil: 'networkidle' });
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: path.join(outDir, '04-android.png'), fullPage: true });
  console.log('04-android.png done');

  await browser.close();
})().catch(e => { console.error('FAILED:', e); process.exit(1); });