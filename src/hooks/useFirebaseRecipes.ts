import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Recipe } from '../types/recipe'

export const useFirebaseRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time listener for recipes
  useEffect(() => {
    // ULTRA-FIX: Lösche localStorage-Rezepte SOFORT beim Start!
    const localRecipes = localStorage.getItem('foodflash_recipes')
    const migrationFlag = localStorage.getItem('foodflash_migrated_to_firebase')
    
    if (localRecipes && migrationFlag === 'true') {
      console.warn('🗑️ ULTRA-FIX: Migration ist abgeschlossen, lösche alte localStorage-Rezepte JETZT!')
      localStorage.removeItem('foodflash_recipes')
      console.warn('✅ localStorage gelöscht - ERZWINGE HARD RELOAD!')
      
      // HARD RELOAD um React State zu leeren!
      setTimeout(() => {
        window.location.reload()
      }, 500)
      return // Verhindere, dass der Rest des Codes ausgeführt wird
    }

    const recipesCollection = collection(db, 'recipes')
    const recipesQuery = query(recipesCollection, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      recipesQuery,
      (snapshot) => {
        const recipesData: Recipe[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          recipesData.push({
            id: doc.id,
            ...data,
            // Ensure ingredients array exists (backwards compatibility)
            ingredients: data.ingredients || [],
            comments: data.comments || [],
            // Convert Firestore Timestamp to ISO string
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as Recipe)
        })
        setRecipes(recipesData)
        setIsLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching recipes:', error)
        setError('Fehler beim Laden der Rezepte')
        setIsLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Add a new recipe
  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    try {
      const recipesCollection = collection(db, 'recipes')
      
      // Remove undefined values (Firestore doesn't accept them)
      const cleanRecipe: Record<string, unknown> = {
        ...recipe,
        createdAt: serverTimestamp(),
        ingredients: recipe.ingredients || [],
        comments: recipe.comments || [],
      }
      
      // Remove undefined fields
      Object.keys(cleanRecipe).forEach(key => {
        if (cleanRecipe[key] === undefined) {
          delete cleanRecipe[key]
        }
      })
      
      await addDoc(recipesCollection, cleanRecipe)
    } catch (error) {
      console.error('Error adding recipe:', error)
      setError('Fehler beim Hinzufügen des Rezepts')
      throw error
    }
  }

  // Update an existing recipe
  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      const recipeDoc = doc(db, 'recipes', id)
      
      // Remove undefined values (Firestore doesn't accept them)
      const cleanUpdates: Record<string, unknown> = { ...updates }
      Object.keys(cleanUpdates).forEach(key => {
        if (cleanUpdates[key] === undefined) {
          delete cleanUpdates[key]
        }
      })
      
      await updateDoc(recipeDoc, cleanUpdates)
    } catch (error: unknown) {
      console.error('Error updating recipe:', error)
      
      // Überprüfe, ob das Rezept nicht existiert
      const errorMessage = (error as { message?: string }).message || ''
      if (errorMessage.includes('NOT_FOUND') || errorMessage.includes('No document')) {
        console.error('⚠️ Rezept existiert nicht in Firebase! ID:', id)
        console.error('🔧 Dieses Rezept wurde bereits migriert und sollte nicht mehr angezeigt werden.')
        
        // Zeige hilfreiche Fehlermeldung - KEIN automatischer Reload mehr!
        setError('Dieses Rezept existiert nicht in Firebase')
        alert('⚠️ Dieses Rezept hat eine veraltete ID.\n\n' +
          'Bitte kontaktiere den Support oder starte die App neu.')
      } else {
        setError('Fehler beim Aktualisieren des Rezepts')
      }
      throw error
    }
  }

  // Delete a recipe
  const deleteRecipe = async (id: string) => {
    try {
      const recipeDoc = doc(db, 'recipes', id)
      await deleteDoc(recipeDoc)
    } catch (error) {
      console.error('Error deleting recipe:', error)
      setError('Fehler beim Löschen des Rezepts')
      throw error
    }
  }

  return {
    recipes,
    isLoading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  }
}

