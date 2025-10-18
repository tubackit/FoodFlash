// Cleanup old localStorage data to prevent conflicts with Firebase
export const cleanupOldLocalStorageData = () => {
  try {
    // Check if Firebase migration has been completed
    const migrationCompleted = localStorage.getItem('foodflash_migration_completed')
    
    if (migrationCompleted) {
      // Migration was completed, clean up old localStorage data
      console.log('🧹 Cleaning up old localStorage data...')
      
      // Remove old recipe data
      localStorage.removeItem('foodflash_recipes')
      console.log('✅ Removed old recipes from localStorage')
      
      // Remove old shopping list data
      localStorage.removeItem('foodflash_shopping')
      console.log('✅ Removed old shopping list from localStorage')
      
      // Remove old week planner data
      localStorage.removeItem('foodflash_week_plan')
      console.log('✅ Removed old week planner from localStorage')
      
      console.log('🎉 localStorage cleanup completed!')
    }
  } catch (error) {
    console.error('Error during localStorage cleanup:', error)
  }
}

// Force cleanup for specific recipe deletion issues
export const forceCleanupRecipeData = () => {
  try {
    console.log('🧹 Force cleaning recipe data...')
    
    // Remove all recipe-related localStorage data
    localStorage.removeItem('foodflash_recipes')
    localStorage.removeItem('foodflash_migration_completed')
    
    console.log('✅ Force cleanup completed!')
    
    // Reload the page to refresh Firebase data
    window.location.reload()
  } catch (error) {
    console.error('Error during force cleanup:', error)
  }
}

// Direct pizza recipe deletion - emergency function
export const deletePizzaRecipeDirectly = async () => {
  try {
    console.log('🍕 Attempting direct pizza recipe deletion...')
    
    // Import Firebase functions dynamically to avoid build issues
    const { collection, getDocs, deleteDoc, doc } = await import('firebase/firestore')
    const { db } = await import('../config/firebase')
    
    // Get all recipes
    const recipesCollection = collection(db, 'recipes')
    const snapshot = await getDocs(recipesCollection)
    
    let pizzaDeleted = false
    
    // Find and delete pizza recipes
    for (const recipeDoc of snapshot.docs) {
      const data = recipeDoc.data()
      const title = data.title?.toLowerCase() || ''
      
      // Check if it's a pizza recipe (various spellings)
      if (title.includes('pizza') || title.includes('pizzarezept') || title.includes('pizzarezept')) {
        console.log(`🗑️ Deleting pizza recipe: "${data.title}"`)
        await deleteDoc(doc(db, 'recipes', recipeDoc.id))
        pizzaDeleted = true
      }
    }
    
    if (pizzaDeleted) {
      console.log('✅ Pizza recipe(s) deleted successfully!')
      alert('🍕 Pizzarezept erfolgreich gelöscht!')
      window.location.reload()
    } else {
      console.log('ℹ️ No pizza recipes found')
      alert('ℹ️ Kein Pizzarezept gefunden')
    }
    
  } catch (error) {
    console.error('Error deleting pizza recipe:', error)
    alert('❌ Fehler beim Löschen des Pizzarezepts')
  }
}
