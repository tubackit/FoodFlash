import { useState, useEffect } from 'react'
import { Recipe, Ingredient } from '../types/recipe'

const STORAGE_KEY = 'foodflash_recipes'

// Load initial recipes from localStorage
const loadRecipes = (): Recipe[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const recipes = JSON.parse(stored) as Recipe[]
    // Migrate old recipes without comments/ingredients array
    return recipes.map(recipe => ({
      ...recipe,
      comments: recipe.comments || [],
      ingredients: recipe.ingredients || []
    }))
  } catch (error) {
    console.error('Error loading recipes:', error)
    return []
  }
}

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipes)

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
  }, [recipes])

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'comments' | 'ingredients'> & { ingredients?: Ingredient[] } | Recipe) => {
    // Check if it's already a complete recipe (from import)
    const isCompleteRecipe = 'id' in recipe && 'createdAt' in recipe && 'comments' in recipe
    
    const newRecipe: Recipe = isCompleteRecipe
      ? (recipe as Recipe)
      : {
          ...recipe,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          comments: [],
          ingredients: recipe.ingredients || [],
        }
    
    setRecipes((prev) => [newRecipe, ...prev])
  }

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
  }

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === id ? { ...recipe, ...updates } : recipe))
    )
  }

  return {
    recipes,
    addRecipe,
    deleteRecipe,
    updateRecipe,
  }
}

