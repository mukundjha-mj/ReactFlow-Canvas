import type { ReactNode } from 'react'

interface ServiceIconContainerProps {
  children: ReactNode
  accentColor?: string
  isDarkMode?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Reusable icon container with accent color theming.
 * Provides consistent styling for service/database icons across the app.
 */
export function ServiceIconContainer({ children, accentColor, isDarkMode = true, size = 'md' }: ServiceIconContainerProps) {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }

  const defaultAccent = isDarkMode ? '#60a5fa' : '#0ea5e9'
  const color = accentColor || defaultAccent

  return (
    <div
      className={`flex items-center justify-center rounded-lg ${sizeClasses[size]}`}
      style={{
        background: `${color}20`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 8px ${color}30`,
      }}
    >
      {children}
    </div>
  )
}
