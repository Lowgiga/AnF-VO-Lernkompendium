# Technischer Audit-Bericht: AnFöVO Lernkompendium v2.9.4

Stand: 12. November 2026 | Prüfer: OpenCode Agent (Deep-Code-Audit)

## 1. Architektur-Übersicht

| Komponente | Technologie | Zeilen | Datei |
|---|---|---|---|
| HTML-Lernanwendung | Single-File PWA (HTML/CSS/JS) | ~2.200 | `index.html` |
| RobotNav-Engine | Vanilla JS (IIFE) | ~385 | `algorithm/robot-navigation.js` (inline in index.html) |
| Android-Wrapper | Java + WebView + WebViewAssetLoader | 132 | `MainActivity.java` |
| Build-System | Gradle 8.13 + AGP 8.13.2 | — | `build.gradle` |
| CI/CD | GitHub Actions (android-build.yml) | 121 | `.github/workflows/android-build.yml` |
| Browser-Tests | Playwright + Python (verify-build.py) | — | `tests/` |

**Datenfluss:** `index.html` (root) ↔ `android/app/src/main/assets/index.html` (byte-identisch, geprüft via CI-Parity-Gate)

## 2. Funktions-Architektur

### Kern-Module (JS)

| Modul | Zeilen | Verantwortung |
|---|---|---|
| Store (localStorage) | 1207–1212 | Persistenz mit In-Memory-Fallback |
| State (S) | 1213 | gaps, darf, exam, done, cards, quiz, notes, prefs, endtest |
| DATA | 1201 | version, cardmods, glossary, modules, quiz, cards |
| HEFT_MAPPING | 823–1200 | 70 Seiten → LE-Zuordnung, Status, Basis-Quellen |
| Suche | 1204–1252 | Normalisierung, Index, Highlighting, Trefferanzeige |
| Karteikarten | 1255–1265 | Pool, Show, Flip, Rate (known/unsure/unknown) |
| Prüfung | 1269–1281 | 10 Fragen, Auswertung, Ergebnis |
| Fortschritt | 1287–1302 | Modul-Balken, TOC, Lesefortschritt, SVG-Ringe |
| Navigation | 1337–1412 | buildList, rebuild, render, next/prev/goTo, setMode |
| Aufgaben | 1432–1453 | checkGap, setGap, answer, darfAnswer, endAnswer, evalTask |
| Import/Export | 1473–1491 | exportData, importData, download, upload |
| Druck | 1494–1501 | prePrint, postPrint, printWithSolutions |
| Init | 1514–1569 | DOMContentLoaded, Event-Listener-Registrierung |
| RobotNav | 1585–1971 | DOM-Inventory, Obstacle-Cache, Position-Planner, Motion-Controller |
| Selbsttest | 1972–2138 | 40 Prüfungskarten, automatisierte Regression |

### View-System
Views: `inhalt, blaettern, suche, geschafft, karten, exam, foto, fortschritt, quellen, info` (10 Views). Umschaltung via `.view.active` CSS-Klasse. Body-Klassen `mode-*` steuern Layout-Varianten.

### Speicher-Strategie
- **localStorage** mit Prefix `anfoevo_v2_` (9 Keys)
- **Fallback:** In-Memory `Store.mem` bei fehlendem/quota-exceeded Storage
- **Persistenz:** `navigator.storage.persist()` (best-effort)
- **Import/Export:** JSON `{app, version, exported, data}` — Validierung auf app-Key und Feldtypen
- **Max. Upload:** 5 MB (FileReader API)

## 3. CSS-Architektur

### Design-Tokens
- `:root` (Z. 13–18): Farben, Schriften, Space-Skala (4px–32px), Radien, Tap-Target (44px)
- Dark Mode: `@media (prefers-color-scheme:dark)` (Z. 19–21)
- LE-Farben: `[data-le="1..11"]` (Z. 224) — 11 Lerneinheiten-Farben
- v2.7 3D-Objekt: `#object-stage`, `.book3d`, `.robot3d` (Z. 403–519)
- v2.8 RobotNav-CSS: CSS-Variablen `--robot-nav-*` (Z. 467–488)

### Keyframes (11 Animationen)
`flipin, bookNudge, bookLeaf, robotGesture, robotNod, robotNavClimb, viewIn, okPulse, badShake, shimmer, toastBounce`

### Media Queries (12 Breakpoints)
`max-width:700px, 600px, 760px, 1100px, min-width:900px, prefers-reduced-motion:reduce, prefers-color-scheme:dark, hover:hover and pointer:fine, print`

## 4. Barrierefreiheit (A11y)

