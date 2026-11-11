# System- und Umsetzungsplan

## Digitales Lern-Kompendium zur Basisqualifizierung nach § 8 AnFöVO NRW

**Konsolidierter Arbeitsstand:** 10.11.2026\
**Ziel:** Vollständige, fachlich belastbare und digital bearbeitbare
Lernanwendung -- nicht nur eine HTML-Demoseite.\
**Ausgangsbasis:** vorhandenes Kompendium v2.5.1, Weiterentwicklungen
v2.5.2 und v2.5.3.\
**Dokumentstatus:** konsolidierte Spezifikation aus den bisherigen
Festlegungen und den vorhandenen Prüfberichten. Ungeklärte Punkte sind
ausdrücklich markiert.

------------------------------------------------------------------------

# 1. Zielbild und Produktdefinition

Entwickelt werden soll ein digitales Lern- und Arbeitskompendium für die
Basisqualifizierung gemäß § 8 AnFöVO NRW. Es orientiert sich an der
Reihenfolge und didaktischen Struktur des zugrunde liegenden
Handbuchs/Kurshefts, ist aber ein eigenständig gestaltetes digitales
Lernprodukt. Es soll den Charakter eines hochwertigen Schulungs- und
Arbeitshefts bewahren und die Papierfassung funktional erweitern.

Die Anwendung muss Lernstoff vollständig lesbar darstellen und die
Bearbeitung der Aufgaben direkt im Dokument ermöglichen. Lernende sollen
das Kompendium schrittweise durcharbeiten, eigene Antworten eintragen,
Lösungen zur Selbstkontrolle öffnen, Selbsttests durchführen, ihren
Fortschritt behalten und das Ergebnis bei Bedarf exportieren oder
drucken können.

**Kein Produktziel** ist ein bloßes Quiz, eine reine Zusammenfassung,
eine Sammlung von Musterlösungen oder eine unstrukturierte
Wissensdatenbank. Aufgaben und Reflexionen dürfen nicht pauschal durch
vorgegebene Antworten ersetzt werden.

## 1.1 Erfolgsdefinition

Das Produkt gilt erst als fertig, wenn alle folgenden Ebenen erfüllt und
nachgewiesen sind:

1.  Inhalt: alle vorgesehenen Lerneinheiten und Aufgaben sind anhand des
    Kursmaterials abgeglichen.
2.  Didaktik: Reihenfolge, Lernziele, Aufgaben und Selbstkontrolle
    bilden einen nachvollziehbaren Lernweg.
3.  Bedienung: Lesen, Navigieren, Suchen, Ausfüllen, Speichern,
    Wiederherstellen und Drucken funktionieren tatsächlich.
4.  Gestaltung: Buch-/Heftcharakter, ruhige Lesbarkeit, mobile Bedienung
    und Animationen sind konsistent.
5.  Technik: Standalone-HTML und PWA sind synchron; Offline-Betrieb und
    Datenexport funktionieren.
6.  Qualität: Browser-, Mobile-, Druck-, Accessibility- und
    Performance-Prüfungen sind real ausgeführt und dokumentiert.
7.  Übergabe: alle Quelldateien, Release-Dateien, Ressourcen,
    Dokumentation, Tests und Prüfsummen sind enthalten.

------------------------------------------------------------------------

# 2. Verbindliche fachliche und didaktische Leitplanken

-   Die Lerninhalte folgen der ursprünglichen Reihenfolge des
    Handbuchs/Kurshefts.
-   Das Kompendium bleibt vollständig durchlesbar; Inhalte werden nicht
    auf Quizfragen reduziert.
-   Jede Lerneinheit enthält die jeweils vorgesehenen Erklärungen,
    Aufgaben, Tabellen, Lückentexte, Reflexionsfragen und Übungen.
-   Objektiv beantwortbare Wissensfragen dürfen mit fachlich begründeten
    Lösungsvorschlägen ergänzt werden.
-   Persönliche Reflexionen, Erfahrungen, Einschätzungen und
    individuelle Fallantworten bleiben offen und werden nicht als eine
    einzige richtige Antwort dargestellt.
-   Lösungen sind freiwillig aufrufbar. Mehrere Lösungen dürfen
    gleichzeitig geöffnet bleiben.
-   Fachliche Aussagen müssen mit nachvollziehbaren Quellen belegt
    werden. Keine erfundenen Quellen, Paragraphen, Zahlen oder
    Rechtsbehauptungen.
-   Rechtsstand und Abrufdatum sind bei veränderlichen
    Rechtsinformationen zu dokumentieren.
-   Der Aufgabenbereich der Alltagsbegleitung ist klar von
    Behandlungspflege und anderen vorbehaltenen Tätigkeiten abzugrenzen.
    Keine Anleitung zu Tätigkeiten außerhalb der zulässigen Rolle.
-   Inhaltliche Ergänzungen sind als Ergänzung erkennbar und dürfen die
    Ausgangsstruktur nicht unbemerkt verändern.
-   Keine stillschweigende Korrektur oder Umdeutung des Kursmaterials.
    Abweichungen werden als redaktionelle Aktualisierung mit Begründung
    dokumentiert.

## 2.1 Bereits ausdrücklich priorisierte Inhaltsbereiche

Diese Bereiche sind bei der fachlichen Vollständigkeitsprüfung besonders
zu behandeln:

-   LE 2.3
-   LE 3.3.6 und LE 3.3.7
-   LE 5.1.1 bis LE 5.3

Für LE 5.1.1 wurde bereits eine Ergänzung dokumentiert: die fünf
Sinnesbereiche sehen, hören, riechen, schmecken und fühlen. Die
Ergänzung muss gegen das Originalmaterial abgeglichen bleiben.

## 2.2 Inhaltsabgleich

Es ist eine nachvollziehbare Zuordnungsmatrix anzulegen:

  -----------------------------------------------------------------------
  Feld                                Bedeutung
  ----------------------------------- -----------------------------------
  Lernheft-Seite/Abschnitt            Fundstelle im Originalmaterial

  Lernziel                            Was soll gelernt werden?

  Kompendium-Seite                    Wo ist es digital umgesetzt?

  Aufgabentyp                         Freitext, Lücke, Tabelle, Fall,
                                      Quiz, Reflexion

  Lösung/Feedback                     Lösung vorhanden, nicht vorgesehen
                                      oder individuell

  Quelle                              Fachquelle bzw. Originalfundstelle

  Status                              vollständig, teilweise, offen,
                                      fachlich zu prüfen
  -----------------------------------------------------------------------

Die Zuordnung der vorhandenen HTML-Seiten zu LE 1--11 darf nicht allein
aus `data-le`-Attributen abgeleitet werden. Inhaltlich querliegende
Seiten (Lernziele, Checkpoints, Anhang) sind von fachlichen Seiten ohne
Zuordnung zu unterscheiden. Die vorhandenen 32 Seiten ohne numerisches
`data-le` sind einzeln zu klassifizieren.

------------------------------------------------------------------------

# 3. Funktionsumfang der Anwendung

## 3.1 Lesen und Navigation

-   Heft-/Buchnavigation mit klarer Kapitel- und Seitengliederung.
-   Vorwärts- und Zurück-Navigation; eindeutige Anzeige der aktuellen
    Seite und Lerneinheit.
-   Kapitelübersicht bzw. Inhaltsverzeichnis mit Sprungzielen.
-   Klar erkennbare Schaltflächen „Zurück" und „Weiter".
-   Ein Lernschritt pro Ansicht, wo dies die Orientierung verbessert;
    zusammengehörige Inhalte dürfen sinnvoll auf einer Seite bleiben.
-   Navigation muss Tastatur, Touch und Maus unterstützen.
-   Bei Seitenwechseln darf die Leseposition nicht unerwartet verloren
    gehen.
-   Die Suche muss mehrteilige Suchbegriffe unterstützen: alle Suchterme
    müssen in einem Treffer erfüllt sein; Groß-/Kleinschreibung und
    übliche Schreibvarianten sollen robust behandelt werden.

## 3.2 Aufgaben und Eingaben

-   Lückentexte mit editierbaren Feldern.
-   Freitextfelder für offene Fragen und Reflexionen.
-   Digitale Tabellen und strukturierte Eingabefelder.
-   Checklisten und Ankreuzaufgaben.
-   Fallbeispiele mit mehrzeiligen Antwortfeldern.
-   Selbsttests mit nachvollziehbarer Rückmeldung.
-   Checkpoints zur Lernstandskontrolle.
-   Eingaben müssen nach Navigation und Neustart erhalten bleiben.
-   Eingaben müssen exportiert und wieder importiert werden können.
-   Leere Eingaben dürfen nicht durch Musterlösungen überschrieben
    werden.

## 3.3 Lösungen und Feedback

-   Lösungen über native HTML-Disclosure-Elemente
    (`<details>/<summary>`) oder gleichwertige semantische, zugängliche
    Lösung.
-   Grundsätzlich kein JavaScript erforderlich, um eine Lösung zu öffnen
    oder zu schließen.
-   Mehrere Lösungen können parallel geöffnet bleiben.
-   Lösungen müssen klar von Aufgabenstellung und eigenständiger
    Lernendenantwort getrennt sein.
-   Reflexionsfragen erhalten keine vorgetäuschte Musterlösung. Zulässig
    sind Kriterien, Denkanstöße oder Beispielperspektiven, klar als
    solche bezeichnet.
-   Optionaler Lösungsmodus für den Ausdruck: alle Lösungen öffnen.

## 3.4 Fortschritt und Datensicherheit

-   Fortschritt pro Lerneinheit und Gesamtfortschritt.
-   Speicherung lokal im Browser/WebView.
-   Sichtbarer Speicherstatus und verständliche Hinweise bei
    Speicherproblemen.
-   Export aller Antworten und des Lernfortschritts in ein portables
    Format (bevorzugt JSON).
-   Import mit Validierung des Dateiformats und einer Vorschau bzw.
    Bestätigung vor dem Überschreiben vorhandener Daten.
-   Versioniertes Datenformat und Migrationsstrategie bei späteren
    App-Versionen.
-   Kein unbemerkter Datenverlust bei Versionswechseln.
-   Kein Cloud-Zwang; lokale Nutzung muss vollständig möglich sein.
-   Datenschutz: keine unnötigen externen Tracker oder Telemetrie.

## 3.5 Druck und PDF

Zwei ausdrücklich getrennte Druckmodi:

1.  **„Zum Ausfüllen"**: Eingabefelder werden als leere Linien/Flächen
    ausgegeben; Lösungen bleiben geschlossen bzw. werden nicht
    mitgedruckt.
2.  **„Mit Lösungen"**: alle Lösungselemente werden geöffnet und
    gedruckt; Aufgabenblöcke dürfen nicht unleserlich über Seiten
    getrennt werden.

Weitere Anforderungen: - A4-Ausgabe mit sinnvoller Seitennummerierung
und ausreichenden Rändern. - Navigation, Bedienelemente und
Hintergrundanimation werden nicht gedruckt. - Tabellen und Aufgaben
sollen möglichst zusammengehalten werden. - Druckansicht muss in realen
Browsern als PDF und auf Papier geprüft werden.

## 3.6 Darstellung und Personalisierung

-   Heller und dunkler Darstellungsmodus.
-   `prefers-reduced-motion` respektieren.
-   Mobilgeräte zuerst mit gut lesbarer Typografie.
-   Mobile Schriftgröße für Fließtext mindestens 18 px.
-   Lesespalte linksbündig, angenehme Zeilenlänge etwa 60--75 Zeichen;
    vorhandene 65ch-Maximalbreite ist ein sinnvoller Ausgangspunkt.
-   Fließtext in dunklem Grau statt reinem Schwarz.
-   Ruhige Kontraste, klare Hierarchie, ausreichender Zeilenabstand.
-   Inhalte dürfen bei 200 % und 400 % Zoom nicht abgeschnitten werden.
-   Fokuszustände und Tastaturbedienung müssen sichtbar und vollständig
    sein.

------------------------------------------------------------------------

# 4. Visuelles Konzept: digitales Buch und Seitenanimation

Das visuelle Ziel ist ein hochwertiges, ruhiges digitales Lernbuch mit
einer subtilen Buch-/Papiermetapher. Der Hintergrund darf Atmosphäre
erzeugen, aber niemals Lesbarkeit, Bedienung oder Performance
beeinträchtigen.

## 4.1 Buchblätter-Animation

-   Vorhandene Animation basiert auf einer Sequenz einzelner Bildframes,
    die aus einer schnellen Video-/Animationssequenz gewonnen werden
    können.
-   Vorwärtsblättern: Sequenz läuft in Vorwärtsrichtung.
-   Zurückblättern: Sequenz läuft in Gegenrichtung.
-   Nach dem Blättern kehrt die Animation in einen ruhigen Ruhezustand
    zurück.
-   Keine Texte innerhalb der Animation.
-   Keine sichtbaren Sprünge, Flackern, Ruckler oder abrupten
    Skalierungswechsel.
-   Die Animation soll sich über den sichtbaren Anwendungsbereich
    erstrecken und beim Scrollen als Hintergrundebene erhalten bleiben.
    Sie soll nicht durch eine riesige, hochauflösende Canvas-Fläche über
    die gesamte Dokumenthöhe unnötig GPU-Speicher verbrauchen.
-   Der Inhaltsbereich erhält eine ausreichend deckende, ruhige
    Überlagerung, damit Text jederzeit lesbar bleibt.
-   Animation darf Eingaben, Scrollen oder Navigation nicht blockieren.
-   Vorwärts- und Rückwärtsrichtung müssen zur tatsächlichen
    Seitenbewegung passen.
-   Mehrfachklicks und schnelle Richtungswechsel müssen sauber behandelt
    werden (Animation abbrechen/neu ausrichten oder in eine
    Warteschlange stellen; kein inkonsistenter Framezustand).

## 4.2 Technische Animationserfordernisse

-   Frames vorladen und dekodieren, bevor sie gebraucht werden.
-   Bei Klick vor abgeschlossener Vorladung die Animation zuverlässig
    nachladen und anschließend ausführen; Klick darf nicht einfach ohne
    Animation verloren gehen.
-   Begrenzte Frame-Anzahl und Dateigröße, separate optimierte
    Desktop-/Mobilvarianten.
-   `requestAnimationFrame` statt blockierender Schleifen.
-   `prefers-reduced-motion`, `Save-Data` und langsame Verbindungen
    berücksichtigen; in diesen Fällen statisches Bild oder deaktivierte
    Animation.
-   Sichtbarkeitswechsel/Tab-Wechsel und `pagehide` sauber behandeln.
-   Bildfehler müssen auf ein statisches Fallback zurückfallen.
-   Canvas nur so groß wie die tatsächlich sichtbare Fläche bzw. mit
    begrenztem DPR betreiben.
-   Keine unnötigen Hintergrundanimationen im Druckmodus.
-   Animationen müssen bei schwächeren Mobilgeräten getestet werden.

## 4.3 Micro-Interactions

Dezente Mikroanimationen sind zulässig für: - Navigationsfeedback, -
Fortschrittsanzeigen, - Öffnen von Lösungselementen, -
Fokus-/Hoverzustände, - Bestätigung erfolgreicher
Speicher-/Exportvorgänge.

Sie müssen kurz, konsistent und nicht ablenkend sein. Bei reduzierter
Bewegung werden sie deaktiviert oder stark reduziert.

------------------------------------------------------------------------

# 5. Informationsarchitektur und Seitenmodell

Die Anwendung enthält die Lerneinheiten LE 1 bis LE 11 sowie
übergreifende Bereiche wie Start, Lernziele, Inhaltsübersicht,
Checkpoints, Quellen, Impressum und Anhang.

Vorhandene technische Bestandsdaten aus dem v2.5.3-Audit: - 70
`article.page`-Seiten - 48 Sections - 390 eindeutige IDs - 299
Eingabefelder - 32 Buttons

