import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../config/firebase'
import { compressImage } from './imageCompression'

/**
 * Lädt ein Bild zu Firebase Storage hoch
 * @param file - Die Bild-Datei
 * @param recipeId - Die ID des Rezepts (für eindeutigen Pfad)
 * @returns Promise mit Download-URL
 */
export const uploadRecipeImage = async (file: File, recipeId: string): Promise<string> => {
  try {
    // Komprimiere Bild
    const compressedBlob = await compressImage(file)

    // Erstelle eindeutigen Dateinamen
    const timestamp = Date.now()
    const fileExtension = 'jpg' // Komprimierte Bilder sind immer JPEG
    const fileName = `recipe-${recipeId}-${timestamp}.${fileExtension}`

    // Storage-Referenz erstellen
    const storageRef = ref(storage, `recipe-images/${fileName}`)

    // Upload
    await uploadBytes(storageRef, compressedBlob)

    // Download-URL holen
    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
  } catch (error) {
    console.error('Fehler beim Upload:', error)
    throw new Error('Bild konnte nicht hochgeladen werden')
  }
}

/**
 * Löscht ein Bild aus Firebase Storage
 * @param imageUrl - Die vollständige Download-URL des Bildes
 */
export const deleteRecipeImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extrahiere Storage-Pfad aus URL
    const urlParts = imageUrl.split('/o/')
    if (urlParts.length < 2) {
      console.warn('Ungültige Storage-URL, kann nicht gelöscht werden')
      return
    }

    const pathPart = urlParts[1].split('?')[0]
    const filePath = decodeURIComponent(pathPart)

    // Storage-Referenz erstellen
    const storageRef = ref(storage, filePath)

    // Löschen
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Fehler beim Löschen:', error)
    // Fehler nicht werfen - Bild könnte bereits gelöscht sein
  }
}

/**
 * Extrahiert die Storage-Pfad aus einer Firebase Storage URL
 * @param url - Die Firebase Storage URL
 * @returns Der Pfad oder null
 */
export const extractStoragePath = (url: string): string | null => {
  try {
    const urlParts = url.split('/o/')
    if (urlParts.length < 2) return null

    const pathPart = urlParts[1].split('?')[0]
    return decodeURIComponent(pathPart)
  } catch {
    return null
  }
}

/**
 * Prüft ob eine URL eine Firebase Storage URL ist
 * @param url - Die zu prüfende URL
 * @returns true wenn Firebase Storage URL
 */
export const isFirebaseStorageUrl = (url: string): boolean => {
  return url.includes('firebasestorage.googleapis.com') || url.includes('firebasestorage.app')
}

