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
      await addDoc(recipesCollection, {
        ...recipe,
        createdAt: serverTimestamp(),
        ingredients: recipe.ingredients || [],
        comments: recipe.comments || [],
      })
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
      await updateDoc(recipeDoc, updates)
    } catch (error) {
      console.error('Error updating recipe:', error)
      setError('Fehler beim Aktualisieren des Rezepts')
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

