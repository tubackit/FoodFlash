export type ShoppingCategory = 
  | 'produce'           // Obst & Gemüse
  | 'bakery'            // Brot & Backwaren
  | 'meat'              // Fleisch & Wurst
  | 'deli'              // Aufschnitt
  | 'dairy'             // Käse & Milchprodukte
  | 'beverages'         // Getränke
  | 'pantry'            // Konserven & Vorräte
  | 'snacks'            // Süßigkeiten & Snacks
  | 'frozen'            // Tiefkühlware
  | 'household'         // Haushalt & Sonstiges

export interface ShoppingItem {
  id: string
  name: string
  category: ShoppingCategory
  quantity?: string
  checked: boolean
  createdAt: string
}

export interface ShoppingList {
  items: ShoppingItem[]
}

