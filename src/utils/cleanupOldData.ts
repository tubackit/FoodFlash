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
