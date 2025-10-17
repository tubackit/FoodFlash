import { useState, ChangeEvent, FormEvent } from 'react'
import { Search, X, Loader, Youtube } from 'lucide-react'
import { searchYouTubeVideos, YouTubeVideo } from '../services/youtube'
import clsx from 'clsx'

interface YouTubeSearchProps {
  onSelect: (video: YouTubeVideo) => void
  onClose: () => void
}

const YouTubeSearch = ({ onSelect, onClose }: YouTubeSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Check if we're in development mode (localhost) and have API key
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const hasApiKey = (import.meta as any).env?.VITE_YOUTUBE_API_KEY

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setError('')
    setVideos([])

    try {
      const results = await searchYouTubeVideos(searchTerm)
      setVideos(results)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoSelect = (video: YouTubeVideo) => {
    onSelect(video)
    onClose()
  }

  // Show warning if not on localhost or no API key
  if (!isLocal || !hasApiKey) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800/80 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
          <div className="mb-4">
            <Youtube className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-100 mb-2">
              YouTube-Suche nur lokal verfügbar
            </h3>
            <p className="text-gray-300 mb-6">
              Die YouTube-Suche funktioniert nur auf dem lokalen Development-Server 
              aus Sicherheitsgründen. Verwende die App lokal unter:
            </p>
            <code className="bg-slate-700 px-3 py-2 rounded text-primary-400 font-mono text-sm">
              http://localhost:5174/FoodFlash/
            </code>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800/80 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Youtube className="h-7 w-7 text-red-600" />
            Auf YouTube suchen
          </h3>
          <button
            onClick={onClose}
            data-test-id="close-youtube-search"
            aria-label="Suche schließen"
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-300" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Suche nach Rezepten... z.B. 'Carbonara'"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-600 rounded-lg focus:border-red-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              className={clsx(
                'absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg font-medium transition-all',
                isLoading || !searchTerm.trim()
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-red-600 text-white hover:bg-red-700'
              )}
            >
              {isLoading ? 'Suche...' : 'Suchen'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader className="h-8 w-8 text-red-600 animate-spin" />
          </div>
        )}

        {/* Results */}
        {!isLoading && videos.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <p className="text-sm text-gray-600 mb-3">
              {videos.length} Ergebnisse gefunden
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  data-test-id={`youtube-video-${video.id}`}
                  aria-label={`${video.title} auswählen`}
                  className="bg-slate-800/80 border-2 border-gray-600 rounded-xl overflow-hidden hover:border-red-400 hover:shadow-lg transition-all duration-200 text-left group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-700">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <Youtube className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h4 className="font-bold text-gray-100 text-sm line-clamp-2 mb-1">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {video.channelTitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && videos.length === 0 && searchTerm === '' && (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <Youtube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Suche nach Rezepten auf YouTube</p>
              <p className="text-sm text-gray-400 mt-2">z.B. "Spaghetti Carbonara"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubeSearch

