import { useState } from 'react'
import { Calendar, Plus, Trash2, ChefHat } from 'lucide-react'
import { useWeekPlanner } from '../hooks/useWeekPlanner'
import { useRecipes } from '../hooks/useRecipes'
import { WeekDay, MealPlan } from '../types/planner'
import clsx from 'clsx'

const weekDays: { key: WeekDay; label: string; short: string }[] = [
  { key: 'monday', label: 'Montag', short: 'Mo' },
  { key: 'tuesday', label: 'Dienstag', short: 'Di' },
  { key: 'wednesday', label: 'Mittwoch', short: 'Mi' },
  { key: 'thursday', label: 'Donnerstag', short: 'Do' },
  { key: 'friday', label: 'Freitag', short: 'Fr' },
  { key: 'saturday', label: 'Samstag', short: 'Sa' },
  { key: 'sunday', label: 'Sonntag', short: 'So' },
]

const mealTypes: { key: MealPlan['mealType']; label: string; emoji: string }[] = [
  { key: 'breakfast', label: 'Frühstück', emoji: '🥐' },
  { key: 'lunch', label: 'Mittagessen', emoji: '🍽️' },
  { key: 'dinner', label: 'Abendessen', emoji: '🍝' },
  { key: 'snack', label: 'Snack', emoji: '🍪' },
]

const WeekPlanner = () => {
  const { weekPlan, addMealToDay, removeMealFromDay, clearDay, clearWeek } = useWeekPlanner()
  const { recipes } = useRecipes()
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null)
  const [selectedMealType, setSelectedMealType] = useState<MealPlan['mealType']>('lunch')

  const handleAddMeal = (recipeId: string) => {
    if (!selectedDay) return
    
    addMealToDay(selectedDay, {
      recipeId,
      mealType: selectedMealType,
    })
    setSelectedDay(null)
  }

  const handleRemoveMeal = (day: WeekDay, recipeId: string, mealType: MealPlan['mealType']) => {
    removeMealFromDay(day, recipeId, mealType)
  }

  const handleClearDay = (day: WeekDay) => {
    if (confirm(`Möchtest du alle Mahlzeiten für ${weekDays.find(d => d.key === day)?.label} löschen?`)) {
      clearDay(day)
    }
  }

  const handleClearWeek = () => {
    if (confirm('Möchtest du den gesamten Wochenplan löschen?')) {
      clearWeek()
    }
  }

  const getRecipeById = (recipeId: string) => {
    return recipes.find((r) => r.id === recipeId)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Calendar className="h-10 w-10 text-accent-500" />
          Wochenplaner
        </h2>
        <p className="text-gray-600 mb-4">Plane deine Mahlzeiten für die Woche</p>
        <button
          onClick={handleClearWeek}
          data-test-id="clear-week"
          aria-label="Wochenplan löschen"
          className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          Wochenplan zurücksetzen
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
        {weekDays.map((weekDay) => {
          const dayMeals = weekPlan.days[weekDay.key]
          const mealsGrouped = mealTypes.map((mealType) => ({
            ...mealType,
            meals: dayMeals.filter((m) => m.mealType === mealType.key),
          }))

          return (
            <div
              key={weekDay.key}
              className="bg-dark-700/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-dark-600/50"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-800 hidden lg:block">{weekDay.label}</h3>
                  <h3 className="font-bold text-gray-800 lg:hidden">{weekDay.short}</h3>
                </div>
                <button
                  onClick={() => handleClearDay(weekDay.key)}
                  data-test-id={`clear-day-${weekDay.key}`}
                  aria-label={`${weekDay.label} löschen`}
                  className="p-1 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Meals by Type */}
              <div className="space-y-3">
                {mealsGrouped.map((mealTypeGroup) => (
                  <div key={mealTypeGroup.key}>
                    <div className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <span>{mealTypeGroup.emoji}</span>
                      <span className="hidden lg:inline">{mealTypeGroup.label}</span>
                    </div>
                    <div className="space-y-1">
                      {mealTypeGroup.meals.map((meal, idx) => {
                        const recipe = getRecipeById(meal.recipeId)
                        if (!recipe) return null

                        return (
                          <div
                            key={`${meal.recipeId}-${idx}`}
                            className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-2 text-xs group relative"
                          >
                            <p className="font-medium text-gray-700 pr-6 line-clamp-2">
                              {recipe.title}
                            </p>
                            <button
                              onClick={() => handleRemoveMeal(weekDay.key, meal.recipeId, meal.mealType)}
                              data-test-id={`remove-meal-${weekDay.key}-${meal.recipeId}`}
                              aria-label={`${recipe.title} entfernen`}
                              className="absolute top-1 right-1 p-1 bg-dark-800 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/20 text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Button */}
              <button
                onClick={() => setSelectedDay(weekDay.key)}
                data-test-id={`add-meal-${weekDay.key}`}
                aria-label={`Mahlzeit zu ${weekDay.label} hinzufügen`}
                className={clsx(
                  'w-full mt-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2',
                  selectedDay === weekDay.key
                    ? 'bg-accent-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-accent-100 hover:text-accent-700'
                )}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">Hinzufügen</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Recipe Selection Modal */}
      {selectedDay && (
        <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-2 border-accent-500/30 autumn-glow-gold">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-accent-500" />
              Rezept für {weekDays.find((d) => d.key === selectedDay)?.label} auswählen
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              data-test-id="close-recipe-selection"
              aria-label="Rezeptauswahl schließen"
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Meal Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mahlzeit</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mealTypes.map((mealType) => (
                <button
                  key={mealType.key}
                  onClick={() => setSelectedMealType(mealType.key)}
                  data-test-id={`select-meal-type-${mealType.key}`}
                  aria-label={`${mealType.label} auswählen`}
                  className={clsx(
                    'py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200',
                    selectedMealType === mealType.key
                      ? 'bg-accent-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-accent-100'
                  )}
                >
                  <span className="mr-1">{mealType.emoji}</span>
                  {mealType.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipe List */}
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleAddMeal(recipe.id)}
                  data-test-id={`select-recipe-${recipe.id}`}
                  aria-label={`${recipe.title} hinzufügen`}
                  className="bg-gradient-to-br from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-accent-300"
                >
                  <p className="font-bold text-gray-800 mb-1 line-clamp-2">{recipe.title}</p>
                  {recipe.rating && (
                    <p className="text-xs text-gray-600">⭐ {recipe.rating}/5</p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Keine Rezepte vorhanden. Füge zuerst Rezepte hinzu!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WeekPlanner

