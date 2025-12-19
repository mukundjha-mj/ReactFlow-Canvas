import { ChevronDown, MoreVertical } from 'lucide-react'
import { cn } from '../../lib/utils'
import { getAppIcon } from '../../utils/getAppIcon'
import { AppList } from './AppList'
import type { AppInfo } from '../../types'

interface AppDropdownProps {
  apps?: AppInfo[]
  selectedAppId: string | null
  isLoading: boolean
  isError: boolean
  isOpen: boolean
  onToggle: () => void
  onSelect: (id: string) => void
  onCreateApp: () => void
  onDeleteApp?: (id: string) => void
  onRetry: () => void
  isDarkMode: boolean
}

export function AppDropdown({
  apps,
  selectedAppId,
  isLoading,
  isError,
  isOpen,
  onToggle,
  onSelect,
  onCreateApp,
  onDeleteApp = () => {},
  onRetry,
  isDarkMode
}: AppDropdownProps) {
  const selectedApp = apps?.find(app => app.id === selectedAppId)
  
  return (
    <aside 
      className="absolute left-2 top-14 sm:left-4 sm:top-16 lg:left-20 lg:top-4 z-10 w-[calc(100vw-1rem)] sm:w-[340px] flex flex-col rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" 
      style={{ 
        background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)'
      }}
    >
      {/* Dropdown Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer transition-colors"
        style={{
          borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)',
          background: 'transparent'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            {getAppIcon({ iconName: selectedApp?.icon, className: "h-4 w-4 sm:h-5 sm:w-5 text-white" })}
          </div>
          <span className="text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-none" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            {selectedApp?.name || 'supertokens-golang'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
            style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
          />
          <button 
            onClick={(e) => e.stopPropagation()}
            className="rounded p-1 transition-colors"
            style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
              e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#000000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Dropdown Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col overflow-hidden p-4">
          <AppList
            apps={apps}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            selectedAppId={selectedAppId}
            onSelect={onSelect}
            onCreateApp={onCreateApp}
            onDeleteApp={onDeleteApp}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </aside>
  )
}
