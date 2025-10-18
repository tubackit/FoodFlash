/**
 * Smart Recipe Hook - Automatically uses Firebase for real-time sync
 * Falls back to localStorage if Firebase is unavailable
 */

import { useFirebaseRecipes } from './useFirebaseRecipes'
import { useRecipes as useLocalRecipes } from './useRecipes'

// Set this to true to enable Firebase, false to use localStorage
const USE_FIREBASE = true

export const useRecipesWithSync = () => {
  const firebaseHooks = useFirebaseRecipes()
  const localHooks = useLocalRecipes()

  // Return Firebase hooks if enabled, otherwise local hooks
  if (USE_FIREBASE) {
    return firebaseHooks
  }

  return localHooks
}

