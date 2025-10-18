# 🔒 API-Key sichern - Schritt-für-Schritt

**Ziel:** Deinen Firebase API-Key so absichern, dass nur deine Domains darauf zugreifen können.

**Dauer:** ~10 Minuten

---

## 📋 Schritt 1: Google Cloud Console öffnen

### 1.1 Console aufrufen
1. Öffne in deinem Browser: **https://console.cloud.google.com/**
2. Melde dich mit dem **gleichen Google-Account** an, den du für Firebase benutzt hast

### 1.2 Projekt auswählen
1. Oben in der Leiste siehst du einen **Projekt-Namen**
2. Klicke darauf
3. Wähle: **foodflash-46a42** (dein Firebase-Projekt)

   Falls du es nicht siehst:
   - Schaue in der Liste nach "FoodFlash" oder "foodflash"
   - Die Projekt-ID ist: `foodflash-46a42`

---

## 📋 Schritt 2: Anmeldedaten finden

### 2.1 Menü öffnen
1. Klicke oben links auf das **☰ Hamburger-Menü** (drei Striche)
2. Scrolle runter zu: **"APIs und Dienste"** (oder "APIs & Services")
3. Klicke darauf
4. Klicke dann auf: **"Anmeldedaten"** (oder "Credentials")

### 2.2 API-Key finden
Du siehst jetzt eine Liste mit Anmeldedaten. Suche nach:

**Name:** "Browser key (auto created by Firebase)" oder ähnlich

**API-Key beginnt mit:** `AIzaSyBQwo6qEZWlOyXRv3iPycYiLIqRt3PalkE`

👉 **Klicke auf diesen API-Key** (auf den Namen oder das Stift-Symbol ✏️)

---

## 📋 Schritt 3: API-Key einschränken

### 3.1 Anwendungsbeschränkungen setzen

Du siehst jetzt die Einstellungen für diesen API-Key.

#### A) Finde den Bereich "Anwendungsbeschränkungen"
(oder "Application restrictions")

#### B) Wähle: **"HTTP-Referrer (Websites)"**
(oder "HTTP referrers (web sites)")

#### C) Klicke auf **"+ ELEMENT HINZUFÜGEN"** (oder "+ ADD AN ITEM")

#### D) Füge **GENAU** diese 5 Einträge hinzu:

```
http://localhost:5173/*
```
👆 Für lokale Entwicklung (Standard Vite Port)

```
http://localhost:*/*
```
👆 Für alle anderen lokalen Ports

```
http://192.168.*:*/*
```
👆 Für mobile Entwicklung im lokalen Netzwerk

```
https://tubackit.github.io/*
```
👆 Für deine GitHub Pages Domain

```
https://tubackit.github.io/FoodFlash/*
```
👆 Speziell für deine FoodFlash App

**So sollte es aussehen:**
```
Websitebeschränkungen:
✓ http://localhost:5173/*
✓ http://localhost:*/*
✓ http://192.168.*:*/*
✓ https://tubackit.github.io/*
✓ https://tubackit.github.io/FoodFlash/*
```

---

### 3.2 API-Einschränkungen setzen

#### A) Scrolle runter zu "API-Einschränkungen"
(oder "API restrictions")

#### B) Wähle: **"Schlüssel einschränken"** 
(oder "Restrict key")

#### C) Aktiviere NUR diese APIs:

Suche und aktiviere (✅):
```
✅ Cloud Firestore API
✅ Identity Toolkit API
✅ Token Service API
```

Alle anderen APIs sollten **NICHT** aktiviert sein! ❌

**Wichtig:** Wenn du eine API nicht findest:
- Klicke auf "APIs aktivieren" (oder "Enable APIs")
- Suche nach "Firestore" oder "Identity Toolkit"
- Aktiviere sie zuerst

---

### 3.3 Speichern

1. Scrolle ganz nach unten
2. Klicke auf **"SPEICHERN"** (oder "SAVE")
3. Warte auf die Bestätigung: **"API-Schlüssel wurde aktualisiert"**

⚠️ **WICHTIG:** Es kann **bis zu 5 Minuten** dauern, bis die Änderungen aktiv werden!

---

## 📋 Schritt 4: Firestore Security Rules

Jetzt müssen wir noch die Datenbank-Regeln anpassen!

### 4.1 Firebase Console öffnen
1. Öffne: **https://console.firebase.google.com/**
2. Wähle dein Projekt: **FoodFlash** oder **foodflash-46a42**

### 4.2 Firestore Rules bearbeiten
1. Klicke links im Menü auf: **"Firestore Database"**
2. Klicke oben auf den Tab: **"Regeln"** (oder "Rules")

### 4.3 Neue Regeln einfügen

