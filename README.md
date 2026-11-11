# AnFöVO Lernkompendium

Ein digitales, offlinefähiges Lern-Kompendium zur Basisqualifizierung nach § 8 AnFöVO NRW. Das Projekt verbindet interaktive Lernseiten, Aufgaben und Lösungen mit lokal gespeicherter Lernaktivität, einer hybriden Buch-/Navigationsoberfläche und einer Android-WebView-App.

> **Projektstand:** Version 2.9.1 · 70 Lernseiten · lokale Web-App und Android-Projekt

## Überblick

Das Lern-Kompendium ist als **local-first Anwendung** aufgebaut. Die zentrale Anwendung liegt in `index.html` und kann direkt im Browser geöffnet werden. Die Lerninhalte bleiben lokal verfügbar; der Kern der Anwendung benötigt zur Laufzeit keine externen Dienste.

- **Lernen:** 70 strukturierte Lernseiten mit Aufgaben und Lösungen.
- **Fortschritt:** Lernfortschritt wird lokal gespeichert und kann über die vorhandene Sicherungsfunktion exportiert werden.
- **Navigation:** Eine hybride Oberfläche verbindet ein digitales 3D-Buch mit einer lesbaren, zugänglichen Lernansicht.
- **RobotNav:** Ein deterministischer, browserseitiger Layout- und Navigationshelfer unterstützt die Oberfläche. Der Roboter ist eine dekorative Figur und kein KI-Agent.
- **Offline und PWA:** Die Anwendung ist auf lokale Nutzung ausgelegt; Web-App- und Android-Assets werden im Projekt mitgeführt.
- **Android:** Ein natives Android-Projekt kapselt dieselbe HTML-Anwendung in einer WebView.

## Schnellstart

### Im Browser

1. Repository herunterladen oder klonen.
2. `index.html` im aktuellen Browser öffnen.
3. Das Kompendium über die Buch- und Seitennavigation verwenden.

Für die Kernanwendung ist kein lokaler Entwicklungsserver erforderlich. Bei Nutzung als installierbare PWA müssen die dafür vorgesehenen Web-App-Dateien über einen geeigneten lokalen oder gehosteten HTTP(S)-Origin bereitgestellt werden; Browser beschränken Service Worker auf sichere Kontexte.

### Android

Das Android-Projekt befindet sich in `android/`. Es verwendet die mitgelieferte HTML-Anwendung und deren Assets.

## Produkt- und Gestaltungsprinzipien

- **Inhalte bewahren:** Alle 70 bestehenden Lernseiten und ihre Lernfunktionalität bleiben erhalten. Inhaltliche Änderungen erfolgen nicht stillschweigend.
- **Offline zuerst:** Keine zusätzlichen externen Laufzeitabhängigkeiten oder Netzwerkaufrufe für die Kernanwendung.
- **Zugänglichkeit und Lesbarkeit:** Die Buchmetapher ergänzt die lesbare Lernoberfläche, statt sie zu ersetzen.
- **Deterministische Navigation:** RobotNav arbeitet browserseitig und reproduzierbar. Der silberne Roboter ist rein dekorativ, stellt keine Netzwerkverbindungen her und führt keine autonomen Agentenaktionen aus.

## Projektstruktur

| Pfad | Zweck |
| --- | --- |
| `index.html` | Eigenständige Web-Anwendung und Einstiegspunkt |
| `bg/` | Hintergrund- und Animationsbilder der Web-Anwendung |
| `android/` | Android-WebView-Projekt inklusive Gradle Wrapper und App-Assets |
| `algorithm/` | RobotNav-Quellmaterial und algorithmische Komponenten |
| `tests/` | Statische Prüfungen, Browser-Smoke-Tests und RobotNav-Tests |
| `docs/` | Architektur-, Design- und Inhaltserhaltungsdokumentation |
| `release/` | Erstellte Testartefakte und Android-Quellpakete |

Weitere Informationen: [Architektur](docs/ARCHITECTURE.md), [Design System](docs/DESIGN_SYSTEM.md) und [Content Preservation](docs/CONTENT_PRESERVATION.md).

## Qualitätssicherung

