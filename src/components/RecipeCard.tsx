import { Youtube, Instagram, Facebook, Music, ExternalLink, Trash2, Globe, StickyNote, Save, MessageCircle, Send, Edit } from 'lucide-react'
import clsx from 'clsx'
import { Recipe, Platform, Comment } from '../types/recipe'
import { useState, ChangeEvent, FormEvent } from 'react'
import StarRating from './StarRating'
import EditRecipeModal from './EditRecipeModal'

interface RecipeCardProps {
  recipe: Recipe
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Recipe>) => void
}

const platformConfig: Record<Platform, { icon: typeof Youtube; color: string; label: string }> = {
  youtube: { icon: Youtube, color: 'bg-red-100 text-red-600 border-red-200', label: 'YouTube' },
  instagram: { icon: Instagram, color: 'bg-pink-100 text-pink-600 border-pink-200', label: 'Instagram' },
  facebook: { icon: Facebook, color: 'bg-blue-100 text-blue-600 border-blue-200', label: 'Facebook' },
  tiktok: { icon: Music, color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'TikTok' },
  own: { icon: StickyNote, color: 'bg-green-100 text-green-600 border-green-200', label: 'Eigenes Rezept' },
  other: { icon: Globe, color: 'bg-purple-100 text-purple-600 border-purple-200', label: 'Andere' },
}

const RecipeCard = ({ recipe, onDelete, onUpdate }: RecipeCardProps) => {
  const config = platformConfig[recipe.platform]
  const Icon = config.icon
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState(recipe.notes || '')
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)

  const handleDelete = () => {
    if (confirm(`Möchtest du "${recipe.title}" wirklich löschen?`)) {
      onDelete(recipe.id)
    }
  }

  const handleOpenLink = () => {
    if (recipe.url && recipe.url.trim() !== '') {
      window.open(recipe.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotesValue(e.target.value)
  }

  const handleSaveNotes = () => {
    onUpdate(recipe.id, { notes: notesValue })
    setIsEditingNotes(false)
  }

  const handleToggleNotes = () => {
    if (isEditingNotes) {
      // Cancel editing - reset to original value
      setNotesValue(recipe.notes || '')
    }
    setIsEditingNotes(!isEditingNotes)
  }

  const handleRatingChange = (newRating: number) => {
    onUpdate(recipe.id, { rating: newRating })
  }

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value)
  }

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment: Comment = {
      id: crypto.randomUUID(),
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedComments = [...recipe.comments, newComment]
    onUpdate(recipe.id, { comments: updatedComments })
    setCommentText('')
  }

  const handleToggleComments = () => {
    setShowComments(!showComments)
  }

  const handleOpenEditModal = () => {
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }

  const handleSaveEdit = (id: string, updates: Partial<Recipe>) => {
    onUpdate(id, updates)
    setShowEditModal(false)
  }

  return (
    <>
      {showEditModal && (
        <EditRecipeModal
          recipe={recipe}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-gray-100">
      {/* Image */}
      {recipe.imageUrl ? (
        <div className="h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 flex items-center justify-center">
          <Icon className="h-16 w-16 text-white opacity-50" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Platform Badge & Edit Button */}
        <div className="flex items-center justify-between mb-3">
          <div className={clsx('inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border-2', config.color)}>
            <Icon className="h-4 w-4" />
            {config.label}
          </div>
          <button
            onClick={handleOpenEditModal}
            data-test-id={`edit-recipe-${recipe.id}`}
            aria-label={`Rezept ${recipe.title} bearbeiten`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-primary-600"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {recipe.description}
          </p>
        )}

        {/* Date */}
        <p className="text-xs text-gray-400 mb-4">
          Hinzugefügt: {new Date(recipe.createdAt).toLocaleDateString('de-DE')}
        </p>

        {/* Rating Section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Bewertung</span>
            {recipe.rating && (
              <span className="text-xs text-gray-500">{recipe.rating}/5</span>
            )}
          </div>
          <StarRating
            rating={recipe.rating || 0}
            onRatingChange={handleRatingChange}
            size="lg"
          />
        </div>

        {/* Notes Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <StickyNote className="h-4 w-4 text-accent-500" />
              Notizen
            </div>
            <button
              onClick={handleToggleNotes}
              data-test-id={`toggle-notes-${recipe.id}`}
              aria-label={isEditingNotes ? 'Notizen-Bearbeitung abbrechen' : 'Notizen bearbeiten'}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              {isEditingNotes ? 'Abbrechen' : 'Bearbeiten'}
            </button>
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notesValue}
                onChange={handleNotesChange}
                data-test-id={`notes-input-${recipe.id}`}
                aria-label="Notizen bearbeiten"
                placeholder="Füge deine Notizen hinzu..."
                rows={3}
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-accent-500 focus:outline-none transition-colors resize-none"
              />
              <button
                onClick={handleSaveNotes}
                data-test-id={`save-notes-${recipe.id}`}
                aria-label="Notizen speichern"
                className={clsx(
                  'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'bg-accent-500 text-white hover:bg-accent-600'
                )}
              >
                <Save className="h-4 w-4" />
                Speichern
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 min-h-[60px]">
              {recipe.notes || (
                <span className="text-gray-400 italic">Keine Notizen vorhanden</span>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <button
            onClick={handleToggleComments}
            data-test-id={`toggle-comments-${recipe.id}`}
            aria-label={showComments ? 'Kommentare ausblenden' : 'Kommentare anzeigen'}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-secondary-500" />
              Kommentare
              {recipe.comments.length > 0 && (
                <span className="bg-secondary-100 text-secondary-700 text-xs px-2 py-0.5 rounded-full">
                  {recipe.comments.length}
                </span>
              )}
            </div>
            <span className="text-xs text-primary-500">
              {showComments ? 'Ausblenden' : 'Anzeigen'}
            </span>
          </button>

          {showComments && (
            <div className="mt-3 space-y-3">
              {/* Comment List */}
              {recipe.comments.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recipe.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <p className="text-gray-700">{comment.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={handleCommentChange}
                  data-test-id={`comment-input-${recipe.id}`}
                  aria-label="Kommentar hinzufügen"
                  placeholder="Kommentar hinzufügen..."
                  className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-secondary-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  data-test-id={`add-comment-${recipe.id}`}
                  aria-label="Kommentar senden"
                  disabled={!commentText.trim()}
                  className={clsx(
                    'px-3 py-2 rounded-lg transition-all duration-200',
                    commentText.trim()
                      ? 'bg-secondary-500 text-white hover:bg-secondary-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {recipe.url && recipe.url.trim() !== '' && (
            <button
              onClick={handleOpenLink}
              data-test-id={`open-recipe-${recipe.id}`}
              aria-label={`Rezept ${recipe.title} öffnen`}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md'
              )}
            >
              <ExternalLink className="h-4 w-4" />
              Öffnen
            </button>
          )}
          <button
            onClick={handleDelete}
            data-test-id={`delete-recipe-${recipe.id}`}
            aria-label={`Rezept ${recipe.title} löschen`}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              'bg-red-100 text-red-600 hover:bg-red-200',
              !recipe.url || recipe.url.trim() === '' ? 'flex-1' : ''
            )}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default RecipeCard

