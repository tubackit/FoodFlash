import { Zap, Home, BookOpen, Calendar, ShoppingCart } from 'lucide-react'
import clsx from 'clsx'

interface HeaderProps {
  activeTab: 'home' | 'recipes' | 'planner' | 'shopping'
  setActiveTab: (tab: 'home' | 'recipes' | 'planner' | 'shopping') => void
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="bg-dark-800/95 backdrop-blur-sm shadow-2xl border-b-2 border-primary-600/50 autumn-glow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap 
                className="h-10 w-10 text-primary-400 fill-primary-400" 
                strokeWidth={2}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-pulse autumn-glow-gold"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
              🍂 Food Flash
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('home')}
              data-test-id="nav-home"
              aria-label="Zur Startseite navigieren"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'home'
                  ? 'bg-primary-600 text-white shadow-lg scale-105 autumn-glow'
                  : 'bg-dark-700/50 text-gray-300 hover:bg-primary-600/20 hover:text-primary-300 border border-dark-600/50'
              )}
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">🏠 Start</span>
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              data-test-id="nav-recipes"
              aria-label="Zu meinen Rezepten navigieren"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'recipes'
                  ? 'bg-secondary-600 text-white shadow-lg scale-105 autumn-glow-green'
                  : 'bg-dark-700/50 text-gray-300 hover:bg-secondary-600/20 hover:text-secondary-300 border border-dark-600/50'
              )}
            >
              <BookOpen className="h-5 w-5" />
              <span className="hidden sm:inline">📖 Rezepte</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              data-test-id="nav-planner"
              aria-label="Zum Wochenplaner navigieren"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'planner'
                  ? 'bg-accent-600 text-white shadow-lg scale-105 autumn-glow-gold'
                  : 'bg-dark-700/50 text-gray-300 hover:bg-accent-600/20 hover:text-accent-300 border border-dark-600/50'
              )}
            >
              <Calendar className="h-5 w-5" />
              <span className="hidden sm:inline">📅 Planer</span>
            </button>

            <button
              onClick={() => setActiveTab('shopping')}
              data-test-id="nav-shopping"
              aria-label="Zur Einkaufsliste navigieren"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'shopping'
                  ? 'bg-primary-600 text-white shadow-lg scale-105 autumn-glow'
                  : 'bg-dark-700/50 text-gray-300 hover:bg-primary-600/20 hover:text-primary-300 border border-dark-600/50'
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">🛒 Einkauf</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

