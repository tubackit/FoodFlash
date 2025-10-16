import { useState, useEffect } from 'react'
import { ShoppingList, ShoppingItem, ShoppingCategory } from '../types/shopping'

const STORAGE_KEY = 'foodflash_shopping'

const loadShoppingList = (): ShoppingList => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { items: [] }
  } catch (error) {
    console.error('Error loading shopping list:', error)
    return { items: [] }
  }
}

export const useShoppingList = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingList>(loadShoppingList)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingList))
  }, [shoppingList])

  const addItem = (name: string, category: ShoppingCategory, quantity?: string) => {
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      quantity: quantity?.trim(),
      checked: false,
      createdAt: new Date().toISOString(),
    }
    setShoppingList((prev) => ({
      items: [...prev.items, newItem],
    }))
  }

  const toggleItem = (id: string) => {
    setShoppingList((prev) => ({
      items: prev.items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }))
  }

  const deleteItem = (id: string) => {
    setShoppingList((prev) => ({
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const clearChecked = () => {
    setShoppingList((prev) => ({
      items: prev.items.filter((item) => !item.checked),
    }))
  }

  const clearAll = () => {
    setShoppingList({ items: [] })
  }

  return {
    items: shoppingList.items,
    addItem,
    toggleItem,
    deleteItem,
    clearChecked,
    clearAll,
  }
}

