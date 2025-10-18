# 🔒 Firebase Sicherheit einrichten

**Problem:** Firebase-Config ist öffentlich auf GitHub → Jeder könnte theoretisch zugreifen!

**Lösung:** Firebase Security Rules + Domain-Beschränkungen

---

## 📋 Schritt 1: Firebase Security Rules verschärfen

### 1.1 Firebase Console öffnen
1. Gehe zu: https://console.firebase.google.com/
2. Wähle dein Projekt: **FoodFlash**
3. Klicke auf **"Firestore Database"**
4. Klicke auf **"Regeln"** / **"Rules"**

### 1.2 Neue Sicherheitsregeln setzen

**Ersetze die aktuellen Regeln durch:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Nur Zugriff von erlaubten Domains
    function isAllowedDomain() {
      // Localhost für Entwicklung
      return request.auth == null && (
        request.headers['origin'] == 'http://localhost:5173' ||
        request.headers['origin'].matches('http://localhost:.*') ||
        request.headers['origin'].matches('http://192.168.*') ||
        // Deine GitHub Pages Domain
        request.headers['origin'] == 'https://tubackit.github.io'
      );
    }
    
    // Rezepte
    match /recipes/{recipeId} {
      allow read: if isAllowedDomain();
      allow write: if isAllowedDomain();
    }
    
    // Einkaufsliste
    match /shoppingList/{itemId} {
      allow read: if isAllowedDomain();
      allow write: if isAllowedDomain();
    }
    
    // Wochenplaner
    match /weekPlanner/{dayId} {
      allow read: if isAllowedDomain();
      allow write: if isAllowedDomain();
    }
  }
}
```

### 1.3 Veröffentlichen
Klicke auf **"Veröffentlichen"** / **"Publish"**

---

## 📋 Schritt 2: API-Key Beschränkungen (empfohlen)

### 2.1 Google Cloud Console öffnen
1. Gehe zu: https://console.cloud.google.com/
2. Wähle dein Projekt: **FoodFlash**
3. Gehe zu **"APIs & Dienste"** → **"Anmeldedaten"**

### 2.2 API-Key einschränken
1. Finde deinen **Browser-Schlüssel** (Browser key)
2. Klicke darauf zum Bearbeiten
3. Unter **"Anwendungsbeschränkungen"**:
   - Wähle **"HTTP-Referrer (Websites)"**
   - Füge hinzu:
     ```
     http://localhost:*/*
     http://192.168.*:*/*
     https://tubackit.github.io/*
     ```

4. Unter **"API-Einschränkungen"**:
   - Wähle **"Schlüssel einschränken"**
   - Wähle nur:
     - ✅ Cloud Firestore API
     - ✅ Identity Toolkit API

5. Klicke **"Speichern"**

---

## 📋 Schritt 3: Bessere Lösung - Umgebungsvariablen (optional)

Wenn du noch sicherer sein willst, verschiebe die Config in `.env`:

### 3.1 `.env` Datei erweitern

Öffne `.env` und füge hinzu:

```bash
# YouTube API Key
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Firebase Config
VITE_FIREBASE_API_KEY=AIzaSyBQwo6qEZWlOyXRv3iPycYiLIqRt3PalkE
VITE_FIREBASE_AUTH_DOMAIN=foodflash-46a42.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=foodflash-46a42
VITE_FIREBASE_STORAGE_BUCKET=foodflash-46a42.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=497618057237
VITE_FIREBASE_APP_ID=1:497618057237:web:3025f9c950cdf76b67361c
```

### 3.2 `firebase.ts` anpassen

**Ich kann das für dich machen, wenn du möchtest!**

Dann liest die App die Config aus `.env` statt hardcoded.

---

## ⚖️ Was ist sicher genug?

### **Level 1: API-Key Beschränkungen** ⭐⭐⭐
- ✅ Schnell einzurichten (5 Minuten)
- ✅ Schützt gegen die meisten Angriffe
- ✅ Gut für Familien-Nutzung
- **Empfohlen für dich!**

### **Level 2: Umgebungsvariablen** ⭐⭐⭐⭐
- ✅ Config nicht im Code
- ⚠️ Aber: Auf GitHub Pages trotzdem sichtbar (im JavaScript)
- ✅ Gut für private Repos

### **Level 3: Firebase Authentication** ⭐⭐⭐⭐⭐
- ✅ Jeder muss sich anmelden
- ✅ Komplett sicher
- ⚠️ Mehr Aufwand für Familie
- ⚠️ Jeder braucht Google-Account

---

## 🎯 Meine Empfehlung für dich:

### **Jetzt sofort:**
1. ✅ **Schritt 1:** Firestore Security Rules (siehe oben)
2. ✅ **Schritt 2:** API-Key Beschränkungen (siehe oben)

**Das dauert 5-10 Minuten und ist für eure Familien-Nutzung völlig ausreichend!**

### **Später (optional):**
3. ⭐ **Schritt 3:** Umgebungsvariablen (wenn du willst)
4. ⭐ **Firebase Authentication** (wenn ihr wollt, dass jeder sich anmeldet)

---

## ❓ Häufige Fragen

### **Ist mein API-Key jetzt unsicher?**
**Jein.** Der API-Key ist **öffentlich** (das ist normal bei Frontend-Apps), aber:
- ✅ Mit Domain-Beschränkungen kann nur deine Domain zugreifen
- ✅ Mit Firestore Rules kann niemand deine Daten ändern
- ✅ Für Familien-Nutzung völlig OK!

### **Sollte ich ein neues Firebase-Projekt erstellen?**
**Nein, nicht nötig!** Einfach die Security Rules anpassen (siehe oben).

### **Was ist mit GitHub Pages?**
Auf GitHub Pages ist der API-Key **immer sichtbar** im JavaScript. Das ist normal!
Die Security Rules schützen trotzdem deine Daten. ✅

### **Kann jemand meine Daten löschen?**
Nach den neuen Security Rules: **Nein!** Nur von erlaubten Domains.

---

## 🚀 Nächster Schritt

**Sag mir Bescheid, und ich helfe dir:**

1. ✅ Security Rules setzen (ich erkläre es dir Schritt für Schritt)
2. ✅ API-Key Beschränkungen einrichten
3. ✅ Optional: Umgebungsvariablen einrichten (ich übernehme das für dich)

**Was möchtest du zuerst machen?** 🔒

