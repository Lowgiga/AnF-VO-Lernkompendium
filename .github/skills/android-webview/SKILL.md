---
name: android-webview
description: Maintain the Android WebView wrapper, Gradle build, SDK configuration, packaging parity, and debug APK validation for the learning compendium.
---

# Android WebView Skill

## Use this skill when
Changing files under `android/`, WebView behavior, Android packaging, Gradle, SDK configuration, app metadata or APK generation.

## Baseline
- Application ID: `de.omega.lernkompendium`
- Version baseline: 2.9.4 / versionCode 294
- Minimum SDK: 29
- Compile/target SDK: 36
- Android Gradle Plugin: 8.13.2
- Gradle wrapper: 8.13
- CI JDK: 17

Confirm current values in source files before relying on this baseline.

## Safety rules
- Use only the committed Gradle wrapper and its pinned distribution checksum.
- Do not downgrade Gradle, AGP, SDK or application version to hide a build failure.
- Preserve the app ID, WebView security posture, offline behavior and local-first runtime.
- Keep `android/app/src/main/assets/index.html` byte-identical to root `index.html`.
- Keep `manifest.json`, `sw.js`, the PWA icons, and `bg/` byte-identical with the repository root.
- Do not add cleartext traffic, broad permissions, remote navigation or JavaScript bridges without a documented threat analysis and explicit need.
- Never touch release keystores, signing secrets or publishing credentials without explicit authorization.
- Do not claim device validation from a successful CI build.

## Workflow
1. Inspect Gradle wrapper properties, root/app Gradle files, manifest and WebView activity.
2. Identify whether the change affects build configuration, runtime, packaging or signing.
3. Keep changes scoped and preserve current dependency versions.
4. Verify asset parity.
5. Run the debug build when the environment supports it.

## Validation
From repository root: `cmp index.html android/app/src/main/assets/index.html`.
From `android/`: `./gradlew --no-daemon clean :app:assembleDebug` (Windows: `gradlew.bat`).
Also run `python tests/verify-build.py`. State explicitly whether a physical-device install test was performed.