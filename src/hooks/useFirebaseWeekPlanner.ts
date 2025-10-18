import { useState, useEffect } from 'react'
import {
  collection,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface PlannedMeal {
  recipeId: string
  recipeTitle: string
  mealType: MealType
}

export interface DayPlan {
  date: string // YYYY-MM-DD format
  meals: PlannedMeal[]
}

export const useFirebaseWeekPlanner = () => {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time listener for week planner
  useEffect(() => {
    const weekPlannerCollection = collection(db, 'weekPlanner')

    const unsubscribe = onSnapshot(
      weekPlannerCollection,
      (snapshot) => {
        const planData: DayPlan[] = []
        snapshot.forEach((doc) => {
          planData.push({
            date: doc.id, // Document ID is the date
            meals: doc.data().meals || [],
          })
        })
        // Sort by date
        planData.sort((a, b) => a.date.localeCompare(b.date))
        setWeekPlan(planData)
        setIsLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching week planner:', error)
        setError('Fehler beim Laden des Wochenplaners')
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Add meal to a specific day
  const addMealToDay = async (
    date: string,
    recipeId: string,
    recipeTitle: string,
    mealType: MealType
  ) => {
    try {
      const dayDoc = doc(db, 'weekPlanner', date)
      
      // Find existing day plan or create new one
      const existingDay = weekPlan.find((d) => d.date === date)
      const meals = existingDay ? [...existingDay.meals] : []
      
      // Add new meal
      meals.push({ recipeId, recipeTitle, mealType })
      
      await setDoc(dayDoc, {
        meals,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error adding meal:', error)
      setError('Fehler beim Hinzufügen der Mahlzeit')
      throw error
    }
  }

  // Remove meal from a specific day
  const removeMealFromDay = async (date: string, mealIndex: number) => {
    try {
      const existingDay = weekPlan.find((d) => d.date === date)
      if (!existingDay) return

      const meals = existingDay.meals.filter((_, index) => index !== mealIndex)
      
      const dayDoc = doc(db, 'weekPlanner', date)
      
      if (meals.length === 0) {
        // If no meals left, delete the document
        await deleteDoc(dayDoc)
      } else {
        // Otherwise update with remaining meals
        await setDoc(dayDoc, {
          meals,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error('Error removing meal:', error)
      setError('Fehler beim Entfernen der Mahlzeit')
      throw error
    }
  }

  // Clear all meals for a specific day
  const clearDay = async (date: string) => {
    try {
      const dayDoc = doc(db, 'weekPlanner', date)
      await deleteDoc(dayDoc)
    } catch (error) {
      console.error('Error clearing day:', error)
      setError('Fehler beim Leeren des Tages')
      throw error
    }
  }

  // Clear entire week plan
  const clearWeekPlan = async () => {
    try {
      const deletePromises = weekPlan.map((day) =>
        deleteDoc(doc(db, 'weekPlanner', day.date))
      )
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error clearing week plan:', error)
      setError('Fehler beim Leeren des Wochenplaners')
      throw error
    }
  }

  // Get meals for a specific date
  const getMealsForDate = (date: string): PlannedMeal[] => {
    const day = weekPlan.find((d) => d.date === date)
    return day?.meals || []
  }

  return {
    weekPlan,
    isLoading,
    error,
    addMealToDay,
    removeMealFromDay,
    clearDay,
    clearWeekPlan,
    getMealsForDate,
  }
}

