import { useMemo, useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import { Textarea } from '../ui/textarea'
import type { ServiceNode, ServiceNodeData } from '../../types'
import { useUIStore } from '../../store/appStore'
import { cn } from '../../lib/utils'
import { BarChart3, Cpu, HardDrive, MapPin, PackageOpen, ServerCrash, Activity, CheckCircle2, AlertTriangle, XCircle, Globe, Settings } from 'lucide-react'
import { getServiceLogo } from '../../utils/getServiceLogo'
import { FaDatabase } from 'react-icons/fa'

interface NodeInspectorProps {
  node?: ServiceNode
  onUpdate: (data: Partial<ServiceNodeData>) => void
  isDarkMode?: boolean
}

/**
 * Right panel inspector for viewing and editing selected node properties.
 * Implements debounced text inputs (300ms) for optimal performance.
 */
const statusTheme = {
  healthy: { label: 'Healthy', variant: 'default' as const, classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  degraded: { label: 'Degraded', variant: 'secondary' as const, classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  down: { label: 'Down', variant: 'destructive' as const, classes: 'bg-red-500/20 text-red-300 border-red-500/30' },
}

export function NodeInspector({ node, onUpdate, isDarkMode = true }: NodeInspectorProps) {
  const activeTab = useUIStore((s) => s.activeInspectorTab)
  const setActiveTab = useUIStore((s) => s.setActiveInspectorTab)

  const status = node ? statusTheme[node.data.status] : undefined

  const [localName, setLocalName] = useState(node?.data.name ?? '')
  const [localDescription, setLocalDescription] = useState(node?.data.description ?? '')
  const [localScale, setLocalScale] = useState(node?.data.scale ?? 0)

  useEffect(() => {
    if (node) {
      setLocalName(node.data.name)
      setLocalDescription(node.data.description ?? '')
      setLocalScale(node.data.scale)
    }
  }, [node?.id])

  useEffect(() => {
    if (!node || localName === node.data.name) return
    const timer = setTimeout(() => {
      onUpdate({ name: localName })
    }, 300)
    return () => clearTimeout(timer)
  }, [localName, node, onUpdate])

  useEffect(() => {
    if (!node || localDescription === (node.data.description ?? '')) return
    const timer = setTimeout(() => {
      onUpdate({ description: localDescription })
    }, 300)
    return () => clearTimeout(timer)
  }, [localDescription, node, onUpdate])

  const sliderValue = useMemo(() => [localScale], [localScale])

  if (!node) {
    return (
      <div
        className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl p-4 text-center text-sm"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)',
          background: isDarkMode ? 'rgb(15,20,27)' : 'rgb(255,255,255)',
          color: isDarkMode ? 'rgb(154,164,178)' : 'rgb(107,114,128)'
        }}
      >
        <PackageOpen size={32} style={{ color: isDarkMode ? 'rgb(154,164,178)' : 'rgb(107,114,128)' }} />
        <p>Select a node to inspect its config.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Service Node Card Preview */}
      <div
        className="rounded-2xl transition-all duration-200"
        style={{
          background: isDarkMode ? '#000000' : '#ffffff',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.12)',
          boxShadow: isDarkMode
            ? '0px 3.54px 4.55px 0px rgba(255, 255, 255, 0.05), 0px 3.54px 4.55px 0px rgba(255, 255, 255, 0.13), 0px 0.51px 1.01px 0px rgba(255, 255, 255, 0.2)'
            : '0px 3.54px 4.55px 0px #00000005, 0px 3.54px 4.55px 0px #0000000d, 0px 0.51px 1.01px 0px #0000001a'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: isDarkMode ? '#ffffff' : '#f5f5f5',
                boxShadow: isDarkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {getServiceLogo({ serviceName: node.data.name, kind: node.data.kind, size: 'small' })}
            </div>
            <h3 className="text-sm font-semibold" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>{localName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: isDarkMode ? 'rgb(52, 211, 153)' : 'rgb(5, 150, 105)',
                border: isDarkMode ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              ${node.data.costPerHour.toFixed(2)}/HR
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
          className="flex items-center justify-between px-3 py-1.5"
          style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)' }}
        >
          <div className="flex items-center justify-center text-[11px] font-semibold min-w-[48px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
            <span>{node.data.metrics.cpu.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-center text-[11px] font-semibold min-w-[52px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
            <span>{node.data.metrics.memory.toFixed(2)} GB</span>
          </div>
          <div className="flex items-center justify-center text-[11px] font-semibold min-w-[46px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
            <span>{node.data.metrics.disk} GB</span>
          </div>
          <div className="flex items-center justify-center text-[11px] font-semibold min-w-[62px]" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
            <span>{node.data.metrics.region}</span>
          </div>
        </div>

        {/* Labels Row */}
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)' }}
        >
          <div
            className="flex items-center gap-1 rounded-full px-3 py-1.5"
            style={{ background: isDarkMode ? '#ffffff' : '#000000' }}
          >
            <Activity size={11} style={{ color: isDarkMode ? '#000000' : '#ffffff' }} />
            <span className="text-[10px] font-bold" style={{ color: isDarkMode ? '#000000' : '#ffffff' }}>CPU</span>
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
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="relative mr-2.5 flex-1">
            <div
              className="h-1.5 rounded-full"
              style={{
                background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(34, 197, 94), rgb(234, 179, 8), rgb(239, 68, 68))',
              }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full shadow-lg transition-all"
              style={{
                left: `${Math.min(Math.max(localScale, 0), 100)}%`,
                border: `2px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
                background: isDarkMode ? '#ffffff' : '#000000',
                boxShadow: isDarkMode
                  ? '0 2px 4px rgba(0,0,0,0.2)'
                  : '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            {localScale.toFixed(0)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
            style={{
              background: node.data.status === 'healthy'
                ? (isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)')
                : node.data.status === 'degraded'
                  ? (isDarkMode ? 'rgba(234, 179, 8, 0.2)' : 'rgba(234, 179, 8, 0.15)')
                  : (isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)'),
              color: node.data.status === 'healthy'
                ? (isDarkMode ? '#4ade80' : '#15803d')
                : node.data.status === 'degraded'
                  ? (isDarkMode ? '#fbbf24' : '#a16207')
                  : (isDarkMode ? '#f87171' : '#b91c1c'),
              border: `1px solid ${node.data.status === 'healthy'
                ? (isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.3)')
                : node.data.status === 'degraded'
                  ? (isDarkMode ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.3)')
                  : (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)')}`
            }}
          >
            {node.data.status === 'healthy' && <CheckCircle2 size={12} />}
            {node.data.status === 'degraded' && <AlertTriangle size={12} />}
            {node.data.status === 'down' && <XCircle size={12} />}
            <span>{node.data.status === 'healthy' ? 'Success' : node.data.status === 'degraded' ? 'Degraded' : 'Error'}</span>
          </div>
          <span className="text-[11px] font-semibold" style={{ color: '#ff9900', opacity: 0.8 }}>
            aws
          </span>
        </div>
      </div>

      {/* Node Details Section */}
      <div
        className="flex flex-col gap-3 rounded-xl p-3 shadow-lg"
        style={{
          border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.12)',
          background: isDarkMode ? 'rgb(26,26,26)' : 'rgb(255,255,255)'
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.12em]"
              style={{ color: isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)' }}
            >
              Service Node
            </p>
            <p
              className="text-lg font-semibold"
              style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
            >
              {localName}
            </p>
            <p
              className="text-xs"
              style={{ color: isDarkMode ? 'rgb(107,114,128)' : 'rgb(156,163,175)' }}
            >
              {node.id}
            </p>
          </div>
          {status && (
            <Badge
              variant={status.variant}
              className={cn(
                'text-xs font-medium',
                status.classes
              )}
            >
              {status.label}
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'config' | 'runtime')}>
          <TabsList
            className="w-full"
            style={{ background: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgb(243,244,246)' }}
          >
            <TabsTrigger
              value="config"
              className="data-[state=active]:shadow-sm"
              style={{
                background: activeTab === 'config'
                  ? (isDarkMode ? 'rgb(59,130,246)' : 'rgb(59,130,246)')
                  : 'transparent',
                color: activeTab === 'config'
                  ? '#ffffff'
                  : (isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)')
              }}
            >
              Config
            </TabsTrigger>
            <TabsTrigger
              value="runtime"
              className="data-[state=active]:shadow-sm"
              style={{
                background: activeTab === 'runtime'
                  ? (isDarkMode ? 'rgb(59,130,246)' : 'rgb(59,130,246)')
                  : 'transparent',
                color: activeTab === 'runtime'
                  ? '#ffffff'
                  : (isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)')
              }}
            >
              Runtime
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
              >
                Name
              </label>
              <Input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Enter node name"
                style={{
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)',
                  background: isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
              >
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdate({ status: 'healthy' })}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: node.data.status === 'healthy'
                      ? 'rgb(34,197,94)'
                      : (isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)'),
                    color: node.data.status === 'healthy' ? '#ffffff' : (isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)'),
                    border: `1px solid ${node.data.status === 'healthy' ? 'rgb(34,197,94)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)')}`
                  }}
                >
                  Healthy
                </button>
                <button
                  onClick={() => onUpdate({ status: 'degraded' })}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: node.data.status === 'degraded'
                      ? 'rgb(234,179,8)'
                      : (isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)'),
                    color: node.data.status === 'degraded' ? '#ffffff' : (isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)'),
                    border: `1px solid ${node.data.status === 'degraded' ? 'rgb(234,179,8)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)')}`
                  }}
                >
                  Degraded
                </button>
                <button
                  onClick={() => onUpdate({ status: 'down' })}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: node.data.status === 'down'
                      ? 'rgb(239,68,68)'
                      : (isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)'),
                    color: node.data.status === 'down' ? '#ffffff' : (isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)'),
                    border: `1px solid ${node.data.status === 'down' ? 'rgb(239,68,68)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)')}`
                  }}
                >
                  Down
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
              >
                Description
              </label>
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                placeholder="Short note about this node"
                rows={3}
                style={{
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)',
                  background: isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium">
                <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>Scale</span>
                <span style={{ color: isDarkMode ? 'rgb(59,130,246)' : 'rgb(37,99,235)' }}>{localScale}%</span>
              </div>
              <Slider
                value={sliderValue}
                min={0}
                max={100}
                step={1}
                onValueChange={([val]) => {
                  const clamped = Math.min(Math.max(val, 0), 100)
                  setLocalScale(clamped)
                  onUpdate({ scale: clamped })
                }}
                className="[&_[role=slider]]:border-primary [&_[role=slider]]:bg-background"
              />
              <Input
                type="number"
                min={0}
                max={100}
                value={localScale}
                onChange={(e) => {
                  const next = Number(e.target.value)
                  const clamped = Number.isNaN(next) ? 0 : Math.min(Math.max(next, 0), 100)
                  setLocalScale(clamped)
                  onUpdate({ scale: clamped })
                }}
                onBlur={() => {
                  const clamped = Math.min(Math.max(localScale, 0), 100)
                  if (localScale !== clamped) {
                    setLocalScale(clamped)
                    onUpdate({ scale: clamped })
                  }
                }}
                style={{
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)',
                  background: isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
                className="text-center text-lg font-semibold"
              />
            </div>
          </TabsContent>

          <TabsContent value="runtime" className="space-y-3 text-sm">
            <div
              className="flex items-center gap-2"
              style={{ color: isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)' }}
            >
              <Cpu size={16} /> CPU • {node.data.metrics.cpu.toFixed(2)}
            </div>
            <div
              className="flex items-center gap-2"
              style={{ color: isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)' }}
            >
              <HardDrive size={16} /> Disk • {node.data.metrics.disk} GB
            </div>
            <div
              className="flex items-center gap-2"
              style={{ color: isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)' }}
            >
              <BarChart3 size={16} /> Memory • {node.data.metrics.memory.toFixed(2)} GB
            </div>
            <div
              className="flex items-center gap-2"
              style={{ color: isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)' }}
            >
              <MapPin size={16} /> Region • {node.data.metrics.region}
            </div>
            <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2',
              node.data.status === 'down' && 'border-red-500/40 bg-red-500/10 text-red-100',
              node.data.status === 'degraded' && 'border-amber-400/40 bg-amber-500/10 text-amber-50',
              node.data.status === 'healthy' && 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
            )}>
              <ServerCrash size={16} />
              <span className="text-xs">Status: {status?.label ?? 'Unknown'}</span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
