import { Search } from 'lucide-react'
import { Input } from '../ui/input'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isDarkMode?: boolean
}

/**
 * Reusable search input component with icon.
 * Used in AppList and other searchable lists.
 */
export function SearchInput({ value, onChange, placeholder = 'Search...', isDarkMode = true }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: isDarkMode ? 'rgb(154,164,178)' : 'rgb(107,114,128)' }}
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg pl-9 text-sm tracking-tight"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
          background: isDarkMode ? 'rgb(15,20,27)' : 'rgb(255,255,255)',
          color: isDarkMode ? '#ffffff' : '#000000',
        }}
      />
    </div>
  )
}
