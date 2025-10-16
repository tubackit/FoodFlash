import { Recipe } from '../types/recipe'
import { WeekPlan } from '../types/planner'
import { ShoppingList } from '../types/shopping'

export interface ExportData {
  version: string
  exportDate: string
  recipes: Recipe[]
  weekPlan?: WeekPlan
  shoppingList?: ShoppingList
}

export const exportRecipes = (recipes: Recipe[], weekPlan?: WeekPlan, shoppingList?: ShoppingList) => {
  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    recipes,
    weekPlan,
    shoppingList,
  }

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `foodflash-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importRecipes = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content) as ExportData
        
        // Validate the data structure
        if (!data.recipes || !Array.isArray(data.recipes)) {
          throw new Error('Ungültiges Datenformat')
        }
        
        resolve(data)
      } catch (error) {
        reject(new Error('Fehler beim Lesen der Datei: ' + (error as Error).message))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'))
    }
    
    reader.readAsText(file)
  })
}

