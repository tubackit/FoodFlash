# 🏠 Multi-Haushalt Support

## 🎉 **NEU: Jeder Haushalt eigene Listen!**

---

## ✅ **Was ist neu?**

### **Problem gelöst:**
```
VORHER: ❌
1 Einkaufsliste für ALLE
→ Du siehst Omas Zucker
→ Oma sieht deine Milch
→ CHAOS! 😵

JETZT: ✅
Jeder Haushalt eigene Liste!
→ Du siehst nur DEINE Sachen
→ Oma sieht nur IHRE Sachen
→ PERFEKT! 🎯
```

---

## 🏘️ **Wie funktioniert es?**

### **Beim ersten Start:**

1. **Modal erscheint automatisch:**
```
┌─────────────────────────────────────┐
│  🏠 Willkommen bei FoodFlash!       │
│                                     │
│  Welcher Haushalt bist du?          │
│                                     │
│  [ ] 🏠 Haushalt 1                 │
│  [ ] 🏡 Haushalt 2                 │
│  [ ] 🏘️ Haushalt 3                 │
│                                     │
│         [ Auswählen ]               │
└─────────────────────────────────────┘
```

2. **Wähle deinen Haushalt**
3. **Fertig!** ✅ Wird gespeichert

---

## 🔄 **Haushalt wechseln:**

### **Oben links im Header:**
```
🏠 Haushalt 1 ▼  ← Klicken!

Dropdown:
┌─────────────────┐
│ 🏠 Haushalt 1  │ ← Aktuell
│ 🏡 Haushalt 2  │
│ 🏘️ Haushalt 3  │
└─────────────────┘
```

**So einfach!** ✅

---

## 📊 **Was ist getrennt?**

### **Jeder Haushalt HAT:**

1. ✅ **Eigene Einkaufsliste** 🛒
   - Du siehst nur DEINE Artikel
   - Oma sieht nur IHRE Artikel

2. ✅ **Eigener Wochenplaner** 📅
   - Du planst DEINE Woche
   - Oma plant IHRE Woche

---

## 🎯 **Was bleibt geteilt?**

### **ALLE Haushalte TEILEN:**

1. ✅ **ALLE Rezepte!** 📖
   - Du fügst Rezept hinzu → **ALLE sehen es!**
   - Oma fügt Rezept hinzu → **ALLE sehen es!**
   - **Perfekt zum Teilen!** 🎉

---

## 💡 **Praktisches Beispiel:**

### **3 Haushalte in deiner Familie:**

#### **Haushalt 1 (Du):**
```
Einkaufsliste:
✅ Milch
✅ Brot
✅ Eier

Wochenplaner:
Mo: Pasta Carbonara
Di: Pizza

Rezepte:
→ Sieht ALLE Rezepte! (eigene + Oma + Schwester)
```

#### **Haushalt 2 (Oma):**
```
Einkaufsliste:
✅ Zucker
✅ Mehl
✅ Butter

Wochenplaner:
Mo: Apfelkuchen
Di: Suppe

Rezepte:
→ Sieht ALLE Rezepte! (eigene + Du + Schwester)
```

#### **Haushalt 3 (Schwester):**
```
Einkaufsliste:
✅ Tomaten
✅ Pasta
✅ Käse

Wochenplaner:
Mo: Salat
Di: Burger

Rezepte:
→ Sieht ALLE Rezepte! (eigene + Du + Oma)
```

---

## 🔥 **Vorteile:**

### **1. Keine Verwirrung mehr!** ✅
```
VORHER: "Wer hat Milch auf die Liste geschrieben?"
JETZT:  Jeder sieht nur seine Liste!
```

### **2. Jeder plant selbst!** ✅
```
VORHER: "Warum steht Montag Pizza? Wir kochen doch Suppe!"
JETZT:  Jeder Haushalt eigener Wochenplan!
```

### **3. Rezepte trotzdem geteilt!** ✅
```
Omas Apfelkuchen? → ALLE sehen ihn!
Deine Pasta? → ALLE sehen sie!
```

---

## 🛠️ **Technische Details:**

### **Datenstruktur in Firebase:**

```
Firebase:
  - recipes/                    → FÜR ALLE! ✅
    - recipe1
    - recipe2
    
  - households/
    - household1/               → NUR HAUSHALT 1
      - shoppingList/
        - item1
        - item2
      - weekPlanner/
        - monday
        - tuesday
        
    - household2/               → NUR HAUSHALT 2
      - shoppingList/
      - weekPlanner/
      
    - household3/               → NUR HAUSHALT 3
      - shoppingList/
      - weekPlanner/
```

---

## 📱 **Auf jedem Gerät:**

### **localStorage speichert Auswahl:**

```
Dein Computer: Haushalt 1
Omas Tablet: Haushalt 2
Schwestern Handy: Haushalt 3

→ Jeder sieht automatisch SEINE Listen!
→ Aber ALLE Rezepte werden geteilt! ✅
```

---

## ⚙️ **Haushalt umbenennen?**

### **Aktuell:**
```
Haushalt 1 = "Haushalt 1"
Haushalt 2 = "Haushalt 2"
Haushalt 3 = "Haushalt 3"
```

### **Du kannst umbenennen in Code:**

Datei: `src/types/household.ts`

```typescript
export const DEFAULT_HOUSEHOLDS: Household[] = [
  {
    id: 'household1',
    name: 'Patrick', // ← HIER ÄNDERN!
    icon: '🏠',
    color: 'bg-blue-600',
  },
  {
    id: 'household2',
    name: 'Oma Helga', // ← HIER ÄNDERN!
    icon: '🏡',
    color: 'bg-green-600',
  },
  {
    id: 'household3',
    name: 'Schwester Anna', // ← HIER ÄNDERN!
    icon: '🏘️',
    color: 'bg-purple-600',
  },
]
```

Dann: `npm run deploy`

---

## 🎯 **Häufige Fragen (FAQ):**

### **Q: Muss jeder einen Haushalt wählen?**
**A:** Ja! Beim ersten Öffnen der App.

### **Q: Kann ich den Haushalt wechseln?**
**A:** Ja! Oben links im Header → Dropdown.

### **Q: Sieht Oma meine Einkaufsliste?**
**A:** Nein! Jeder Haushalt eigene Liste.

### **Q: Sieht Oma meine Rezepte?**
**A:** Ja! Rezepte sind für ALLE! ✅

### **Q: Was passiert wenn ich Browser-Daten lösche?**
**A:** Du musst den Haushalt neu wählen.

### **Q: Kann ich mehr als 3 Haushalte haben?**
**A:** Ja! Einfach in `household.ts` mehr hinzufügen.

### **Q: Kosten mehr Haushalte Geld?**
**A:** Nein! Alles kostenlos im Firebase-Plan!

---

## 💰 **Kosten:**

### **Für 3 Haushalte:**

```
Firebase Firestore:
- Rezepte: ~1 MB (geteilt)
- Haushalt 1: ~100 KB (Listen)
- Haushalt 2: ~100 KB (Listen)
- Haushalt 3: ~100 KB (Listen)
= ca. 1.3 MB von 5.000 MB

Kosten: €0.00 ✅
```

**Selbst mit 10 Haushalten noch kostenlos!** 🎯

---

## 🚀 **Jetzt nutzen:**

### **Online:**
```
https://tubackit.github.io/FoodFlash/
```

### **Lokal:**
```bash
npm run dev        # Computer
npm run dev:mobile # Handy im WLAN
```

---

## 🎉 **FERTIG!**

**Jetzt hat jeder Haushalt eigene Listen!**

**Aber Rezepte bleiben geteilt!** 👨‍👩‍👧‍👦

**Perfekte Familien-Lösung!** 🏠✨

---

## 💡 **Tipp:**

Beim ersten Öffnen:
1. **Du:** Wähle Haushalt 1
2. **Oma:** Wähle Haushalt 2 (auf ihrem Gerät)
3. **Schwester:** Wähle Haushalt 3 (auf ihrem Gerät)

**Dann funktioniert alles automatisch!** 🎯

**Happy Cooking! 👨‍🍳🎉**

