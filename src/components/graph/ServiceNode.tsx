import type { NodeProps } from '@xyflow/react'
import { cn } from '../../lib/utils'
import type { ServiceNodeData } from '../../types'
import { getServiceLogo } from '../../utils/getServiceLogo'
import { NodeCard } from '../shared/NodeCard'

/**
 * Custom ReactFlow node component with theme-based styling.
 * Renders distinct visual themes for service (blue) vs database (purple) nodes.
 * Delegates rendering to the shared NodeCard component for consistency.
 */
export function ServiceNode({ data: nodeData, selected }: NodeProps) {
    const data = nodeData as ServiceNodeData
    const isDarkMode = data.isDarkMode ?? true

    return (
        <div className={cn('group relative w-[240px] sm:w-[280px]')}>
            <NodeCard
                name={data.name}
                kind={data.kind}
                status={data.status}
                costPerHour={data.costPerHour}
                metrics={data.metrics}
                scale={data.scale}
                provider={data.provider || 'aws'}
                icon={getServiceLogo({ serviceName: data.name, kind: data.kind, size: 'small' })}
                isDarkMode={isDarkMode}
                selected={selected}
            />
        </div>
    )
}
