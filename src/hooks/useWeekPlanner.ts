import { useState, useEffect } from 'react'
import { WeekPlan, WeekDay, MealPlan } from '../types/planner'

const STORAGE_KEY = 'foodflash_weekplan'

const getWeekStart = (): string => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  const monday = new Date(today.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

const createEmptyWeekPlan = (): WeekPlan => ({
  weekStart: getWeekStart(),
  days: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
})

const loadWeekPlan = (): WeekPlan => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return createEmptyWeekPlan()

    const plan = JSON.parse(stored) as WeekPlan
    const currentWeekStart = getWeekStart()

    // Reset if it's a new week
    if (plan.weekStart !== currentWeekStart) {
      return createEmptyWeekPlan()
    }

    return plan
  } catch (error) {
    console.error('Error loading week plan:', error)
    return createEmptyWeekPlan()
  }
}

export const useWeekPlanner = () => {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(loadWeekPlan)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weekPlan))
  }, [weekPlan])

  const addMealToDay = (day: WeekDay, meal: MealPlan) => {
    setWeekPlan((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...prev.days[day], meal],
      },
    }))
  }

  const removeMealFromDay = (day: WeekDay, recipeId: string, mealType: MealPlan['mealType']) => {
    setWeekPlan((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].filter(
          (meal) => !(meal.recipeId === recipeId && meal.mealType === mealType)
        ),
      },
    }))
  }

  const clearDay = (day: WeekDay) => {
    setWeekPlan((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [],
      },
    }))
  }

  const clearWeek = () => {
    setWeekPlan(createEmptyWeekPlan())
  }

  return {
    weekPlan,
    addMealToDay,
    removeMealFromDay,
    clearDay,
    clearWeek,
  }
}

