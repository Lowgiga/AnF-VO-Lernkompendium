# Android build guide — AnF-VO-Lernkompendium 2.9.3

## Architecture

The native Android application hosts the standalone learning compendium in a WebView. Runtime assets are bundled locally under `app/src/main/assets/`; no external website is required to load the application content.

## Requirements

- JDK 17 or 21 for running Gradle 8.13. JDK 25 is not a supported runtime for this wrapper.
- Android SDK Platform 36.
- Android Build Tools 36.0.0.
- Gradle 8.13, provided by the committed Gradle Wrapper.
- Android Gradle Plugin 8.13.2.

The wrapper consists of `gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.jar`, and `gradle/wrapper/gradle-wrapper.properties`. The distribution URL and SHA-256 are pinned in the properties file. Do not generate the wrapper during CI or use a runner-installed global Gradle version.

## Debug APK

Windows PowerShell:

```powershell
.\gradlew.bat --no-daemon clean :app:assembleDebug
```

Linux/macOS:

```bash
./gradlew --no-daemon clean :app:assembleDebug
```

Output: `app/build/outputs/apk/debug/`. ABI split builds include ARM64, x86_64, and a universal debug APK.

## Continuous integration

The `.github/workflows/android-build.yml` workflow runs for relevant pushes to `main` and `release/**`, pull requests targeting `main`, and manual dispatch. It installs Node.js 22 and runs the static and Playwright browser checks, validates the committed Gradle wrapper, installs JDK 17 and Android SDK Platform 36 / Build Tools 36.0.0, builds through the wrapper, verifies APK signatures, and uploads debug APK artifacts for 14 days. Changes under `tests/` also trigger validation.

## Release signing

Debug APKs use the standard Android debug certificate and are for testing only. A production release requires a persistent private keystore. Configure `KOMPENDIUM_KEYSTORE`, `KOMPENDIUM_STORE_PASSWORD`, `KOMPENDIUM_KEY_PASSWORD`, and `KOMPENDIUM_KEY_ALIAS` in the build environment. Never commit keystore files or passwords. Retain the same keystore for future updates of this application ID.

## Device installation

```powershell
adb install -r .\app\build\outputs\apk\debug\app-arm64-v8a-debug.apk
```

Confirm the generated APK filename in the output directory before installing. Device installation and runtime checks must be recorded separately from successful compilation and APK signature verification.
