import type { ReactFlowInstance } from 'reactflow'
import { cn } from '../../lib/utils'
import { getServiceLogo } from '../../utils/getServiceLogo'
import type { ServiceNode } from '../../types'

interface ServiceIconRailProps {
  nodes: ServiceNode[]
  selectedNodeId: string | null
  onSelectNode: (nodeId: string) => void
  instance: ReactFlowInstance | null
}

export function ServiceIconRail({ nodes, selectedNodeId, onSelectNode, instance }: ServiceIconRailProps) {
  const handleNodeClick = (node: ServiceNode) => {
    onSelectNode(node.id)
    instance?.fitView({ 
      nodes: [node],
      duration: 300,
      padding: 0.3
    })
  }

  return (
    <aside 
      className="absolute left-2 sm:left-4 top-1/2 z-10 hidden md:flex -translate-y-1/2 flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-white/[0.06] px-1.5 sm:px-2 py-3 sm:py-4 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" 
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
    >
      {nodes.map((node) => (
        <button
          key={node.id}
          onClick={() => handleNodeClick(node)}
          className={cn(
            'flex h-8 w-8 sm:h-10 sm:w-10 bg-white items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/[0.08]',
            selectedNodeId === node.id && 'bg-white/[0.12] shadow-lg'
          )}
          title={node.data.name}
        >
          {getServiceLogo({ serviceName: node.data.name, kind: node.data.kind, size: 'medium' })}
        </button>
      ))}
    </aside>
  )
}
