# 🍂 Food Flash - Einfache Anleitung

## 🚀 Schnellstart

### App auf dem Computer starten:
```bash
cd /Users/pmac1/Desktop/FoodFlash
npm run dev
```
Dann öffne: **http://localhost:5173/FoodFlash/**

### App auf dem Handy nutzen:
```bash
cd /Users/pmac1/Desktop/FoodFlash
npm run dev:mobile
```
Dann öffne auf dem Handy die **Network-URL** die angezeigt wird (z.B. http://192.168.1.100:5173/FoodFlash/)

---

## 📱 Als App auf dem Handy installieren

### iPhone/iPad:
1. Öffne die App im Safari
2. Tippe auf **Teilen** (Pfeil nach oben)
3. Wähle **"Zum Home-Bildschirm"**

### Android:
1. Öffne die App in Chrome
2. Tippe auf **⋮ Menü**
3. Wähle **"Zum Startbildschirm hinzufügen"**

---

## 🔑 YouTube-Suche aktivieren (optional)

1. Erstelle eine `.env` Datei im Projekt-Ordner
2. Füge deinen YouTube API-Key ein:
   ```
   VITE_YOUTUBE_API_KEY=DEIN_API_SCHLÜSSEL_HIER
   ```
3. Starte den Server neu

**YouTube API-Key erstellen:** Siehe `YOUTUBE-API-SETUP.md`

---

## 👨‍👩‍👧‍👦 Mit der Familie teilen

### Option 1: Über Gist-Cloud (empfohlen)
1. In der App auf **"Gist-Cloud"** klicken
2. Gist-URL erstellen und mit Familie teilen
3. Familie gibt die gleiche Gist-URL in ihrer App ein

### Option 2: Rezepte exportieren/importieren
1. **Exportieren:** Rezepte → Export-Button → JSON-Datei speichern
2. **Importieren:** Datei per WhatsApp/E-Mail senden → Empfänger klickt Import

---

## 🌐 GitHub Pages (Online-Version)

**URL:** https://tubackit.github.io/FoodFlash/

**⚠️ Einschränkungen:**
- YouTube-Suche funktioniert NICHT (nur lokal)
- Updates können 10-20 Minuten dauern (Browser-Cache)
- Bei Problemen: Inkognito-Modus nutzen oder Browser-Cache leeren

**💡 Empfehlung:** Nutze die lokale Version! Sie ist schneller, hat alle Features und keine Cache-Probleme.

---

## 🛠️ Wichtige Befehle

| Befehl | Was es macht |
|--------|--------------|
| `npm run dev` | App lokal starten (nur auf diesem Computer) |
| `npm run dev:mobile` | App im Netzwerk starten (auch auf Handy) |
| `npm run build` | Production-Build erstellen |
| `git pull` | Neueste Updates vom GitHub holen |
| `npm install` | Dependencies installieren (nach git pull) |

---

## 🆘 Probleme lösen

### Server startet nicht:
```bash
rm -rf node_modules
npm install
npm run dev
```

### Port schon belegt:
Der Server wechselt automatisch zu einem anderen Port (z.B. 5174 statt 5173)

### Änderungen werden nicht angezeigt:
1. Browser-Cache leeren (Cmd + Shift + R)
2. Oder Inkognito-Modus nutzen

### Handy kann nicht verbinden:
- Mac und Handy müssen im **gleichen WLAN** sein
- Firewall könnte den Port blocken (normalerweise kein Problem)

---

## 📂 Wo sind meine Daten?

Alle Rezepte und Daten werden im **Browser gespeichert** (LocalStorage):
- **Sicher:** Nur auf deinem Gerät
- **Privat:** Keine Cloud, keine Server
- **Gist-Sync:** Optional für Familie-Sharing

**⚠️ Wichtig:** Browser-Daten nicht löschen, sonst sind die Rezepte weg!  
**💾 Tipp:** Regelmäßig exportieren als Backup!

---

## 🎨 Features

✅ Rezepte speichern (YouTube, Instagram, Facebook, TikTok)  
✅ Eigene Rezepte hinzufügen (ohne URL)  
✅ Zutaten verwalten  
✅ Notizen und Kommentare  
✅ Bewertungen (⭐⭐⭐⭐⭐)  
✅ Wochenplaner  
✅ Einkaufsliste (sortiert nach Kategorien)  
✅ Suche und Filter  
✅ Export/Import  
✅ Familie-Sharing (Gist)  
✅ YouTube-Suche (nur lokal)  
✅ Dunkles herbstliches Design 🎃  

---

## 💡 Tipps

- **Rezepte schnell durchblättern:** In der mobilen Ansicht sind Rezepte automatisch eingeklappt
- **WhatsApp-Share:** Einkaufsliste kann direkt kopiert und per WhatsApp geteilt werden
- **Zutaten-Magic:** Bei Rezepten mit Zutaten gibt es einen Button zum direkten Hinzufügen zur Einkaufsliste
- **Wochenplaner:** Plane deine Mahlzeiten für die ganze Woche im Voraus

---

## 📞 Hilfe gebraucht?

Bei Fragen oder Problemen schaue in die anderen Dokumentations-Dateien:
- `QUICKSTART.md` - Schnellstart-Anleitung
- `YOUTUBE-API-SETUP.md` - YouTube API einrichten
- `GIST-GUIDE.md` - Familie-Sharing mit Gist (manuell)
- `FIREBASE-SETUP.md` - 🔥 **NEU:** Automatisches Familie-Sharing mit Firebase!
- `README.md` - Technische Details

---

**Viel Spaß beim Kochen! 🍂👨‍🍳**

