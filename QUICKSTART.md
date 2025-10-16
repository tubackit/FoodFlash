# ⚡ FoodFlash - Schnellstart

## 🚀 1. Lokal starten

```bash
# Ins Verzeichnis wechseln
cd /Users/pmac1/Desktop/FoodFlash

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft auf: `http://localhost:5173`

---

## 📤 2. Auf GitHub hochladen

### Schritt 1: Git initialisieren
```bash
git init
git add .
git commit -m "🎉 Initial commit - Food Flash App"
```

### Schritt 2: GitHub Repository erstellen
1. Gehe zu https://github.com/new
2. Repository Name: `FoodFlash`
3. **Public** oder **Private** wählen
4. **NICHT** "Initialize with README" ankreuzen
5. Klicke **"Create repository"**

### Schritt 3: Code pushen
```bash
# ERSETZE 'DEIN-USERNAME' mit deinem GitHub Username!
git remote add origin https://github.com/DEIN-USERNAME/FoodFlash.git
git branch -M main
git push -u origin main
```

---

## 🌐 3. GitHub Pages aktivieren (Optional)

### Schritt 1: vite.config.ts anpassen
Öffne `vite.config.ts` und ändere:
```typescript
base: '/FoodFlash/',  // → Ändere zu deinem Repository-Namen
```

### Schritt 2: In GitHub
1. Gehe zu deinem Repository
2. **Settings** → **Pages**
3. Source: **GitHub Actions**
4. Fertig! Nach 1-2 Minuten ist die App online

Deine App URL: `https://DEIN-USERNAME.github.io/FoodFlash/`

---

## 👨‍👩‍👧‍👦 4. Mit Familie teilen

### Option A: App-Link teilen
```
https://DEIN-USERNAME.github.io/FoodFlash/
```
Jeder nutzt die gleiche App (aber eigene lokale Rezepte)

### Option B: Gist-Cloud nutzen (EMPFOHLEN!)
1. Eine Person erstellt Gist mit Rezepten → siehe `GIST-GUIDE.md`
2. Teilt Gist-URL mit Familie
3. Alle laden von der gleichen URL
4. ✅ Gemeinsame Rezeptsammlung!

---

## 📋 Wichtige Dateien

- **README.md** - Vollständige Dokumentation
- **DEPLOYMENT.md** - Detaillierte Deployment-Anleitung
- **GIST-GUIDE.md** - GitHub Gist für Familien
- **SHARING.md** - Rezepte teilen & Export/Import

---

## ❓ Probleme?

### App startet nicht?
```bash
# Node.js Version prüfen (sollte >= 18 sein)
node --version

# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### GitHub Push schlägt fehl?
```bash
# Stelle sicher, dass du eingeloggt bist
git config --global user.name "Dein Name"
git config --global user.email "deine@email.com"

# Probiere nochmal
git push -u origin main
```

### GitHub Pages zeigt 404?
1. Prüfe `vite.config.ts` → `base` muss richtig sein
2. Commit & Push die Änderung
3. Warte 2-3 Minuten

---

## 🎉 Fertig!

Deine Food Flash App ist jetzt:
- ✅ Auf GitHub
- ✅ Online verfügbar (wenn GitHub Pages aktiviert)
- ✅ Bereit zum Teilen mit der Familie

**Viel Spaß beim Rezepte sammeln!** 🍳⚡

