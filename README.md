# Aufmaß-Generator – Elektro Krieg Meiningen

PWA zur Erstellung von Rechnungsaufmaßen aus Leistungsverzeichnissen.

## Features
- PDF-Leistungsverzeichnis importieren (automatische Positionserkennung)
- Raumliste manuell eingeben oder als Excel importieren  
- Aufmaß-Tabelle direkt im Browser bearbeiten und Mengen eintragen
- Speichern im Browser oder als JSON-Datei
- PDF-Druck im A4-Querformat
- Offline-fähig (PWA mit Service Worker)

## Deployment
Einfach alle Dateien in ein GitHub-Repository laden und GitHub Pages aktivieren.

## Version
Aktuelle Version: **1.0.0**  
Stand: 24.06.2026

## Update-Prozess
1. `version.json` → Versionsnummer erhöhen
2. `sw.js` → `CACHE`-Konstante auf neue Version setzen
3. Änderungen committen und pushen
4. App erkennt das Update automatisch und fragt zum Neu-Laden
