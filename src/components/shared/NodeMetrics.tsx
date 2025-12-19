import { Activity, HardDrive, Globe } from 'lucide-react'
import { FaDatabase } from 'react-icons/fa'

interface NodeMetricsProps {
  cpu: number
  memory: number
  disk: number
  region: string
  isDarkMode?: boolean
  showLabels?: boolean
  accentColor?: string
}

/**
 * Reusable metrics display component for showing node CPU, memory, disk, and region.
 * Can be rendered with or without labels, supporting both compact and detailed views.
 */
export function NodeMetrics({ cpu, memory, disk, region, isDarkMode = true, showLabels = true, accentColor }: NodeMetricsProps) {
  return (
    <>
      {/* Metrics Row */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)' }}
      >
        <div className="flex items-center justify-center text-[11px] font-semibold min-w-[48px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
          <span>{cpu.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-center text-[11px] font-semibold min-w-[52px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
          <span>{memory.toFixed(2)} GB</span>
        </div>
        <div className="flex items-center justify-center text-[11px] font-semibold min-w-[46px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
          <span>{disk} GB</span>
        </div>
        <div className="flex items-center justify-center text-[11px] font-semibold min-w-[62px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
          <span>{region}</span>
        </div>
      </div>

      {/* Labels Row */}
      {showLabels && (
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: accentColor ? `1px solid ${accentColor}30` : (isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)') }}
        >
          <div
            className="flex items-center gap-1 rounded-full px-3 py-1.5"
            style={{
              background: accentColor ? `${accentColor}30` : (isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'),
              border: `1px solid ${accentColor ? `${accentColor}50` : (isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)')}`,
            }}
          >
            <Activity size={11} style={{ color: accentColor || (isDarkMode ? '#60a5fa' : '#0ea5e9') }} />
            <span className="text-[10px] font-bold" style={{ color: accentColor || (isDarkMode ? '#60a5fa' : '#0ea5e9') }}>CPU</span>
          </div>
          <div className="flex items-center gap-1">
            <FaDatabase size={10} style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }} />
            <span className="text-[10px] font-medium" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>Memory</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive size={10} style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }} />
            <span className="text-[10px] font-medium" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>Disk</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe size={10} style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }} />
            <span className="text-[10px] font-medium" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>Region</span>
          </div>
        </div>
      )}
    </>
  )
}
