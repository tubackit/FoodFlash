import { Search, X } from 'lucide-react'
import { ChangeEvent } from 'react'
import clsx from 'clsx'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  const handleClear = () => {
    onSearchChange('')
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        data-test-id="search-recipes"
        aria-label="Rezepte suchen"
        placeholder="Suche nach Rezepten, Beschreibung oder Plattform..."
        className={clsx(
          'w-full pl-12 pr-12 py-3 rounded-full border-2 border-gray-200',
          'focus:border-primary-500 focus:outline-none transition-colors',
          'bg-slate-800/80 shadow-sm'
        )}
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          data-test-id="clear-search"
          aria-label="Suche löschen"
          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-200 text-gray-400 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default SearchBar

