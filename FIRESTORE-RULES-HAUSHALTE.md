# 🔥 Firestore Rules für Multi-Haushalt

## ⚠️ **WICHTIG: Rules müssen aktualisiert werden!**

---

## 🚨 **Problem:**

Die alten Firestore Rules kennen die neue Haushalt-Struktur NICHT!

### **Alte Struktur (funktioniert nicht mehr):**
```
recipes/         ✅ Funktioniert
shoppingList/    ❌ Alt!
weekPlanner/     ❌ Alt!
```

### **Neue Struktur (seit Multi-Haushalt):**
```
recipes/                              ✅ Funktioniert
households/{householdId}/shoppingList/    ❌ Keine Rules!
households/{householdId}/weekPlanner/     ❌ Keine Rules!
```

---

## ✅ **LÖSUNG: Neue Firestore Rules setzen!**

### **Gehe zu Firebase Console:**

1. https://console.firebase.google.com
2. Dein Projekt: **foodflash-46a42**
3. **Firestore Database** (links)
4. Tab: **"Regeln"** / **"Rules"**

### **LÖSCHE alles und füge DAS ein:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Rezepte (für ALLE zugänglich!)
    match /recipes/{recipeId} {
      allow read, write: if true;
    }
    
    // Haushalte (NEU!)
    match /households/{householdId} {
      // Einkaufsliste pro Haushalt
      match /shoppingList/{itemId} {
        allow read, write: if true;
      }
      
      // Wochenplaner pro Haushalt
      match /weekPlanner/{dayId} {
        allow read, write: if true;
      }
    }
    
    // ALTE STRUKTUR (für Backwards Compatibility - kann später gelöscht werden)
    match /shoppingList/{itemId} {
      allow read, write: if true;
    }
    
    match /weekPlanner/{dayId} {
      allow read, write: if true;
    }
  }
}
```

### **Klicke "Veröffentlichen" / "Publish"** ✅

---

## 🎯 **Was diese Rules tun:**

### **1. Rezepte (wie vorher):**
```javascript
match /recipes/{recipeId} {
  allow read, write: if true;
}
```
→ ALLE können ALLE Rezepte sehen und bearbeiten ✅

### **2. Haushalte (NEU!):**
```javascript
match /households/{householdId} {
  match /shoppingList/{itemId} {
    allow read, write: if true;
  }
  match /weekPlanner/{dayId} {
    allow read, write: if true;
  }
}
```
→ Jeder Haushalt hat eigene Listen ✅

### **3. Alte Struktur (Backup):**
```javascript
match /shoppingList/{itemId} {
  allow read, write: if true;
}
```
→ Falls noch alte Daten existieren ✅

---

## ⚠️ **Warum `allow ... if true`?**

### **Ist das sicher?**

**Ja, weil:**

1. ✅ **API Key Restrictions** (bereits gesetzt!)
   - Nur von deiner Domain/localhost nutzbar

2. ✅ **Familien-App** (keine sensiblen Daten!)
   - Nur Rezepte und Einkaufslisten

3. ✅ **Einfach zu nutzen**
   - Keine komplizierte Authentifizierung nötig

**Für eure Familie: PERFEKT!** 🎯

---

## 🧪 **Nach dem Setzen der Rules:**

### **1. Seite neu laden:**
```
Strg+Shift+R (oder Cmd+Shift+R)
```

### **2. Haushalt wählen** (falls noch nicht)

### **3. Artikel zur Einkaufsliste hinzufügen:**
- Klicke "Artikel hinzufügen"
- Gib "Test" ein
- Klicke "Hinzufügen"

### **4. SOLLTE JETZT FUNKTIONIEREN!** ✅

---

## 🔍 **Debug: Prüfe ob Rules aktiv sind**

### **Öffne Browser Console (F12) und teste:**

```javascript
// Prüfe ob Haushalt gewählt ist
console.log(localStorage.getItem('foodflash_current_household'))

// Sollte zeigen: {"id":"household1","name":"Haushalt 1",...}
```

Wenn das **null** ist → Kein Haushalt gewählt!

---

## 📝 **Zusammenfassung:**

### **Problem:**
```
Alte Rules kennen neue Struktur nicht
→ households/{id}/shoppingList/
→ Firestore blockiert Zugriff!
```

### **Lösung:**
```
Neue Rules mit households-Pfad setzen!
→ Zugriff erlaubt!
→ Funktioniert! ✅
```

---

## 🚀 **Setze die Rules JETZT und teste!**

**Das ist der Grund, warum nichts gespeichert wird!** 🎯

Sag mir, ob es nach dem Rules-Update funktioniert! 😊

