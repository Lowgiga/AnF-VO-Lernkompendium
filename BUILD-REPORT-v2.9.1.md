# Build report — AnFöVO Learning Compendium v2.9.1

## Verified

- Standalone HTML static checks: 20 passed, 0 failed.
- Android wrapper built successfully with Gradle 8.13, Android Gradle Plugin 8.13.2 and JDK 21.
- Android app metadata: `de.omega.lernkompendium`, version `2.9.1`, version code `291`, min SDK 29, target SDK 36.
- Android `assets/index.html` is byte-identical to the project root `index.html`.
- HTML SHA-256: `E79D274C7BBCB4173C2F335EAF8413833A2724C49C20BC174639CC9D3F3AB1DF`.
- ARM64 debug APK signature verified with Android APK Signature Scheme v2.
- APK SHA-256: `C3CA44CAE253D15E73A2AB98F9D6DB645518B35740465F9B0587282147686B13`.

## Artifacts

- `release/AnFoeVO_Lernkompendium_v2.9.1-debug-arm64.apk`
- `release/AnFoeVO_AndroidWrapper_v2.9.1-source.zip`

## Not yet verified

- Real browser interaction and visual regression tests.
- Installation and runtime behavior on the Galaxy S25; ADB did not detect a connected device during this build session.
- Production release signing. The APK uses the Android debug certificate and must not be treated as a Play Store release.

## Rebuild

```powershell
cd android
gradle --version  # Use Gradle 8.13
.\gradlew.bat clean :app:assembleDebug
```
