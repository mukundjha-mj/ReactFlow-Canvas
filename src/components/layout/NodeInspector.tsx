import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import { Textarea } from '../ui/textarea'
import type { ServiceNode, ServiceNodeData } from '../../types'
import { useUIStore } from '../../store/appStore'
import { cn } from '../../lib/utils'
import { BarChart3, Cpu, HardDrive, MapPin, PackageOpen, ServerCrash } from 'lucide-react'

interface NodeInspectorProps {
    node?: ServiceNode
    onUpdate: (data: Partial<ServiceNodeData>) => void
}

const statusTheme = {
    healthy: { label: 'Healthy', variant: 'success' as const },
    degraded: { label: 'Degraded', variant: 'warning' as const },
    down: { label: 'Down', variant: 'danger' as const },
}

export function NodeInspector({ node, onUpdate }: NodeInspectorProps) {
    const activeTab = useUIStore((s) => s.activeInspectorTab)
    const setActiveTab = useUIStore((s) => s.setActiveInspectorTab)

    const status = node ? statusTheme[node.data.status] : undefined

    const sliderValue = useMemo(() => [node?.data.scale ?? 0], [node?.data.scale])

    if (!node) {
        return (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-[rgb(15,20,27)] p-4 text-center text-sm text-[rgb(154,164,178)]">
                <PackageOpen size={32} className="text-[rgb(154,164,178)]" />
                <p>Select a node to inspect its config.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[rgb(92,70,56)] bg-[rgb(51,42,36)] p-4 shadow-lg">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[rgb(199,154,125)]">Service Node</p>
                    <p className="text-lg font-semibold text-white">{node.data.name}</p>
                    <p className="text-xs text-[rgb(154,164,178)]">{node.id}</p>
                </div>
                {status && (
                    <Badge
                        variant={status.variant}
                        className={cn(
                            'text-xs font-medium',
                            status.variant === 'success' && 'bg-emerald-500/20 text-emerald-300',
                        )}
                    >
                        {status.label}
                    </Badge>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'config' | 'runtime')}>
                <TabsList className="w-full bg-[rgb(42,34,29)]">
                    <TabsTrigger
                        value="config"
                        className="data-[state=active]:bg-[rgb(234,179,8)] data-[state=active]:text-[rgb(42,34,29)]"
                    >
                        Config
                    </TabsTrigger>
                    <TabsTrigger
                        value="runtime"
                        className="data-[state=active]:bg-[rgb(219,39,119)] data-[state=active]:text-white"
                    >
                        Runtime
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="config" className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Name</label>
                        <Input
                            value={node.data.name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                            className="border-[rgb(92,70,56)] bg-[rgb(42,34,29)] text-[rgb(234,179,8)] placeholder:text-[rgb(154,120,90)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Description</label>
                        <Textarea
                            value={node.data.description ?? ''}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            placeholder="Short note about this node"
                            className="border-[rgb(92,70,56)] bg-[rgb(42,34,29)] text-[rgb(234,179,8)] placeholder:text-[rgb(154,120,90)]"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-medium">
                            <span className="text-white">Scale</span>
                            <span className="text-[rgb(219,39,119)]">{node.data.scale}%</span>
                        </div>
                        <Slider
                            value={sliderValue}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={([val]) => onUpdate({ scale: Math.min(Math.max(val, 0), 100) })}
                            className="[&_[role=slider]]:border-white [&_[role=slider]]:bg-white"
                        />
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            value={node.data.scale}
                            onChange={(e) => {
                                const next = Number(e.target.value)
                                const clamped = Number.isNaN(next) ? 0 : Math.min(Math.max(next, 0), 100)
                                onUpdate({ scale: clamped })
                            }}
                            className="border-[rgb(92,70,56)] bg-[rgb(42,34,29)] text-center text-lg font-semibold text-[rgb(234,179,8)]"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="runtime" className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Cpu size={16} /> CPU • {node.data.metrics.cpu.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <HardDrive size={16} /> Disk • {node.data.metrics.disk} GB
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <BarChart3 size={16} /> Memory • {node.data.metrics.memory.toFixed(2)} GB
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
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
    )
}
