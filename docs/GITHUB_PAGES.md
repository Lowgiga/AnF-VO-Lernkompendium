# GitHub Pages

The repository root can be served later as an installable offline PWA at the project-site subpath `/AnFoVO-Lernkompendium/`. This branch does not enable GitHub Pages, change repository settings, merge to `main`, or modify billing.

## Ready on this branch

- `index.html` links `./manifest.json`, `./icon-192.png`, and an apple-touch icon.
- `manifest.json` uses relative `start_url` and `scope` (`./`), so installation stays inside the project subpath.
- `sw.js` precaches the shell, icons, and both `bg/d` and `bg/m` frame sets. Its cache name is `anfoevo_v2_cache_2.9.1-web-pwa-2.9.1`.
- `.nojekyll` is present so a later Pages publish does not run Jekyll.
- The service worker is registered only when `location.protocol` is `http:` or `https:`, and the registration returns before calling `register` when the URL contains `android_asset`. Opening `index.html` with `file://` does not register a worker.
- The same `index.html`, `manifest.json`, `sw.js`, icons, and `bg/` frames are byte-identical under `android/app/src/main/assets/`.

The Android WebView loads `https://appassets.androidplatform.net/assets/index.html`. That origin is `https` and does not contain `android_asset`, so the same registration runs there. `MainActivity` already attaches `ServiceWorkerControllerCompat` to the asset loader. A failed registration is ignored and does not block the page. Legacy `file:///android_asset/` URLs skip registration.

## Clean publish surface

The Git branch also contains `android/`, `tests/`, and the Gradle wrapper. Those directories are not the public site.

`scripts/prepare-pages-surface.sh` copies only the web shell into `dist/pages/` (gitignored):

- `index.html`, `manifest.json`, `sw.js`
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`
- `bg/`
- `.nojekyll`
- `LICENSE`

It excludes `android/`, `tests/`, and Gradle. It does not enable GitHub Pages, push a branch, or change repository settings. `dist/pages/` is a local directory you can publish yourself later. A custom destination is accepted only under `dist/` or outside the repository. The script refuses to delete the repository itself. An existing destination is replaced only when it already contains the `.pages-surface` marker written by this script.

## Before a public launch

1. Replace the § 5 DDG placeholder in the impressum (`[vor Veröffentlichung ergänzen: Name, Anschrift, Kontakt]`) with the provider's real name, address, and contact. Do not publish while that placeholder is present, and do not invent those details. `tests/verify-build.py` currently requires the placeholder to stay, so updating it is a deliberate content change.
2. Keep the repository free of workbook photos, verbatim workbook text, and personal notes.
3. Enable GitHub Pages yourself only after that review. Use the project site `https://<owner>.github.io/AnFoVO-Lernkompendium/`. Publish the contents of `dist/pages/` if the public site should omit Android, tests, and Gradle. Publishing the branch root would also expose those directories.
4. GitHub Actions billing stays a manual account decision. `.github/workflows/android-build.yml` runs on pull requests to `main` and consumes Actions minutes when Actions is enabled. This change does not modify billing, spending limits, or repository settings.
5. Merge to `main` only when you choose to. This branch does not merge itself.
