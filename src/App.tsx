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
import { KeyboardShortcuts } from './components/layout/KeyboardShortcuts'

/**
 * Main application component managing the ReactFlow canvas with service/database nodes.
 * Handles app selection, node management, keyboard shortcuts, and theme state.
 */
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
      // Connections between nodes are intentionally disabled in this demo
    },
    [],
  )

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  )

  /**
   * Updates the selected node's data while preserving theme consistency.
   * Uses immutable update pattern to ensure React state updates properly.
   */
  const updateSelectedNode = useCallback(
    (data: Partial<ServiceNodeData>) => {
      if (!selectedNodeId) return
      
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== selectedNodeId) return node
          
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
              isDarkMode,
            },
          }
        }),
      )
    },
    [selectedNodeId, isDarkMode, setNodes],
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

  /**
   * Global keyboard shortcuts handler.
   * Shortcuts: Delete/Backspace (delete node), F (fit view), P (toggle panel), Escape (close/deselect)
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeId && !isInputField) {
        event.preventDefault()
        handleDeleteSelected()
        return
      }
      
      if (event.key === 'f' && !isInputField && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        if (instance) {
          instance.fitView({ duration: 300, padding: 0.2 })
        }
        return
      }
      
      if ((event.key === 'p' || event.key === 'Escape') && !isInputField && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        if (event.key === 'Escape' && (isMobilePanelOpen || selectedNodeId)) {
          setSelectedNodeId(null)
          toggleMobilePanel(false)
        } else if (event.key === 'p') {
          toggleMobilePanel()
        }
        return
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleDeleteSelected, selectedNodeId, instance, isMobilePanelOpen, setSelectedNodeId, toggleMobilePanel])

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
          onDeleteApp={(id) => {
            queryClient.setQueryData<AppInfo[]>(['apps', shouldFail], (oldApps) => {
              if (!oldApps) return []
              return oldApps.filter((a) => a.id !== id)
            })
            queryClient.removeQueries({ queryKey: ['graph', id, shouldFail] })
            
            if (selectedAppId === id) {
              const remaining = (appsQuery.data || []).filter((a) => a.id !== id)
              setSelectedAppId(remaining[0]?.id || null)
              setSelectedNodeId(null)
            }
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
            
            const services = ['API Gateway', 'Load Balancer', 'Auth Service', 'Payment Service', 'Notification Service']
            const databases = ['Redis', 'Postgres', 'MongoDB', 'MySQL', 'Elasticsearch']
            
            const isDatabase = Math.random() > 0.5
            const nodeKind: 'database' | 'service' = isDatabase ? 'database' : 'service'
            const names = isDatabase ? databases : services
            const randomName = names[Math.floor(Math.random() * names.length)]
            
            const providers = ['aws', 'gcp', 'azure']
            const randomProvider = providers[Math.floor(Math.random() * providers.length)]
            
            const viewport = instance?.getViewport() || { x: 0, y: 0, zoom: 1 }
            const existingNodes = nodes
            let newX = 520
            let newY = 200
            
            if (existingNodes.length > 0) {
              const maxY = Math.max(...existingNodes.map(n => n.position.y))
              newY = maxY + 200
            }
            
            const newNode: ServiceNode = {
              id: newNodeId,
              type: 'service',
              position: { x: newX, y: newY },
              data: {
                name: randomName,
                kind: nodeKind,
                status: 'healthy',
                description: isDatabase ? 'Database instance' : 'Service instance',
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
            
            setTimeout(() => {
              instance?.fitView({ duration: 300, padding: 0.2 })
            }, 100)
          }}
        />

        <div className="relative flex-1 overflow-hidden bg-transparent">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange as any}
            onEdgesChange={onEdgesChange as any}
            onConnect={onConnect}
            onSelectNode={(id) => {
              setSelectedNodeId(id)
            }}
            onInit={(inst) => {
              setInstance(inst)
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
            toggleMobilePanel(false)
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
              onDeleteApp={(id) => {
                queryClient.setQueryData<AppInfo[]>(['apps', shouldFail], (oldApps) => {
                  if (!oldApps) return []
                  return oldApps.filter((a) => a.id !== id)
                })
                queryClient.removeQueries({ queryKey: ['graph', id, shouldFail] })
                
                if (selectedAppId === id) {
                  const remaining = (appsQuery.data || []).filter((a) => a.id !== id)
                  setSelectedAppId(remaining[0]?.id || null)
                  setSelectedNodeId(null)
                }
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
          
          queryClient.setQueryData<AppInfo[]>(['apps', shouldFail], (oldApps) => {
            return oldApps ? [...oldApps, newApp] : [newApp]
          })
          
          queryClient.setQueryData<GraphResponse>(['graph', newAppId, shouldFail], {
            nodes: [],
            edges: []
          })
          
          setSelectedAppId(newAppId)
          setIsAppListOpen(false)
          
          console.log('New app created:', newApp)
        }}
        isDarkMode={isDarkMode}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcuts isDarkMode={isDarkMode} />
    </div>
  )
}

export default App
