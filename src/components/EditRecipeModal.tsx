import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { X, Save, Sparkles, HelpCircle, Upload, Trash2 } from 'lucide-react'
import { Recipe, Ingredient } from '../types/recipe'
import { detectPlatform } from '../utils/platformDetector'
import { extractYouTubeThumbnail, canAutoExtractThumbnail } from '../utils/thumbnailExtractor'
import { convertGoogleDriveUrl, isGoogleDriveUrl } from '../utils/googleDriveHelper'
import { validateImageFile } from '../utils/imageCompression'
import { uploadRecipeImage, deleteRecipeImage, isFirebaseStorageUrl } from '../utils/firebaseImageUpload'
import IngredientsInput from './IngredientsInput'

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
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients || [])
  const [showThumbnailHelp, setShowThumbnailHelp] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(recipe.uploadedImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [deleteOldImage, setDeleteOldImage] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Bitte Titel eingeben!')
      return
    }

    setIsUploading(true)

    try {
      const platform = detectPlatform(url)
      let uploadedImageUrl = uploadedImagePreview

      // Upload new image if file selected
      if (uploadedFile) {
        uploadedImageUrl = await uploadRecipeImage(uploadedFile, recipe.id)

        // Delete old image if it exists and is from Firebase Storage
        if (recipe.uploadedImageUrl && isFirebaseStorageUrl(recipe.uploadedImageUrl)) {
          await deleteRecipeImage(recipe.uploadedImageUrl)
        }
      }

      // Delete image if requested
      if (deleteOldImage && recipe.uploadedImageUrl && isFirebaseStorageUrl(recipe.uploadedImageUrl)) {
        await deleteRecipeImage(recipe.uploadedImageUrl)
        uploadedImageUrl = null
      }

      onSave(recipe.id, {
        title: title.trim(),
        url: url.trim() || '',
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        uploadedImageUrl: uploadedImageUrl || undefined,
        ingredients,
        platform,
      })

      onClose()
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
      alert('Fehler beim Hochladen des Bildes!')
    } finally {
      setIsUploading(false)
    }
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validiere Datei
    const validation = validateImageFile(file)
    if (validation !== true) {
      alert(validation)
      return
    }

    // Setze File und erstelle Preview
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setDeleteOldImage(false)
  }

  const handleRemoveUploadedImage = () => {
    setUploadedFile(null)
    setUploadedImagePreview(null)
    setDeleteOldImage(true)
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
      <div className="bg-slate-800/80 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-100">
            Rezept bearbeiten
          </h3>
          <button
            onClick={onClose}
            data-test-id="close-edit-modal"
            aria-label="Bearbeiten abbrechen"
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-200 mb-1">
              Rezept-Titel *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="z.B. Spaghetti Carbonara"
              className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
              required
            />
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-gray-200 mb-1">
              Link zum Rezept (optional)
            </label>
            <input
              id="edit-url"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=... (oder leer für eigenes Rezept)"
              className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-200 mb-1">
              Beschreibung (optional)
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Was macht dieses Rezept besonders?"
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none bg-slate-700 text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Ingredients Input */}
          <IngredientsInput ingredients={ingredients} onChange={setIngredients} />

          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-primary-500/30 rounded-xl p-4 bg-slate-700/30">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-200">
                📸 Eigenes Foto hochladen (optional)
              </label>
              <span className="text-xs text-gray-400">Max. 10 MB</span>
            </div>

            {!uploadedImagePreview ? (
              <div>
                <input
                  id="edit-image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="edit-image-upload"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-slate-600/30 transition-all"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-300 mb-1">
                    Klicke hier oder ziehe ein Bild rein
                  </span>
                  <span className="text-xs text-gray-500">
                    JPEG, PNG oder WebP • Wird automatisch komprimiert
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={uploadedImagePreview}
                  alt="Vorschau"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveUploadedImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {uploadedFile ? '✓ Bereit zum Upload' : '✓ Aktuelles Foto'}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2 text-center">
              💡 <strong>Hybrid-Lösung:</strong> Du kannst sowohl ein eigenes Foto hochladen als auch eine YouTube-URL unten angeben!
            </p>
          </div>

          {/* Image URL Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="edit-image" className="block text-sm font-medium text-gray-200">
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
              className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-slate-700 text-gray-100 placeholder-gray-400"
            />
            {imageUrl && isGoogleDriveUrl(imageUrl) && (
              <p className="text-xs text-green-400 mt-1">
                ✅ Google Drive Link erkannt - wird automatisch konvertiert
              </p>
            )}
            
            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-200 mb-1">Vorschau:</p>
                <div className="relative w-full h-40 bg-slate-700 rounded-lg overflow-hidden border-2 border-gray-600">
                  <img
                    src={convertGoogleDriveUrl(imageUrl)}
                    alt="Vorschau"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center h-full text-red-500 text-sm p-4 text-center"><div><p class="font-bold">❌ Bild kann nicht geladen werden</p><p class="text-xs mt-1">Prüfe Google Drive Freigabe:<br/>"Jeder mit dem Link"</p></div></div>'
                      }
                    }}
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement
                      const parent = target.parentElement
                      if (parent) {
                        const successDiv = document.createElement('div')
                        successDiv.className = 'absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium'
                        successDiv.textContent = '✓ OK'
                        parent.appendChild(successDiv)
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Thumbnail Help */}
            {showThumbnailHelp && (isInstagram || isFacebook || isTikTok) && (
              <div className="mt-3 p-3 bg-slate-700 border border-primary-500/30 rounded-lg text-xs text-gray-200">
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
              disabled={isUploading}
              className="flex-1 py-3 rounded-lg font-medium bg-slate-700 text-gray-100 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`flex-1 py-3 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isUploading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isUploading ? (
                <>⏳ Wird hochgeladen...</>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Speichern
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRecipeModal

