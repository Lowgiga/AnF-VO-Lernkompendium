# AnF-VO-Lernkompendium

A local-first digital learning compendium for § 8 AnFöVO NRW.

## Product direction
A hybrid learning experience: a premium 3D book with a readable, accessible learning interface. The mascot is a white-silver metallic decorative robot with a graphite visor and restrained ice-blue eye lighting. Existing learning content is preserved.

## Start
Open `index.html` in a modern browser. The core application is designed to work locally without external runtime dependencies.

## Project structure
See [Architecture](docs/ARCHITECTURE.md), [Design System](docs/DESIGN_SYSTEM.md), and [Content Preservation](docs/CONTENT_PRESERVATION.md).

## Validation
```powershell
python tests/verify-build.py
```
Browser interaction tests are separate and must be run with the optional Playwright dependency installed. Static checks do not establish browser-runtime correctness.

## Mascot and navigation
RobotNav is a deterministic browser-side layout helper. The white-silver metallic robot is decorative and does not make network requests or act as an AI agent.

## License
No license is declared yet. Public visibility does not grant reuse rights. Select a license explicitly before publishing a reuse grant.

## Android application

The Android WebView wrapper is located in `android/` and packages the same standalone `index.html` used by the desktop version. The HTML source and Android asset copy are byte-identical.

- Application ID: `de.omega.lernkompendium`
- App version: `2.9.1` (`versionCode` 291)
- Minimum Android: API 29
- Compile/target SDK: 36
- Android Gradle Plugin: 8.13.2
- Gradle wrapper: 8.13
- Java compatibility: 17 (build host currently uses JDK 21)

Build a debug APK on Windows:

```powershell
cd android
.\gradlew.bat clean :app:assembleDebug
```

The debug APK is signed with the standard Android debug key and is for testing only. A production release requires a private, backed-up release keystore. The Galaxy S25 installation test remains pending until ADB detects the device.
