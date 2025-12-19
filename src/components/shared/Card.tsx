import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  isDarkMode?: boolean
  className?: string
}

/**
 * Reusable card container component with consistent theming.
 * Used for wrapping content sections in panels and forms.
 */
export function Card({ children, isDarkMode = true, className = '' }: CardProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl p-3 shadow-lg ${className}`}
      style={{
        border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.12)',
        background: isDarkMode ? 'rgb(26,26,26)' : 'rgb(255,255,255)',
      }}
    >
      {children}
    </div>
  )
}
