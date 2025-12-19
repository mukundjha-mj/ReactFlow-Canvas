import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useNodesState,
  useEdgesState,
  type ReactFlowInstance,
} from '@xyflow/react'
import { FlowCanvas } from './components/graph/FlowCanvas'
import { AppList } from './components/layout/AppList'
import { NodeInspector } from './components/layout/NodeInspector'
import { useAppsQuery, useGraphQuery } from './hooks/useAppData'
import { useUIStore } from './store/appStore'
import type { ServiceEdge, ServiceNode, ServiceNodeData, AppInfo, GraphResponse } from './types'
import { Button } from './components/ui/button'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from './lib/utils'
import { TopActions } from './components/layout/TopActions'
import { AppDropdown } from './components/layout/AppDropdown'
import { ServiceIconRail } from './components/layout/ServiceIconRail'
import { CreateAppDialog } from './components/layout/CreateAppDialog'

function App() {
  const queryClient = useQueryClient()
  const selectedAppId = useUIStore((s) => s.selectedAppId)
  const setSelectedAppId = useUIStore((s) => s.setSelectedAppId)
  const selectedNodeId = useUIStore((s) => s.selectedNodeId)
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const shouldFail = useUIStore((s) => s.shouldFail)
  const isMobilePanelOpen = useUIStore((s) => s.isMobilePanelOpen)
  const toggleMobilePanel = useUIStore((s) => s.toggleMobilePanel)

  const [isAppListOpen, setIsAppListOpen] = useState(false)
  const [isCreateAppDialogOpen, setIsCreateAppDialogOpen] = useState(false)

  const appsQuery = useAppsQuery(shouldFail)
  const graphQuery = useGraphQuery(selectedAppId, shouldFail)

  const [nodes, setNodes, onNodesChange] = useNodesState<ServiceNode>([] as ServiceNode[])
  const [edges, setEdges, onEdgesChange] = useEdgesState<ServiceEdge>([] as ServiceEdge[])
  const [instance, setInstance] = useState<ReactFlowInstance<ServiceNode, ServiceEdge> | null>(null)

  useEffect(() => {
    if (!selectedAppId && appsQuery.data?.length) {
      setSelectedAppId(appsQuery.data[0].id)
    }
  }, [appsQuery.data, selectedAppId, setSelectedAppId])

  useEffect(() => {
    if (graphQuery.data) {
      // Add isDarkMode to each node's data
      const nodesWithTheme = graphQuery.data.nodes.map(node => ({
        ...node,
        data: { ...node.data, isDarkMode }
      }))
      setNodes(nodesWithTheme)
      setEdges([])
      setSelectedNodeId(null)
    }
  }, [graphQuery.data, setSelectedNodeId, isDarkMode])

  const onConnect = useCallback(
    () => {
      // Connection disabled
    },
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
            ? { ...node, data: { ...node.data, ...data, isDarkMode } }
            : node,
        ),
      )
    },
    [selectedNodeId, isDarkMode],
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
      // Don't delete node if user is typing in an input/textarea
      const target = event.target as HTMLElement
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId && !isInputField) {
        event.preventDefault()
        handleDeleteSelected()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleDeleteSelected, selectedNodeId])

  const isGraphLoading = graphQuery.isFetching && !graphQuery.data

  return (
    <div className={cn("flex h-screen w-screen overflow-hidden", isDarkMode ? "dark" : "")} style={{ background: isDarkMode ? '#141414' : '#f5f5f5' }}>
      <div className="relative flex flex-1 overflow-hidden">
        <TopActions 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onFitView={() => {
            if (instance) {
              instance.fitView({ duration: 300, padding: 0.2 })
            }
          }}
        />

        {/* AppDropdown Overlay */}
        {isAppListOpen && (
          <div
            className="fixed inset-0 z-[5]"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => setIsAppListOpen(false)}
          />
        )}

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
          onCreateApp={() => {
            setIsCreateAppDialogOpen(true)
          }}
          onRetry={() => appsQuery.refetch()}
          isDarkMode={isDarkMode}
        />

        <ServiceIconRail
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          instance={instance as any}
          isDarkMode={isDarkMode}
          onAddNode={() => {
            const newNodeId = `node-${Date.now()}`
            const serviceNames = ['Redis', 'Postgres', 'MongoDB', 'MySQL', 'Elasticsearch']
            const randomService = serviceNames[Math.floor(Math.random() * serviceNames.length)]
            const providers = ['aws', 'gcp', 'azure']
            const randomProvider = providers[Math.floor(Math.random() * providers.length)]
            
            // Calculate position (center of viewport or below existing nodes)
            const viewport = instance?.getViewport() || { x: 0, y: 0, zoom: 1 }
            const existingNodes = nodes
            let newX = 520 // Default center
            let newY = 200
            
            if (existingNodes.length > 0) {
              // Find the lowest node and place new node below it
              const maxY = Math.max(...existingNodes.map(n => n.position.y))
              newY = maxY + 200
            }
            
            const newNode: ServiceNode = {
              id: newNodeId,
              type: 'service',
              position: { x: newX, y: newY },
              data: {
                name: randomService,
                kind: 'database',
                status: 'healthy',
                description: 'New service node',
                costPerHour: Math.random() * 0.1,
                metrics: {
                  cpu: Math.random() * 4,
                  memory: Math.random() * 8,
                  disk: Math.floor(Math.random() * 100) + 10,
                  region: 'us-east-1'
                },
                scale: Math.floor(Math.random() * 100),
                provider: randomProvider,
                isDarkMode
              }
            }
            
            setNodes((nds) => [...nds, newNode])
            setSelectedNodeId(newNodeId)
            
            // Fit view to show the new node
            setTimeout(() => {
              instance?.fitView({ duration: 300, padding: 0.2 })
            }, 100)
          }}
        />

        {/* Center Canvas */}
        <div className="relative flex-1 overflow-hidden bg-transparent">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange as any}
            onEdgesChange={onEdgesChange as any}
            onConnect={onConnect}
            onSelectNode={(id) => {
              setSelectedNodeId(id)
              // No need to toggle mobile panel, drawer will auto-open based on selectedNodeId
            }}
            onInit={(inst) => {
              setInstance(inst)
              // Fit view on initial load with a slight delay to ensure nodes are rendered
              setTimeout(() => {
                inst.fitView({ duration: 400, padding: 0.2 })
              }, 100)
            }}
            isLoading={isGraphLoading}
            isDarkMode={isDarkMode}
          />

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

      {/* Desktop & Mobile Overlay */}
      {(isMobilePanelOpen || selectedNodeId) && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:bg-black/10"
          onClick={() => {
            setSelectedNodeId(null)
          }}
        />
      )}

      {/* Slide-over Drawer (Desktop & Mobile) */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[90vw] max-w-sm lg:max-w-md flex-col shadow-2xl backdrop-blur-lg transition-all duration-300 ease-in-out',
          (isMobilePanelOpen || selectedNodeId) ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{
          borderLeft: isDarkMode ? '1px solid rgb(38,38,38)' : '1px solid rgb(229,231,235)',
          background: isDarkMode ? 'rgb(23,23,23)' : 'rgb(249,250,251)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: isDarkMode ? '1px solid rgb(38,38,38)' : '1px solid rgb(229,231,235)' }}
        >
          <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            {selectedNodeId ? 'Node Details' : 'Details'}
          </p>
          <button 
            className="rounded-lg p-2 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedNodeId(null)
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-4 scrollbar-hide">
          {selectedNodeId ? (
            <NodeInspector node={selectedNode} onUpdate={updateSelectedNode} isDarkMode={isDarkMode} />
          ) : (
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
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </aside>

      {/* Create App Dialog */}
      <CreateAppDialog
        isOpen={isCreateAppDialogOpen}
        onClose={() => setIsCreateAppDialogOpen(false)}
        onCreateApp={(name, icon) => {
          const newAppId = `app-${Date.now()}`
          const newApp: AppInfo = {
            id: newAppId,
            name: name,
            icon: icon,
            accent: '#3b82f6'
          }
          
          // Add the new app to the query cache
          queryClient.setQueryData<AppInfo[]>(['apps', shouldFail], (oldApps) => {
            return oldApps ? [...oldApps, newApp] : [newApp]
          })
          
          // Create empty graph for the new app
          queryClient.setQueryData<GraphResponse>(['graph', newAppId, shouldFail], {
            nodes: [],
            edges: []
          })
          
          // Select the newly created app
          setSelectedAppId(newAppId)
          setIsAppListOpen(false)
          
          console.log('New app created:', newApp)
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}

export default App
