/**
 * Migration von localStorage zu Firebase
 * Wird automatisch beim ersten Laden ausgeführt
 */

import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Recipe } from '../types/recipe'

const MIGRATION_FLAG = 'foodflash_migrated_to_firebase'
const STORAGE_KEY = 'foodflash_recipes'

export const migrateLocalDataToFirebase = async () => {
  console.log('🔄 Überprüfe Migration-Status...')

  try {
    // Immer prüfen, ob localStorage-Rezepte vorhanden sind
    const recipesJson = localStorage.getItem(STORAGE_KEY)
    
    if (!recipesJson) {
      console.log('ℹ️ Keine localStorage-Rezepte gefunden')
      if (!localStorage.getItem(MIGRATION_FLAG)) {
        localStorage.setItem(MIGRATION_FLAG, 'true')
      }
      return
    }

    const localRecipes: Recipe[] = JSON.parse(recipesJson)
    
    if (localRecipes.length === 0) {
      console.log('ℹ️ localStorage ist leer')
      if (!localStorage.getItem(MIGRATION_FLAG)) {
        localStorage.setItem(MIGRATION_FLAG, 'true')
      }
      return
    }

    // Hole alle Firebase-Rezepte
    const recipesCollection = collection(db, 'recipes')
    const firebaseSnapshot = await getDocs(recipesCollection)
    
    // Erstelle ein Set mit allen Firebase-Rezept-URLs für schnellen Lookup
    const firebaseRecipeUrls = new Set<string>()
    firebaseSnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.url) {
        firebaseRecipeUrls.add(data.url)
      }
    })

    // Finde Rezepte, die nicht in Firebase sind
    const recipesToMigrate = localRecipes.filter(recipe => {
      // Wenn kein URL, vergleiche Titel + Plattform
      if (!recipe.url || recipe.url.trim() === '') {
        // Prüfe, ob ein ähnliches Rezept existiert
        const similar = Array.from(firebaseSnapshot.docs).some(doc => {
          const data = doc.data()
          return data.title === recipe.title && data.platform === recipe.platform
        })
        return !similar
      }
      // Wenn URL vorhanden, prüfe URL
      return !firebaseRecipeUrls.has(recipe.url)
    })

    if (recipesToMigrate.length === 0) {
      console.log('✅ Alle localStorage-Rezepte sind bereits in Firebase')
      localStorage.setItem(MIGRATION_FLAG, 'true')
      return
    }

    console.log(`📦 Migriere ${recipesToMigrate.length} fehlende Rezepte zu Firebase...`)

    // Migriere fehlende Rezepte
    for (const recipe of recipesToMigrate) {
      const { id, createdAt, ...recipeData } = recipe
      
      try {
        await addDoc(recipesCollection, {
          ...recipeData,
          ingredients: recipe.ingredients || [],
          comments: recipe.comments || [],
          rating: recipe.rating || undefined,
          notes: recipe.notes || '',
          createdAt: serverTimestamp(),
        })
      } catch (error) {
        console.error(`❌ Fehler beim Migrieren von Rezept "${recipe.title}":`, error)
      }
    }

    console.log(`✅ ${recipesToMigrate.length} Rezepte erfolgreich migriert!`)
    
    // 2. Einkaufsliste migrieren
    await migrateShoppingList()

    // Migration als abgeschlossen markieren
    localStorage.setItem(MIGRATION_FLAG, 'true')
    
    // WICHTIG: localStorage-Rezepte LÖSCHEN um ID-Konflikte zu vermeiden!
    console.log('🗑️ Lösche alte localStorage-Rezepte (haben falsche IDs)...')
    localStorage.removeItem(STORAGE_KEY)
    console.log('✅ localStorage bereinigt - App verwendet jetzt nur noch Firebase-Daten')
    
  } catch (error) {
    console.error('❌ Fehler bei Migration:', error)
    // Bei Fehler nicht als abgeschlossen markieren, damit es beim nächsten Mal erneut versucht wird
  }
}

async function migrateRecipes() {
  // Diese Funktion wird nicht mehr direkt verwendet
  // Logik ist jetzt in migrateLocalDataToFirebase integriert
  console.log('ℹ️ migrateRecipes() ist deprecated')
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

// Manuelle Re-Migration: Überprüft localStorage und migriert fehlende Rezepte
export const forceReMigration = async () => {
  console.log('🔄 Erzwinge Re-Migration...')
  localStorage.removeItem(MIGRATION_FLAG)
  await migrateLocalDataToFirebase()
  console.log('✅ Re-Migration abgeschlossen')
}

// Überprüft, ob localStorage-Rezepte existieren, die nicht in Firebase sind
export const checkMigrationStatus = async (): Promise<{ 
  localCount: number
  firebaseCount: number
  needsMigration: boolean
  unmigrated: number
}> => {
  const recipesJson = localStorage.getItem(STORAGE_KEY)
  if (!recipesJson) {
    return { localCount: 0, firebaseCount: 0, needsMigration: false, unmigrated: 0 }
  }

  const localRecipes: Recipe[] = JSON.parse(recipesJson)
  const recipesCollection = collection(db, 'recipes')
  const firebaseSnapshot = await getDocs(recipesCollection)
  
  const firebaseRecipeUrls = new Set<string>()
  firebaseSnapshot.forEach((doc) => {
    const data = doc.data()
    if (data.url) {
      firebaseRecipeUrls.add(data.url)
    }
  })

  const unmigrated = localRecipes.filter(recipe => {
    if (!recipe.url || recipe.url.trim() === '') {
      const similar = Array.from(firebaseSnapshot.docs).some(doc => {
        const data = doc.data()
        return data.title === recipe.title && data.platform === recipe.platform
      })
      return !similar
    }
    return !firebaseRecipeUrls.has(recipe.url)
  }).length

  return {
    localCount: localRecipes.length,
    firebaseCount: firebaseSnapshot.size,
    needsMigration: unmigrated > 0,
    unmigrated
  }
}

