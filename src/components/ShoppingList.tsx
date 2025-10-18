import { useState, FormEvent, ChangeEvent } from 'react'
import { ShoppingCart, Plus, Trash2, CheckCircle2, Circle, X, Share2, Copy } from 'lucide-react'
import { useFirebaseShoppingList } from '../hooks/useFirebaseShoppingList'
import { ShoppingCategory } from '../types/shopping'
import { formatShoppingListForWhatsApp } from '../utils/shoppingListFormatter'
import { useHousehold } from '../contexts/HouseholdContext'
import clsx from 'clsx'

const categories: { key: ShoppingCategory; label: string; emoji: string }[] = [
  { key: 'produce', label: 'Obst & Gemüse', emoji: '🥬' },
  { key: 'bakery', label: 'Brot & Backwaren', emoji: '🥖' },
  { key: 'meat', label: 'Fleisch & Wurst', emoji: '🥩' },
  { key: 'deli', label: 'Aufschnitt', emoji: '🥓' },
  { key: 'dairy', label: 'Käse & Milchprodukte', emoji: '🧀' },
  { key: 'beverages', label: 'Getränke', emoji: '🥤' },
  { key: 'pantry', label: 'Konserven & Vorräte', emoji: '🥫' },
  { key: 'snacks', label: 'Süßigkeiten & Snacks', emoji: '🍫' },
  { key: 'frozen', label: 'Tiefkühlware', emoji: '🧊' },
  { key: 'household', label: 'Haushalt & Sonstiges', emoji: '🧹' },
]

