# 👨‍👩‍👧‍👦 Familien-Konfiguration

Die Food Flash App ist jetzt so konfiguriert, dass alle Familienmitglieder automatisch von **einer zentralen Gist-URL** laden können!

---

## 🔧 Aktuelle Konfiguration

**Familien-Gist URL:**
```
https://gist.github.com/tubackit/ab2aa98a3c0fd463e82701a616f0dbf6
```

Diese URL ist **fest in der App** konfiguriert (`src/config/gist.ts`).

---

## 🚀 Wie es funktioniert

### **Für den Rezept-Manager (z.B. Mama):**

#### 1. Neue Rezepte hinzufügen
1. In der App: Rezepte wie gewohnt hinzufügen
2. Bewerten, Notizen schreiben, etc.

#### 2. Gist aktualisieren
1. Klicke **"Exportieren"** → JSON-Datei wird heruntergeladen
2. Gehe zu: https://gist.github.com/tubackit/ab2aa98a3c0fd463e82701a616f0dbf6
3. Klicke **"Edit"** (Bearbeiten)
4. **Lösche alten Inhalt komplett**
5. Öffne die Export-Datei und **kopiere ALLES**
6. **Füge ein** in den Gist
7. Klicke **"Update public gist"**
8. ✅ Fertig! Familie kann jetzt aktualisieren

#### 3. Familie informieren
Sende eine Nachricht:
```
Hey! Neue Rezepte online! 🍳
Klickt auf "Familien-Rezepte aktualisieren" in der App!
```

---

### **Für alle Familienmitglieder:**

#### Updates laden (super einfach!)
1. Öffne die App: https://tubackit.github.io/FoodFlash/
2. Gehe zu **"Rezepte"**
3. Klicke auf den **blauen "Familien-Rezepte aktualisieren" Button** ☁️
4. ✅ Neue Rezepte werden automatisch hinzugefügt!
5. Zeigt "Letzter Sync" mit Zeitstempel an

**Das war's!** Nur 1 Klick zum Aktualisieren! 🎉

---

## ⚙️ Konfiguration ändern

### Gist-URL ändern

Wenn du eine neue Gist-URL hast, bearbeite die Datei:
```
src/config/gist.ts
```

Ändere die Zeile:
```typescript
export const FAMILY_GIST_URL = 'DEINE-NEUE-URL'
```

Dann:
```bash
git add .
git commit -m "Update Gist URL"
git push
npm run build
npx gh-pages -d dist
```

### Sync-Button ausblenden

In `src/config/gist.ts`:
```typescript
export const SHOW_SYNC_BUTTON = false  // Button verstecken
```

### Auto-Sync beim Start aktivieren

⚠️ **Nicht empfohlen** - kann eigene Rezepte überschreiben!

In `src/config/gist.ts`:
```typescript
export const AUTO_SYNC_ON_START = true  // Lädt bei jedem App-Start
```

---

## 📋 Workflow für Familien

### **Wochenplan:**

**Sonntag Abend (Rezept-Manager):**
1. Plant die Woche in der App
2. Erstellt Einkaufsliste
3. Exportiert Rezepte
4. Updated den Gist
5. Sendet Nachricht: "Neue Rezepte online! 🍳"

**Montag Morgen (Familie):**
1. Öffnet App
2. Klickt "Familien-Rezepte aktualisieren" ☁️
3. Hat alle neuen Rezepte & Wochenplan-Ideen!

---

## ✨ Vorteile dieser Konfiguration

✅ **1-Klick-Sync** - kein URL eingeben mehr nötig  
✅ **Zeitstempel** - sieht wann zuletzt aktualisiert  
✅ **Automatische Duplikat-Vermeidung** - fügt nur neue Rezepte hinzu  
✅ **Eigene Rezepte bleiben** - werden nicht überschrieben  
✅ **Eigene Bewertungen/Notizen** - bleiben erhalten  

---

## 🔒 Sicherheit

- Gist ist **öffentlich**, aber URL ist schwer zu erraten
- Nur wer die URL kennt, findet den Gist
- Keine persönlichen Daten, nur Rezepte

---

## ❓ FAQ

**Was passiert beim Sync?**
- Nur **neue** Rezepte werden hinzugefügt (prüft URL)
- Bestehende bleiben unverändert
- Deine eigenen Notizen/Bewertungen bleiben

**Kann ich meine eigenen Rezepte behalten?**
- ✅ Ja! Sync fügt nur hinzu, löscht nichts

**Was wenn der Gist gelöscht wird?**
- Button zeigt Fehler
- Lokale Rezepte bleiben erhalten
- Einfach neue Gist-URL in `src/config/gist.ts` eintragen

---

**Viel Spaß mit der Familien-Rezeptsammlung!** 👨‍👩‍👧‍👦🍳

