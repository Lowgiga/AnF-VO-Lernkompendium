# Changelog

## 2.9.5
- Adopted the standalone RobotNav architecture from the wrapper workstream: `index.html` now loads `robot-navigation.js` via `<script src>` instead of an inline embedded block; the service worker precaches the engine file and supports `skip-waiting`.
- Added byte-parity checks for the engine copies (root ↔ `algorithm/` ↔ Android assets) and extended the PWA precache expectation.
- Learning content unchanged (embedded DATA blob byte-identical); animation overhaul from v2.9.4 carried over.
- Bumped to v2.9.5 / versionCode 295.

## Unreleased

- Prepared the repository root as an installable offline PWA for the GitHub Pages project subpath `/AnFoVO-Lernkompendium/`.
- Mirrored `manifest.json`, `sw.js`, icons, and `bg/` between the root and the Android asset directory.
- Bumped the service-worker cache name to `anfoevo_v2_cache_2.9.1-web-pwa-2.9.1`.
- Updated the impressum version stamp to v2.9.1 and left the § 5 DDG placeholder in place.
- Added `scripts/prepare-pages-surface.sh` to build a local web-only directory. GitHub Pages stays disabled.

## 2.9.4
- Redesigned the book/robot page-turn animation to compositor-only `transform`/`opacity`: removed `filter` animation from `flipin`, removed `drop-shadow` from animated layers, stopped `left/top` layout animation, and replaced the height-based book fill with `scaleY`.
- Throttled the stage parallax with `requestAnimationFrame` via `--par-x`/`--par-y` custom properties; it no longer clobbers RobotNav state and respects `prefers-reduced-motion`.
- Softened the page-turn gestures (book nudge, leaf turn, robot gesture/nod/climb) to a restrained, technical look.
- Bumped to v2.9.4 / versionCode 294.

## 2.9.1
- Added a matching Android WebView wrapper and built a debug APK with Gradle 8.13 / AGP 8.13.2.
- Fixed the Android round-icon resource reference so the APK resource-linking step succeeds.
- Restored static and Playwright browser validation to the Android CI workflow, including test-path triggers.
- Restricted the documented Gradle runtime to supported JDK 17 or 21.
- Verified ARM64, universal and x86_64 debug APK signatures with APK Signature Scheme v2.
- Verified the Android build with JDK 21, Android SDK Platform 36 and Build Tools 36.0.0.
- Updated the mascot to a silver metallic appearance with graphite visor and ice-blue eye lighting.
- Confirmed hybrid book-and-reading-interface design direction in project documentation.
- Added local asset directory structure for book and robot visuals.
- Updated project manifest and README.
- Preserved existing learning content and standalone offline runtime.
- Verified the full 70-page HTML app in local Chrome with zero page errors.
- Passed the Playwright RobotNav harness: nested scroll roots, cache cleanup, stable observers, and teardown.

# Changelog

## v2.9.0
- Hybrid 3D book presentation refined.
- Mascot changed to a white ceramic/metal visual treatment.
- Added architecture, design-system, content-preservation and release-process documentation.
- Existing 70 learning pages retained.
- Static checks: 20 passed, 0 failed.
- Browser interaction tests remain unverified.
