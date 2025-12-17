import type { NodeProps } from 'reactflow'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import { Activity, CheckCircle2, AlertTriangle, XCircle, Database, Server, HardDrive, Globe, Settings } from 'lucide-react'
import type { ServiceNodeData } from '../../types'
import postgresLogo from '../../assets/postgresql.png'
import redisLogo from '../../assets/redis.png'
import mongodbLogo from '../../assets/mongodb.png'

export function ServiceNode({ data, selected }: NodeProps<ServiceNodeData>) {
    const getServiceLogo = () => {
        switch (data.name.toLowerCase()) {
            case 'postgres':
                return <img src={postgresLogo} alt="PostgreSQL" className="h-6 w-6 object-contain " />
            case 'redis':
                return <img src={redisLogo} alt="Redis" className="h-6 w-6 object-contain " />
            case 'mongodb':
                return <img src={mongodbLogo} alt="MongoDB" className="h-6 w-6 object-contain " />
            default:
                return data.kind === 'database' ? (
                    <Database size={14} className="text-blue-400" />
                ) : (
                    <Server size={14} className="text-purple-400" />
                )
        }
    }

    return (
        <div
            className={cn(
                'group relative w-[280px] rounded-xl border transition-all duration-200',
                'shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
                selected ? 'border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.1)]' : 'border-white/[0.04]',
            )}
            style={{
                background: '#000000',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                        {getServiceLogo()}
                    </div>
                    <h3 className="text-xs font-medium text-white">{data.name}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        ${data.costPerHour.toFixed(2)}/HR
                    </div>
                    <button className="rounded-lg p-1 text-[#9aa4b2] transition-colors hover:bg-white/[0.04] hover:text-white">
                        <Settings size={12} />
                    </button>
                </div>
            </div>

            
            {/* Metrics Row */}
            <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-2">
                <div className="flex items-center justify-center text-[10px] font-medium text-gray-400 min-w-[48px]">
                    <span>{data.metrics.cpu.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-center text-[10px] font-medium text-gray-400 min-w-[52px]">
                    <span>{data.metrics.memory.toFixed(2)} GB</span>
                </div>
                <div className="flex items-center justify-center text-[10px] font-medium text-gray-400 min-w-[46px]">
                    <span>{data.metrics.disk} GB</span>
                </div>
                <div className="flex items-center justify-center text-[10px] font-medium text-gray-400 min-w-[62px]">
                    <span>{data.metrics.region}</span>
                </div>
            </div>
            {/* Labels Row */}
            <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-1.5">
                <div className="flex items-center gap-1  rounded-full bg-white px-2.5 py-1 ">
                    <Activity size={10} className="text-black"/>
                    <span className="text-[9px] font-semibold text-black">CPU</span>
                </div>
                <div className="flex items-center gap-1">
                    <Database size={10} className="text-gray-500" />
                    <span className="text-[9px] font-medium text-gray-500">Memory</span>
                </div>
                <div className="flex items-center gap-1">
                    <HardDrive size={10} className="text-gray-500" />
                    <span className="text-[9px] font-medium text-gray-500">Disk</span>
                </div>
                <div className="flex items-center gap-1">
                    <Globe size={10} className="text-gray-500" />
                    <span className="text-[9px] font-medium text-gray-500">Region</span>
                </div>
            </div>


            {/* Slider Section */}
            <div className="flex items-center justify-between px-3 py-2">
                <div className="relative mr-2 flex-1">
                    <div
                        className="h-1 rounded-full"
                        style={{
                            background:
                                'linear-gradient(to right, rgb(59, 130, 246), rgb(34, 197, 94), rgb(234, 179, 8), rgb(239, 68, 68))',
                        }}
                    />
                    <div
                        className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-md transition-all"
                        style={{ left: `${Math.min(Math.max(data.scale, 0), 100)}%` }}
                    />
                </div>
                <span className="text-xs font-semibold text-white">
                    {data.scale.toFixed(0)}
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                <Badge
                    variant={data.status === 'healthy' ? 'success' : data.status === 'degraded' ? 'warning' : 'danger'}
                    className="gap-1 text-[10px] font-medium"
                >
                    {data.status === 'healthy' && <CheckCircle2 size={10} />}
                    {data.status === 'degraded' && <AlertTriangle size={10} />}
                    {data.status === 'down' && <XCircle size={10} />}
                    {data.status === 'healthy' ? 'Success' : data.status === 'degraded' ? 'Degraded' : 'Error'}
                </Badge>
                <span className="text-[11px] font-medium opacity-60" style={{ color: '#ff9900' }}>
                    aws
                </span>
            </div>
        </div>
    )
}
