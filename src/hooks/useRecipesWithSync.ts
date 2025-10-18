/**
 * Smart Recipe Hook - Automatically uses Firebase for real-time sync
 * Falls back to localStorage if Firebase is unavailable
 */

import { useFirebaseRecipes } from './useFirebaseRecipes'
import { useRecipes as useLocalRecipes } from './useRecipes'
import { useEffect, useState } from 'react'

// Set this to true to enable Firebase, false to use localStorage
const USE_FIREBASE = true

export const useRecipesWithSync = () => {
  const firebaseHooks = useFirebaseRecipes()
  const localHooks = useLocalRecipes()
  const [useFirebase, setUseFirebase] = useState(USE_FIREBASE)

  // Auto-detect Firebase availability
  useEffect(() => {
    if (USE_FIREBASE && firebaseHooks.error) {
      console.warn('⚠️ Firebase nicht verfügbar, falle zurück auf localStorage')
      console.warn('Fehler:', firebaseHooks.error)
      setUseFirebase(false)
    }
  }, [firebaseHooks.error])

  // Return Firebase hooks if enabled and available, otherwise local hooks
  if (useFirebase) {
    return firebaseHooks
  }

  console.log('ℹ️ Verwende localStorage (Firebase deaktiviert oder nicht verfügbar)')
  return localHooks
}

