import {
  Background,
  ReactFlow,
  BackgroundVariant,
  MiniMap,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type ReactFlowInstance,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { ServiceEdge, ServiceNode } from '../../types'
import { ServiceNode as ServiceNodeComponent } from './ServiceNode'
import { cn } from '../../lib/utils'

const nodeTypes = { service: ServiceNodeComponent }

interface FlowCanvasProps {
  nodes: ServiceNode[]
  edges: ServiceEdge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  onSelectNode: (id: string | null) => void
  onInit: (instance: ReactFlowInstance<ServiceNode, ServiceEdge>) => void
  isLoading: boolean
  isDarkMode: boolean
}

function FlowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
  onInit,
  isLoading,
  isDarkMode,
}: FlowCanvasProps) {
  const { setViewport } = useReactFlow()

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        attributionPosition="top-right"
        onConnect={onConnect}
        onPaneClick={() => onSelectNode(null)}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        onMove={(_event, viewport) => {
          console.log('🔍 Zoom changed:', {
            zoom: viewport.zoom.toFixed(2),
            x: viewport.x.toFixed(0),
            y: viewport.y.toFixed(0)
          })
        }}
        nodeTypes={nodeTypes}
        defaultViewport={{ zoom: 1.0, x: 33, y: -17 }}
        className="[&_.react-flow__pane]:!cursor-grab"
      >
        <MiniMap zoomable pannable />
        <Controls 
          showFitView={false}
          onZoomIn={() => console.log('➕ Zoom In clicked')}
          onZoomOut={() => console.log('➖ Zoom Out clicked')}
          onInteractiveChange={(isInteractive) => console.log('🔒 Interactive mode:', isInteractive)}
        >
          <button
            className="react-flow__controls-button"
            onClick={() => {
              console.log('🎯 Fit View clicked')
              setViewport({ zoom: 1.0, x: 33, y: -17 }, { duration: 300 })
            }}
            title="Fit View"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path fill="currentColor" d="M1.5 1.5h4v1h-3v3h-1v-4zm9 0h4v4h-1v-3h-3v-1zm-9 9h1v3h3v1h-4v-4zm13 0v4h-4v-1h3v-3h1z" />
            </svg>
          </button>
        </Controls>
        <Background 
          color={isDarkMode ? 'rgba(137, 145, 157, 0.12)' : 'rgba(0, 0, 0, 0.08)'} 
          size={2} 
          gap={18} 
          variant={BackgroundVariant.Dots} 
        />
      </ReactFlow>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
        </div>
      )}

      <div className={cn('pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]')} />
    </div>
  )
}

export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
