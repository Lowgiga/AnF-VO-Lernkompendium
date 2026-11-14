# Build report — AnFöVO Learning Compendium v2.9.5

## Team integration: standalone RobotNav architecture

- Adopted the parallel wrapper workstream: `index.html` now loads the RobotNav engine via `<script src="robot-navigation.js">` instead of an inline embedded block; the engine file is a first-class asset.
- `sw.js` precaches `./robot-navigation.js` and supports a `skip-waiting` message for faster service-worker updates.
- Learning content unchanged: the embedded DATA blob is byte-identical between the previous embedded build and this build (SHA-256 match); the v2.9.4 animation overhaul (compositor-only transform/opacity, rAF-throttled parallax, reduced-motion aware) is carried over.
- Byte parity restored across all surfaces: root `index.html` == repo Android assets == wrapper Android assets; `robot-navigation.js` identical in root, `algorithm/`, Android assets, and wrapper assets.
- Verification updated for the new architecture: `tests/verify-build.py` now checks the script reference and byte-parity of the engine copies (root ↔ `algorithm/` ↔ Android assets) instead of the embedded-block match; PWA precache expectation extended to 65 entries.

## Verified

- Android metadata: `de.omega.lernkompendium`, version `2.9.5`, version code `295`, min SDK 29, target SDK 36.
- Clean local build (Gradle 8.13, JDK 21, SDK 36, Build-Tools 36.0.0): `:app:assembleDebug`, `:app:assembleRelease`, `:app:bundleRelease` successful.
- `apksigner verify` passed; certificate DN `CN=AnFoeVO Lernkompendium, OU=Development, O=Lowgiga, L=NRW, ST=NRW, C=DE`.
- APK asset hashes match repo byte-for-byte:
  - `assets/index.html` = `5461F6FEB43B6EED755E40B7A32091A4E29552779BCCC90A17971368AF40CBBF` (629905 B)
  - `assets/sw.js` = `819CEE725073E5797C8E1487BC8771185805E6B284658CED7510EDC3734D62D9`
  - `assets/robot-navigation.js` = `A9424CABE94BD87B…` (22263 B)
- Static verification: 32/32; `TESTBERICHT_v2.9.5.json/.txt` generated.
- Browser suite `npm run test:all` green: smoke (70 pages, 0 errors), PWA subpath (65 precached entries incl. the engine file), RobotNav harness.

## Artifacts (wrapper build outputs)

| Artifact | SHA-256 |
| --- | --- |
| `app-arm64-v8a-debug.apk` | `844CFC34106886B994ADC7D078F1749E283B848701182286F65321BA884645F7` |
| `app-arm64-v8a-release.apk` | `063FF7D92657C354C467931743D9C1B879EA0055B31FD0E3E6F4E217D69BA1FB` |
| `app-release.aab` | `180D5E4F112F8A444FD259C173F2AFA7D8055286E915559CD34E1880BA04457A` |

## Status

- Service worker cache: `anfoevo_v2_cache_2.9.5-web-pwa-2.9.5`; `2.9.4` no longer present.
- Galaxy S25 offline; on-device reinstall pending. v2.9.3 device verification remains valid for content.
- GitHub Release v2.9.4 (animation update, embedded architecture) remains published; v2.9.5 is the canonical follow-up with the standalone-engine architecture.

## Rebuild

```powershell
$env:ANDROID_HOME="C:\Users\doli\Downloads\android-sdk"
$env:KOMPENDIUM_KEYSTORE="C:\Users\doli\Downloads\AnFoeVO-Release-Keystore\anfoevo-release.jks"
$env:KOMPENDIUM_STORE_PASSWORD="<see AnFoeVO-Release-Keystore\CREDENTIALS.txt>"
$env:KOMPENDIUM_KEY_PASSWORD="<see AnFoeVO-Release-Keystore\CREDENTIALS.txt>"
$env:KOMPENDIUM_KEY_ALIAS="anfoevo-release"
.\gradlew.bat --no-daemon clean :app:assembleDebug :app:assembleRelease :app:bundleRelease
```

Repo checks: `python tests/verify-build.py`; `cd tests; npm run test:all`.