Diese Zahlen sind Bestandswerte der geprüften Datei, keine Sollvorgaben.
Sie dürfen sich bei einer fachlich begründeten Vervollständigung ändern.

Jede Inhaltsseite soll semantisch strukturiert sein: - eindeutige
Hauptüberschrift, - sinnvolle Unterüberschriften, - klare
Aufgabenkennzeichnung, - zugängliche Formularelemente, - Quellenhinweise
in unmittelbarer Nähe oder im Quellenapparat, - stabile IDs für
Navigation und Verlinkung.

Die HTML-Semantik ist gegenüber rein visuellen DIV-Strukturen zu
bevorzugen. Es sind sinnvolle `main`, `nav`, `header`, `footer`,
`article`, `section`, `form`, `fieldset`, `legend`, `label`, `button`
und `details` einzusetzen.

------------------------------------------------------------------------

# 6. Technische Architektur und Lieferform

## 6.1 Primäre Laufzeit

Das Produkt muss mindestens in zwei Formen funktionieren:

**A. Standalone-HTML** - eine direkt öffnungsfähige HTML-Datei, - für
lokale Nutzung ohne Server, - Kernfunktionen dürfen nicht von externen
CDN-Ressourcen abhängen, - lokale Speicherung und Datenexport müssen
funktionieren.

**B. Progressive Web App (PWA)** - eigenständiger PWA-Einstiegspunkt, -
Web-App-Manifest, - Service Worker, - lokal verfügbare Assets, -
Installierbarkeit über HTTPS/localhost, - Offline-Betrieb nach
erfolgreichem Erstaufruf, - klar versionierter Cache und sichere
Cache-Aktualisierung.

Standalone und PWA müssen denselben Lerninhalt und dieselbe
Funktionslogik verwenden. Zulässige Unterschiede beschränken sich auf
PWA-spezifische Manifest-/Icon-Einbindung, Service-Worker-Registrierung
und Startkonfiguration. Parität muss automatisiert geprüft werden.

## 6.2 Quellstruktur und Build-System

Die bisherigen Archive enthalten die fertigen HTML-Artefakte, aber kein
nachgewiesenes ursprüngliches `src/`- oder `build/`-System. Deshalb darf
kein angeblich originaler Quellgenerator vorgetäuscht werden.

Für die weitere professionelle Entwicklung ist ein reproduzierbarer
Quellaufbau einzurichten, z. B.:

-   `src/content/` -- strukturierte Lerninhalte,
-   `src/templates/` -- HTML-Templates,
-   `src/styles/` -- CSS,
-   `src/scripts/` -- JavaScript,
-   `src/assets/` -- Bilder, Icons, Animationframes,
-   `tests/` -- Unit-, Integration-, Accessibility- und Release-Tests,
-   `dist/standalone/` -- Standalone-HTML,
-   `dist/pwa/` -- PWA-Dateien,
-   `docs/` -- Systembeschreibung, Quellen, Bedienung, Release-Notizen.

Die genaue Technologie darf schlank bleiben. Kein Framework nur um des
Frameworks willen. Wenn die Anwendung ohne Build-Schritt wartbar bleibt,
ist eine native HTML/CSS/JavaScript-Architektur vorzuziehen. Falls ein
Build-System eingeführt wird, müssen Versionen, Abhängigkeiten, Lockfile
und reproduzierbare Build-Befehle dokumentiert sein.

## 6.3 Lokale Android-App / WebView

Ein Android-WebView-Projekt wurde als separates Vorhaben vorbereitet,
aber nicht erfolgreich gebaut oder signiert. Der bisherige Entwurf
verwendete: - Paketname `de.omega.lernkompendium` - VersionName `2.5.3`,
VersionCode `253` - minSdk 29, compile/target SDK 36 - Java 17, Android
Gradle Plugin 8.13.0 - AndroidX WebKit 1.18.0 - `WebViewAssetLoader` -
keine INTERNET-Berechtigung im bisherigen lokalen Entwurf.

Diese Angaben sind Ausgangsdaten, keine freigegebene APK. APK-Erstellung
und Installation müssen als eigener Build-/Gerätetest behandelt werden.
Es darf keine fertige APK behauptet werden, solange Build, Signatur und
Installation nicht nachgewiesen sind.

------------------------------------------------------------------------

# 7. Barrierefreiheit, Usability und Qualitätsprinzipien

Zielstandard: WCAG 2.2 AA. Die Konformität ist durch konkrete Tests
nachzuweisen; bloße CSS-Präsenz genügt nicht.

Prüfbereiche: - semantische Struktur und Überschriftenhierarchie, -
Tastaturbedienung aller Funktionen, - sichtbarer Fokus, -
Screenreader-Benennung von Eingaben und Schaltflächen, - Farbkontrast, -
Reflow und Zoom bis 400 %, - Touch-Zielgrößen, - Statusmeldungen und
Fehlermeldungen, - Reduced Motion, - zugängliche Druck- und PDF-Ausgabe.

Usability nach Nielsen: 1. Sichtbarkeit des Systemstatus. 2.
Übereinstimmung mit der realen Welt. 3. Nutzerkontrolle und Freiheit. 4.
Konsistenz und Standards. 5. Fehlervermeidung. 6. Wiedererkennen statt
Erinnern. 7. Flexibilität und Effizienz. 8. Ästhetik und
minimalistisches Design. 9. Fehler erkennen, verstehen und beheben. 10.
Hilfe und Dokumentation.

