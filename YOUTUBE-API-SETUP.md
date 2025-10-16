# 🎬 YouTube API Setup - Anleitung

## ✅ Du hast bereits einen API-Key? Super!

Jetzt musst du ihn nur noch in die App einfügen.

---

## 🔑 **API-Key in die App einfügen:**

### **Schritt 1: .env Datei erstellen**

1. Öffne dein FoodFlash Projekt-Ordner
2. Du siehst eine Datei: `.env.example`
3. **Kopiere** diese Datei
4. **Benenne die Kopie um** zu: `.env` (ohne .example!)

**Oder manuell erstellen:**
- Erstelle eine **neue Datei** im Hauptverzeichnis
- Name: `.env` (genau so, mit Punkt am Anfang!)

### **Schritt 2: API-Key eintragen**

Öffne die `.env` Datei und trage ein:

```bash
VITE_YOUTUBE_API_KEY=AIzaSy...DEIN_ECHTER_KEY_HIER
```

**Beispiel:**
```bash
VITE_YOUTUBE_API_KEY=AIzaSyAbc123Def456Ghi789Xyz
```

**Wichtig:**
- ❌ KEINE Anführungszeichen!
- ❌ KEINE Leerzeichen!
- ✅ Direkt nach dem `=` der Key

### **Schritt 3: App neu starten**

```bash
# Development Server beenden (Strg + C)
# Dann neu starten:
npm run dev
```

✅ **Fertig!** Die YouTube-Integration sollte jetzt funktionieren!

---

## 🧪 **Testen ob es funktioniert:**

1. Öffne die App: `http://localhost:5173`
2. Gehe zu **"Rezepte"**
3. Klicke **"Rezept auf YouTube suchen"** (roter Button)
4. Suchfeld erscheint
5. Tippe: **"Carbonara"**
6. Klicke **"Suchen"**
7. **Videos werden angezeigt!** ✅

**Wenn nichts passiert:**
- Öffne Browser-Konsole (F12)
- Schau nach Fehlermeldungen
- Häufig: "YouTube API Key fehlt" → .env Datei prüfen

---

## 🎯 **Wie die YouTube-Suche funktioniert:**

### **Workflow:**
1. **Button klicken** → Modal öffnet sich
2. **Suchbegriff eingeben:** z.B. "Pizza Rezept"
3. **Enter** oder **"Suchen"** klicken
4. **12 Video-Ergebnisse** werden angezeigt mit:
   - Thumbnail
   - Titel
   - Kanal-Name
5. **Auf Video klicken** → Rezept wird erstellt mit:
   - ✅ Titel (vom Video)
   - ✅ URL (YouTube-Link)
   - ✅ Beschreibung (aus Video-Beschreibung)
   - ✅ Bild (Video-Thumbnail)
   - ✅ Plattform: YouTube
6. **Fertig!** Nur noch ggf. Zutaten hinzufügen & speichern

---

## 🔒 **Sicherheit:**

### **Wichtig:**
- Die `.env` Datei wird **NICHT auf GitHub hochgeladen**
- Ist in `.gitignore` ausgeschlossen
- Dein API-Key bleibt **privat**! ✅

### **Wenn du Code auf GitHub pushst:**
- ✅ `.env.example` wird hochgeladen (ohne echten Key)
- ❌ `.env` wird NICHT hochgeladen
- Andere Nutzer müssen ihren eigenen Key eintragen

---

## 📊 **API-Quota überwachen:**

### **Quota-Verbrauch ansehen:**
1. Gehe zu: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
2. Wähle dein Projekt: **FoodFlash**
3. Siehst du deine **tägliche Nutzung**
4. Limit: 10.000 Einheiten/Tag

### **Verbrauch pro Aktion:**
- 🔍 **Suche:** 100 Einheiten
- 📹 **Video-Details:** 1 Einheit

**→ Du kannst ca. 100 Suchen pro Tag machen!** Völlig ausreichend! ✅

---

## ❓ **Häufige Probleme:**

### **"YouTube API Key fehlt"**
**Lösung:**
- `.env` Datei ist nicht im richtigen Ordner
- Muss im **Hauptverzeichnis** sein (neben `package.json`)
- Server neu starten nach Änderung!

### **"API key not valid"**
**Lösung:**
- Key falsch kopiert (Leerzeichen?)
- Kopiere nochmal direkt von Google Cloud Console
- Achte auf kompletten Key (beginnt mit `AIza...`)

### **"Quota exceeded"**
**Lösung:**
- Tages-Limit erreicht (10.000 Einheiten)
- Warte bis Mitternacht (Pacific Time)
- Oder: Billing aktivieren (bleibt kostenlos)

### **403 Fehler in der App**
**Lösung:**
- API-Einschränkungen zu streng
- Gehe zu: https://console.cloud.google.com/apis/credentials
- Setze auf "Keine Einschränkungen"

---

## 🚀 **Für GitHub Pages Deployment:**

### **Problem:**
- `.env` Dateien funktionieren **nicht** auf GitHub Pages
- Nur beim lokalen `npm run dev`

### **Lösung für Production:**

**Option 1: Key direkt im Code (NICHT empfohlen)**
```typescript
// Nur für private Familien-App OK
const API_KEY = 'AIzaSy...'
```

**Option 2: GitHub Secrets (Empfohlen)**
1. GitHub Repo → Settings → Secrets → Actions
2. New secret: `YOUTUBE_API_KEY`
3. In GitHub Action einbinden
4. Automatisch beim Build eingefügt

**Option 3: YouTube-Suche nur lokal nutzen**
- Auf GitHub Pages: Feature verstecken
- Nur bei lokalem Development sichtbar

---

## 💡 **Meine Empfehlung:**

**Für jetzt (lokale Nutzung):**
1. ✅ API-Key in `.env` eintragen
2. ✅ Lokal testen
3. ✅ Super praktisch für dich!

**Für GitHub Pages später:**
- Entweder Key öffentlich machen (für private Familien-App OK)
- Oder GitHub Secrets nutzen
- Oder Feature nur lokal nutzen

---

## 📝 **Zusammenfassung:**

**Was du JETZT machen musst:**
1. Erstelle Datei: `.env` im Hauptverzeichnis
2. Inhalt: `VITE_YOUTUBE_API_KEY=DEIN_KEY_HIER`
3. Speichern
4. Server neu starten: `npm run dev`
5. ✅ YouTube-Suche testen!

**Brauchst du Hilfe dabei?** 😊

