# Build report — v2.8.0

- Standalone HTML static checks: 20 passed, 0 failed.
- Android build: Gradle 8.13 / AGP 8.13.2 / JDK 21; clean assembleDebug succeeded from the prepared export.
- APK signatures: apksigner verify passed for ARM64, universal and x86_64 debug APKs.
- Package: de.omega.lernkompendium; version 2.8.0 (versionCode 280); minSdk 29; targetSdk 36.
- ARM64 debug APK SHA-256: 476C331B6B612669E57D11EF80F56BF2AF31594B12ECB522C0D611E1545808FE
- Device installation and UI verification remain pending; ADB disconnected during the install attempt.
- Debug signing is not a Play Store release signature. Release signing requires a persistent private keystore.

This report describes the local validated build. It does not claim that the full source tree or APK binary has already been published in this repository.
