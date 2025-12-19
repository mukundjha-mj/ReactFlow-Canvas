import type { NodeProps } from '@xyflow/react'
import { cn } from '../../lib/utils'
import { Activity, CheckCircle2, AlertTriangle, XCircle, HardDrive, Globe, Settings } from 'lucide-react'
import type { ServiceNodeData } from '../../types'
import { getServiceLogo } from '../../utils/getServiceLogo'
import { FaDatabase } from 'react-icons/fa'

/**
 * Custom ReactFlow node component with theme-based styling.
 * Renders distinct visual themes for service (blue) vs database (purple) nodes.
 */
export function ServiceNode({ data: nodeData, selected }: NodeProps) {
    const data = nodeData as ServiceNodeData
    const isDarkMode = data.isDarkMode ?? true
    const isDatabase = data.kind === 'database'

    const nodeStyles = isDatabase
        ? {
            background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
            borderColor: selected 
                ? (isDarkMode ? 'rgba(139, 92, 246, 0.6)' : 'rgba(124, 58, 237, 0.5)')
                : (isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.25)'),
            glowColor: 'rgba(139, 92, 246, 0.3)',
            accentColor: isDarkMode ? '#a78bfa' : '#7c3aed',
        }
        : {
            background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)',
            borderColor: selected 
                ? (isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(14, 165, 233, 0.5)')
                : (isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(14, 165, 233, 0.25)'),
            glowColor: 'rgba(59, 130, 246, 0.3)',
            accentColor: isDarkMode ? '#60a5fa' : '#0ea5e9',
        }

    return (
        <div
            className={cn(
                'group relative w-[240px] sm:w-[280px] rounded-2xl transition-all duration-200',
            )}
            style={{
                background: nodeStyles.background,
                border: selected 
                    ? `2px solid ${nodeStyles.borderColor}`
                    : `1.5px solid ${nodeStyles.borderColor}`,
                boxShadow: selected
                    ? `0px 0px 0px 4px ${nodeStyles.glowColor}, 0px 8px 16px rgba(0, 0, 0, 0.2)`
                    : `0px 4px 8px rgba(0, 0, 0, 0.15)`,
                borderRadius: '16px'
            }}
        >
            {/* Header */}
            <div 
                className="flex items-center justify-between px-3 py-2.5"
                style={{ 
                    borderBottom: `1px solid ${nodeStyles.borderColor}`,
                    background: isDatabase
                        ? (isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(124, 58, 237, 0.04)')
                        : (isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(14, 165, 233, 0.04)')
                }}
            >
                <div className="flex items-center gap-2.5">
                    <div 
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ 
                            background: nodeStyles.accentColor + '20',
                            border: `1px solid ${nodeStyles.accentColor}40`,
                            boxShadow: `0 0 8px ${nodeStyles.accentColor}30`
                        }}
                    >
                        {getServiceLogo({ serviceName: data.name, kind: data.kind, size: 'small' })}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-semibold leading-tight" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>{data.name}</h3>
                        <span 
                            className="text-[9px] font-bold uppercase tracking-wider"
                            style={{ color: nodeStyles.accentColor }}
                        >
                            {isDatabase ? '● Database' : '● Service'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div 
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                        style={{
                            background: nodeStyles.accentColor + '25',
                            color: nodeStyles.accentColor,
                            border: `1px solid ${nodeStyles.accentColor}50`
                        }}
                    >
                        ${data.costPerHour.toFixed(2)}/HR
                    </div>
                    <button 
                        className="rounded-lg p-1.5 transition-all duration-200"
                        style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <Settings size={13} />
                    </button>
                </div>
            </div>

            
            {/* Metrics Row */}
            <div 
                className="flex items-center justify-between px-3 py-2.5"
                style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)' }}
            >
                <div className="flex items-center justify-center text-[11px] font-semibold min-w-[48px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
                    <span>{data.metrics.cpu.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-center text-[11px] font-semibold min-w-[52px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
                    <span>{data.metrics.memory.toFixed(2)} GB</span>
                </div>
                <div className="flex items-center justify-center text-[11px] font-semibold min-w-[46px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
                    <span>{data.metrics.disk} GB</span>
                </div>
                <div className="flex items-center justify-center text-[11px] font-semibold min-w-[62px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
                    <span>{data.metrics.region}</span>
                </div>
            </div>
            {/* Labels Row */}
            <div 
                className="flex items-center justify-between px-3 py-2"
                style={{ borderBottom: `1px solid ${nodeStyles.borderColor}` }}
            >
                <div 
                    className="flex items-center gap-1 rounded-full px-3 py-1.5"
                    style={{ 
                        background: nodeStyles.accentColor + '30',
                        border: `1px solid ${nodeStyles.accentColor}50`
                    }}
                >
                    <Activity size={11} style={{ color: nodeStyles.accentColor }}/>
                    <span className="text-[10px] font-bold" style={{ color: nodeStyles.accentColor }}>CPU</span>
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


            {/* Slider Section */}
            <div className="flex items-center justify-between px-3 py-2.5">
                <div className="relative mr-2.5 flex-1">
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
                            left: `${Math.min(Math.max(data.scale, 0), 100)}%`,
                            border: `2px solid ${nodeStyles.accentColor}`,
                            background: nodeStyles.accentColor,
                            boxShadow: `0 0 8px ${nodeStyles.accentColor}80`
                        }}
                    />
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                    {data.scale.toFixed(0)}
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 pb-3 pt-1.5">
                <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
                    style={{
                        background: data.status === 'healthy' 
                            ? (isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)')
                            : data.status === 'degraded'
                            ? (isDarkMode ? 'rgba(234, 179, 8, 0.2)' : 'rgba(234, 179, 8, 0.15)')
                            : (isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)'),
                        color: data.status === 'healthy'
                            ? (isDarkMode ? '#4ade80' : '#15803d')
                            : data.status === 'degraded'
                            ? (isDarkMode ? '#fbbf24' : '#a16207')
                            : (isDarkMode ? '#f87171' : '#b91c1c'),
                        border: `1px solid ${data.status === 'healthy' 
                            ? (isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.3)')
                            : data.status === 'degraded'
                            ? (isDarkMode ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.3)')
                            : (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)')}`
                    }}
                >
                    {data.status === 'healthy' && <CheckCircle2 size={12} />}
                    {data.status === 'degraded' && <AlertTriangle size={12} />}
                    {data.status === 'down' && <XCircle size={12} />}
                    <span>{data.status === 'healthy' ? 'Success' : data.status === 'degraded' ? 'Degraded' : 'Error'}</span>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: '#ff9900', opacity: 0.8 }}>
                    {data.provider || 'aws'}
                </span>
            </div>
        </div>
    )
}
