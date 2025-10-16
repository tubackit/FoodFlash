import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import RecipeList from './components/RecipeList'
import WeekPlanner from './components/WeekPlanner'
import ShoppingList from './components/ShoppingList'
import { Platform } from './types/recipe'

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'recipes' | 'planner' | 'shopping'>('home')
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null)

  const handlePlatformClick = (platform: Platform) => {
    setPlatformFilter(platform)
    setActiveTab('recipes')
  }

  const handleClearFilter = () => {
    setPlatformFilter(null)
  }

  return (
    <div className="min-h-screen">
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
  )
}

export default App

