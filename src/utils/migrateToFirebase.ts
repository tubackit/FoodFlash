/**
 * Migration von localStorage zu Firebase
 * Wird automatisch beim ersten Laden ausgeführt
 */

import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Recipe } from '../types/recipe'

const MIGRATION_FLAG = 'foodflash_migrated_to_firebase'

export const migrateLocalDataToFirebase = async () => {
  // Prüfe ob bereits migriert wurde
  if (localStorage.getItem(MIGRATION_FLAG)) {
    console.log('✅ Daten bereits zu Firebase migriert')
    return
  }

  console.log('🔄 Starte Migration von localStorage zu Firebase...')

  try {
    // 1. Rezepte migrieren
    await migrateRecipes()

    // 2. Einkaufsliste migrieren
    await migrateShoppingList()

    // 3. Wochenplaner migrieren (optional)
    // await migrateWeekPlanner()

    // Migration als abgeschlossen markieren
    localStorage.setItem(MIGRATION_FLAG, 'true')
    console.log('✅ Migration erfolgreich abgeschlossen!')

    // Optional: localStorage-Daten als Backup behalten
    // Wenn du sie löschen willst, kommentiere die nächsten Zeilen ein:
    // localStorage.removeItem('foodflash_recipes')
    // localStorage.removeItem('foodflash_shopping')
    // localStorage.removeItem('foodflash_weekplan')
  } catch (error) {
    console.error('❌ Fehler bei Migration:', error)
    throw error
  }
}

async function migrateRecipes() {
  const recipesJson = localStorage.getItem('foodflash_recipes')
  if (!recipesJson) {
    console.log('ℹ️ Keine Rezepte in localStorage gefunden')
    return
  }

  const localRecipes: Recipe[] = JSON.parse(recipesJson)
  
  if (localRecipes.length === 0) {
    console.log('ℹ️ Keine Rezepte zum Migrieren')
    return
  }

  // Prüfe ob Firebase bereits Daten hat
  const recipesCollection = collection(db, 'recipes')
  const existingRecipes = await getDocs(recipesCollection)
  
  if (existingRecipes.size > 0) {
    console.log('ℹ️ Firebase hat bereits Rezepte, überspringe Migration')
    return
  }

  console.log(`📦 Migriere ${localRecipes.length} Rezepte...`)

  for (const recipe of localRecipes) {
    const { id, createdAt, ...recipeData } = recipe
    
    await addDoc(recipesCollection, {
      ...recipeData,
      ingredients: recipe.ingredients || [],
      comments: recipe.comments || [],
      createdAt: serverTimestamp(),
    })
  }

  console.log(`✅ ${localRecipes.length} Rezepte migriert`)
}

async function migrateShoppingList() {
  const shoppingJson = localStorage.getItem('foodflash_shopping')
  if (!shoppingJson) {
    console.log('ℹ️ Keine Einkaufsliste in localStorage gefunden')
    return
  }

  const localItems = JSON.parse(shoppingJson)
  
  if (localItems.length === 0) {
    console.log('ℹ️ Keine Einkaufsartikel zum Migrieren')
    return
  }

  // Prüfe ob Firebase bereits Daten hat
  const shoppingCollection = collection(db, 'shoppingList')
  const existingItems = await getDocs(shoppingCollection)
  
  if (existingItems.size > 0) {
    console.log('ℹ️ Firebase hat bereits Einkaufsliste, überspringe Migration')
    return
  }

  console.log(`🛒 Migriere ${localItems.length} Einkaufsartikel...`)

  for (const item of localItems) {
    const { id, ...itemData } = item
    
    await addDoc(shoppingCollection, {
      ...itemData,
      addedAt: serverTimestamp(),
    })
  }

  console.log(`✅ ${localItems.length} Artikel migriert`)
}

// Optional: Manuelle Migration erzwingen
export const forceReMigration = async () => {
  localStorage.removeItem(MIGRATION_FLAG)
  await migrateLocalDataToFirebase()
}

