# 🍳 Food Flash App

[![GitHub Pages](https://img.shields.io/badge/demo-online-brightgreen)](https://github.com/DEIN-USERNAME/FoodFlash)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb)](https://reactjs.org/)

Eine bunte und verspielte App zum Speichern und Verwalten deiner Lieblingsrezepte von YouTube, Instagram, Facebook und TikTok.

> 💡 **Perfekt für Familien!** Teile deine Rezepte über GitHub Gist mit der ganzen Familie.

## 🚀 Schnellstart

```bash
# 1. Repository klonen (wenn von GitHub)
git clone https://github.com/DEIN-USERNAME/FoodFlash.git
cd FoodFlash

# 2. Abhängigkeiten installieren
npm install

# 3. Development Server starten
npm run dev

# 4. Build für Produktion
npm run build
```

📖 **Vollständige Anleitung:** Siehe [QUICKSTART.md](./QUICKSTART.md)

## ✨ Funktionen

### ✅ Rezept-Verwaltung
- 📝 Rezepte mit Links speichern (YouTube, Instagram, Facebook, TikTok)
- 📖 **Eigene Rezepte** ohne URL hinzufügen
- 🔍 Suchfunktion nach Titel, Beschreibung, Plattform & Notizen
- 🎯 **Plattform-Filter**: Klick auf Plattform-Button zeigt nur diese Rezepte
- ⭐ 5-Sterne-Bewertungssystem
- 💬 Kommentar-Funktion mit Zeitstempel
- 📋 Eigene Notizen zu jedem Rezept
- 🖼️ Optionale Bilder (YouTube Auto-Fill, Google Drive Support)
- 🎨 Automatische Plattform-Erkennung mit passenden Icons
- 📤📥 **Export/Import**: Rezepte mit Familie teilen
- ☁️ **GitHub Gist Sync**: Cloud-Speicher für Familie
- 🔄 **Familie-Sync-Button**: 1-Klick-Update von fester Gist-URL
- 🎬 **YouTube-Suche**: Rezepte direkt von YouTube importieren (NEU!)
- 🥕 **Zutaten → Einkaufsliste**: 1-Klick-Import mit Auto-Kategorisierung (NEU!)

### ✅ Wochenplaner
- 📅 7-Tage-Übersicht (Montag - Sonntag)
- 🍽️ 4 Mahlzeiten-Typen: Frühstück, Mittagessen, Abendessen, Snack
- ➕ Rezepte einfach zuordnen
- 🗑️ Einzelne Tage oder ganze Woche löschen
- 💾 Automatisches Speichern im Browser

### ✅ Einkaufsliste
- 🛒 Artikel mit Kategorie und Menge hinzufügen
- 🏪 Sortiert nach Supermarkt-Reihenfolge (wie bei Lidl)
- ✅ Abhaken von gekauften Artikeln
- 🗂️ 10 Kategorien: Obst/Gemüse → Brot → Fleisch → Aufschnitt → Käse/Milch → Getränke → Vorräte → Snacks → Tiefkühlware → Haushalt
- 📋 **Per WhatsApp teilen** - kopieren oder direkt senden (NEU!)
- 🧹 Abgehakte oder alle Artikel löschen

### ✅ Design
- 🎨 Buntes, verspieltes Design
- 🌈 Farbschema: Orange (Primär), Pink/Lila (Sekundär), Grün (Akzent)
- ⚡ Animiertes Blitz-Logo
- 📱 Responsive für Desktop & Mobile

## 📋 Entwicklungs-Status

### ✅ Alle Schritte abgeschlossen!

1. **Schritt 1: Basis-Setup & Layout** ✅
   - React + TypeScript + Vite Setup
   - TailwindCSS konfiguriert
   - Header mit Navigation
   - Hero-Sektion

2. **Schritt 2: Rezept-Speicherung** ✅
   - Formular zum Hinzufügen
   - LocalStorage Integration
   - Rezept-Karten Anzeige
   - Plattform-Erkennung

3. **Schritt 3: Notizen & Suchfunktion** ✅
   - Notizen bearbeiten & speichern
   - Live-Suchfunktion
   - Filter nach allen Feldern

4. **Schritt 4: Bewertung & Kommentare** ✅
   - 5-Sterne-Bewertung
   - Kommentare mit Zeitstempel
   - Ein-/Ausklappbare Ansicht

5. **Schritt 5: Wochenplaner** ✅
   - 7-Tage-Kalender
   - Mahlzeiten-Zuordnung
   - Wöchentliches Reset

6. **Bonus: Einkaufsliste** ✅
   - Supermarkt-Kategorien
   - Abhak-Funktion
   - Smart sortiert

7. **Export/Import** ✅
   - Rezepte als JSON exportieren
   - Import mit Merge oder Replace
   - Perfekt für Familie-Sharing

8. **GitHub Gist Cloud-Sync** ✅
   - Rezepte in GitHub Gist speichern
   - Familie lädt von einer URL
   - Kostenlos & einfach!

9. **Familie-Sync-Button** ✅
   - Feste Gist-URL konfiguriert
   - 1-Klick-Update für Familie
   - Zeigt letzten Sync-Zeitpunkt

10. **Einkaufsliste teilen** ✅
   - WhatsApp-Integration
   - Kopieren in Zwischenablage
   - Formatiert nach Kategorien

## 🛠️ Technologie-Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React Icons
- clsx für dynamische Klassen
- LocalStorage für Datenpersistenz

## 📱 Verwendung

1. **Rezepte hinzufügen**: Navigiere zu "Rezepte" und klicke auf "Neues Rezept hinzufügen"
2. **Rezepte bewerten**: Klicke auf die Sterne in der Rezept-Karte
3. **Notizen hinzufügen**: Klicke auf "Bearbeiten" im Notizen-Bereich
4. **Kommentare schreiben**: Öffne die Kommentare und füge deinen Kommentar hinzu
5. **Wochenplan erstellen**: Gehe zu "Planer", wähle einen Tag und füge ein Rezept hinzu
6. **Einkaufsliste**: Gehe zu "Einkauf", füge Artikel hinzu und hake sie beim Einkaufen ab
7. **Rezepte teilen**: 
   - **Exportieren**: Klicke "Exportieren" → JSON-Datei wird heruntergeladen
   - **Datei-Import**: Klicke "Datei" → wähle "Hinzufügen" oder "Ersetzen" → Datei auswählen
   - **Gist-Cloud** (empfohlen): 
     - Ein Familienmitglied erstellt Gist auf gist.github.com
     - Alle anderen: "Gist-Cloud" → URL eingeben → laden
     - Siehe `GIST-GUIDE.md` für Details!

## 📚 Dokumentation

- 📖 [QUICKSTART.md](./QUICKSTART.md) - Schnellstart & GitHub Setup
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment auf GitHub Pages
- ☁️ [GIST-GUIDE.md](./GIST-GUIDE.md) - Familien-Cloud mit GitHub Gist
- 👨‍👩‍👧‍👦 [SHARING.md](./SHARING.md) - Rezepte teilen & Export/Import
- ⚙️ [FAMILY-CONFIG.md](./FAMILY-CONFIG.md) - Familie-Sync Konfiguration (WICHTIG!)

## 🎯 Zukünftige Erweiterungen

- Community-Funktion für Rezept-Austausch
- Koch-Challenges
- Upload eigener Fotos (aktuell: Google Drive / imgbb.com)
- Rezepte aus Wochenplan automatisch zur Einkaufsliste hinzufügen
- Cloud-Sync für Echtzeit-Familiennutzung (Firebase/Supabase)

## 📄 Lizenz

MIT License - siehe [LICENSE](./LICENSE) Datei

