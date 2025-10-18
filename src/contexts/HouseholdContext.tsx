import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Household, DEFAULT_HOUSEHOLDS } from '../types/household'

interface HouseholdContextType {
  currentHousehold: Household | null
  setCurrentHousehold: (household: Household) => void
  households: Household[]
  hasSelectedHousehold: boolean
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined)

const HOUSEHOLD_STORAGE_KEY = 'foodflash_current_household'

export const HouseholdProvider = ({ children }: { children: ReactNode }) => {
  const [currentHousehold, setCurrentHouseholdState] = useState<Household | null>(null)
  const [hasSelectedHousehold, setHasSelectedHousehold] = useState(false)

  // Load household from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(HOUSEHOLD_STORAGE_KEY)
    if (stored) {
      try {
        const household = JSON.parse(stored) as Household
        setCurrentHouseholdState(household)
        setHasSelectedHousehold(true)
      } catch (error) {
        console.error('Error loading household:', error)
      }
    }
  }, [])

  const setCurrentHousehold = (household: Household) => {
    setCurrentHouseholdState(household)
    setHasSelectedHousehold(true)
    localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(household))
  }

  return (
    <HouseholdContext.Provider
      value={{
        currentHousehold,
        setCurrentHousehold,
        households: DEFAULT_HOUSEHOLDS,
        hasSelectedHousehold,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  )
}

export const useHousehold = () => {
  const context = useContext(HouseholdContext)
  if (!context) {
    throw new Error('useHousehold must be used within HouseholdProvider')
  }
  return context
}

