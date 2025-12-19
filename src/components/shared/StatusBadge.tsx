import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'down'
  isDarkMode?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md'
}

/**
 * Reusable status badge component for displaying service/database health status.
 * Supports three states: healthy (green), degraded (yellow), and down (red).
 */
export function StatusBadge({ status, isDarkMode = true, showIcon = true, size = 'sm' }: StatusBadgeProps) {
  const statusConfig = {
    healthy: {
      label: 'Success',
      icon: CheckCircle2,
      background: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
      color: isDarkMode ? '#4ade80' : '#15803d',
      border: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.3)',
    },
    degraded: {
      label: 'Degraded',
      icon: AlertTriangle,
      background: isDarkMode ? 'rgba(234, 179, 8, 0.2)' : 'rgba(234, 179, 8, 0.15)',
      color: isDarkMode ? '#fbbf24' : '#a16207',
      border: isDarkMode ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.3)',
    },
    down: {
      label: 'Error',
      icon: XCircle,
      background: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)',
      color: isDarkMode ? '#f87171' : '#b91c1c',
      border: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon
  const fontSize = size === 'sm' ? '11px' : '13px'
  const iconSize = size === 'sm' ? 12 : 14

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold"
      style={{
        background: config.background,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontSize,
      }}
    >
      {showIcon && <Icon size={iconSize} />}
      <span>{config.label}</span>
    </div>
  )
}