Zusätzliche Gestaltungsregel: GOV.UK-artiges Prinzip „eine klare Sache
pro Seite", wo es den Lernfluss unterstützt. Klare Sprache, eindeutige
Weiter-Aktion und keine überladenen Ansichten.

Für jede Nielsen-Heuristik ist ein konkreter Prüfpunkt, ein beobachtetes
Ergebnis und ein Screenshot oder reproduzierbarer Testfall zu
dokumentieren. Keine pauschale Prozentbewertung ohne Messmethode.

------------------------------------------------------------------------

# 8. Performance-Ziele und Messung

Performance-Ziel ist eine schnelle, stabile Nutzung auch auf
Mobilgeräten. Zielwert für Lighthouse Mobile: 90+ in Performance, sofern
die reale Testumgebung dies zulässt. Das ist ein Ziel, kein bereits
nachgewiesener Messwert.

Zu messen: - LCP, INP, CLS, - TTFB, sofern serverseitig relevant, -
Ladezeit und Größe der initialen Ressourcen, - Frame- und
Animationsverhalten, - Speicherverbrauch und Canvas-Größe, -
Offline-Startzeit.

Maßnahmen: - kritisches CSS klein halten, - nicht benötigte
Inhalte/Medien verzögert laden, - Animationframes komprimieren und
responsive Varianten nutzen, - Bilder mit passenden Abmessungen und
Formaten bereitstellen, - keine unnötigen Bibliotheken, - kein
Layout-Jank durch nachträgliche Größenänderungen, - keine blockierenden
langen JavaScript-Aufgaben.

Jede Performance-Aussage muss Messdatum, Gerät/Viewport, Browser,
Lighthouse-Version und Ergebnis enthalten.

------------------------------------------------------------------------

# 9. Datenschutz und Sicherheit

-   Standardmäßig lokale Speicherung.
-   Kein Konto- oder Cloudzwang.
-   Keine unnötigen Tracker, Werbung oder Telemetrie.
-   Importdateien validieren; unbekannte Datenfelder ignorieren oder
    sicher behandeln.
-   Export enthält nur Lernantworten und notwendige Metadaten.
-   Keine Ausführung importierter Inhalte als HTML/JavaScript.
-   Externe Links als externe Inhalte kennzeichnen.
-   Fehler beim Speichern/Importieren/Exportieren sichtbar melden.
-   Bei Datenmigration bestehende Nutzerdaten sichern und nicht
    stillschweigend überschreiben.

------------------------------------------------------------------------

# 10. Bereits vorhandener Entwicklungsstand v2.5.3

Die folgende Einordnung basiert auf dem Audit und Testbericht vom
10.11.2026.

## 10.1 Vorhanden bzw. statisch nachgewiesen

-   Standalone-HTML und PWA-HTML.
-   70 Lernseiten und Bereiche für LE 1--11.
-   Umfangreiche Formular-/Eingabestruktur.
-   Suche, Navigation, Aufgaben, Lösungen, Checkpoints und
    Fortschrittsfunktionen sind im Quelltext vorhanden.
-   Native `details`-Lösungselemente.
-   Zwei Druckmodi sind im Code angelegt.
-   Canvas-basierte Buchanimation mit separaten Desktop-/Mobilframes und
    statischem Reduced-Motion-Fallback.
-   Dark-/Reduced-Motion-CSS.
-   PWA-Manifest, Icons, Service Worker und lokale Ressourcen.
-   51/51 statische Release-Checks bestanden.
-   JavaScript-Syntaxprüfung und HTML-Parserprüfung bestanden.
-   ZIP-Integrität und statische Standalone-/PWA-Parität geprüft.

## 10.2 Nicht als Laufzeitfunktion nachgewiesen

Der vorhandene Bericht dokumentiert eine Blockade des
Chromium-/Playwright-Laufs (`net::ERR_BLOCKED_BY_ADMINISTRATOR`). Daher
sind folgende Punkte nicht als bestanden zu werten: - echte Suche und
Navigation, - Bearbeitung und Speicherung, - Wiederherstellung nach
Neustart, - Import und Export, - Selbsttest, - Druck/PDF, -
Touch-/Mobilbedienung, - Dark Mode und Reduced Motion in
Live-Darstellung, - PWA-Installation und Offline-Zyklus, -
Android-WebView-Build und Gerätetest.

## 10.3 Konkrete bekannte offene Befunde

1.  Ein Quellenlisteneintrag zum Kursheft besitzt `href=""`. Er muss
    entweder mit einem echten, zulässigen Ziel versehen oder als
    bibliografischer Text ohne Link ausgegeben werden.
