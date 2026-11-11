# AnF-VO-Lernkompendium

A local-first digital learning compendium for § 8 AnFöVO NRW.

## Product direction

A hybrid learning experience: a premium 3D book with a readable, accessible learning interface. The mascot is a white-silver metallic decorative robot with a graphite visor and restrained ice-blue eye lighting. Existing learning content is preserved.

## Start

Open `index.html` in a modern browser. The core application is designed to work locally without external runtime dependencies.

## Project structure

See [Architecture](docs/ARCHITECTURE.md), [Design System](docs/DESIGN_SYSTEM.md), and [Content Preservation](docs/CONTENT_PRESERVATION.md).

## Validation

Run the static checks from the repository root:

```powershell
python tests/verify-build.py
```

Run the browser checks from `tests/`:

```powershell
npm ci
npx playwright install chromium
npm run test:all
```

Set `CHROMIUM_PATH` when using a system Chrome/Chromium binary instead of Playwright's managed browser. The smoke test checks all 70 HTML pages and JavaScript page errors; the RobotNav harness checks nested scrolling, cache cleanup, observer stability, and teardown.

## Mascot and navigation

RobotNav is a deterministic browser-side layout helper. The white-silver metallic robot is decorative and does not make network requests or act as an AI agent.

## License

This project is released under the **Apache License 2.0** (see [LICENSE](./LICENSE)). Public visibility alone does not imply reuse rights beyond the license terms.

## Android application

The Android WebView wrapper is located in `android/` and packages the same standalone `index.html` used by the desktop version. The HTML source and Android asset copy are byte-identical.

- Application ID: `de.omega.lernkompendium`
- App version: `2.9.1` (`versionCode` 291)
- Minimum Android: API 29
- Compile/target SDK: 36
- Android Gradle Plugin: 8.13.2
- Gradle wrapper: 8.13
- Supported Gradle runtime JDKs: 17 or 21 (CI uses 17; local validation used 21)

Build a debug APK on Windows:

```powershell
cd android
.\gradlew.bat --no-daemon clean :app:assembleDebug
```

Build on Linux or macOS:

```bash
cd android
./gradlew --no-daemon clean :app:assembleDebug
```

The committed Gradle 8.13 wrapper includes its launcher JAR, POSIX and Windows launchers, and the distribution SHA-256 pin. CI validates the wrapper before building with JDK 17, Android SDK Platform 36, and Android Build Tools 36.0.0. Do not generate or replace the wrapper with an unpinned Gradle installation.

The debug APK is signed with the standard Android debug key and is for testing only. A production release requires a private, backed-up release keystore. The Galaxy S25 installation test remains pending until ADB detects the device.
