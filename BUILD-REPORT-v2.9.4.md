# Build report — AnFöVO Learning Compendium v2.9.4

## Animation overhaul (this release)

- Page-turn and RobotNav gestures redesigned to a restrained, technical look and to modern performance standards (web.dev/MDN: animate only `transform`/`opacity`).
- `@keyframes flipin` is now opacity + transform only; the `filter:brightness()` animation was removed.
- All `filter:drop-shadow()` layers removed from `#object-stage`, `.book3d`, and `.robot3d`; depth is carried by a single static blurred `:before` ground shadow and by `translateZ` layering.
- The stage parallax no longer writes an inline `style.transform` (which clobbered RobotNav state and media-query scales); it is rAF-throttled and writes `--par-x`/`--par-y` custom properties consumed by the base transform. It returns early under `prefers-reduced-motion`.
- `will-change:left,top` removed; a compositor-friendly `transform .15s ease-out` transition was added instead.
- Book progress fill switched from animated `height` (layout) to `scaleY(var(--book-fill))` (transform); `--book-fill` is now a unitless factor.
- Keyframe durations shortened (.72s → .6s) with `cubic-bezier(.33,.7,.25,1)`; gesture amplitudes reduced (robot arm -72° → -38°, nod/climb peaks reduced, leaf peak translateZ 22px → 14px). All keyframe names (`flipin`, `bookNudge`, `bookLeaf`, `robotGesture`, `robotNod`, `robotNavClimb`, `viewIn`, `okPulse`, `badShake`, `shimmer`, `toastBounce`) are unchanged.
- Learning content in `index.html` was not modified; only CSS/JS presentation changed.

## Verified

- Android project and Gradle Wrapper are committed under `android/`.
- Gradle Wrapper: 8.13; Android Gradle Plugin: 8.13.2.
- Android app metadata: `de.omega.lernkompendium`, version `2.9.4`, version code `294`, min SDK 29, target SDK 36.
- Clean local build with Gradle 8.13, JDK 21, Android SDK Platform 36, Build Tools 36.0.0: `:app:assembleDebug`, `:app:assembleRelease`, `:app:bundleRelease` all successful.
- `apksigner verify` passed for debug and release ARM64 APKs; release certificate DN: `CN=AnFoeVO Lernkompendium, OU=Development, O=Lowgiga, L=NRW, ST=NRW, C=DE` (alias `anfoevo-release`, RSA 2048, SHA384withRSA, 10000 days).
- Asset parity: root `index.html` == `android/app/src/main/assets/index.html` (repo) == wrapper `app/src/main/assets/index.html`; same for `sw.js` and `manifest.json` (SHA-256 verified on all three locations).
- `index.html` SHA-256: `0200BD363B5CD22A7A9084938C847FEF83326221C2747440A12DC93CB1EA1E9F`.
- Service worker cache name: `anfoevo_v2_cache_2.9.4-web-pwa-2.9.4`; `2.9.3` no longer present in `sw.js`.
- Static build verification: 32 passed, 0 failed; generated `TESTBERICHT_v2.9.4.json` and `TESTBERICHT_v2.9.4.txt`.
- Browser suite: `npm run test:all` passed (smoke, PWA subpath, RobotNav harness); 70 learning pages, 0 page errors.

## Artifacts (wrapper build outputs)

| Artifact | SHA-256 |
| --- | --- |
| `app-arm64-v8a-debug.apk` | `D94D13F8E3E105102872E23BC7CF07A7F088E0FEE65EB59C047FA83EEE84C68A` |
| `app-arm64-v8a-release.apk` | `E63DCC4BB4CD794122660B562B5648ECB59B9693C4BA44BA55C0BF40882A0FB6` |
| `app-release.aab` | `365449F593A7A146FA8B7D35E92E7BB1691ECAFF64ADAA3BAA6E850CAFD50055` |

APK binaries are generated build outputs, published as workflow artifacts / release bundles, not committed to the source tree.

## CI and release status

- GitHub Actions runs are gated by the account billing lock reported earlier; local Gradle builds bypass it. CI status for this commit must be confirmed after push.
- Release signing uses the local keystore in `AnFoeVO-Release-Keystore/` (not committed; credentials in `CREDENTIALS.txt`).
- Galaxy S25 (`RZCY11YXS4D`) is currently offline; on-device reinstall and pixel diff for v2.9.4 are pending. Previous device verification (v2.9.3) remains valid for content; the v2.9.4 delta is presentation-only.
- GitHub Release/tag creation is intentionally deferred until explicitly approved.

## Rebuild

Windows PowerShell (wrapper):

```powershell
$env:ANDROID_HOME="C:\Users\doli\Downloads\android-sdk"
$env:KOMPENDIUM_KEYSTORE="C:\Users\doli\Downloads\AnFoeVO-Release-Keystore\anfoevo-release.jks"
$env:KOMPENDIUM_STORE_PASSWORD="<see AnFoeVO-Release-Keystore\CREDENTIALS.txt>"
$env:KOMPENDIUM_KEY_PASSWORD="<see AnFoeVO-Release-Keystore\CREDENTIALS.txt>"
$env:KOMPENDIUM_KEY_ALIAS="anfoevo-release"
.\gradlew.bat --no-daemon clean :app:assembleDebug :app:assembleRelease :app:bundleRelease
```

Repo checks:

```powershell
python tests/verify-build.py
cd tests; npm run test:all
```
