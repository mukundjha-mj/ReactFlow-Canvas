interface NodeScaleSliderProps {
  value: number
  isDatabase?: boolean
  isDarkMode?: boolean
  accentColor?: string
  onChange?: (value: number) => void
  readonly?: boolean
}

/**
 * Reusable scale slider component with theme-aware gradients.
 * Database nodes get purple gradient, service nodes get multi-color gradient.
 */
export function NodeScaleSlider({ value, isDatabase = false, isDarkMode = true, accentColor, onChange, readonly = true }: NodeScaleSliderProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || !onChange) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    onChange(Math.round(percentage))
  }

  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <div 
        className="relative mr-2.5 flex-1" 
        onClick={handleClick}
        style={{ cursor: readonly ? 'default' : 'pointer' }}
      >
        <div
          className="h-1.5 rounded-full"
          style={{
            background: isDatabase
              ? 'linear-gradient(to right, rgb(139, 92, 246), rgb(168, 85, 247), rgb(192, 132, 252), rgb(217, 70, 239))'
              : 'linear-gradient(to right, rgb(59, 130, 246), rgb(34, 197, 94), rgb(234, 179, 8), rgb(239, 68, 68))',
          }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full shadow-lg transition-all"
          style={{
            left: `${Math.min(Math.max(value, 0), 100)}%`,
            border: `2px solid ${accentColor || (isDarkMode ? '#60a5fa' : '#0ea5e9')}`,
            background: accentColor || (isDarkMode ? '#60a5fa' : '#0ea5e9'),
            boxShadow: `0 0 8px ${accentColor || (isDarkMode ? '#60a5fa' : '#0ea5e9')}80`,
          }}
        />
      </div>
      <span className="text-sm font-bold tabular-nums" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
        {value.toFixed(0)}
      </span>
    </div>
  )
}
