const { chromium } = require('playwright');
const fs = require('fs');
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

  const root = path.resolve(__dirname, '..');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  const manifestIconsMissing = (manifest.icons || [])
    .filter(icon => !fs.existsSync(path.resolve(root, icon.src)))
    .map(icon => icon.src);
  const manifestLink = await page.evaluate(() =>
    document.querySelector('link[rel="manifest"]')?.getAttribute('href') || null
  );

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileRobotDisplay = await page.locator('.robot3d').evaluate(el => getComputedStyle(el).display);

  const progressChecks = await page.evaluate(() => {
    const view = document.getElementById('view-fortschritt');
    const wasActive = view.classList.contains('active');
    view.classList.add('active');
    const rows = Array.from(document.querySelectorAll('#proglist .prog'));
    const rings = rows.filter(row => row.querySelector('.ring-wrap svg.ring') && row.querySelector('.ring-pct')).length;
    const countLabels = rows.filter(row => row.querySelector('.prog-count')).length;
    const bars = rows.filter(row => {
      const bar = row.querySelector('.bar');
      return !!bar && bar.getBoundingClientRect().width >= 32;
    }).length;
    const exercisePages = document.querySelectorAll('#pages article.page[data-fill="1"]').length;
    const overallText = document.getElementById('prog-overall-txt')?.textContent || '';
    if (!wasActive) view.classList.remove('active');
    return { rows: rows.length, rings, countLabels, bars, exercisePages, overallText };
  });

  const accessibilityChecks = await page.evaluate(() => {
    const dialog = document.getElementById('confirmDlg');
    const labelId = dialog.getAttribute('aria-labelledby');
    const descriptionId = dialog.getAttribute('aria-describedby');
    const dialogNamed = !!labelId && !!document.getElementById(labelId);
    const dialogDescribed = !!descriptionId && !!document.getElementById(descriptionId);

    window.dispatchEvent(new Event('kompendium:pagechange'));
    const pageChangeFeedback = document.querySelector('.robot3d')?.classList.contains('mood-ok') || false;

    const before = Array.from(document.querySelectorAll('.view'))
      .filter(view => view.classList.contains('active'))
      .map(view => view.id)
      .join(',');
    window.uiConfirm('Stabilitätstest', function () {});
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
    const focusStayedInDialog = dialog.contains(document.activeElement);
    const after = Array.from(document.querySelectorAll('.view'))
      .filter(view => view.classList.contains('active'))
      .map(view => view.id)
      .join(',');
    dialog.querySelector('.dlg-cancel').click();

    return {
      dialogNamed,
      dialogDescribed,
      pageChangeFeedback,
      focusStayedInDialog,
      shortcutsDidNotNavigate: before === after
    };
  });

  const interactionChecks = await page.evaluate(() => {
    const task = Array.from(document.querySelectorAll('.task')).find(candidate => {
      const gaps = Array.from(candidate.querySelectorAll('.gap'));
      return gaps.length >= 2 && gaps.every(gap => {
        try { return JSON.parse(gap.dataset.alts || '[]').some(answer => String(answer).trim().length > 0) && !!gap.querySelector('.gap-in'); }
        catch (_) { return false; }
      });
    });
    if (!task) return { gapScenarioFound: false };

    const solution = task.querySelector('details.loesung');
    if (!solution) return { gapScenarioFound: false };
    solution.open = false;
    solution.dispatchEvent(new Event('toggle'));

    const inputs = Array.from(task.querySelectorAll('.gap')).map(gap => gap.querySelector('.gap-in'));
    inputs.forEach(input => {
      const answers = JSON.parse(input.closest('.gap').dataset.alts || '[]');
      const correctAnswer = answers.find(answer => String(answer).trim().length > 0);
      input.value = String(correctAnswer);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    solution.open = true;
    solution.dispatchEvent(new Event('toggle'));
    const moodGreenAfterOpening = document.querySelector('.robot3d')?.classList.contains('mood-ok') || false;

    inputs[0].value = '__not_a_valid_answer__';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    const moodBadAfterEditing = document.querySelector('.robot3d')?.classList.contains('mood-bad') || false;

    HTMLCanvasElement.prototype.getContext = function () { return null; };
    const markDone = document.getElementById('markdone');
    markDone.click();

    const currentPage = document.querySelector('article.page.current');
    let storageAvailable = false;
    let completionPersisted = false;
    try {
      storageAvailable = document.getElementById('storenote').hidden;
      if (storageAvailable && currentPage) {
        const raw = localStorage.getItem('anfoevo_v2_done');
        const done = raw ? JSON.parse(raw) : {};
        completionPersisted = done[currentPage.dataset.id] === true;
      }
    } catch (_) {
      storageAvailable = false;
    }

    return {
      gapScenarioFound: true,
      moodGreenAfterOpening,
      moodBadAfterEditing,
      markDonePressed: markDone.getAttribute('aria-pressed') === 'true',
      storageAvailable,
      completionPersisted
    };
  });

  await browser.close();
  const report = {
    ...result,
    manifestLink,
    manifestIconsMissing,
    mobileRobotDisplay,
    progressChecks,
    accessibilityChecks,
    interactionChecks,
    errors
  };
  console.log(JSON.stringify(report, null, 2));
  if (
    !result.title.includes('v2.9.4') ||
    result.pageCount < 1 ||
    !result.robotNavAvailable ||
    !result.bookPresent ||
    !result.robotPresent ||
    manifestLink !== './manifest.json' ||
    manifestIconsMissing.length > 0 ||
    mobileRobotDisplay === 'none' ||
    progressChecks.rings !== progressChecks.rows ||
    progressChecks.countLabels !== progressChecks.rows ||
    progressChecks.bars !== progressChecks.rows ||
    !progressChecks.overallText.endsWith('von ' + progressChecks.exercisePages + ' Aufgaben erledigt') ||
    !accessibilityChecks.dialogNamed ||
    !accessibilityChecks.dialogDescribed ||
    !accessibilityChecks.pageChangeFeedback ||
    !accessibilityChecks.focusStayedInDialog ||
    !accessibilityChecks.shortcutsDidNotNavigate ||
    !interactionChecks.gapScenarioFound ||
    !interactionChecks.moodGreenAfterOpening ||
    !interactionChecks.moodBadAfterEditing ||
    !interactionChecks.markDonePressed ||
    (interactionChecks.storageAvailable && !interactionChecks.completionPersisted) ||
    errors.length
  ) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
