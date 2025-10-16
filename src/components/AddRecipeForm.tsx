import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { Plus, X, Sparkles, HelpCircle } from 'lucide-react'
import clsx from 'clsx'
import { Recipe } from '../types/recipe'
import { detectPlatform } from '../utils/platformDetector'
import { extractYouTubeThumbnail, canAutoExtractThumbnail } from '../utils/thumbnailExtractor'
import { convertGoogleDriveUrl, isGoogleDriveUrl } from '../utils/googleDriveHelper'

interface AddRecipeFormProps {
  onAdd: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void
}

const AddRecipeForm = ({ onAdd }: AddRecipeFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showThumbnailHelp, setShowThumbnailHelp] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Bitte Titel eingeben!')
      return
    }

    const platform = detectPlatform(url)

    onAdd({
      title: title.trim(),
      url: url.trim() || '',
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      platform,
    })

    // Reset form
    setTitle('')
    setUrl('')
    setDescription('')
    setImageUrl('')
    setIsOpen(false)
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
    const value = e.target.value
    setImageUrl(value)
  }

  // Auto-convert Google Drive URLs when pasted
  useEffect(() => {
    if (imageUrl && isGoogleDriveUrl(imageUrl)) {
      const converted = convertGoogleDriveUrl(imageUrl)
      if (converted !== imageUrl) {
        setImageUrl(converted)
      }
    }
  }, [imageUrl])

  const handleAutoFillImage = () => {
    const thumbnail = extractYouTubeThumbnail(url)
    if (thumbnail) {
      setImageUrl(thumbnail)
    }
  }

  const handleToggleForm = () => {
    setIsOpen(!isOpen)
  }

  const handleToggleThumbnailHelp = () => {
    setShowThumbnailHelp(!showThumbnailHelp)
  }

  const canAutoFill = canAutoExtractThumbnail(url)
  const urlLower = url.toLowerCase()
  const isInstagram = urlLower.includes('instagram.com')
  const isFacebook = urlLower.includes('facebook.com') || urlLower.includes('fb.com')
  const isTikTok = urlLower.includes('tiktok.com')

  if (!isOpen) {
    return (
      <button
        onClick={handleToggleForm}
        data-test-id="open-add-recipe"
        aria-label="Neues Rezept hinzufügen"
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 font-bold text-lg"
      >
        <Plus className="h-6 w-6" />
        Neues Rezept hinzufügen
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-primary-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Plus className="h-6 w-6 text-primary-500" />
          Neues Rezept
        </h3>
        <button
          onClick={handleToggleForm}
          data-test-id="close-add-recipe"
          aria-label="Formular schließen"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="recipe-title" className="block text-sm font-medium text-gray-700 mb-1">
            Rezept-Titel *
          </label>
          <input
            id="recipe-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            data-test-id="recipe-title-input"
            aria-label="Rezept-Titel eingeben"
            placeholder="z.B. Spaghetti Carbonara"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* URL Input */}
        <div>
          <label htmlFor="recipe-url" className="block text-sm font-medium text-gray-700 mb-1">
            Link zum Rezept (optional)
          </label>
          <input
            id="recipe-url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            data-test-id="recipe-url-input"
            aria-label="Rezept-URL eingeben"
            placeholder="https://www.youtube.com/watch?v=... (oder leer für eigenes Rezept)"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            YouTube, Instagram, Facebook, TikTok Link - oder leer lassen für eigene Rezepte
          </p>
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="recipe-description" className="block text-sm font-medium text-gray-700 mb-1">
            Beschreibung (optional)
          </label>
          <textarea
            id="recipe-description"
            value={description}
            onChange={handleDescriptionChange}
            data-test-id="recipe-description-input"
            aria-label="Rezept-Beschreibung eingeben"
            placeholder="Was macht dieses Rezept besonders?"
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Image URL Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="recipe-image" className="block text-sm font-medium text-gray-700">
              Bild-URL (optional)
            </label>
            <div className="flex items-center gap-2">
              {canAutoFill && (
                <button
                  type="button"
                  onClick={handleAutoFillImage}
                  data-test-id="auto-fill-image"
                  aria-label="Bild automatisch aus YouTube laden"
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
                  data-test-id="thumbnail-help"
                  aria-label="Hilfe zum Thumbnail finden"
                  className="flex items-center gap-1 text-xs font-medium text-secondary-500 hover:text-secondary-600 transition-colors"
                >
                  <HelpCircle className="h-3 w-3" />
                  Hilfe
                </button>
              )}
            </div>
          </div>
          <input
            id="recipe-image"
            type="url"
            value={imageUrl}
            onChange={handleImageUrlChange}
            data-test-id="recipe-image-input"
            aria-label="Bild-URL eingeben"
            placeholder={canAutoFill ? "Klicke 'Auto-Fill' für YouTube-Thumbnail" : "Google Drive oder imgbb.com Link"}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
          />
          {canAutoFill && (
            <p className="text-xs text-primary-600 mt-1">
              💡 YouTube-Thumbnail verfügbar - klicke "Auto-Fill"
            </p>
          )}
          {imageUrl && isGoogleDriveUrl(imageUrl) && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Google Drive Link erkannt - wird automatisch konvertiert
            </p>
          )}

          {/* Thumbnail Help Dialog */}
          {showThumbnailHelp && (isInstagram || isFacebook || isTikTok) && (
            <div className="mt-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-blue-800 text-sm">
                  {isInstagram && '📷 Instagram Thumbnail finden'}
                  {isFacebook && '📘 Facebook Thumbnail finden'}
                  {isTikTok && '🎵 TikTok Thumbnail finden'}
                </h4>
                <button
                  type="button"
                  onClick={handleToggleThumbnailHelp}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {isInstagram && (
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Öffne den Instagram-Post im Browser</li>
                  <li>Rechtsklick auf das Bild/Video → "Bild-URL kopieren" oder "Grafik-Adresse kopieren"</li>
                  <li>Füge die URL hier ein</li>
                  <li><strong>Alternative:</strong> Screenshot vom Post machen</li>
                </ol>
              )}

              {isFacebook && (
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Öffne das Facebook-Video im Browser</li>
                  <li>Rechtsklick auf das Video-Thumbnail → "Grafikadresse kopieren"</li>
                  <li>Füge die URL hier ein</li>
                  <li><strong>Alternative:</strong> Screenshot machen</li>
                </ol>
              )}

              {isTikTok && (
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Öffne das TikTok-Video im Browser</li>
                  <li>Pause das Video bei einem guten Frame</li>
                  <li>Screenshot vom Video machen</li>
                </ol>
              )}

              <div className="mt-3 pt-3 border-t border-blue-300">
                <p className="text-xs font-bold text-blue-800 mb-2">📁 Mit Google Drive (empfohlen):</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Screenshot/Bild in Google Drive hochladen</li>
                  <li>Rechtsklick auf Datei → "Link teilen"</li>
                  <li>Auf "Eingeschränkt" klicken → "Jeder mit dem Link" wählen</li>
                  <li>Link kopieren (sieht aus wie: <code className="bg-blue-100 px-1">drive.google.com/file/d/XXXX/view</code>)</li>
                  <li>Ändere das Format zu: <code className="bg-blue-100 px-1 block mt-1">drive.google.com/uc?export=view&id=XXXX</code></li>
                  <li>Füge diesen Link hier ein</li>
                </ol>
              </div>

              <div className="mt-2 pt-2 border-t border-blue-300">
                <p className="text-xs font-bold text-blue-800 mb-1">🌐 Alternative: imgbb.com</p>
                <p className="text-xs text-blue-700">Kostenlos, kein Account nötig - einfach hochladen & Link kopieren</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          data-test-id="submit-recipe"
          aria-label="Rezept speichern"
          className={clsx(
            'w-full py-3 rounded-lg font-bold text-white transition-all duration-200',
            'bg-gradient-to-r from-primary-500 to-secondary-500',
            'hover:shadow-lg hover:scale-105'
          )}
        >
          Rezept speichern ⚡
        </button>
      </form>
    </div>
  )
}

export default AddRecipeForm

