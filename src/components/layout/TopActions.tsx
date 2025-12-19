import { Share2, Moon, Sun, Maximize2, HelpCircle } from 'lucide-react'

interface TopActionsProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onFitView: () => void
}

export function TopActions({ isDarkMode, onToggleTheme, onFitView }: TopActionsProps) {
  return (
    <aside 
      className="absolute right-2 top-2 sm:right-4 sm:top-4 p-1 rounded-sm z-10 flex items-center gap-1 sm:gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" 
      style={{ 
        background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)'
      }}
    >
      {/* Fit View */}
      <button 
        onClick={onFitView}
        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg backdrop-blur-md transition-all duration-200 hover:scale-105"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)',
          background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
        title="Fit View (F)"
        aria-label="Fit view to canvas - Press F"
      >
        <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Share */}
      <button 
        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg backdrop-blur-md transition-all duration-200"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)',
          background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Theme Toggle */}
      <button 
        onClick={onToggleTheme}
        className="relative flex h-8 w-14 sm:h-10 sm:w-16 items-center rounded-full backdrop-blur-md transition-all duration-300"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)',
          background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'
        }}
      >
        <div 
          className="absolute flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-300"
          style={{
            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            left: isDarkMode ? '0.25rem' : 'calc(100% - 2rem)',
            transform: isDarkMode ? 'translateX(0)' : 'translateX(-0.25rem)'
          }}
        >
          {isDarkMode ? (
            <Moon className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#ffffff' }} />
          ) : (
            <Sun className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#f59e0b' }} />
          )}
        </div>
      </button>

      <button 
        onClick={() => {
          const event = new KeyboardEvent('keydown', { key: '?' })
          window.dispatchEvent(event)
        }}
        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg backdrop-blur-md transition-all duration-200 hover:scale-105"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)',
          background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
        title="Keyboard Shortcuts (?)"
        aria-label="Show keyboard shortcuts - Press ?"
      >
        <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Profile Avatar - Hidden on small screens */}
      <button 
        className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 backdrop-blur-md transition-all duration-200 hover:scale-105"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          alt="Profile" 
          className="h-full w-full object-cover"
        />
      </button>
    </aside>
  )
}
