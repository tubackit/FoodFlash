/**
 * Komprimiert ein Bild auf eine maximale Größe
 * @param file - Die Bild-Datei
 * @param maxWidth - Maximale Breite (Standard: 800px)
 * @param maxHeight - Maximale Höhe (Standard: 600px)
 * @param quality - Qualität 0-1 (Standard: 0.85)
 * @returns Promise mit komprimiertem Blob
 */
export const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.85
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Canvas erstellen
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Canvas context nicht verfügbar'))
          return
        }

        // Berechne neue Dimensionen (Aspect Ratio beibehalten)
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Setze Canvas-Größe
        canvas.width = width
        canvas.height = height

        // Zeichne komprimiertes Bild
        ctx.drawImage(img, 0, 0, width, height)

        // Konvertiere zu Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Fehler beim Komprimieren'))
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('Fehler beim Laden des Bildes'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Validiert eine Bild-Datei
 * @param file - Die zu validierende Datei
 * @param maxSizeMB - Maximale Dateigröße in MB (Standard: 10)
 * @returns true wenn valid, sonst Fehlermeldung
 */
export const validateImageFile = (file: File, maxSizeMB = 10): string | true => {
  // Prüfe Dateityp
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return 'Nur JPEG, PNG und WebP Bilder sind erlaubt!'
  }

  // Prüfe Dateigröße
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `Datei zu groß! Maximum: ${maxSizeMB} MB`
  }

  return true
}

