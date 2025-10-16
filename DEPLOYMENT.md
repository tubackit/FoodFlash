# 🚀 Food Flash Deployment Anleitung

## 📦 App auf GitHub Pages hosten

### Schritt 1: Repository auf GitHub erstellen
1. Gehe zu [github.com](https://github.com) und logge dich ein
2. Klicke auf "New repository" (Neues Repository)
3. Repository Name: `FoodFlash`
4. Wähle: **Public** (öffentlich)
5. **NICHT** "Initialize with README" ankreuzen
6. Klicke "Create repository"

### Schritt 2: Code zu GitHub pushen
Öffne das Terminal in deinem Projekt-Ordner und führe aus:

```bash
# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Initial commit - Food Flash App"

# GitHub Repository als Remote hinzufügen (ERSETZE 'DEIN-USERNAME')
git remote add origin https://github.com/DEIN-USERNAME/FoodFlash.git

# Branch umbenennen zu main (falls nötig)
git branch -M main

# Code zu GitHub pushen
git push -u origin main
```

### Schritt 3: GitHub Pages aktivieren
1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **"Settings"** (Einstellungen)
3. In der linken Sidebar: Klicke auf **"Pages"**
4. Bei "Build and deployment":
   - Source: **GitHub Actions** auswählen
5. Fertig! Die Workflow-Datei wird automatisch erkannt

### Schritt 4: Deployment prüfen
1. Gehe zu **"Actions"** Tab in deinem Repository
2. Warte bis der Workflow ✅ grün ist (ca. 1-2 Minuten)
3. Deine App ist jetzt live unter: `https://DEIN-USERNAME.github.io/FoodFlash/`

---

## 👨‍👩‍👧‍👦 Mit der Familie nutzen

### Option A: Jeder hat seine eigenen Rezepte
- Teile den Link: `https://DEIN-USERNAME.github.io/FoodFlash/`
- Jede Person speichert ihre Rezepte lokal im Browser
- ❌ Rezepte werden NICHT geteilt

### Option B: Rezepte teilen (Export/Import) - EMPFOHLEN
Die App hat eine Export/Import-Funktion (wird als nächstes implementiert):
1. Person A exportiert ihre Rezepte als JSON-Datei
2. Teilt die Datei via WhatsApp/E-Mail/Drive
3. Person B importiert die Datei
4. ✅ Rezepte sind jetzt bei beiden!

---

## 🔄 App aktualisieren

Wenn du Änderungen machst:

```bash
git add .
git commit -m "Beschreibung der Änderung"
git push
```

Die App wird automatisch neu deployed! (ca. 1-2 Minuten)

---

## 🌐 Alternative Hosting-Optionen

### Vercel (Empfohlung für Anfänger)
1. Gehe zu [vercel.com](https://vercel.com)
2. "Sign up" mit GitHub
3. "Import Project" → Wähle dein FoodFlash Repository
4. Klicke "Deploy"
5. Fertig! URL wird automatisch erstellt

### Netlify
1. Gehe zu [netlify.com](https://netlify.com)
2. "Sign up" mit GitHub
3. "Add new site" → "Import an existing project"
4. Wähle GitHub → FoodFlash Repository
5. Build settings werden automatisch erkannt
6. "Deploy site"

---

## ⚠️ Wichtige Hinweise

1. **vite.config.ts anpassen**: 
   - Ändere `base: '/FoodFlash/'` zu deinem tatsächlichen Repository-Namen

2. **LocalStorage**: 
   - Daten bleiben lokal im Browser
   - Beim Browser-Cache löschen gehen Daten verloren
   - Regelmäßig Export-Funktion nutzen!

3. **Für echtes Teilen**:
   - Später kann ein Backend (z.B. Firebase, Supabase) hinzugefügt werden
   - Dann können alle auf die gleichen Rezepte zugreifen

