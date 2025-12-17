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
import { AlertTriangle, X, Share2, Moon, Sun, Zap, ChevronDown, MoreVertical, Settings, Cloud, Box, Workflow, Layers } from 'lucide-react'
import { SiGo } from 'react-icons/si'
import { cn } from './lib/utils'
import { getServiceLogo } from './utils/getServiceLogo'

const getAppIcon = (iconName?: string) => {
  const iconClass = "h-5 w-5 text-white"
  switch (iconName) {
    case 'go':
      return <SiGo className={iconClass} />
    case 'cloud':
      return <Cloud className={iconClass} />
    case 'boxes':
      return <Box className={iconClass} />
    case 'pipeline':
      return <Workflow className={iconClass} />
    case 'edge':
      return <Layers className={iconClass} />
    default:
      return <Zap className={iconClass} />
  }
}

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
        {/* Floating Top Right Actions */}
        <aside className="absolute right-2 top-2 sm:right-4 sm:top-4 p-1 rounded-sm z-10 flex items-center gap-1 sm:gap-2 border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.8)'}}>
          {/* Share */}
          <button className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/[0.08]">
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative flex h-8 w-12 sm:h-10 sm:w-16 items-center rounded-full border border-white/[0.06] bg-black/60 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08]"
          >
            <div 
              className={`absolute flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 ${
                isDarkMode ? 'left-1' : 'left-5 sm:left-7'
              }`}
            >
              {isDarkMode ? (
                <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              ) : (
                <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              )}
            </div>
          </button>

          {/* Profile Avatar - Hidden on small screens */}
          <button className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-br from-pink-500 to-purple-600 backdrop-blur-md transition-all duration-200 hover:scale-105">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </button>
        </aside>

        {/* Floating App Dropdown - Top Left */}
        <aside className="absolute left-2 top-14 sm:left-4 sm:top-16 lg:left-20 lg:top-4 z-10 w-[calc(100vw-1rem)] sm:w-[340px] flex flex-col rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
          {/* Dropdown Header */}
          <button
            onClick={() => setIsAppListOpen(!isAppListOpen)}
            className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                {getAppIcon(appsQuery.data?.find(app => app.id === selectedAppId)?.icon)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[150px] sm:max-w-none">
                {appsQuery.data?.find(app => app.id === selectedAppId)?.name || 'supertokens-golang'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ChevronDown
                className={cn("h-4 w-4 text-gray-400 transition-transform", isAppListOpen && "rotate-180")}
              />
              <button className="rounded p-1 text-gray-400 transition-colors hover:bg-white/[0.08] hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </button>

          {/* Dropdown Content */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isAppListOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="flex flex-col overflow-hidden p-4">
              <AppList
                apps={appsQuery.data}
                isLoading={appsQuery.isPending}
                isError={appsQuery.isError}
                onRetry={() => appsQuery.refetch()}
                selectedAppId={selectedAppId}
                onSelect={(id) => {
                  setSelectedAppId(id)
                  setSelectedNodeId(null)
                  setIsAppListOpen(false)
                }}
              />
            </div>
          </div>
        </aside>

        {/* Floating Left Icon Rail */}
        <aside className="absolute left-2 sm:left-4 top-1/2 z-10 hidden md:flex -translate-y-1/2 flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-white/[0.06] px-1.5 sm:px-2 py-3 sm:py-4 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          {/* Service Logos - Dynamic based on selected app's graph */}
          {nodes.map((node) => {
            return (
              <button
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id)
                  instance?.fitView({ 
                    nodes: [node],
                    duration: 300,
                    padding: 0.3
                  })
                }}
                className={cn(
                  'flex h-8 w-8 sm:h-10 sm:w-10 bg-white items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/[0.08]',
                  selectedNodeId === node.id && 'bg-white/[0.12] shadow-lg'
                )}
                title={node.data.name}
              >
                {getServiceLogo({ serviceName: node.data.name, kind: node.data.kind, size: 'medium' })}
              </button>
            )
          })}
        </aside>

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
