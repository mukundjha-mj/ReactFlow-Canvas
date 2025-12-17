import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type NodeChange,
  type Connection,
  type ReactFlowInstance,
} from 'reactflow'
import { FlowCanvas } from './components/graph/FlowCanvas'
import { AppList } from './components/layout/AppList'
import { NodeInspector } from './components/layout/NodeInspector'
import { useAppsQuery, useGraphQuery } from './hooks/useAppData'
import { useUIStore } from './store/appStore'
import type { ServiceEdge, ServiceNode, ServiceNodeData } from './types'
import { Button } from './components/ui/button'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from './lib/utils'
import { TopActions } from './components/layout/TopActions'
import { AppDropdown } from './components/layout/AppDropdown'
import { ServiceIconRail } from './components/layout/ServiceIconRail'

function App() {
  const selectedAppId = useUIStore((s) => s.selectedAppId)
  const setSelectedAppId = useUIStore((s) => s.setSelectedAppId)
  const selectedNodeId = useUIStore((s) => s.selectedNodeId)
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const shouldFail = useUIStore((s) => s.shouldFail)
  const isMobilePanelOpen = useUIStore((s) => s.isMobilePanelOpen)
  const toggleMobilePanel = useUIStore((s) => s.toggleMobilePanel)

  const [isAppListOpen, setIsAppListOpen] = useState(false)

  const appsQuery = useAppsQuery(shouldFail)
  const graphQuery = useGraphQuery(selectedAppId, shouldFail)

  const [nodes, setNodes] = useState<ServiceNode[]>([])
  const [edges, setEdges] = useState<ServiceEdge[]>([])
  const [instance, setInstance] = useState<ReactFlowInstance | null>(null)

  useEffect(() => {
    if (!selectedAppId && appsQuery.data?.length) {
      setSelectedAppId(appsQuery.data[0].id)
    }
  }, [appsQuery.data, selectedAppId, setSelectedAppId])

  useEffect(() => {
    if (graphQuery.data) {
      setNodes(graphQuery.data.nodes)
      setEdges(graphQuery.data.edges)
      setSelectedNodeId(null)
    }
  }, [graphQuery.data, setSelectedNodeId])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: 'smoothstep' }, eds)),
    [],
  )

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  )

  const updateSelectedNode = useCallback(
    (data: Partial<ServiceNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node,
        ),
      )
    },
    [selectedNodeId],
  )

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNodeId) return
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId))
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId),
    )
    setSelectedNodeId(null)
    toggleMobilePanel(false)
  }, [selectedNodeId, setSelectedNodeId, toggleMobilePanel])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId) {
        event.preventDefault()
        handleDeleteSelected()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleDeleteSelected, selectedNodeId])

  const isGraphLoading = graphQuery.isFetching && !graphQuery.data

  return (
    <div className="flex h-screen w-screen overflow-hidden text-neutral-100" style={{ background: '#141414' }}>
      <div className="relative flex flex-1 overflow-hidden">
        <TopActions isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

        <AppDropdown
          apps={appsQuery.data}
          selectedAppId={selectedAppId}
          isLoading={appsQuery.isPending}
          isError={appsQuery.isError}
          isOpen={isAppListOpen}
          onToggle={() => setIsAppListOpen(!isAppListOpen)}
          onSelect={(id) => {
            setSelectedAppId(id)
            setSelectedNodeId(null)
            setIsAppListOpen(false)
          }}
          onRetry={() => appsQuery.refetch()}
        />

        <ServiceIconRail
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          instance={instance}
        />

        {/* Center Canvas */}
        <div className="relative flex-1 overflow-hidden bg-transparent">
          <ReactFlowProvider>
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectNode={(id) => {
                setSelectedNodeId(id)
                if (id) toggleMobilePanel(true)
              }}
              onInit={(inst) => {
                setInstance(inst)
                inst.fitView({ padding: 0.2 })
              }}
              isLoading={isGraphLoading}
            />
          </ReactFlowProvider>

          {graphQuery.isError && (
            <div className="absolute inset-x-0 top-4 mx-auto w-[340px] rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle size={16} /> Graph failed to load
              </div>
              <p className="mt-1 text-xs text-red-100/80">Retry or disable the mock error toggle.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-red-500/40 text-red-50"
                onClick={() => graphQuery.refetch()}
              >
                Retry fetch
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden',
          isMobilePanelOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => toggleMobilePanel(false)}
      />

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[90vw] max-w-sm translate-x-full flex-col border-l border-neutral-800 bg-neutral-900 shadow-2xl backdrop-blur-lg transition-transform duration-300 lg:hidden',
          isMobilePanelOpen && 'translate-x-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <p className="text-sm font-semibold">Details</p>
          <Button variant="ghost" size="icon" onClick={() => toggleMobilePanel(false)}>
            <X size={18} />
          </Button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {selectedNodeId ? (
            <div className="p-4">
              <NodeInspector node={selectedNode} onUpdate={updateSelectedNode} />
            </div>
          ) : (
            <div className="p-4">
              <AppList
                apps={appsQuery.data}
                isLoading={appsQuery.isPending}
                isError={appsQuery.isError}
                onRetry={() => appsQuery.refetch()}
                selectedAppId={selectedAppId}
                onSelect={(id) => {
                  setSelectedAppId(id)
                  setSelectedNodeId(null)
                  toggleMobilePanel(false)
                }}
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default App
