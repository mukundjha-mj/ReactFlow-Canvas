import {
  Background,
  Controls,
  ReactFlow,
  BackgroundVariant,
  type ReactFlowInstance,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from 'reactflow'
import 'reactflow/dist/style.css'
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
  onInit: (instance: ReactFlowInstance) => void
  isLoading: boolean
}

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
  onInit,
  isLoading,
}: FlowCanvasProps) {
  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => onSelectNode(null)}
        onSelectionChange={(params) =>
          onSelectNode(params?.nodes?.[0]?.id ?? null)
        }
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.35}
        maxZoom={1.5}
        className="[&_.react-flow__pane]:!cursor-grab"
      >
        <Background color="rgba(137, 145, 157, 0.12)" size={2} gap={18} variant={BackgroundVariant.Dots} />
      </ReactFlow>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
        </div>
      )}

      <div className={cn('pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]')} />
    </div>
  )}
