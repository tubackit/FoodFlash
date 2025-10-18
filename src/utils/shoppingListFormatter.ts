import { ShoppingCategory } from '../types/shopping'

// Generic item type that works with both local and Firebase items
interface FormattableShoppingItem {
  name: string
  quantity?: string
  category: ShoppingCategory
  checked: boolean
}

const categoryLabels: Record<ShoppingCategory, { label: string; emoji: string }> = {
  produce: { label: 'Obst & Gemüse', emoji: '🥬' },
  bakery: { label: 'Brot & Backwaren', emoji: '🥖' },
  meat: { label: 'Fleisch & Wurst', emoji: '🥩' },
  deli: { label: 'Aufschnitt', emoji: '🥓' },
  dairy: { label: 'Käse & Milchprodukte', emoji: '🧀' },
  beverages: { label: 'Getränke', emoji: '🥤' },
  pantry: { label: 'Konserven & Vorräte', emoji: '🥫' },
  snacks: { label: 'Süßigkeiten & Snacks', emoji: '🍫' },
  frozen: { label: 'Tiefkühlware', emoji: '🧊' },
  household: { label: 'Haushalt & Sonstiges', emoji: '🧹' },
}

const categoryOrder: ShoppingCategory[] = [
  'produce',
  'bakery',
  'meat',
  'deli',
  'dairy',
  'beverages',
  'pantry',
  'snacks',
  'frozen',
  'household',
]

export const formatShoppingListForWhatsApp = (items: FormattableShoppingItem[]): string => {
  if (items.length === 0) {
    return '🛒 Einkaufsliste ist leer'
  }

  const uncheckedItems = items.filter(item => !item.checked)
  
  if (uncheckedItems.length === 0) {
    return '✅ Alle Artikel wurden bereits gekauft!'
  }

  let text = '🛒 *Einkaufsliste*\n\n'

  // Group by category
  categoryOrder.forEach((category) => {
    const categoryItems = uncheckedItems.filter((item) => item.category === category)
    
    if (categoryItems.length > 0) {
      const config = categoryLabels[category]
      text += `${config.emoji} *${config.label}*\n`
      
      categoryItems.forEach((item) => {
        const quantity = item.quantity ? ` (${item.quantity})` : ''
        text += `  • ${item.name}${quantity}\n`
      })
      
      text += '\n'
    }
  })

  text += `📊 Insgesamt: ${uncheckedItems.length} ${uncheckedItems.length === 1 ? 'Artikel' : 'Artikel'}`

  return text
}

export const formatShoppingListWithChecked = (items: FormattableShoppingItem[]): string => {
  if (items.length === 0) {
    return '🛒 Einkaufsliste ist leer'
  }

  let text = '🛒 *Einkaufsliste*\n\n'

  categoryOrder.forEach((category) => {
    const categoryItems = items.filter((item) => item.category === category)
    
    if (categoryItems.length > 0) {
      const config = categoryLabels[category]
      text += `${config.emoji} *${config.label}*\n`
      
      categoryItems.forEach((item) => {
        const checkbox = item.checked ? '✅' : '☐'
        const quantity = item.quantity ? ` (${item.quantity})` : ''
        text += `  ${checkbox} ${item.name}${quantity}\n`
      })
      
      text += '\n'
    }
  })

  const checkedCount = items.filter(i => i.checked).length
  text += `📊 ${checkedCount}/${items.length} gekauft`

  return text
}

