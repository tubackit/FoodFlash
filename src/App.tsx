import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import RecipeList from './components/RecipeList'
import WeekPlanner from './components/WeekPlanner'
import ShoppingList from './components/ShoppingList'
import HouseholdSelectionModal from './components/HouseholdSelectionModal'
import { Platform } from './types/recipe'
import { migrateLocalDataToFirebase } from './utils/migrateToFirebase'
import { HouseholdProvider } from './contexts/HouseholdContext'

// Dark theme version
function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'recipes' | 'planner' | 'shopping'>('home')
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null)

  // Migriere localStorage-Daten zu Firebase beim ersten Laden
  useEffect(() => {
    const migrate = async () => {
      try {
        await migrateLocalDataToFirebase()
      } catch (error) {
        console.error('Migration fehlgeschlagen:', error)
      }
    }
    migrate()
  }, [])

  const handlePlatformClick = (platform: Platform) => {
    setPlatformFilter(platform)
    setActiveTab('recipes')
  }

  const handleClearFilter = () => {
    setPlatformFilter(null)
  }

  return (
    <HouseholdProvider>
      <div className="min-h-screen">
        <HouseholdSelectionModal />
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'home' && <Hero onPlatformClick={handlePlatformClick} />}
          {activeTab === 'recipes' && (
            <RecipeList 
              platformFilter={platformFilter} 
              onClearFilter={handleClearFilter}
            />
          )}
          {activeTab === 'planner' && <WeekPlanner />}
          {activeTab === 'shopping' && <ShoppingList />}
        </main>
      </div>
    </HouseholdProvider>
  )
}

export default App