Die automatisierten Prüfungen werden aus dem Repository ausgeführt.

### Statische Projektprüfung

```powershell
python tests/verify-build.py
```

### Browser- und RobotNav-Prüfungen

```powershell
cd tests
npm ci
npx playwright install chromium
npm run test:all
```

Bei Verwendung eines bereits installierten Chrome-/Chromium-Browsers kann `CHROMIUM_PATH` auf dessen ausführbare Datei gesetzt werden. Die Browserprüfungen decken die Desktop- und Mobilansicht, Seitennavigation, Suche, Fortschrittsspeicherung, Backup-Export, Druckfunktion, Hintergrundressourcen und Browserfehler ab. Der RobotNav-Test prüft unter anderem verschachtelte Scrollbereiche, Cache-Bereinigung, Observer-Stabilität und Teardown.

### Verifizierter Stand 2.9.1

- 70 Lernseiten im Browser-Smoke-Test erkannt.
- Desktop- und Mobil-Smoke-Test erfolgreich; keine Seitenfehler, Konsolenfehler oder fehlgeschlagenen Ressourcen in den geprüften Läufen.
- RobotNav-Harness erfolgreich; drei verschachtelte Scrollbereiche und keine Observer-Selbstauslösungen.
- Android-Debug-APK mit Gradle 8.13, Android Gradle Plugin 8.13.2 und JDK 21 erstellt.
- APK-Signatur der ARM64-Debug-APK geprüft.
- HTML-Datei im Android-Asset-Verzeichnis byte-identisch mit der Projektdatei.

Nicht als abgeschlossen ausgewiesen sind ein visueller Pixelvergleich, die Installation und Laufzeitprüfung auf einem realen Galaxy-S25-Gerät sowie das Produktions-Release-Signing. Die erzeugte APK ist eine Debug-APK und keine Play-Store-fertige Veröffentlichung. Details stehen in [BUILD-REPORT-v2.9.1.md](BUILD-REPORT-v2.9.1.md).

## Android-App

| Merkmal | Wert |
| --- | --- |
| Application ID | `de.omega.lernkompendium` |
| Version | `2.9.1` |
| Version Code | `291` |
| Minimum Android | API 29 |
| Compile-/Target-SDK | 36 |
| Android Gradle Plugin | 8.13.2 |
| Gradle Wrapper | 8.13 |
| Unterstützte Gradle-JDK-Laufzeit | 17 oder 21 |

### Debug-APK erstellen

**Windows (PowerShell):**

```powershell
cd android
.\\gradlew.bat --no-daemon clean :app:assembleDebug
```

**Linux/macOS:**

```bash
cd android
./gradlew --no-daemon clean :app:assembleDebug
```

Der eingecheckte Gradle-Wrapper enthält Launcher-JAR, Windows- und POSIX-Startskripte sowie eine SHA-256-Prüfsumme für die Gradle-Distribution. CI validiert den Wrapper und baut mit JDK 17, Android SDK Platform 36 und Android Build Tools 36.0.0. Den Wrapper nicht durch eine ungeprüfte globale Gradle-Installation ersetzen.

Die Debug-APK wird mit dem standardmäßigen Android-Debug-Schlüssel signiert und ist ausschließlich für Tests vorgesehen. Für eine produktive Veröffentlichung ist ein eigener, sicher verwahrter Release-Keystore erforderlich.

## Lizenz

Dieses Repository enthält eine [Apache License 2.0](LICENSE). Die Lizenzbedingungen und Hinweise in der Datei `LICENSE` sind maßgeblich.

## Projektinformationen

- Repository: [Lowgiga/AnFoVO-Lernkompendium](https://github.com/Lowgiga/AnFoVO-Lernkompendium)
- Aktueller Projektstand: `main` · v2.9.1
- Änderungsübersicht: [CHANGELOG.md](CHANGELOG.md)
- Produktspezifikation: [PRODUKT_SPEZIFIKATION.md](PRODUKT_SPEZIFIKATION.md)
- Build-Nachweis: [BUILD-REPORT-v2.9.1.md](BUILD-REPORT-v2.9.1.md)

