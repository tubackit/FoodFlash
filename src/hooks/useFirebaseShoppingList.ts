import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { ShoppingCategory } from '../types/shopping'

export interface ShoppingListItem {
  id: string
  name: string
  quantity?: string
  category: ShoppingCategory
  checked: boolean
  addedAt: string
}

export const useFirebaseShoppingList = () => {
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time listener for shopping list
  useEffect(() => {
    const shoppingListCollection = collection(db, 'shoppingList')
    const shoppingListQuery = query(shoppingListCollection, orderBy('addedAt', 'desc'))

    const unsubscribe = onSnapshot(
      shoppingListQuery,
      (snapshot) => {
        const itemsData: ShoppingListItem[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          itemsData.push({
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to ISO string
            addedAt: data.addedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as ShoppingListItem)
        })
        setItems(itemsData)
        setIsLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching shopping list:', error)
        setError('Fehler beim Laden der Einkaufsliste')
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Add item to shopping list
  const addItem = async (
    name: string,
    category: string,
    quantity?: string
  ) => {
    try {
      const shoppingListCollection = collection(db, 'shoppingList')
      await addDoc(shoppingListCollection, {
        name,
        quantity: quantity || '',
        category,
        checked: false,
        addedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error adding item:', error)
      setError('Fehler beim Hinzufügen des Artikels')
      throw error
    }
  }

  // Toggle item checked status
  const toggleItem = async (id: string) => {
    try {
      const item = items.find((i) => i.id === id)
      if (!item) return

      const itemDoc = doc(db, 'shoppingList', id)
      await updateDoc(itemDoc, {
        checked: !item.checked,
      })
    } catch (error) {
      console.error('Error toggling item:', error)
      setError('Fehler beim Aktualisieren des Artikels')
      throw error
    }
  }

  // Remove item from shopping list
  const removeItem = async (id: string) => {
    try {
      const itemDoc = doc(db, 'shoppingList', id)
      await deleteDoc(itemDoc)
    } catch (error) {
      console.error('Error removing item:', error)
      setError('Fehler beim Löschen des Artikels')
      throw error
    }
  }

  // Clear all items
  const clearAllItems = async () => {
    try {
      const deletePromises = items.map((item) =>
        deleteDoc(doc(db, 'shoppingList', item.id))
      )
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error clearing shopping list:', error)
      setError('Fehler beim Leeren der Einkaufsliste')
      throw error
    }
  }

  // Clear checked items
  const clearCheckedItems = async () => {
    try {
      const checkedItems = items.filter((item) => item.checked)
      const deletePromises = checkedItems.map((item) =>
        deleteDoc(doc(db, 'shoppingList', item.id))
      )
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error clearing checked items:', error)
      setError('Fehler beim Löschen der erledigten Artikel')
      throw error
    }
  }

  return {
    items,
    isLoading,
    error,
    addItem,
    toggleItem,
    removeItem,
    clearAllItems,
    clearCheckedItems,
  }
}

