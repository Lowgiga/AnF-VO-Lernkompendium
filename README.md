# AnF-VO-Lernkompendium

Offline-capable digital learning compendium for the basic qualification under § 8 AnFöVO NRW.

## Applications

- **Standalone web app:** `index.html`
- **Robot navigation source:** `algorithm/robot-navigation.js`
- **Native Android app:** `android/`
- **Android application ID:** `de.omega.lernkompendium`
- **Version:** `2.8.0` (`versionCode 280`)

The web application remains a standalone HTML app. RobotNav is a deterministic JavaScript layout and event-scheduling helper for the decorative mascot. It is not an AI agent. The HTML app does not require runtime network calls for its local application logic.

## Android build

The Android project uses a native WebView with bundled local assets and `WebViewAssetLoader`.

| Setting | Value |
|---|---|
| Android Gradle Plugin | 8.13.2 |
| Gradle | 8.13 |
| JDK | 17+ (locally verified with JDK 21) |
| compileSdk / targetSdk | 36 |
| minSdk | 29 |
| AndroidX WebKit | 1.18.0 |

Build a Debug APK on Windows:

```powershell
cd android
.\gradlew.bat --no-daemon clean :app:assembleDebug
```

Debug APKs are created under `android/app/build/outputs/apk/debug/`. The ARM64 APK is the expected install target for current Samsung Galaxy phones.

## Security and release signing

Debug APKs use the standard Android debug signing key and are for development/testing only. A Play Store or long-term release requires a persistent private keystore. Do not commit keystore files or passwords. The same release keystore must be retained for future updates of the same application ID.

## Verification status

- Standalone static checks: **20 passed, 0 failed**.
- Android Debug build: **successful** from the release export.
- APK v2 signature verification: **passed** for ARM64, universal and x86_64 debug APKs.
- Package metadata: **verified** as `de.omega.lernkompendium`, version `2.8.0`, code `280`.
- Real-device install and UI testing: **pending**; ADB disconnected during the installation attempt.
- Release signing: **not configured**.

See `BUILD-REPORT-v2.8.0.md` for the current local build evidence.
