import { ExportData } from './exportImport'

export const loadFromGist = async (gistUrl: string): Promise<ExportData> => {
  try {
    // Extract Gist ID from URL
    const gistId = extractGistId(gistUrl)
    if (!gistId) {
      throw new Error('Ungültige Gist-URL')
    }

    // Fetch from GitHub Gist API
    const apiUrl = `https://api.github.com/gists/${gistId}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error('Gist konnte nicht geladen werden')
    }

    const gistData = await response.json()
    
    // Get the first file content (should be our JSON)
    const files = Object.values(gistData.files) as any[]
    if (!files.length) {
      throw new Error('Gist enthält keine Dateien')
    }

    const content = files[0].content
    const data = JSON.parse(content) as ExportData

    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error('Ungültiges Datenformat')
    }

    return data
  } catch (error) {
    throw new Error('Fehler beim Laden vom Gist: ' + (error as Error).message)
  }
}

export const extractGistId = (url: string): string | null => {
  // Various Gist URL formats:
  // https://gist.github.com/username/GIST_ID
  // https://gist.github.com/GIST_ID
  // Just the ID: GIST_ID

  const patterns = [
    /gist\.github\.com\/[^\/]+\/([a-f0-9]+)/i,  // With username
    /gist\.github\.com\/([a-f0-9]+)/i,           // Without username
    /^([a-f0-9]{32})$/i,                         // Just ID (32 hex chars)
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export const validateGistUrl = (url: string): boolean => {
  return extractGistId(url) !== null
}

