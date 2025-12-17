import { Share2, Moon, Sun } from 'lucide-react'

interface TopActionsProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function TopActions({ isDarkMode, onToggleTheme }: TopActionsProps) {
  return (
    <aside 
      className="absolute right-2 top-2 sm:right-4 sm:top-4 p-1 rounded-sm z-10 flex items-center gap-1 sm:gap-2 border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" 
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
    >
      {/* Share */}
      <button className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/[0.08]">
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Theme Toggle */}
      <button 
        onClick={onToggleTheme}
        className="relative flex h-8 w-12 sm:h-10 sm:w-16 items-center rounded-full border border-white/[0.06] bg-black/60 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08]"
      >
        <div 
          className={`absolute flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 ${
            isDarkMode ? 'left-1' : 'left-5 sm:left-7'
          }`}
        >
          {isDarkMode ? (
            <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          ) : (
            <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          )}
        </div>
      </button>

      {/* Profile Avatar - Hidden on small screens */}
      <button className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-br from-pink-500 to-purple-600 backdrop-blur-md transition-all duration-200 hover:scale-105">
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          alt="Profile" 
          className="h-full w-full object-cover"
        />
      </button>
    </aside>
  )
}
