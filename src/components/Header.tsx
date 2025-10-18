import { Zap, Home, BookOpen, Calendar, ShoppingCart, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'
import { useHousehold } from '../contexts/HouseholdContext'

interface HeaderProps {
  activeTab: 'home' | 'recipes' | 'planner' | 'shopping'
  setActiveTab: (tab: 'home' | 'recipes' | 'planner' | 'shopping') => void
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const { currentHousehold, households, setCurrentHousehold } = useHousehold()
  const [showHouseholdDropdown, setShowHouseholdDropdown] = useState(false)

  return (
    <header className="bg-slate-800/95 backdrop-blur-sm shadow-2xl border-b-2 border-primary-600/50 autumn-glow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Household */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap 
                  className="h-10 w-10 text-primary-400 fill-primary-400" 
                  strokeWidth={2}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-pulse autumn-glow-gold"></div>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                🍂 Food Flash
              </h1>
            </div>

            {/* Household Selector */}
            {currentHousehold && (
              <div className="relative">
                <button
                  onClick={() => setShowHouseholdDropdown(!showHouseholdDropdown)}
                  data-test-id="household-selector"
                  aria-label="Haushalt wechseln"
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-slate-700/80 border border-slate-600 hover:border-primary-500 transition-all text-gray-200 hover:text-primary-300"
                >
                  <span className="text-lg">{currentHousehold.icon}</span>
                  <span className="hidden md:inline text-sm font-medium">
                    {currentHousehold.name}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>

                {/* Dropdown */}
                {showHouseholdDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowHouseholdDropdown(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full mt-2 left-0 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[200px]">
                      <div className="p-2">
                        <p className="text-xs text-gray-400 px-3 py-1 mb-1">
                          Haushalt wechseln:
                        </p>
                        {households.map((household) => (
                          <button
                            key={household.id}
                            onClick={() => {
                              setCurrentHousehold(household)
                              setShowHouseholdDropdown(false)
                            }}
                            data-test-id={`switch-to-${household.id}`}
                            aria-label={`Zu ${household.name} wechseln`}
                            className={clsx(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                              currentHousehold.id === household.id
                                ? 'bg-primary-600 text-white'
                                : 'hover:bg-slate-700 text-gray-200'
                            )}
                          >
                            <span className="text-lg">{household.icon}</span>
                            <span className="text-sm font-medium">
                              {household.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex gap-0.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              data-test-id="nav-home"
              aria-label="Zur Startseite navigieren"
              className={clsx(
                'flex items-center justify-center px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-full font-medium transition-all duration-200 min-w-[32px] sm:min-w-0',
                activeTab === 'home'
                  ? 'bg-primary-600 text-white shadow-lg scale-105 autumn-glow'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-primary-600/20 hover:text-primary-300 border border-slate-600/50'
              )}
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xl:inline ml-2">🏠 Start</span>
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              data-test-id="nav-recipes"
              aria-label="Zu meinen Rezepten navigieren"
              className={clsx(
                'flex items-center justify-center px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-full font-medium transition-all duration-200 min-w-[32px] sm:min-w-0',
                activeTab === 'recipes'
                  ? 'bg-secondary-600 text-white shadow-lg scale-105 autumn-glow-green'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-secondary-600/20 hover:text-secondary-300 border border-dark-600/50'
              )}
            >
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xl:inline ml-2">📖 Rezepte</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              data-test-id="nav-planner"
              aria-label="Zum Wochenplaner navigieren"
              className={clsx(
                'flex items-center justify-center px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-full font-medium transition-all duration-200 min-w-[32px] sm:min-w-0',
                activeTab === 'planner'
                  ? 'bg-accent-600 text-white shadow-lg scale-105 autumn-glow-gold'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-accent-600/20 hover:text-accent-300 border border-dark-600/50'
              )}
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xl:inline ml-2">📅 Planer</span>
            </button>

            <button
              onClick={() => setActiveTab('shopping')}
              data-test-id="nav-shopping"
              aria-label="Zur Einkaufsliste navigieren"
              className={clsx(
                'flex items-center justify-center px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-full font-medium transition-all duration-200 min-w-[32px] sm:min-w-0',
                activeTab === 'shopping'
                  ? 'bg-primary-600 text-white shadow-lg scale-105 autumn-glow'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-primary-600/20 hover:text-primary-300 border border-slate-600/50'
              )}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xl:inline ml-2">🛒 Einkauf</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

