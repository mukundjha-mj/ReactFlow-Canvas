import type { ReactFlowInstance } from '@xyflow/react'
import { getServiceLogo } from '../../utils/getServiceLogo'
import type { ServiceNode } from '../../types'
import { Plus } from 'lucide-react'

interface ServiceIconRailProps {
  nodes: ServiceNode[]
  selectedNodeId: string | null
  onSelectNode: (nodeId: string) => void
  instance: ReactFlowInstance | null
  isDarkMode: boolean
  onAddNode: () => void
}

export function ServiceIconRail({ nodes, selectedNodeId, onSelectNode, instance, isDarkMode, onAddNode }: ServiceIconRailProps) {
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
      className="absolute left-2 sm:left-4 top-1/2 z-10 hidden md:flex -translate-y-1/2 flex-col items-center gap-2 sm:gap-3 p-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" 
      style={{ 
        background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.1)'
      }}
    >
      {nodes.map((node) => (
        <button
          key={node.id}
          onClick={() => handleNodeClick(node)}
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg transition-all duration-200"
          style={{
            background: selectedNodeId === node.id 
              ? (isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(59,130,246,0.15)')
              : (isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.95)'),
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            boxShadow: selectedNodeId === node.id 
              ? (isDarkMode ? '0 10px 15px -3px rgba(255,255,255,0.2)' : '0 10px 15px -3px rgba(59,130,246,0.3)')
              : (isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)')
          }}
          onMouseEnter={(e) => {
            if (selectedNodeId !== node.id) {
              e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(245,245,245,1)'
            }
          }}
          onMouseLeave={(e) => {
            if (selectedNodeId !== node.id) {
              e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.95)'
            }
          }}
          title={node.data.name}
        >
          {getServiceLogo({ serviceName: node.data.name, kind: node.data.kind, size: 'medium' })}
        </button>
      ))}
      
      {/* Add Node Button */}
      <div 
        className="w-full"
        style={{
          borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          marginTop: '0.5rem',
          paddingTop: '0.5rem'
        }}
      >
        <button
          onClick={onAddNode}
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            border: isDarkMode ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.2)',
            background: isDarkMode ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)',
            color: '#3b82f6'
          }}
          title="Add Node"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </aside>
  )
}
