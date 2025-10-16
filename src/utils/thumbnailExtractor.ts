export const extractYouTubeThumbnail = (url: string): string | null => {
  if (!url) return null

  try {
    const urlLower = url.toLowerCase()
    let videoId: string | null = null

    // YouTube URL patterns
    if (urlLower.includes('youtube.com/watch')) {
      const urlObj = new URL(url)
      videoId = urlObj.searchParams.get('v')
    } else if (urlLower.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([^?&]+)/)
      videoId = match ? match[1] : null
    } else if (urlLower.includes('youtube.com/embed/')) {
      const match = url.match(/youtube\.com\/embed\/([^?&]+)/)
      videoId = match ? match[1] : null
    }

    if (videoId) {
      // Use maxresdefault for best quality (falls back to hqdefault if not available)
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }

    return null
  } catch (error) {
    console.error('Error extracting YouTube thumbnail:', error)
    return null
  }
}

export const canAutoExtractThumbnail = (url: string): boolean => {
  if (!url) return false
  const urlLower = url.toLowerCase()
  return urlLower.includes('youtube.com') || urlLower.includes('youtu.be')
}

