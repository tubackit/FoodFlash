import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { X, Save, Sparkles, HelpCircle } from 'lucide-react'
import { Recipe } from '../types/recipe'
import { detectPlatform } from '../utils/platformDetector'
import { extractYouTubeThumbnail, canAutoExtractThumbnail } from '../utils/thumbnailExtractor'
import { convertGoogleDriveUrl, isGoogleDriveUrl } from '../utils/googleDriveHelper'

interface EditRecipeModalProps {
  recipe: Recipe
  onSave: (id: string, updates: Partial<Recipe>) => void
  onClose: () => void
}

const EditRecipeModal = ({ recipe, onSave, onClose }: EditRecipeModalProps) => {
  const [title, setTitle] = useState(recipe.title)
  const [url, setUrl] = useState(recipe.url)
  const [description, setDescription] = useState(recipe.description)
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || '')
  const [showThumbnailHelp, setShowThumbnailHelp] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Bitte Titel eingeben!')
      return
    }

    const platform = detectPlatform(url)

    onSave(recipe.id, {
      title: title.trim(),
      url: url.trim() || '',
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      platform,
    })

    onClose()
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleAutoFillImage = () => {
    const thumbnail = extractYouTubeThumbnail(url)
    if (thumbnail) {
      setImageUrl(thumbnail)
    }
  }

  const handleToggleThumbnailHelp = () => {
    setShowThumbnailHelp(!showThumbnailHelp)
  }

  // Auto-convert Google Drive URLs
  useEffect(() => {
    if (imageUrl && isGoogleDriveUrl(imageUrl)) {
      const converted = convertGoogleDriveUrl(imageUrl)
      if (converted !== imageUrl) {
        setImageUrl(converted)
      }
    }
  }, [imageUrl])

  const canAutoFill = canAutoExtractThumbnail(url)
  const urlLower = url.toLowerCase()
  const isInstagram = urlLower.includes('instagram.com')
  const isFacebook = urlLower.includes('facebook.com') || urlLower.includes('fb.com')
  const isTikTok = urlLower.includes('tiktok.com')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Rezept bearbeiten
          </h3>
          <button
            onClick={onClose}
            data-test-id="close-edit-modal"
            aria-label="Bearbeiten abbrechen"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
              Rezept-Titel *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="z.B. Spaghetti Carbonara"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 mb-1">
              Link zum Rezept (optional)
            </label>
            <input
              id="edit-url"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=... (oder leer für eigenes Rezept)"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung (optional)
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Was macht dieses Rezept besonders?"
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Image URL Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700">
                Bild-URL (optional)
              </label>
              <div className="flex items-center gap-2">
                {canAutoFill && (
                  <button
                    type="button"
                    onClick={handleAutoFillImage}
                    className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    Auto-Fill
                  </button>
                )}
                {(isInstagram || isFacebook || isTikTok) && (
                  <button
                    type="button"
                    onClick={handleToggleThumbnailHelp}
                    className="flex items-center gap-1 text-xs font-medium text-secondary-500 hover:text-secondary-600 transition-colors"
                  >
                    <HelpCircle className="h-3 w-3" />
                    Hilfe
                  </button>
                )}
              </div>
            </div>
            <input
              id="edit-image"
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Google Drive oder imgbb.com Link"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
            {imageUrl && isGoogleDriveUrl(imageUrl) && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Google Drive Link erkannt
              </p>
            )}

            {/* Thumbnail Help */}
            {showThumbnailHelp && (isInstagram || isFacebook || isTikTok) && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                <p className="font-bold mb-1">💡 Tipp:</p>
                <p>Screenshot machen und auf <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline">imgbb.com</a> oder Google Drive hochladen</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
            >
              <Save className="h-5 w-5" />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRecipeModal

