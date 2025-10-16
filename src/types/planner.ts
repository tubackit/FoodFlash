export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface MealPlan {
  recipeId: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export interface DayPlan {
  day: WeekDay
  meals: MealPlan[]
}

export interface WeekPlan {
  weekStart: string // ISO date string
  days: Record<WeekDay, MealPlan[]>
}

