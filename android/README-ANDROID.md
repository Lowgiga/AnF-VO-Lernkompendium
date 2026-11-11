# Lern-Kompendium Android v2.9.1

## Architektur
Native Android-Activity mit Android WebView; Inhalte werden lokal aus `app/src/main/assets/` geladen. Der Einstieg ist die PWA-kompatible `index.html`; die Lerninhalte bleiben offline verfÃ¼gbar. Es wird keine externe Website als Laufzeitquelle benÃ¶tigt.

## Buildvoraussetzungen
- JDK 17 oder neuer (lokal geprÃ¼ft mit JDK 21)
- Android SDK Platform 36
- Android Build Tools 35.0.0 oder neuer
- Gradle 8.13 passend zum Android Gradle Plugin 8.13.2

Auf dem Windows-Buildhost wird `ANDROID_HOME` auf das installierte SDK gesetzt.

## Debug-APK
Install Gradle 8.13, then generate the wrapper once if `gradle-wrapper.jar` is not present: `gradle wrapper --gradle-version 8.13`. Under Windows PowerShell:
```powershell
.\gradlew.bat :app:assembleDebug
```
Ausgabe: `app\build\outputs\apk\debug\app-debug.apk`

## Release-Varianten
Mit einem Release-Keystore und den Umgebungsvariablen `KOMPENDIUM_KEYSTORE`, `KOMPENDIUM_STORE_PASSWORD`, `KOMPENDIUM_KEY_PASSWORD` und `KOMPENDIUM_KEY_ALIAS`:
```powershell
.\gradlew.bat :app:assembleRelease
```
Erzeugt die universelle APK und die ABI-Varianten `arm64-v8a` und `x86_64` (Pfad unter `app\build\outputs\apk\release\`).

## Installation
```powershell
adb install -r .\app\build\outputs\apk\debug\app-debug.apk
```
FÃ¼r die Installation direkt auf dem Telefon kann die APK auch Ã¼bertragen und geÃ¶ffnet werden. Android verlangt ggf. die Freigabe â€žUnbekannte Apps installierenâ€œ.

## Signatur
Debug-APK: SDK-Debugsignatur, fÃ¼r Tests.
Release-APK: eigener, dauerhaft aufzubewahrender Keystore. Nicht im Repository speichern. Ein Wechsel des SchlÃ¼ssels verhindert regulÃ¤re Updates derselben installierten App.


[executed on device: lowpc (ecc80e91-2d19-4992-afcf-09a4342182c2)]