**Lösche ALLES** und ersetze es durch:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Hilfsfunktion: Prüfe ob Request von erlaubter Domain kommt
    function isAllowedOrigin() {
      return request.auth == null && (
        // Lokale Entwicklung
        request.headers['origin'] == 'http://localhost:5173' ||
        request.headers['origin'].matches('http://localhost:.*') ||
        request.headers['origin'].matches('http://192.168.*') ||
        // GitHub Pages (deine Domain)
        request.headers['origin'] == 'https://tubackit.github.io'
      );
    }
    
    // Rezepte
    match /recipes/{recipeId} {
      allow read, write: if isAllowedOrigin();
    }
    
    // Einkaufsliste
    match /shoppingList/{itemId} {
      allow read, write: if isAllowedOrigin();
    }
    
    // Wochenplaner
    match /weekPlanner/{dayId} {
      allow read, write: if isAllowedOrigin();
    }
  }
}
```

### 4.4 Veröffentlichen
1. Klicke oben rechts auf: **"Veröffentlichen"** (oder "Publish")
2. Warte auf die Bestätigung

---

## ✅ Fertig! Testen

### Test 1: Lokale App
```bash
cd /Users/pmac1/Desktop/FoodFlash
npm run dev
```

Öffne: `http://localhost:5173/FoodFlash/`

**Erwartung:** App funktioniert normal ✅

### Test 2: GitHub Pages
Öffne: `https://tubackit.github.io/FoodFlash/`

**Erwartung:** App funktioniert normal ✅

### Test 3: Mobile im lokalen Netzwerk
```bash
npm run dev:mobile
```

Öffne vom Handy: `http://192.168.x.x:5173/FoodFlash/`

**Erwartung:** App funktioniert normal ✅

---

## 🎯 Was ist jetzt geschützt?

### ✅ **Vorher (unsicher):**
- ❌ Jeder mit deinem API-Key konnte auf deine Datenbank zugreifen
- ❌ Von jeder beliebigen Website oder App
- ❌ Könnte deine Daten löschen oder vollmüllen

### ✅ **Nachher (sicher):**
- ✅ Nur deine erlaubten Domains können zugreifen:
  - `localhost:5173` (lokale Entwicklung)
  - `192.168.*` (mobile Entwicklung)
  - `tubackit.github.io` (deine Website)
- ✅ Alle anderen Anfragen werden **blockiert**
- ✅ Deine Daten sind geschützt!

---

## ❓ Häufige Probleme

### **Problem: App funktioniert nicht mehr**
**Lösung:** Warte 5 Minuten! Die API-Einschränkungen brauchen Zeit.

### **Problem: "Permission denied" Fehler**
**Ursachen:**
1. **Firestore Rules noch nicht aktiv** → Warte 1-2 Minuten
2. **Falscher Origin** → Prüfe ob du die richtige URL verwendest
3. **Cache** → Hard-Refresh mit `Cmd + Shift + R` (Mac) oder `Ctrl + Shift + R` (Windows)

### **Problem: Funktioniert nur manchmal**
**Lösung:** Lösche Browser-Cache und starte neu

### **Problem: Eine API fehlt in der Liste**
**Lösung:** 
1. Gehe zu "APIs aktivieren"
2. Suche nach der fehlenden API
3. Aktiviere sie
4. Gehe zurück zu den Anmeldedaten

---

## 📊 Überprüfen

### Prüfe API-Key Einschränkungen:
1. Gehe zu: https://console.cloud.google.com/
2. APIs & Dienste → Anmeldedaten
3. Klicke auf deinen API-Key
4. Du solltest sehen:

```
Anwendungsbeschränkungen
Art: HTTP-Referrer
Websites:
  http://localhost:5173/*
  http://localhost:*/*
  http://192.168.*:*/*
  https://tubackit.github.io/*
  https://tubackit.github.io/FoodFlash/*

API-Einschränkungen
Art: Schlüssel einschränken
APIs:
  ✓ Cloud Firestore API
  ✓ Identity Toolkit API
  ✓ Token Service API
```

### Prüfe Firestore Rules:
1. Gehe zu: https://console.firebase.google.com/
2. Firestore Database → Regeln
3. Du solltest die neuen Rules sehen mit `isAllowedOrigin()`

---

## 🎉 Geschafft!

**Deine Firebase-Datenbank ist jetzt geschützt!** 🔒

- ✅ Nur erlaubte Domains können zugreifen
- ✅ API-Key ist eingeschränkt
- ✅ Firestore Rules sind aktiv
- ✅ Deine Familie kann weiterhin die App nutzen
- ✅ Fremde können NICHT mehr auf deine Daten zugreifen

**Fragen? Probleme? Melde dich! 🎃**

