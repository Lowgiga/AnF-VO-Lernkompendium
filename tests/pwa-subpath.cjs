const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PREFIX = '/AnFoVO-Lernkompendium';
const CACHE = 'anfoevo_v2_cache_2.9.1-web-pwa-2.9.1';
const FRAME_NAMES = ['d', 'm'].flatMap((size) =>
  fs.readdirSync(path.join(ROOT, 'bg', size))
    .filter((name) => name.endsWith('.webp'))
    .sort()
    .map((name) => `${PREFIX}/bg/${size}/${name}`)
);
const EXPECTED_CACHE = [
  `${PREFIX}/`,
  `${PREFIX}/index.html`,
  `${PREFIX}/manifest.json`,
  `${PREFIX}/icon-192.png`,
  `${PREFIX}/icon-512.png`,
  `${PREFIX}/icon-512-maskable.png`,
  ...FRAME_NAMES
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/manifest+json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname !== PREFIX && !pathname.startsWith(PREFIX + '/')) {
      res.writeHead(404);
      res.end('missing project subpath');
      return;
    }
    let rel = pathname.slice(PREFIX.length).replace(/^\/+/, '');
    if (rel === '') rel = 'index.html';
    const file = path.resolve(ROOT, rel);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

(async () => {
  const { server, origin } = await startServer();
  const base = origin + PREFIX + '/';
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  const errors = [];
  try {
    const context = await browser.newContext();
    const page = await context.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', (error) => errors.push(String(error)));
    if (FRAME_NAMES.length !== 58) throw new Error('Expected 58 background frames, found ' + FRAME_NAMES.length);
    await page.goto(base, { waitUntil: 'load' });
    let installTimer;
    const installed = await Promise.race([
      page.evaluate(async ({ expectedCache, expectedPaths }) => {
        if (!window.__pwaRegisterAttempted) return { ok: false, reason: 'registration was not attempted' };
        const link = document.querySelector('link[rel="manifest"]');
        const icon = document.querySelector('link[rel="icon"]');
        if (!link || !icon) return { ok: false, reason: 'missing manifest or icon link' };
        const manifestUrl = new URL(link.getAttribute('href'), location.href);
        const iconUrl = new URL(icon.getAttribute('href'), location.href);
        if (!manifestUrl.pathname.endsWith('/AnFoVO-Lernkompendium/manifest.json')) {
          return { ok: false, reason: 'manifest URL ' + manifestUrl.pathname };
        }
        if (!iconUrl.pathname.endsWith('/AnFoVO-Lernkompendium/icon-192.png')) {
          return { ok: false, reason: 'icon URL ' + iconUrl.pathname };
        }
        const manifest = await (await fetch(manifestUrl)).json();
        const registration = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('service worker did not become active within 15 seconds')), 15000);
          navigator.serviceWorker.ready.then((value) => {
            clearTimeout(timer);
            resolve(value);
          }, (error) => {
            clearTimeout(timer);
            reject(error);
          });
        });
        const names = await caches.keys();
        const cache = await caches.open(expectedCache);
        const keys = await cache.keys();
        const urls = keys.map((request) => new URL(request.url).pathname);
        const missing = expectedPaths.filter((item) => !urls.includes(item));
        const frame = await fetch(new URL('bg/d/r00.webp', location.href));
        return {
          ok: true,
          scope: registration.scope,
          script: registration.active && registration.active.scriptURL,
          manifestStart: manifest.start_url,
          manifestScope: manifest.scope,
          cacheNames: names,
          cached: urls.length,
          expected: expectedPaths.length,
          missing,
          frameStatus: frame.status,
          frameType: frame.headers.get('content-type')
        };
      }, { expectedCache: CACHE, expectedPaths: EXPECTED_CACHE }),
      new Promise((_, reject) => {
        installTimer = setTimeout(() => reject(new Error('PWA install check timed out after 20 seconds')), 20000);
      })
    ]).finally(() => clearTimeout(installTimer));
    if (!installed.ok) throw new Error(installed.reason || 'install check failed');
    if (!installed.scope.endsWith('/AnFoVO-Lernkompendium/')) throw new Error('Unexpected scope ' + installed.scope);
    if (!installed.script.endsWith('/AnFoVO-Lernkompendium/sw.js')) throw new Error('Unexpected worker ' + installed.script);
    if (installed.manifestStart !== './' || installed.manifestScope !== './') {
      throw new Error('Manifest scope escaped the project subpath: ' + JSON.stringify(installed));
    }
    if (!installed.cacheNames.includes(CACHE) || installed.missing.length) {
      throw new Error('Cache incomplete: ' + JSON.stringify({
        cacheNames: installed.cacheNames,
        cached: installed.cached,
        expected: installed.expected,
        missing: installed.missing
      }));
    }
    if (installed.frameStatus !== 200 || installed.frameType !== 'image/webp') {
      throw new Error('Background frame was not served: ' + JSON.stringify(installed));
    }
    await page.reload({ waitUntil: 'load' });
    const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);
    if (!controlled) throw new Error('Reloaded page is not controlled by the service worker');
    await context.setOffline(true);
    const offlineResponse = await page.goto(base, { waitUntil: 'load' });
    const offline = await page.evaluate(() => ({
      title: document.title,
      pages: document.querySelectorAll('#pages article.page').length,
      manifest: !!document.querySelector('link[rel="manifest"]')
    }));
    if (!offlineResponse || !offlineResponse.ok() || !offline.title.includes('v2.9.1') || offline.pages < 70 || !offline.manifest) {
      throw new Error('Offline navigation failed: ' + JSON.stringify({ status: offlineResponse && offlineResponse.status(), offline }));
    }
    await context.setOffline(false);
    await context.close();

    const filePage = await browser.newPage();
    const fileErrors = [];
    filePage.on('pageerror', (error) => fileErrors.push(String(error)));
    await filePage.goto(require('url').pathToFileURL(path.join(ROOT, 'index.html')).href, { waitUntil: 'load' });
    const fileState = await filePage.evaluate(() => ({
      protocol: location.protocol,
      attempted: window.__pwaRegisterAttempted === true,
      pages: document.querySelectorAll('#pages article.page').length
    }));
    if (fileState.protocol !== 'file:' || fileState.attempted || fileState.pages < 70 || fileErrors.length || errors.length) {
      throw new Error('file:// registration guard failed: ' + JSON.stringify({ fileState, fileErrors, errors }));
    }
    console.log(JSON.stringify({
      pass: true,
      scope: installed.scope,
      cache: CACHE,
      cachedEntries: installed.cached,
      expectedEntries: installed.expected,
      missing: installed.missing,
      offlinePages: offline.pages,
      fileProtocolSkipped: true,
      errors
    }, null, 2));
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
