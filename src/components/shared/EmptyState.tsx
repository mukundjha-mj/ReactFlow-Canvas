import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  message: string
  isDarkMode?: boolean
}

/**
 * Reusable empty state component for displaying placeholder content.
 * Used when no data is available or no selection is made.
 */
export function EmptyState({ icon, message, isDarkMode = true }: EmptyStateProps) {
  return (
    <div
      className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl p-4 text-center text-sm"
      style={{
        border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)',
        background: isDarkMode ? 'rgb(15,20,27)' : 'rgb(255,255,255)',
        color: isDarkMode ? 'rgb(154,164,178)' : 'rgb(107,114,128)',
      }}
    >
      <div style={{ color: isDarkMode ? 'rgb(154,164,178)' : 'rgb(107,114,128)' }}>{icon}</div>
      <p>{message}</p>
    </div>
  )
}