const ShoppingList = () => {
  const { currentHousehold } = useHousehold()
  const { items, addItem, toggleItem, removeItem, clearCheckedItems, clearAllItems, isLoading } = useFirebaseShoppingList(currentHousehold?.id)
  const [isAdding, setIsAdding] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory>('produce')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) return
    
    if (!currentHousehold) {
      alert('❌ Bitte wähle zuerst einen Haushalt aus!')
      return
    }

    addItem(itemName, selectedCategory, itemQuantity)
    setItemName('')
    setItemQuantity('')
    setIsAdding(false)
  }

  const handleItemNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value)
  }

  const handleItemQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemQuantity(e.target.value)
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as ShoppingCategory)
  }

  const handleToggleItem = (id: string) => {
    toggleItem(id)
  }

  const handleDeleteItem = (id: string) => {
    removeItem(id)
  }

  const handleClearChecked = () => {
    if (confirm('Möchtest du alle abgehakten Artikel löschen?')) {
      clearCheckedItems()
    }
  }

  const handleClearAll = () => {
    if (confirm('Möchtest du die gesamte Einkaufsliste löschen?')) {
      clearAllItems()
    }
  }

  const handleCopyToClipboard = async () => {
    const text = formatShoppingListForWhatsApp(items)
    
    try {
      await navigator.clipboard.writeText(text)
      alert('✅ Einkaufsliste in Zwischenablage kopiert!')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('✅ Einkaufsliste kopiert!')
    }
  }

  const handleShareViaWhatsApp = () => {
    const text = formatShoppingListForWhatsApp(items)
    const encodedText = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
  }

  // Group items by category
  const itemsByCategory = categories.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category === cat.key),
  }))

  const checkedCount = items.filter((item) => item.checked).length
  const totalCount = items.length

  return (
    <div className="max-w-4xl mx-auto">
      {/* No Household Warning */}
      {!currentHousehold && (
        <div className="bg-red-900/30 border-2 border-red-500 rounded-xl p-6 mb-6 text-center">
          <p className="text-red-200 text-lg font-bold mb-2">
            ⚠️ Kein Haushalt gewählt!
          </p>
          <p className="text-red-300 text-sm">
            Bitte wähle zuerst einen Haushalt aus, um die Einkaufsliste zu nutzen.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-100 mb-2 flex items-center justify-center gap-3">
          <ShoppingCart className="h-10 w-10 text-primary-500" />
          Einkaufsliste
          {currentHousehold && (
            <span className="text-lg text-gray-400">({currentHousehold.icon} {currentHousehold.name})</span>
          )}
        </h2>
        <p className="text-gray-300">
          {isLoading ? (
            '🔄 Synchronisiere mit der Cloud...'
          ) : totalCount === 0 ? (
            'Füge Artikel zu deiner Einkaufsliste hinzu'
          ) : (
            <>
              {checkedCount} von {totalCount} {totalCount === 1 ? 'Artikel' : 'Artikeln'} gekauft
            </>
          )}
        </p>
      </div>

      {/* Add Item Form */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          data-test-id="open-add-item"
          aria-label="Artikel hinzufügen"
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 font-bold text-lg mb-6"
        >
          <Plus className="h-6 w-6" />
          Artikel hinzufügen
        </button>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-primary-500/30 autumn-glow mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-100">Neuer Artikel</h3>
            <button
              onClick={() => setIsAdding(false)}
              data-test-id="close-add-item"
              aria-label="Formular schließen"
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="item-name" className="block text-sm font-medium text-gray-200 mb-1">
                  Artikel *
                </label>
                <input
                  id="item-name"
                  type="text"
                  value={itemName}
                  onChange={handleItemNameChange}
                  data-test-id="item-name-input"
                  aria-label="Artikel-Name eingeben"
                  placeholder="z.B. Tomaten"
                  className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="item-quantity" className="block text-sm font-medium text-gray-200 mb-1">
                  Menge (optional)
                </label>
                <input
                  id="item-quantity"
                  type="text"
                  value={itemQuantity}
                  onChange={handleItemQuantityChange}
                  data-test-id="item-quantity-input"
                  aria-label="Menge eingeben"
                  placeholder="z.B. 500g, 3 Stück"
                  className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="item-category" className="block text-sm font-medium text-gray-200 mb-1">
                Kategorie *
              </label>
              <select
                id="item-category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                data-test-id="item-category-select"
                aria-label="Kategorie auswählen"
                className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100"
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              data-test-id="submit-item"
              aria-label="Artikel zur Liste hinzufügen"
              className="w-full py-3 rounded-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105"
            >
              Zur Liste hinzufügen
            </button>
          </form>
        </div>
      )}

      {/* Action Buttons */}
      {items.length > 0 && (
        <div className="space-y-3 mb-6">
          {/* Share Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyToClipboard}
              data-test-id="copy-shopping-list"
              aria-label="Einkaufsliste kopieren"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Copy className="h-5 w-5" />
              Kopieren
            </button>
            <button
              onClick={handleShareViaWhatsApp}
              data-test-id="share-whatsapp"
              aria-label="Per WhatsApp teilen"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              WhatsApp
            </button>
          </div>

          {/* Management Buttons */}
          <div className="flex gap-3">
            {checkedCount > 0 && (
              <button
                onClick={handleClearChecked}
                data-test-id="clear-checked"
                aria-label="Abgehakte Artikel löschen"
                className="flex-1 py-2 px-4 bg-accent-100 text-accent-700 rounded-lg font-medium hover:bg-accent-200 transition-colors text-sm"
              >
                Abgehakte löschen ({checkedCount})
              </button>
            )}
            <button
              onClick={handleClearAll}
              data-test-id="clear-all"
              aria-label="Alle Artikel löschen"
              className="py-2 px-4 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
            >
              Alle löschen
            </button>
          </div>
        </div>
      )}

      {/* Shopping List by Categories */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {itemsByCategory.map((category) => {
            if (category.items.length === 0) return null

            return (
              <div key={category.key} className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-dark-600/50">
                <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2 text-lg">
                  <span className="text-2xl">{category.emoji}</span>
                  {category.label}
                  <span className="text-sm text-gray-300 font-normal ml-auto">
                    {category.items.filter(i => i.checked).length}/{category.items.length}
                  </span>
                </h3>

                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group',
                        item.checked ? 'bg-slate-600/30' : 'bg-slate-600/50 hover:bg-slate-500/50'
                      )}
                    >
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        data-test-id={`toggle-item-${item.id}`}
                        aria-label={item.checked ? 'Als nicht gekauft markieren' : 'Als gekauft markieren'}
                        className="flex-shrink-0 transition-transform hover:scale-110"
                      >
                        {item.checked ? (
                          <CheckCircle2 className="h-6 w-6 text-accent-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-300" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={clsx(
                            'font-medium',
                            item.checked ? 'line-through text-gray-400' : 'text-white'
                          )}
                        >
                          {item.name}
                        </p>
                        {item.quantity && (
                          <p
                            className={clsx(
                              'text-sm',
                              item.checked ? 'text-gray-400' : 'text-gray-200'
                            )}
                          >
                            {item.quantity}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        data-test-id={`delete-item-${item.id}`}
                        aria-label={`${item.name} löschen`}
                        className="flex-shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-dark-600/50">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-gray-200 mb-2">Deine Einkaufsliste ist leer</h3>
          <p className="text-gray-300">Füge Artikel hinzu und sie werden nach Supermarkt-Kategorien sortiert!</p>
        </div>
      )}
    </div>
  )
}

export default ShoppingList

