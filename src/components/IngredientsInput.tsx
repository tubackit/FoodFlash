import { useState, ChangeEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { Ingredient } from '../types/recipe'
import clsx from 'clsx'

interface IngredientsInputProps {
  ingredients: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

const IngredientsInput = ({ ingredients, onChange }: IngredientsInputProps) => {
  const [newIngredientName, setNewIngredientName] = useState('')
  const [newIngredientQuantity, setNewIngredientQuantity] = useState('')

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewIngredientName(e.target.value)
  }

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewIngredientQuantity(e.target.value)
  }

  const handleAdd = () => {
    if (!newIngredientName.trim()) return

    const newIngredient: Ingredient = {
      name: newIngredientName.trim(),
      quantity: newIngredientQuantity.trim() || undefined,
    }

    onChange([...ingredients, newIngredient])
    setNewIngredientName('')
    setNewIngredientQuantity('')
  }

  const handleRemove = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        Zutaten (optional)
      </label>

      {/* Existing Ingredients */}
      {ingredients.length > 0 && (
        <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-slate-700 rounded-lg px-3 py-2 group"
            >
              <span className="flex-1 text-sm text-gray-100">
                {ingredient.name}
                {ingredient.quantity && (
                  <span className="text-gray-400 ml-2">({ingredient.quantity})</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                data-test-id={`remove-ingredient-${index}`}
                aria-label="Zutat entfernen"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Ingredient - ALLES untereinander für bessere Sichtbarkeit */}
      <div className="space-y-2 w-full">
        <input
          type="text"
          value={newIngredientName}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          placeholder="Zutat, z.B. Tomaten"
          className="w-full px-3 py-2 text-sm border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
        />
        <input
          type="text"
          value={newIngredientQuantity}
          onChange={handleQuantityChange}
          onKeyPress={handleKeyPress}
          placeholder="Menge (optional)"
          className="w-full px-3 py-2 text-sm border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          data-test-id="add-ingredient"
          aria-label="Zutat hinzufügen"
          disabled={!newIngredientName.trim()}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm',
            newIngredientName.trim()
              ? 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-lg active:scale-95'
              : 'bg-slate-600 text-gray-500 cursor-not-allowed'
          )}
        >
          <Plus className="h-5 w-5" />
          <span>Zutat hinzufügen</span>
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Enter drücken oder Plus-Button zum Hinzufügen
      </p>
    </div>
  )
}

export default IngredientsInput

