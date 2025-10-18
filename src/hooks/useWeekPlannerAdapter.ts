/**
 * Adapter to make Firebase WeekPlanner compatible with existing WeekPlanner component
 */

import { useFirebaseWeekPlanner } from './useFirebaseWeekPlanner'
import { WeekDay, MealPlan } from '../types/planner'

type WeekPlanData = Record<WeekDay, { meals: MealPlan[] }>
import { useFirebaseRecipes } from './useFirebaseRecipes'

export const useWeekPlannerAdapter = () => {
  const firebaseHooks = useFirebaseWeekPlanner()
  const { recipes } = useFirebaseRecipes()

  // Convert Firebase format to local format
  const days: WeekPlanData = {
    monday: { meals: [] },
    tuesday: { meals: [] },
    wednesday: { meals: [] },
    thursday: { meals: [] },
    friday: { meals: [] },
    saturday: { meals: [] },
    sunday: { meals: [] },
  }

  // Helper to convert day name to date string (YYYY-MM-DD)
  const getDayDate = (day: WeekDay): string => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    const dayMap: Record<WeekDay, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    }
    
    const targetDay = dayMap[day]
    const diff = targetDay - dayOfWeek
    const date = new Date(today)
    date.setDate(today.getDate() + diff)
    
    return date.toISOString().split('T')[0] // YYYY-MM-DD
  }

  // Map Firebase data to local format
  firebaseHooks.weekPlan.forEach((dayPlan) => {
    // Find which WeekDay this date corresponds to
    const date = new Date(dayPlan.date)
    const dayOfWeek = date.getDay()
    
    const dayNames: WeekDay[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]
    
    const dayName = dayNames[dayOfWeek]
    
    // Convert Firebase meals to local format
    days[dayName].meals = dayPlan.meals.map((meal) => ({
      recipeId: meal.recipeId,
      mealType: meal.mealType,
    }))
  })

  const weekPlan = {
    weekStart: new Date().toISOString(),
    days,
  }

  // Add meal to a specific day
  const addMealToDay = async (day: WeekDay, meal: MealPlan) => {
    const date = getDayDate(day)
    const recipe = recipes.find((r) => r.id === meal.recipeId)
    
    if (!recipe) {
      console.error('Recipe not found:', meal.recipeId)
      return
    }
    
    await firebaseHooks.addMealToDay(
      date,
      meal.recipeId,
      recipe.title,
      meal.mealType
    )
  }

  // Remove meal from a specific day (by recipeId and mealType, not index)
  const removeMealFromDay = async (day: WeekDay, recipeId: string, mealType: MealPlan['mealType']) => {
    const date = getDayDate(day)
    const dayMeals = firebaseHooks.getMealsForDate(date)
    const mealIndex = dayMeals.findIndex(
      (m) => m.recipeId === recipeId && m.mealType === mealType
    )
    
    if (mealIndex !== -1) {
      await firebaseHooks.removeMealFromDay(date, mealIndex)
    }
  }

  // Clear all meals for a specific day
  const clearDay = async (day: WeekDay) => {
    const date = getDayDate(day)
    await firebaseHooks.clearDay(date)
  }

  // Clear entire week plan
  const clearWeek = async () => {
    await firebaseHooks.clearWeekPlan()
  }

  return {
    weekPlan,
    isLoading: firebaseHooks.isLoading,
    error: firebaseHooks.error,
    addMealToDay,
    removeMealFromDay,
    clearDay,
    clearWeek,
  }
}

