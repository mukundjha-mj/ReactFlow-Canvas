import type { ReactNode } from 'react'
import { Settings } from 'lucide-react'
import { ServiceIconContainer } from './ServiceIconContainer'
import { NodeMetrics } from './NodeMetrics'
import { NodeScaleSlider } from './NodeScaleSlider'
import { StatusBadge } from './StatusBadge'
import { ProviderBadge } from './ProviderBadge'

interface NodeCardProps {
  name: string
  kind: 'service' | 'database'
  status: 'healthy' | 'degraded' | 'down'
  costPerHour: number
  metrics: {
    cpu: number
    memory: number
    disk: number
    region: string
  }
  scale: number
  provider: string
  icon: ReactNode
  isDarkMode?: boolean
  selected?: boolean
  onSettingsClick?: () => void
}

/**
 * Unified node card component used by both ServiceNode (canvas) and NodeInspector (preview).
 * Ensures consistent visual appearance across different contexts.
 */
export function NodeCard({
  name,
  kind,
  status,
  costPerHour,
  metrics,
  scale,
  provider,
  icon,
  isDarkMode = true,
  selected = false,
  onSettingsClick,
}: NodeCardProps) {
  const isDatabase = kind === 'database'

  const nodeStyles = isDatabase
    ? {
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
        borderColor: selected
          ? isDarkMode ? 'rgba(139, 92, 246, 0.6)' : 'rgba(124, 58, 237, 0.5)'
          : isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.25)',
        glowColor: 'rgba(139, 92, 246, 0.3)',
        accentColor: isDarkMode ? '#a78bfa' : '#7c3aed',
        headerBg: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(124, 58, 237, 0.04)',
      }
    : {
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)',
        borderColor: selected
          ? isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(14, 165, 233, 0.5)'
          : isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(14, 165, 233, 0.25)',
        glowColor: 'rgba(59, 130, 246, 0.3)',
        accentColor: isDarkMode ? '#60a5fa' : '#0ea5e9',
        headerBg: isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(14, 165, 233, 0.04)',
      }

  return (
    <div
      className="rounded-2xl transition-all duration-200"
      style={{
        background: nodeStyles.background,
        border: selected
          ? `2px solid ${nodeStyles.borderColor}`
          : `1.5px solid ${nodeStyles.borderColor}`,
        boxShadow: selected
          ? `0px 0px 0px 4px ${nodeStyles.glowColor}, 0px 8px 16px rgba(0, 0, 0, 0.2)`
          : '0px 4px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '16px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{
          borderBottom: `1px solid ${nodeStyles.borderColor}`,
          background: nodeStyles.headerBg,
        }}
      >
        <div className="flex items-center gap-2.5">
          <ServiceIconContainer accentColor={nodeStyles.accentColor} isDarkMode={isDarkMode}>
            {icon}
          </ServiceIconContainer>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold leading-tight" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
              {name}
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: nodeStyles.accentColor }}>
              {isDatabase ? '● Database' : '● Service'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{
              background: `${nodeStyles.accentColor}25`,
              color: nodeStyles.accentColor,
              border: `1px solid ${nodeStyles.accentColor}50`,
            }}
          >
            ${costPerHour.toFixed(2)}/HR
          </div>
          {onSettingsClick && (
            <button
              className="rounded-lg p-1.5 transition-all duration-200"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              onClick={onSettingsClick}
            >
              <Settings size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <NodeMetrics
        cpu={metrics.cpu}
        memory={metrics.memory}
        disk={metrics.disk}
        region={metrics.region}
        isDarkMode={isDarkMode}
        accentColor={nodeStyles.accentColor}
      />

      {/* Slider */}
      <NodeScaleSlider value={scale} isDatabase={isDatabase} isDarkMode={isDarkMode} accentColor={nodeStyles.accentColor} />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1.5">
        <StatusBadge status={status} isDarkMode={isDarkMode} />
        <ProviderBadge provider={provider} />
      </div>
    </div>
  )
}
