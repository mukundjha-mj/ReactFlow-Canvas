import type { ReactNode } from 'react'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Button } from '../ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  icon?: ReactNode
}

/**
 * Reusable error state component for displaying API failures.
 * Used across AppList, AppDropdown, and other data-fetching components.
 */
export function ErrorState({ 
  title = 'Failed to load', 
  message = 'An error occurred while fetching data.',
  onRetry,
  icon
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-4 text-sm text-red-100">
      <div className="flex items-center gap-2 font-semibold">
        {icon || <TriangleAlert size={16} />}
        {title}
      </div>
      <p className="text-xs text-red-200/80">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 text-red-100">
          <RefreshCw size={14} /> Retry
        </Button>
      )}
    </div>
  )
}
