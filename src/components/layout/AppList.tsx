import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'
import { Badge } from '../ui/badge'
import type { AppInfo } from '../../types'
import { cn } from '../../lib/utils'
import { Plus, RefreshCw, Search, TriangleAlert } from 'lucide-react'

interface AppListProps {
  apps?: AppInfo[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  selectedAppId: string | null
  onSelect: (id: string) => void
}

export function AppList({ apps, isLoading, isError, onRetry, selectedAppId, onSelect }: AppListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!apps) return []
    return apps.filter((app) => app.name.toLowerCase().includes(query.toLowerCase()))
  }, [apps, query])

  return (
    <div className="flex flex-col gap-4">
      {/* App Switcher Header */}
      <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[rgb(15,20,27)] px-3 py-2">
        <div className="flex flex-1 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
            <span className="text-sm">⚡</span>
          </div>
          <span className="flex-1 text-sm font-medium text-white">
            {apps?.find(app => app.id === selectedAppId)?.name || 'supertokens-golang'}
          </span>
          <svg className="h-4 w-4 text-[rgb(154,164,178)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button className="ml-2 flex h-6 w-6 items-center justify-center rounded text-[rgb(154,164,178)] hover:bg-white/[0.04]">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Application Section Title */}
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-white">Application</h2>
      </div>

      {/* Search Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(154,164,178)]" />
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 rounded-lg border-white/[0.08] bg-[rgb(15,20,27)] pl-9 text-sm tracking-tight text-white placeholder:text-[rgb(154,164,178)] focus:bg-[rgb(15,20,27)]"
          />
        </div>
        <Button
          size="icon"
          className="h-10 w-10 shrink-0 rounded-lg bg-primary text-white hover:bg-primary/90"
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
        <div className="flex flex-col items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-4 text-sm text-red-100">
          <div className="flex items-center gap-2 font-semibold">
            <TriangleAlert size={16} />
            Mock API failed
          </div>
          <p className="text-xs text-red-200/80">Toggle the lightning icon in the top bar to simulate recovery.</p>
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 text-red-100">
            <RefreshCw size={14} /> Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-1">
          {filtered.map((app) => (
            <button
              key={app.id}
              onClick={() => onSelect(app.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
                selectedAppId === app.id
                  ? 'bg-primary/15 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'hover:bg-white/[0.04]',
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg transition-all',
                  selectedAppId === app.id ? 'bg-primary shadow-md' : 'bg-gradient-to-br from-primary/80 to-primary/60',
                )}
              >
                ⚡
              </div>
              <span
                className={cn(
                  'flex-1 text-[13px] font-medium tracking-tight transition-colors',
                  selectedAppId === app.id ? 'text-white' : 'text-[rgb(154,164,178)] group-hover:text-white',
                )}
              >
                {app.name}
              </span>
              <svg
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  selectedAppId === app.id ? 'text-primary' : 'text-[rgb(154,164,178)] group-hover:text-white',
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
