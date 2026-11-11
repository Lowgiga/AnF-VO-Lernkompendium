# Build report — AnFöVO Learning Compendium v2.9.1

## Verified

- Android project and Gradle Wrapper are committed under `android/`.
- Gradle Wrapper: 8.13; Android Gradle Plugin: 8.13.2.
- Wrapper JAR SHA-256: `81A82AAEA5ABCC8FF68B3DFCB58B3C3C429378EFD98E7433460610FECD7AE45F`.
- Wrapper distribution SHA-256 is pinned in `android/gradle/wrapper/gradle-wrapper.properties`.
- Android app metadata: `de.omega.lernkompendium`, version `2.9.1`, version code `291`, min SDK 29, target SDK 36.
- Fixed launcher resource linking: both `android:icon` and `android:roundIcon` reference the committed vector drawable `@drawable/ic_launcher`; no missing `@mipmap/ic_launcher` resource remains.
- Clean Android debug build from the current branch checkout succeeded locally with Gradle 8.13, JDK 21, Android SDK Platform 36, and Build Tools 36.0.0.
- Generated variants: ARM64, universal, and x86_64.
- APK v2 signature verification passed for all three variants.
- ARM64 debug APK SHA-256: `5F46977940411D1F4DB765A3D837925307F99C7AA4D0BC5DED691C4E0000FE93`.
- Browser test suite: `npm ci` succeeded; audit reported 0 vulnerabilities; `npm run test:all` passed.
- Browser smoke test confirmed 70 pages, German document language, RobotNav availability, book/robot/canvas components, and zero page errors.
- RobotNav harness passed: 3 scroll roots, cache cleanup from 7 to 5 entries, zero observer self-trigger flushes, and no browser errors.

## CI and release status

- Previous pull-request workflow run #20 did not start. GitHub's check annotation reported: `The job was not started because your account is locked due to a billing issue.` No runner was allocated and no Android build steps ran.
- A local build before the manifest correction reproduced the missing `@mipmap/ic_launcher` resource error. The manifest reference is corrected and the local Android build now passes.
- The workflow now runs on pushes to `main` and `release/**`, validates the Gradle Wrapper, builds the APKs, verifies signatures, and uploads artifacts for 14 days.
- CI remains unverified until the GitHub Actions billing restriction is resolved and the workflow runs successfully.
- Real-device installation and runtime verification remain pending until ADB detects the Galaxy S25.
- The APK uses the Android debug certificate. Production release signing requires a persistent private keystore and is not configured here.
- APK binaries are generated build outputs and are published as workflow artifacts, not committed to the source tree.

## Rebuild

Windows PowerShell:

```powershell
cd android
.\gradlew.bat --no-daemon clean :app:assembleDebug
```

Linux/macOS:

```bash
cd android
./gradlew --no-daemon clean :app:assembleDebug
```
