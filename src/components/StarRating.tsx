import { Star } from 'lucide-react'
import clsx from 'clsx'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const handleStarClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= rating

        return (
          <button
            key={starValue}
            onClick={() => handleStarClick(starValue)}
            data-test-id={`star-${starValue}`}
            aria-label={`${starValue} ${starValue === 1 ? 'Stern' : 'Sterne'} bewerten`}
            disabled={readonly}
            className={clsx(
              'transition-all duration-200',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={clsx(
                sizeClasses[size],
                isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating

