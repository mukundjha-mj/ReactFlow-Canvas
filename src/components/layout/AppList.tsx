import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import type { AppInfo } from '../../types'
import { cn } from '../../lib/utils'
import { Plus, ChevronRight } from 'lucide-react'
import { AppDeleteButton } from './AppDeleteButton'
import { getAppIcon } from '../../utils/getAppIcon'
import { SearchInput, ErrorState } from '../shared'

interface AppListProps {
  apps?: AppInfo[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  selectedAppId: string | null
  onSelect: (id: string) => void
  onCreateApp: () => void
  onDeleteApp: (id: string) => void
  isDarkMode: boolean
}

export function AppList({ apps, isLoading, isError, onRetry, selectedAppId, onSelect, onCreateApp, onDeleteApp, isDarkMode }: AppListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!apps) return []
    return apps.filter((app) => app.name.toLowerCase().includes(query.toLowerCase()))
  }, [apps, query])

  return (
    <div className="flex flex-col gap-4">
      {/* Application Section Title */}
      <div>
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>Application</h2>
      </div>

      {/* Search Row */}
      <div className="flex items-center gap-2">
        <SearchInput value={query} onChange={setQuery} isDarkMode={isDarkMode} />
        <Button
          onClick={onCreateApp}
          size="icon"
          className="h-10 w-10 shrink-0 rounded-lg transition-all hover:scale-105"
          style={{
            background: isDarkMode ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)',
            border: isDarkMode ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.2)',
            color: '#3b82f6'
          }}
        >
          <Plus size={18} />
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      )}

      {isError && (
        <ErrorState
          title="Mock API failed"
          message="Toggle the lightning icon in the top bar to simulate recovery."
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && (
        <div className="space-y-1">
          {filtered.map((app) => (
            <div key={app.id} className="flex items-center group">
              <button
                onClick={() => onSelect(app.id)}
                className="flex-1 group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200"
                style={{
                  background: selectedAppId === app.id
                    ? 'rgba(59,130,246,0.15)'
                    : 'transparent',
                  boxShadow: selectedAppId === app.id
                    ? '0 0 12px rgba(59,130,246,0.3)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedAppId !== app.id) {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAppId !== app.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg transition-all',
                  )}
                  style={{
                    background: selectedAppId === app.id 
                      ? (isDarkMode ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)')
                      : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                    boxShadow: selectedAppId === app.id 
                      ? (isDarkMode ? '0 0 0 1px rgba(59,130,246,0.5)' : '0 0 0 1px rgba(59,130,246,0.3)')
                      : 'none'
                  }}
                >
                  {getAppIcon({ iconName: app.icon, className: "h-4 w-4" })}
                </div>
                <span
                  className="flex-1 text-[13px] font-medium tracking-tight transition-colors"
                  style={{ 
                    color: selectedAppId === app.id 
                      ? (isDarkMode ? '#ffffff' : '#000000')
                      : (isDarkMode ? 'rgb(200,200,200)' : 'rgb(80,80,80)')
                  }}
                >
                  {app.name}
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 transition-colors"
                  style={{ 
                    color: selectedAppId === app.id 
                      ? '#3b82f6'
                      : (isDarkMode ? 'rgb(120,120,120)' : 'rgb(160,160,160)')
                  }}
                />
              </button>
              <AppDeleteButton onClick={() => onDeleteApp(app.id)} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
