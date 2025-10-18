import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import RecipeList from './components/RecipeList'
import WeekPlanner from './components/WeekPlanner'
import ShoppingList from './components/ShoppingList'
import HouseholdSelectionModal from './components/HouseholdSelectionModal'
import { Platform } from './types/recipe'
import { migrateLocalDataToFirebase, forceReMigration, checkMigrationStatus } from './utils/migrateToFirebase'
import { HouseholdProvider } from './contexts/HouseholdContext'

// Dark theme version
function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'recipes' | 'planner' | 'shopping'>('home')
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null)

  // Migriere localStorage-Daten zu Firebase beim ersten Laden
  useEffect(() => {
    const migrate = async () => {
      try {
        console.log('🔄 Starte Migration und Bereinigung...')
        
        // 1. Migration durchführen
        await migrateLocalDataToFirebase()
        
        // 2. Überprüfen, ob Migration abgeschlossen ist
        const status = await checkMigrationStatus()
        console.log('📊 Migration-Status:', status)
        
        // 3. Migration löscht jetzt automatisch localStorage
        // Kein manueller Reload mehr nötig - Firebase-Listener übernimmt
        
      } catch (error) {
        console.error('Migration fehlgeschlagen:', error)
      }
    }
    migrate()

    // Mache Migration-Tools global verfügbar für Debugging
    // @ts-expect-error - Globale Funktionen für Debugging
    window.FoodFlash = {
      forceReMigration,
      checkMigrationStatus,
      version: '2.0.0',
      clearLocalStorage: () => {
        localStorage.removeItem('foodflash_recipes')
        localStorage.removeItem('foodflash_migrated_to_firebase')
        console.log('✅ localStorage gelöscht - bitte Seite neu laden (F5)')
      }
    }
    console.log('🍂 FoodFlash geladen! Verfügbare Debugging-Tools:')
    console.log('  - window.FoodFlash.forceReMigration() - Migration erneut durchführen')
    console.log('  - window.FoodFlash.checkMigrationStatus() - Migration-Status überprüfen')
    console.log('  - window.FoodFlash.clearLocalStorage() - localStorage löschen')
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
        
        <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
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

