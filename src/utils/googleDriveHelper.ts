/**
 * Converts a Google Drive share link to a direct image URL
 * Supports multiple formats and cleans up parameters
 */
export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url

  // Check if it's a Google Drive URL
  if (!url.includes('drive.google.com')) return url

  try {
    // Extract FILE_ID from various Google Drive URL formats
    let fileId: string | null = null

    // Remove any URL parameters first (like ?usp=sharing)
    const cleanUrl = url.split('?')[0]

    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = cleanUrl.match(/\/file\/d\/([^/]+)/)
    if (fileMatch) {
      fileId = fileMatch[1]
    }

    // Format 2: https://drive.google.com/open?id=FILE_ID
    if (!fileId) {
      const openMatch = url.match(/[?&]id=([^&]+)/)
      if (openMatch) {
        fileId = openMatch[1]
      }
    }

    // Format 3: Already has uc?export or uc?id - extract ID
    if (!fileId) {
      const ucMatch = url.match(/[?&]id=([^&]+)/)
      if (ucMatch) {
        fileId = ucMatch[1]
      }
    }

    // If we found a file ID, return the direct view URL
    if (fileId) {
      // Use thumbnail endpoint for better compatibility
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
    }

    // If already in correct format, return as is
    if (url.includes('uc?export=view') || url.includes('thumbnail?id=')) {
      return url
    }

    return url
  } catch (error) {
    console.error('Error converting Google Drive URL:', error)
    return url
  }
}

export const isGoogleDriveUrl = (url: string): boolean => {
  return Boolean(url && url.includes('drive.google.com'))
}

