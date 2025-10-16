import { ShoppingCategory } from '../types/shopping'

// Simple keyword-based category detection
const categoryKeywords: Record<ShoppingCategory, string[]> = {
  produce: ['tomate', 'gurke', 'salat', 'paprika', 'zwiebel', 'knoblauch', 'karotte', 'kartoffel', 'apfel', 'banane', 'zitrone', 'orange', 'beere', 'spinat', 'brokkoli', 'pilz', 'champignon'],
  bakery: ['brot', 'brötchen', 'baguette', 'toast', 'croissant', 'mehl', 'hefe'],
  meat: ['hähnchen', 'huhn', 'rind', 'schwein', 'hack', 'steak', 'filet', 'schnitzel', 'bratwurst'],
  deli: ['schinken', 'salami', 'mortadella', 'aufschnitt', 'wurst'],
  dairy: ['milch', 'butter', 'käse', 'joghurt', 'sahne', 'schmand', 'quark', 'frischkäse', 'mozzarella', 'parmesan', 'ei', 'eier'],
  beverages: ['wasser', 'saft', 'cola', 'limo', 'bier', 'wein', 'kaffee', 'tee', 'milch'],
  pantry: ['reis', 'nudel', 'pasta', 'dose', 'konserve', 'öl', 'essig', 'gewürz', 'salz', 'pfeffer', 'zucker', 'honig', 'marmelade', 'ketchup', 'senf', 'mayonnaise', 'soße'],
  snacks: ['schokolade', 'keks', 'chips', 'süßigkeit', 'gummibär', 'bonbon'],
  frozen: ['tiefkühl', 'tk-', 'eis', 'eiscreme', 'gefrier'],
  household: ['spülmittel', 'schwamm', 'putzmittel', 'klopapier', 'küchenpapier', 'müllbeutel', 'alufolie', 'frischhaltefolie'],
}

export const detectIngredientCategory = (ingredientName: string): ShoppingCategory => {
  const nameLower = ingredientName.toLowerCase()

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => nameLower.includes(keyword))) {
      return category as ShoppingCategory
    }
  }

  // Default to produce (most common for cooking ingredients)
  return 'produce'
}

