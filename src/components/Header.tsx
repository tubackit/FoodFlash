import { Zap, Home, BookOpen, Calendar, ShoppingCart } from 'lucide-react'
import clsx from 'clsx'

interface HeaderProps {
  activeTab: 'home' | 'recipes' | 'planner' | 'shopping'
  setActiveTab: (tab: 'home' | 'recipes' | 'planner' | 'shopping') => void
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-primary-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap 
                className="h-10 w-10 text-primary-500 fill-primary-500" 
                strokeWidth={2}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Food Flash
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
                  ? 'bg-primary-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
              )}
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Start</span>
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              data-test-id="nav-recipes"
              aria-label="Zu meinen Rezepten navigieren"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'recipes'
                  ? 'bg-secondary-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-secondary-100 hover:text-secondary-700'
              )}
            >
              <BookOpen className="h-5 w-5" />
              <span className="hidden sm:inline">Rezepte</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              data-test-id="nav-planner"
              aria-label="Zum Wochenplaner navigieren"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'planner'
                  ? 'bg-accent-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-accent-100 hover:text-accent-700'
              )}
            >
              <Calendar className="h-5 w-5" />
              <span className="hidden sm:inline">Planer</span>
            </button>

            <button
              onClick={() => setActiveTab('shopping')}
              data-test-id="nav-shopping"
              aria-label="Zur Einkaufsliste navigieren"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200',
                activeTab === 'shopping'
                  ? 'bg-primary-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Einkauf</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

