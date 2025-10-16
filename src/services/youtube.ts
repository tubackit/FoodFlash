export interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  description: string
  url: string
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

export const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  if (!API_KEY) {
    throw new Error('YouTube API Key fehlt! Bitte in .env Datei eintragen.')
  }

  const searchQuery = `${query} rezept`
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=12&key=${API_KEY}`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('API-Key ungültig oder Quota überschritten')
      }
      throw new Error('YouTube API Fehler: ' + response.statusText)
    }

    const data = await response.json()

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }))
  } catch (error) {
    console.error('YouTube API Error:', error)
    throw error
  }
}

export const getVideoDetails = async (videoUrl: string): Promise<YouTubeVideo | null> => {
  if (!API_KEY) {
    throw new Error('YouTube API Key fehlt!')
  }

  // Extract video ID from URL
  const videoId = extractVideoId(videoUrl)
  if (!videoId) {
    throw new Error('Ungültige YouTube-URL')
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Video konnte nicht geladen werden')
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error('Video nicht gefunden')
    }

    const item = data.items[0]
    return {
      id: videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.maxresdefault?.url || item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      url: videoUrl,
    }
  } catch (error) {
    console.error('YouTube Video Details Error:', error)
    throw error
  }
}

const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

