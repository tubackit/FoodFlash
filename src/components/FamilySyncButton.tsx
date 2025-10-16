import { useState } from 'react'
import { RefreshCw, Cloud } from 'lucide-react'
import clsx from 'clsx'
import { loadFromGist } from '../utils/gistSync'
import { FAMILY_GIST_URL } from '../config/gist'
import { Recipe } from '../types/recipe'

interface FamilySyncButtonProps {
  onSync: (recipes: Recipe[]) => void
  mode?: 'merge' | 'replace'
}

const FamilySyncButton = ({ onSync, mode = 'merge' }: FamilySyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(
    localStorage.getItem('foodflash_last_sync')
  )

  const handleSync = async () => {
    setIsLoading(true)
    try {
      const data = await loadFromGist(FAMILY_GIST_URL)
      
      if (mode === 'replace') {
        localStorage.removeItem('foodflash_recipes')
      }
      
      onSync(data.recipes)
      
      const now = new Date().toISOString()
      setLastSync(now)
      localStorage.setItem('foodflash_last_sync', now)
      
      alert(`✅ ${data.recipes.length} Familien-Rezepte geladen!`)
    } catch (error) {
      alert('❌ Fehler beim Laden: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatLastSync = () => {
    if (!lastSync) return 'Nie'
    const date = new Date(lastSync)
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 shadow-lg text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          <h3 className="font-bold">Familien-Rezepte</h3>
        </div>
        <p className="text-xs opacity-90">Letzter Sync: {formatLastSync()}</p>
      </div>

      <button
        onClick={handleSync}
        disabled={isLoading}
        data-test-id="family-sync"
        aria-label="Familien-Rezepte synchronisieren"
        className={clsx(
          'w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2',
          isLoading
            ? 'bg-white/30 cursor-not-allowed'
            : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md'
        )}
      >
        <RefreshCw className={clsx('h-4 w-4', isLoading && 'animate-spin')} />
        {isLoading ? 'Lade...' : 'Familien-Rezepte aktualisieren'}
      </button>

      <p className="text-xs opacity-75 mt-2 text-center">
        Lädt die neuesten Rezepte von der Familien-Cloud
      </p>
    </div>
  )
}

export default FamilySyncButton

