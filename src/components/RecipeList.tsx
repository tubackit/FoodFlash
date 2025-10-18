import { useFirebaseRecipes } from '../hooks/useFirebaseRecipes'
import AddRecipeForm from './AddRecipeForm'
import RecipeCard from './RecipeCard'
import SearchBar from './SearchBar'
import FamilySyncButton from './FamilySyncButton'
import YouTubeSearch from './YouTubeSearch'
import { BookOpen, X, Download, Upload, FileJson, Cloud, Youtube } from 'lucide-react'
import { useState, useMemo, useRef, ChangeEvent } from 'react'
import { Platform, Recipe } from '../types/recipe'
import { exportRecipes, importRecipes } from '../utils/exportImport'
import { loadFromGist, validateGistUrl } from '../utils/gistSync'
import { SHOW_SYNC_BUTTON } from '../config/gist'
import { YouTubeVideo } from '../services/youtube'
import { forceCleanupRecipeData, deletePizzaRecipeDirectly } from '../utils/cleanupOldData'
import clsx from 'clsx'

interface RecipeListProps {
  platformFilter?: Platform | null
  onClearFilter?: () => void
}

const RecipeList = ({ platformFilter, onClearFilter }: RecipeListProps) => {
  const { recipes, addRecipe, deleteRecipe, updateRecipe, isLoading } = useFirebaseRecipes()
  const [searchTerm, setSearchTerm] = useState('')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showGistDialog, setShowGistDialog] = useState(false)
  const [gistUrl, setGistUrl] = useState('')
  const [gistLoading, setGistLoading] = useState(false)
  const [saveGistUrl, setSaveGistUrl] = useState(true)
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false)

  // Filter recipes based on search term AND platform filter
  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    // Platform filter
    if (platformFilter) {
      filtered = filtered.filter((recipe) => recipe.platform === platformFilter)
    }

    // Search term filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter((recipe) => {
        const title = recipe.title.toLowerCase()
        const description = recipe.description.toLowerCase()
        const platform = recipe.platform.toLowerCase()
        const notes = (recipe.notes || '').toLowerCase()

        return (
          title.includes(search) ||
          description.includes(search) ||
          platform.includes(search) ||
          notes.includes(search)
        )
      })
    }

    return filtered
  }, [recipes, searchTerm, platformFilter])

  const handleExport = () => {
    exportRecipes(recipes)
  }

  const handleImportClick = () => {
    setShowImportDialog(true)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const data = await importRecipes(file)
      
      if (importMode === 'replace') {
        // Replace all recipes
        // We need to clear and add new ones
        // This will be handled by clearing localStorage and adding new recipes
        localStorage.removeItem('foodflash_recipes')
        data.recipes.forEach(recipe => addRecipe(recipe))
      } else {
        // Merge: Add only recipes that don't exist (check by URL or title)
        const existingUrls = new Set(recipes.map(r => r.url))
        const newRecipes = data.recipes.filter(r => !existingUrls.has(r.url))
        newRecipes.forEach(recipe => addRecipe(recipe))
      }

      setShowImportDialog(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      alert(`✅ ${importMode === 'replace' ? 'Ersetzt' : 'Hinzugefügt'}: ${data.recipes.length} Rezepte`)
    } catch (error) {
      alert('❌ Fehler beim Importieren: ' + (error as Error).message)
    }
  }

  const handleImportModeChange = (mode: 'merge' | 'replace') => {
    setImportMode(mode)
  }

  const handleCloseImportDialog = () => {
    setShowImportDialog(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleOpenGistDialog = () => {
    // Load saved Gist URL from localStorage
    const savedUrl = localStorage.getItem('foodflash_gist_url')
    if (savedUrl) {
      setGistUrl(savedUrl)
    }
    setShowGistDialog(true)
  }

  const handleCloseGistDialog = () => {
    setShowGistDialog(false)
    setGistUrl('')
  }

  const handleGistUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGistUrl(e.target.value)
  }

  const handleLoadFromGist = async () => {
    if (!gistUrl.trim()) {
      alert('Bitte Gist-URL eingeben!')
      return
    }

    if (!validateGistUrl(gistUrl)) {
      alert('Ungültige Gist-URL! Bitte überprüfe die URL.')
      return
    }

    setGistLoading(true)
    try {
      const data = await loadFromGist(gistUrl)
      
      if (importMode === 'replace') {
        localStorage.removeItem('foodflash_recipes')
        data.recipes.forEach(recipe => addRecipe(recipe))
      } else {
        const existingUrls = new Set(recipes.map(r => r.url))
        const newRecipes = data.recipes.filter(r => !existingUrls.has(r.url))
        newRecipes.forEach(recipe => addRecipe(recipe))
      }

      // Save Gist URL if checkbox is checked
      if (saveGistUrl) {
        localStorage.setItem('foodflash_gist_url', gistUrl)
      }

      setShowGistDialog(false)
      setGistUrl('')
      alert(`✅ ${data.recipes.length} Rezepte von Gist geladen!`)
    } catch (error) {
      alert('❌ ' + (error as Error).message)
    } finally {
      setGistLoading(false)
    }
  }

  const handleClearSavedGistUrl = () => {
    localStorage.removeItem('foodflash_gist_url')
    setGistUrl('')
    alert('✅ Gespeicherte Gist-URL wurde gelöscht')
  }

  const handleFamilySync = (familyRecipes: Recipe[]) => {
    // Add recipes from family gist
    const existingUrls = new Set(recipes.map(r => r.url))
    const newRecipes = familyRecipes.filter(r => !existingUrls.has(r.url))
    newRecipes.forEach(recipe => addRecipe(recipe))
  }

  const handleOpenYouTubeSearch = () => {
    setShowYouTubeSearch(true)
  }

  const handleCloseYouTubeSearch = () => {
    setShowYouTubeSearch(false)
  }

  const handleYouTubeVideoSelect = (video: YouTubeVideo) => {
    // Auto-fill recipe with YouTube video data
    addRecipe({
      title: video.title,
      url: video.url,
      description: video.description.slice(0, 200), // Limit description
      imageUrl: video.thumbnail,
      platform: 'youtube',
      ingredients: [],
      comments: [],
      rating: undefined,
      notes: '',
    })
    setShowYouTubeSearch(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-100 mb-2 flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 text-primary-500" />
          Deine Rezepte
        </h2>
        <p className="text-gray-600">
          {recipes.length === 0
            ? 'Füge dein erstes Rezept hinzu!'
            : `${recipes.length} ${recipes.length === 1 ? 'Rezept' : 'Rezepte'} gespeichert`}
        </p>
      </div>

      {/* Platform Filter Badge */}
      {platformFilter && onClearFilter && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium">
            <span>Filter: {platformFilter === 'youtube' ? 'YouTube' : platformFilter === 'instagram' ? 'Instagram' : platformFilter === 'facebook' ? 'Facebook' : platformFilter === 'tiktok' ? 'TikTok' : platformFilter === 'own' ? 'Eigene Rezepte' : platformFilter}</span>
            <button
              onClick={onClearFilter}
              data-test-id="clear-platform-filter"
              aria-label="Filter entfernen"
              className="p-1 hover:bg-primary-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Recipe Form */}
      <div className="mb-8">
        <AddRecipeForm onAdd={(recipe) => addRecipe({ 
          ...recipe, 
          ingredients: recipe.ingredients || [],
          comments: [], 
          rating: undefined 
        })} />
      </div>

      {/* Debug Buttons */}
      <div className="mb-6 text-center space-y-2">
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => {
              if (confirm('🍕 Pizzarezept direkt aus Firebase löschen?\n\nDies umgeht alle Konflikte und löscht das Rezept sofort.')) {
                deletePizzaRecipeDirectly()
              }
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Pizzarezept löschen
          </button>
          
          <button
            onClick={() => {
              if (confirm('🧹 Alte Daten bereinigen und Seite neu laden?\n\nDies kann helfen, wenn Rezepte nicht gelöscht werden können.')) {
                forceCleanupRecipeData()
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Alte Daten bereinigen
          </button>
        </div>
      </div>

      {/* Family Sync Button */}
      {SHOW_SYNC_BUTTON && (
        <div className="mb-6">
          <FamilySyncButton onSync={handleFamilySync} mode="merge" />
        </div>
      )}

      {/* YouTube Search Button */}
      <div className="mb-6">
        <button
          onClick={handleOpenYouTubeSearch}
          data-test-id="youtube-search"
          aria-label="Auf YouTube nach Rezepten suchen"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 font-bold text-lg"
        >
          <Youtube className="h-6 w-6" />
          Rezept auf YouTube suchen
        </button>
      </div>

      {/* YouTube Search Modal */}
      {showYouTubeSearch && (
        <YouTubeSearch
          onSelect={handleYouTubeVideoSelect}
          onClose={handleCloseYouTubeSearch}
        />
      )}

      {/* Export/Import Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {recipes.length > 0 && (
          <button
            onClick={handleExport}
            data-test-id="export-recipes"
            aria-label="Rezepte exportieren"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Download className="h-5 w-5" />
            Exportieren
          </button>
        )}
        <button
          onClick={handleImportClick}
          data-test-id="import-recipes"
          aria-label="Rezepte importieren"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Upload className="h-5 w-5" />
          Datei
        </button>
        <button
          onClick={handleOpenGistDialog}
          data-test-id="load-from-gist"
          aria-label="Von GitHub Gist laden"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Cloud className="h-5 w-5" />
          Gist-Cloud
        </button>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/80 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <FileJson className="h-6 w-6 text-secondary-500" />
                Rezepte importieren
              </h3>
              <button
                onClick={handleCloseImportDialog}
                data-test-id="close-import-dialog"
                aria-label="Dialog schließen"
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Import Mode Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-200 mb-2">Import-Modus:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="import-mode"
                    checked={importMode === 'merge'}
                    onChange={() => handleImportModeChange('merge')}
                    className="w-4 h-4 text-secondary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-100">Hinzufügen</span>
                    <p className="text-xs text-gray-600">Neue Rezepte zu bestehenden hinzufügen</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="import-mode"
                    checked={importMode === 'replace'}
                    onChange={() => handleImportModeChange('replace')}
                    className="w-4 h-4 text-secondary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-100">Ersetzen</span>
                    <p className="text-xs text-gray-600">Alle bestehenden Rezepte löschen und ersetzen</p>
                  </div>
                </label>
              </div>
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
              id="recipe-file-input"
            />
            <label
              htmlFor="recipe-file-input"
              className={clsx(
                'block w-full py-3 text-center rounded-lg font-bold cursor-pointer transition-all duration-200',
                'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:shadow-lg hover:scale-105'
              )}
            >
              Datei auswählen
            </label>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Wähle eine FoodFlash JSON-Datei aus
            </p>
          </div>
        </div>
      )}

      {/* GitHub Gist Dialog */}
      {showGistDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <Cloud className="h-6 w-6 text-blue-500" />
                Von GitHub Gist laden
              </h3>
              <button
                onClick={handleCloseGistDialog}
                data-test-id="close-gist-dialog"
                aria-label="Dialog schließen"
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Info Box */}
            <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">💡 So funktioniert's:</p>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                <li>Ein Familienmitglied erstellt einen <strong>öffentlichen Gist</strong> mit der Export-Datei</li>
                <li>Gist-URL wird mit der Familie geteilt</li>
                <li>Alle laden die Rezepte von dieser URL</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                📖 <a href="https://gist.github.com" target="_blank" rel="noopener noreferrer" className="underline">gist.github.com</a> - kostenlos & einfach!
              </p>
            </div>

            {/* Import Mode Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-200 mb-2">Import-Modus:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gist-import-mode"
                    checked={importMode === 'merge'}
                    onChange={() => handleImportModeChange('merge')}
                    className="w-4 h-4 text-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-100">Hinzufügen</span>
                    <p className="text-xs text-gray-600">Neue Rezepte zu bestehenden hinzufügen</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gist-import-mode"
                    checked={importMode === 'replace'}
                    onChange={() => handleImportModeChange('replace')}
                    className="w-4 h-4 text-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-100">Ersetzen</span>
                    <p className="text-xs text-gray-600">Alle bestehenden Rezepte löschen und ersetzen</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Gist URL Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gist-url" className="block text-sm font-medium text-gray-200">
                  GitHub Gist URL
                </label>
                {localStorage.getItem('foodflash_gist_url') && (
                  <button
                    onClick={handleClearSavedGistUrl}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    URL löschen
                  </button>
                )}
              </div>
              <input
                id="gist-url"
                type="url"
                value={gistUrl}
                onChange={handleGistUrlChange}
                placeholder="https://gist.github.com/username/..."
                className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Z.B.: https://gist.github.com/username/abc123...
              </p>
              
              {/* Save URL Checkbox */}
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveGistUrl}
                  onChange={(e) => setSaveGistUrl(e.target.checked)}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-sm text-gray-200">URL für nächstes Mal speichern</span>
              </label>
            </div>

            {/* Load Button */}
            <button
              onClick={handleLoadFromGist}
              disabled={gistLoading}
              className={clsx(
                'w-full py-3 rounded-lg font-bold text-white transition-all duration-200',
                gistLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:scale-105'
              )}
            >
              {gistLoading ? 'Lade...' : 'Von Gist laden'}
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {recipes.length > 0 && (
        <div className="mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-slate-800/80 rounded-2xl p-12 text-center shadow-lg">
          <div className="text-6xl mb-4 animate-pulse">🔄</div>
          <h3 className="text-2xl font-bold text-gray-200 mb-2">
            Lade Rezepte...
          </h3>
          <p className="text-gray-400">
            Synchronisiere mit der Cloud ☁️
          </p>
        </div>
      ) : /* Recipe Grid */
      recipes.length > 0 ? (
        filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onDelete={deleteRecipe}
                onUpdate={updateRecipe}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/80 rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-200 mb-2">
              Keine Ergebnisse
            </h3>
            <p className="text-gray-500">
              Keine Rezepte für "{searchTerm}" gefunden.
            </p>
          </div>
        )
      ) : (
        <div className="bg-slate-800/80 rounded-2xl p-12 text-center shadow-lg">
          <div className="text-6xl mb-4">🍳</div>
          <h3 className="text-2xl font-bold text-gray-200 mb-2">
            Noch keine Rezepte
          </h3>
          <p className="text-gray-500">
            Klicke auf den Button oben, um dein erstes Rezept zu speichern!
          </p>
        </div>
      )}
    </div>
  )
}

export default RecipeList

