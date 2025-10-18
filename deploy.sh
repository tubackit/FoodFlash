#!/bin/bash

# 🚀 FoodFlash Auto-Deploy Script
# Dieses Script committed, pusht und deployed automatisch zu GitHub Pages

echo "🚀 FoodFlash Auto-Deploy gestartet..."
echo ""

# 1. Git Status anzeigen
echo "📊 Git Status:"
git status --short
echo ""

# 2. Frage nach Commit-Message
read -p "💬 Commit-Nachricht (oder Enter für 'Update'): " commit_msg
if [ -z "$commit_msg" ]; then
  commit_msg="Update"
fi
echo ""

# 3. Git Add
echo "➕ Füge Änderungen hinzu..."
git add .
echo "✅ Fertig"
echo ""

# 4. Git Commit
echo "💾 Erstelle Commit..."
git commit -m "$commit_msg"
if [ $? -ne 0 ]; then
  echo "⚠️  Nichts zu committen oder Fehler beim Commit"
  echo ""
fi
echo ""

# 5. Git Push
echo "⬆️  Pushe zu GitHub..."
git push origin main
if [ $? -ne 0 ]; then
  echo "❌ Push fehlgeschlagen!"
  exit 1
fi
echo "✅ Push erfolgreich"
echo ""

# 6. Deploy zu GitHub Pages
echo "🌐 Deploye zu GitHub Pages..."
npm run deploy
if [ $? -ne 0 ]; then
  echo "❌ Deployment fehlgeschlagen!"
  exit 1
fi
echo ""

# 7. Fertig!
echo "🎉 FERTIG!"
echo ""
echo "📱 Deine Änderungen sind jetzt live auf:"
echo "   https://tubackit.github.io/FoodFlash/"
echo ""
echo "⏱️  Warte 1-2 Minuten, dann aktualisiere die Seite im Browser."
echo ""