| Feature | Implementierung | Zeile |
|---|---|---|
| Skiplink | `.skiplink → #maincontent` | 535, 554 |
| ARIA Live-Regions | `aria-live="polite"` (#savedflash, #pagerinfo, #hits, .gap-fb) | 40, 536, 552, 103 |
| ARIA Expanded | `#mehr`, `#tocbtn` | 547, 538 |
| Focus-Outline | 3px solid `--focus` (Z. 26) | 26 |
| Reduced Motion | `@media (prefers-reduced-motion:reduce)` deaktiviert alle Animationen | 157, 444, 486, 510, 520 |
| Touch-Targets | ≥ 44px (`--tap:44px`) | 17 |
| Tastaturnavigation | Strg+K, `/`, Esc, Pfeiltasten, Enter | 1547–1553 |
| Screen-Reader | `role="status"`, `aria-hidden`, `aria-label` | diverse |

## 5. Sicherheit

| Maßnahme | Bewertung |
|---|---|
| CSP | `script-src 'self' 'unsafe-inline'`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'` — gut |
| XSS | `esc()` (Z. 1291) für Ausgaben, `createTextNode` für Highlighting (sicher), `textContent` für Daten (sicher) |
| Externe Links | `rel="noopener" target="_blank"` — gut |
| Import-Validierung | Typ-Check auf Felder, aber keine Inhalts-Validierung (niedriges Risiko, da textContent) |
| Daten (localStorage) | Nur Client-seitig, keine serverseitige Validierung (reine Offline-App) |

## 6. Performance

| Bereich | Befund | Empfehlung |
|---|---|---|
| DOM-Queries in Loops | `updateProgress()` O(n·m), `highlight()` TreeWalker pro Element | Caching der DOM-Referenzen |
| Re-Renders | `render()` bei jedem Seitenwechsel, `updateToc()` iteriert alle TOC-Links | Virtualisierung bei >100 Seiten |
| Große Assets | 29 WebP-Hintergrundbilder (r00 + 14×w + 14×z) | Lazy-Loading bereits implementiert (requestIdleCallback) |
| RobotNav | `currentObstacles()` misst alle gecachten Elemente bei jedem Flush | Cache-Invalidierung optimieren |
| Canvas | Hintergrund-Canvas bis 1.5× DPI | Bereits begrenzt |

## 7. Android-Integration (MainActivity.java)

| Feature | Implementierung | Zeile |
|---|---|---|
| WebViewAssetLoader | `https://appassets.androidplatform.net/assets/index.html` | 39, 92 |
| ServiceWorker | `ServiceWorkerControllerCompat` mit AssetLoader-Interceptor | 41–45 |
| JS-Bridge | `AppBridge` (saveProgress, printPage) | 58, 110–136 |
| Export | MediaStore Downloads (`anfoevo_v2_fortschritt.json`) | 114–122 |
| Druck | `PrintManager` mit A4, no-margins | 129–134 |
| File-Chooser | `WebChromeClient.onShowFileChooser` | 82–89 |
| Back-Button | `webView.goBack()` oder `super.onBackPressed()` | 96–98 |
| Render-Crash | `onRenderProcessGone` → `recreate()` | 76–80 |
| Security | `MIXED_CONTENT_NEVER_ALLOW`, `SafeBrowsing`, `AllowFileAccess=false` | 52, 56, 57 |

## 8. Potenzielle Bugs & Risiken

| # | Befund | Schweregrad | Status |
|---|---|---|---|
| 1 | bgTurn Race Condition (pending-Flag) | Niedrig | Bereits mitigiert (BG.pending-Reset in preload-Callback) |
| 2 | MutationObserver Memory-Leak-Potenzial | Niedrig | RobotNav beobachtet body subtree; inventory() bei häufigen DOM-Änderungen |
| 3 | Store.set Quota-Exceeded Fallback | Niedrig | In-Memory-Fallback aktiv, aber bereits geschriebene Daten bleiben |
| 4 | importData fehlende Inhalts-Validierung | Niedrig | textContent-Zuweisung verhindert XSS; JSON-Schema-Check fehlt |
| 5 | RobotNav stale Cache bei stage-Mutationen | Niedrig | `ownMutationTargets` WeakSet ignoriert eigene Schreibvorgänge |
| 6 | bgLoad Promise bei Fehler | Niedrig | `res(false)` wird aufgerufen, `f.ready` bleibt false (kein Crash) |

## 9. CI/CD-Pipeline (android-build.yml)

| Step | Beschreibung |
|---|---|
| Checkout | actions/checkout@v7 |
| Node 22 | setup-node@v6 |
| npm ci | tests/package-lock.json |
| Playwright Chromium | npx playwright install --with-deps |
| Parity-Check | `cmp -s index.html android/.../index.html` |
| verify-build.py | 21 Prüfungen (Python) |
| Browser-Tests | `npm run test:all` (Playwright + Smoke) |
| JDK 17 | setup-java@v6 (Temurin) |
| Android SDK | setup-android@v4 + sdkmanager (platform-36, build-tools-36.0.0) |
| Gradle Wrapper | wrapper-validation@v4 |
| Build | `./gradlew clean :app:assembleDebug` |
| Signatur | apksigner verify --verbose |
| Upload | Artifact (14 Tage Retention) |

## 10. Zusammenfassung

**Single-File-PWA** (~2.200 Zeilen HTML/CSS/JS), 70 Lernseiten, 11 Lerneinheiten, 40 Prüfungskarten. localStorage-Persistenz mit In-Memory-Fallback. Canvas-Hintergrund (29 WebP-Frames). RobotNav-Overlay mit Obstacle-Avoidance. Android-WebView-Wrapper mit WebViewAssetLoader (Offline). CSP mit `unsafe-inline` (notwendig für Single-File). Potenzielle Performance-Probleme bei DOM-Queries in Loops (nicht kritisch für 70 Seiten). Keine serverseitige Komponente (reine Offline-App).

**Qualitätsbewertung:** Gut — alle Kernfunktionen implementiert und getestet. Barrierefreiheit überdurchschnittlich. Sicherheit durch CSP und textContent-Zuweisung gewährleistet. Performance für den Anwendungsfall ausreichend.