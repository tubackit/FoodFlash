import { useState } from 'react'
import { Home, Check } from 'lucide-react'
import clsx from 'clsx'
import { useHousehold } from '../contexts/HouseholdContext'
import { Household } from '../types/household'

const HouseholdSelectionModal = () => {
  const { households, setCurrentHousehold, hasSelectedHousehold } = useHousehold()
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)

  if (hasSelectedHousehold) {
    return null
  }

  const handleSelect = (household: Household) => {
    setSelectedHousehold(household)
  }

  const handleConfirm = () => {
    if (selectedHousehold) {
      setCurrentHousehold(selectedHousehold)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border-2 border-primary-500/30 my-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-primary-600/20 rounded-full">
              <Home className="h-8 w-8 md:h-12 md:w-12 text-primary-500" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
            Willkommen bei FoodFlash! 🎉
          </h2>
          <p className="text-gray-300 text-base md:text-lg">
            Welcher Haushalt bist du?
          </p>
          <p className="text-gray-400 text-xs md:text-sm mt-2">
            Jeder Haushalt hat seine eigene Einkaufsliste und Wochenplanung.
            <br className="hidden md:block" />
            <span className="md:inline"> </span>Rezepte werden mit allen geteilt! 👨‍👩‍👧‍👦
          </p>
        </div>

        {/* Household Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {households.map((household) => (
            <button
              key={household.id}
              onClick={() => handleSelect(household)}
              data-test-id={`select-${household.id}`}
              aria-label={`${household.name} auswählen`}
              className={clsx(
                'relative p-4 md:p-6 rounded-xl border-2 transition-all duration-200',
                'hover:scale-105 hover:shadow-xl',
                selectedHousehold?.id === household.id
                  ? 'border-primary-500 bg-primary-600/20'
                  : 'border-gray-600 bg-slate-700/50 hover:border-primary-500/50'
              )}
            >
              {/* Selected Indicator */}
              {selectedHousehold?.id === household.id && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full">
                  <Check className="h-4 w-4" />
                </div>
              )}

              {/* Icon */}
              <div className="text-4xl md:text-5xl mb-2 md:mb-3">{household.icon}</div>

              {/* Name */}
              <h3 className="text-base md:text-lg font-bold text-gray-100 mb-1">
                {household.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-400">
                Eigene Listen & Planung
              </p>
            </button>
          ))}
        </div>

        {/* Hint */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-4">
          <p className="text-xs md:text-sm text-blue-200">
            💡 <strong>Tipp:</strong> Du kannst den Haushalt später jederzeit wechseln!
          </p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedHousehold}
          data-test-id="confirm-household"
          aria-label="Haushalt bestätigen"
          className={clsx(
            'w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-200',
            selectedHousehold
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-xl hover:scale-105'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          )}
        >
          {selectedHousehold
            ? `${selectedHousehold.icon} ${selectedHousehold.name} auswählen`
            : 'Bitte wähle einen Haushalt'}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-3">
          Diese Einstellung wird auf deinem Gerät gespeichert
        </p>
      </div>
    </div>
  )
}

export default HouseholdSelectionModal

