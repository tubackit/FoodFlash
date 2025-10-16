import { Platform } from '../types/recipe'

export const detectPlatform = (url: string): Platform => {
  if (!url || url.trim() === '') {
    return 'own' // Eigene Rezepte ohne URL
  }

  const urlLower = url.toLowerCase()

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube'
  }
  if (urlLower.includes('instagram.com')) {
    return 'instagram'
  }
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
    return 'facebook'
  }
  if (urlLower.includes('tiktok.com')) {
    return 'tiktok'
  }

  return 'other'
}

