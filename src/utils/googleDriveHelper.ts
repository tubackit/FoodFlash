/**
 * Converts a Google Drive share link to a direct image URL
 * From: https://drive.google.com/file/d/FILE_ID/view
 * To: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url

  // Check if it's a Google Drive URL
  if (!url.includes('drive.google.com')) return url

  try {
    // Extract FILE_ID from various Google Drive URL formats
    let fileId: string | null = null

    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = url.match(/\/file\/d\/([^/]+)/)
    if (fileMatch) {
      fileId = fileMatch[1]
    }

    // Format 2: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([^&]+)/)
    if (openMatch) {
      fileId = openMatch[1]
    }

    // If we found a file ID, return the direct view URL
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }

    // If already in correct format, return as is
    if (url.includes('uc?export=view') || url.includes('uc?id=')) {
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