2.  Impressum enthält bewusst einen Platzhalter („vor Veröffentlichung
    ergänzen"). Vor öffentlicher Veröffentlichung muss die
    Anbieterkennzeichnung geklärt sein.
3.  32 Seiten haben keine numerische `data-le`-Zuordnung. Jede Seite
    muss fachlich klassifiziert werden.
4.  Inhaltsabdeckung LE 1--11 ist nicht seitenweise gegen das
    Original-Kursmaterial nachgewiesen.
5.  Accessibility-Audit ist nur statisch und keine WCAG-2.2-AA-Prüfung.
6.  Release-ZIP trägt intern teilweise noch Verzeichnisnamen v2.5.2,
    obwohl das Paket als v2.5.3 bezeichnet wird. Packaging-Namen und
    Versionsmetadaten sind vor dem nächsten Release zu vereinheitlichen.
7.  Das bisherige Archiv enthält keine nachgewiesenen
    Original-Quelldateien oder reproduzierbare Build-Pipeline.

**Wichtige Einordnung:** Der vorhandene Bericht nennt 58 % als
konservative, gewichtete Reifegrad-Schätzung. Das ist keine gemessene
Fertigstellungsquote und darf nicht als präzise Projektmetrik
dargestellt werden.

------------------------------------------------------------------------

# 11. Umsetzungsplan in verbindlicher Reihenfolge

## Phase 0 -- Baseline und Sicherung

-   v2.5.1-Originalarchiv unverändert sichern.
-   v2.5.3-HTML, PWA, ZIP und Berichte mit SHA-256 erfassen.
-   Release-ZIP vollständig entpacken und Inhalt inventarisieren.
-   Standalone/PWA-Differenzen dokumentieren.
-   Keine destruktiven Änderungen an Originaldateien.
-   Arbeitsbranch bzw. versioniertes Arbeitsverzeichnis anlegen.

**Abnahmekriterium:** Baseline mit Dateiliste, Prüfsummen und
reproduzierbarer Kopie.

## Phase 1 -- System- und Inhaltsinventar

-   alle 70 vorhandenen Seiten extrahieren und in einer Seitenmatrix
    erfassen.
-   Kursmaterial/Scans vollständig seitenweise durchgehen.
-   LE 1--11, Aufgaben, Tabellen, Reflexionen und Lernziele zuordnen.
-   offene `data-le`-Seiten klassifizieren.
-   Prioritätsbereiche LE 2.3, LE 3.3.6/3.3.7 und LE 5.1.1--5.3 fachlich
    prüfen.
-   Quellen- und Rechtsstandmatrix erstellen.
-   Lücken und Widersprüche als Issues erfassen; nichts stillschweigend
    erfinden.

**Abnahmekriterium:** 100-%-Mapping-Matrix mit Status pro
Originalabschnitt und Kompendiumseite.

## Phase 2 -- Architektur und Quellstruktur

-   reproduzierbare Quellstruktur aufsetzen.
-   Lerninhalte strukturiert von Darstellung und Interaktionslogik
    trennen.
-   Build-Ausgabe für Standalone und PWA definieren.
-   gemeinsame Komponenten für Aufgaben, Lösungen, Checkpoints,
    Navigation und Fortschritt erstellen.
-   Versions- und Migrationsschema für gespeicherte Antworten
    definieren.
-   Tests automatisiert in den Build integrieren.

**Abnahmekriterium:** Ein Befehl erzeugt beide Artefakte reproduzierbar;
Paritätstest besteht.

## Phase 3 -- Inhaltliche Vervollständigung

-   alle elf Lerneinheiten anhand der Mapping-Matrix vervollständigen.
-   Aufgaben und Arbeitsblätter digital vollständig abbilden.
-   fachliche Lösungen und Feedback dort ergänzen, wo objektiv möglich.
-   persönliche Reflexionen offen lassen.
-   Quellen direkt zuordnen und Aktualitätsdatum vermerken.
-   Rollen-/Grenzenhinweise zur Alltagsbegleitung deutlich machen.
-   Film- und Medienmaterial passend je Lerneinheit einbetten, mit
    Titel, Anbieter, Lernzweck, Sprache, Laufzeit (nur wenn verifiziert)
    und externer Kennzeichnung.
-   tote oder leere Quellenlinks beseitigen.

**Abnahmekriterium:** Jede Original-Lerneinheit und jede vorgesehene
Aufgabe hat einen belegten digitalen Zielort oder eine dokumentierte
begründete Abweichung.

## Phase 4 -- Interaktionen und Datenhaltung

-   Navigation und Mehrwortsuche funktionsfähig implementieren.
-   alle Eingabefelder mit stabilen IDs und persistenter Speicherung
    versehen.
-   Speicherstatus und Fehlerbehandlung ergänzen.
-   JSON-Export und validierten Import umsetzen.
-   Datenmigration und Backupstrategie implementieren.
-   Selbsttests/Checkpoints mit nachvollziehbarer Rückmeldung testen.

**Abnahmekriterium:** Testperson kann vollständig arbeiten, schließen,
neu öffnen und ohne Datenverlust fortsetzen; Export/Import stellt den
Zustand wieder her.

## Phase 5 -- Design und Buchanimation

-   Typografie, 65ch-Lesespalte, dunkles Grau und mobile 18px als
    Baseline umsetzen.
-   ruhige Seitenhierarchie und klare Weiter-/Zurück-Aktionen.
-   Buchanimation vorwärts/rückwärts mit korrekter Bewegungsrichtung.
-   Frames robust vorladen; frühe Klicks dürfen nicht verloren gehen.
-   Animation auf sichtbare Canvas-Fläche begrenzen.
-   statischer Fallback bei Reduced Motion/Save-Data/Fehler.
-   Micro-Interactions konsistent und zurückhaltend.
-   Screenshots vorher/nachher bei Desktop und Mobile anfertigen.

**Abnahmekriterium:** keine sichtbaren Frame-Sprünge; keine Blockade der
Eingabe; Lesbarkeit und reduzierte Bewegung sind gewährleistet.

## Phase 6 -- Druck, PWA und Offline

-   „Zum Ausfüllen" und „Mit Lösungen" real testen.
-   Aufgabenblöcke und Tabellen beim Seitenumbruch zusammenhalten.
-   Manifest, Icons, Service Worker und Cacheversion aktualisieren.
-   Offline-Installation und Neustart ohne Netzwerk nachweisen.
-   Cache-Upgrade und Rollback bei Fehlern testen.

**Abnahmekriterium:** beide Druckmodi liefern brauchbare A4-PDFs;
installierte PWA startet nach Offline-Neustart.

## Phase 7 -- Barrierefreiheit, Usability und Performance

-   WCAG-2.2-AA-Audit mit Tastatur, Screenreader und Kontrastmessung.
-   200-/400-%-Zoom und 360px-Viewport.
-   Nielsen-10-Checkliste mit konkreten Ergebnissen.
-   Lighthouse Mobile und Web Vitals erfassen.
-   Animation auf Mobilgeräten und bei Reduced Motion testen.
-   reale Screenshots und Messprotokolle sichern.

**Abnahmekriterium:** keine kritischen Accessibility-Blocker;
Performance-Ziele gemessen; Abweichungen offen dokumentiert.

## Phase 8 -- Release und Übergabe

Lieferpaket: - Standalone-HTML. - vollständiges PWA-Verzeichnis. -
vollständige Assets und Animationframes. - Quellcode und
Build-Skripte. - README mit Start-/Build-/Testanleitung. -
Systemarchitektur-Dokument. - Inhaltsmapping und Quellenmatrix. -
Änderungsprotokoll. - Testbericht mit bestanden/nicht bestanden/nicht
ausgeführt. - Accessibility- und Performance-Bericht. - Screenshots
Desktop/Mobile und Druckbeispiele. - SHA-256-Manifest. - Release-ZIP mit
sauberer Versionsstruktur. - optional separates Android-Projekt und APK
erst nach erfolgreichem Build und Signatur.

**Abnahmekriterium:** Ein Dritter kann das Projekt aus dem Quellpaket
aufbauen, testen und die Release-Dateien reproduzieren.

------------------------------------------------------------------------

# 12. Teststrategie und Abnahmefälle

Mindestens folgende End-to-End-Fälle müssen real ausgeführt werden:

1.  App öffnen und alle LE 1--11 über Navigation erreichen.
2.  Mehrwortsuche mit zwei und drei Suchbegriffen testen.
3.  Eingabe in Freitext, Lücke, Tabelle und Checkliste.
4.  Mehrere Lösungen gleichzeitig öffnen und schließen.
5.  Zwischen Seiten wechseln; Eingaben bleiben erhalten.
6.  App schließen und erneut öffnen; Fortschritt bleibt erhalten.
7.  JSON exportieren, Daten ändern, JSON importieren; Zustand wird
    wiederhergestellt.
8.  Ungültige/alte Importdatei testen; Daten bleiben geschützt.
9.  Selbsttest vollständig durchführen; Rückmeldung prüfen.
10. Druckmodus „Zum Ausfüllen": keine Lösungen, leere Antwortbereiche.
11. Druckmodus „Mit Lösungen": alle Lösungen sichtbar, Aufgabenblöcke
    nicht zerrissen.
12. Desktop-Viewport und 360px-Mobile-Viewport.
13. Tastaturbedienung ohne Maus.
14. Screenreader-Bezeichnungen und Statusmeldungen.
15. Reduced Motion: keine störende Animation.
16. Save-Data/Offline: statischer Hintergrund und nutzbarer Inhalt.
17. PWA installieren, offline neu starten und Inhalte aufrufen.
18. Service-Worker-Update: Cache wird kontrolliert aktualisiert.
19. Android-WebView: Eingaben, Export, Import, Druck und Neustart.
20. Fehlerfall: Speicherkontingent/Exportfehler wird sichtbar gemeldet.

Jeder Test bekommt: - eindeutige Test-ID, - Voraussetzungen, -
Schritte, - erwartetes Ergebnis, - tatsächliches Ergebnis, -
Browser/Gerät, - Datum, - Status, - Screenshot/Log oder andere Evidenz.

Ein Test, der nicht ausgeführt wurde, bekommt den Status **NICHT
AUSGEFÜHRT**, niemals PASS.

------------------------------------------------------------------------

# 13. Quellen und Medien

Quellenhierarchie: 1. geltende Rechtsnormen und amtliche
Veröffentlichungen, 2. zuständige Ministerien/Behörden und offizielle
Informationsportale, 3. fachlich etablierte Verbände und
Alzheimer-Gesellschaften, 4. wissenschaftliche Fachliteratur, 5.
ergänzende Medien nur mit nachvollziehbarem Anbieter und Lernzweck.

Für Videos/Filme sind mindestens Anbieter, Titel, URL, Sprache, Lernziel
und Verfügbarkeit zu erfassen. Laufzeiten nur nach tatsächlicher Prüfung
angeben. Externe Medien dürfen nicht automatisch als lokal verfügbar
dargestellt werden.

Bereits gefundene Anlaufstellen für Demenz-Lernmedien: - Alzheimer
Gesellschaft Baden-Württemberg: Kurzfilme, u. a. zu Kommunikation,
Perspektivwechsel und gesellschaftlicher Teilhabe. - Alzheimer
Gesellschaft Rheinland-Pfalz: Lernvideos zu Demenzformen, Validation,
Kommunikation, Alltag/Aktivierung, herausforderndem Verhalten und
Entlastung.

Diese Links sind Kandidaten für eine Einzelprüfung, keine bereits
vollständig kuratierte Medienbibliothek.

------------------------------------------------------------------------

# 14. Konkrete Übergabeanweisung an eine andere Coding-AI

Du arbeitest als Senior Full-Stack Engineer und Technical QA Lead an
einem bestehenden digitalen Lern-Kompendium nach § 8 AnFöVO NRW.

**Arbeitsauftrag:** Setze die oben beschriebene Spezifikation
vollständig um. Beginne nicht mit einem Neubau aus dem Nichts.
Inventarisiere zuerst die gelieferten v2.5.1/v2.5.3-Artefakte, sichere
die Baseline, lies die vorhandenen Berichte und prüfe die tatsächliche
Dateistruktur. Bewahre bestehende funktionierende Inhalte und
Funktionen. Führe Änderungen chirurgisch und versioniert durch.

**Verbindliche Arbeitsregeln:** - Step-back: Produktziel, fachliche
Grenzen und Risiken zuerst explizit bestimmen. - SOURCE und INFERRED
sauber trennen. - Annahmen, offene Fragen und Konfidenz 0--1 je
Kernaussage dokumentieren. - Keine Inhalte, Quellen, Paragraphen,
Laufzeiten, Testergebnisse oder Funktionen erfinden. - Originaldateien
nicht überschreiben; neue Version und Backups erstellen. - Vor
Änderungen SHA-256 erfassen. - Bei fachlichen Lücken nicht raten: Issue
mit genauer Fundstelle anlegen. - Keine externen Abhängigkeiten ohne
begründeten Nutzen. - Kein Framework-Zwang; schlanke, wartbare
Architektur. - Alle interaktiven Funktionen tatsächlich ausführen und
testen. - Code mit Fehlerbehandlung, Versionsangaben, Abhängigkeiten und
Tests liefern. - Bei jedem Release Standalone/PWA-Parität prüfen. -
Keine Release-Freigabe ohne Browser-, Druck-, PWA- und
Accessibility-Nachweise. - Nicht ausgeführte Tests explizit als NICHT
AUSGEFÜHRT kennzeichnen. - Vor destruktiven Änderungen prüfen und
Zustimmung einholen.

**Arbeitsmodus:** in Phasen arbeiten, aber nicht nach jeder Kleinigkeit
um Erlaubnis fragen. Sichere, reversible Schritte selbstständig
durchführen. Bei fachlich oder rechtlich relevanten Unklarheiten gezielt
nachfragen. Nach jeder Phase konkrete Dateien und Testergebnisse
liefern.

**Erste Aufgabe:** Bestandsinventar und Inhaltsmapping erstellen. Danach
offene Punkte priorisieren und Phase 1 bis Phase 8 umsetzen. Nicht bloß
einen Plan zurückgeben -- Änderungen in den Projektdateien durchführen.

------------------------------------------------------------------------

# 15. Offene Entscheidungen, die nicht erfunden werden dürfen

1.  Vollständige, verlässliche Seiten-/Abschnittszuordnung des
    Original-Kurshefts zu allen LE 1--11.
2.  Anbieter-/Impressumsdaten für den tatsächlichen Verwendungszweck
    (privat, intern oder öffentliche Veröffentlichung).
3.  Finale Auswahl und Rechte-/Verfügbarkeitsprüfung der ergänzenden
    Medien.
4.  Ob Android-APK weiterhin ein verbindliches Releaseziel ist oder
    zunächst HTML/PWA ausreicht.
5.  Ob es eine neue modulare Quellarchitektur geben soll oder die
    bestehende Single-HTML-Struktur vorerst beibehalten wird.
    Empfehlung: neue reproduzierbare Quellstruktur, aber ohne Verlust
    der Standalone-Ausgabe.
6.  Finale fachliche Freigabe aller rechtlichen und pflegerischen
    Aussagen.

------------------------------------------------------------------------

# 16. Statusübersicht

  -----------------------------------------------------------------------
  Bereich                             Stand am 10.11.2026
  ----------------------------------- -----------------------------------
  Vorhandene HTML/PWA-Basis           vorhanden

  Lernseiten LE 1--11                 vorhanden, Vollständigkeit fachlich
                                      nicht abschließend belegt

  Interaktive Elemente im Code        vorhanden, Laufzeit nicht
                                      vollständig geprüft

  Buchanimation                       teilweise implementiert,
                                      Robustheit/Performance weiter zu
                                      prüfen

  Statische Release-Prüfungen         51/51 bestanden

  Browser-End-to-End                  blockiert/nicht nachgewiesen

  Druckprüfung                        nicht nachgewiesen

  PWA-Offline-Test                    nicht nachgewiesen

  WCAG 2.2 AA                         nicht nachgewiesen

  Performance 90+ Mobile              Ziel, nicht gemessen

  Android-APK                         Projektentwurf, kein bestätigter
                                      Build

  System-/Quellarchitektur            bisherige Original-Buildquellen
                                      fehlen; neue Pipeline erforderlich

  Vollständiges Inhaltsmapping        offen

  Release-Freigabe                    zurückgestellt
  -----------------------------------------------------------------------

**Abschließende Einordnung:** Das vorhandene v2.5.3 ist eine
substanzielle Grundlage, aber noch kein vollständig freigegebenes
Gesamtsystem. Der nächste professionelle Schritt ist kein Neustart und
kein weiteres kosmetisches Versionsupdate, sondern die kontrollierte
Vervollständigung anhand dieser Spezifikation und mit belastbaren
Laufzeit- und Inhaltsnachweisen.
