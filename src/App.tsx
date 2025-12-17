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
import { TopBar } from './components/layout/TopBar'
import { AppList } from './components/layout/AppList'
import { NodeInspector } from './components/layout/NodeInspector'
import { useAppsQuery, useGraphQuery } from './hooks/useAppData'
import { useUIStore } from './store/appStore'
import type { ServiceEdge, ServiceNode, ServiceNodeData } from './types'
import { Button } from './components/ui/button'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from './lib/utils'
import postgresLogo from './assets/postgresql.png'
import redisLogo from './assets/redis.png'
import mongodbLogo from './assets/mongodb.png'

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

  const handleFitView = useCallback(() => {
    instance?.fitView({ padding: 0.2 })
  }, [instance])

  const isGraphLoading = graphQuery.isFetching && !graphQuery.data

  return (
    <div className="flex h-screen w-screen overflow-hidden text-neutral-100" style={{ background: '#141414' }}>
      <div className="relative flex flex-1 overflow-hidden">
        {/* Floating Top Right Actions */}
        <aside className="absolute right-4 top-4 p-1 rounded-sm z-10 hidden items-center gap-2 lg:flex border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md lg:flex" style={{ background: 'rgba(0, 0, 0, 0.8)'}}>
          {/* Share */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/[0.08]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>  
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative flex h-10 w-16 items-center rounded-full border border-white/[0.06] bg-black/60 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08]"
          >
            <div 
              className={`absolute flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 ${
                isDarkMode ? 'left-1' : 'left-7'
              }`}
            >
              {isDarkMode ? (
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

          {/* Settings */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/[0.08]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Profile Avatar */}
          <button className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-br from-pink-500 to-purple-600 backdrop-blur-md transition-all duration-200 hover:scale-105">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </button>
        </aside>

        {/* Floating App Dropdown - Top Left */}
        <aside className="absolute left-20 top-4 z-10 hidden w-[340px] flex-col rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md lg:flex" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
          {/* Dropdown Header */}
          <button
            onClick={() => setIsAppListOpen(!isAppListOpen)}
            className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-white">
                {appsQuery.data?.find(app => app.id === selectedAppId)?.name || 'supertokens-golang'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className={cn("h-4 w-4 text-gray-400 transition-transform", isAppListOpen && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <button className="rounded p-1 text-gray-400 transition-colors hover:bg-white/[0.08] hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
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
        <aside className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 rounded-2xl border border-white/[0.06] px-2 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md lg:flex" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          {/* GitHub */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-all duration-200 hover:bg-white/[0.08]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>

          {/* Service Logos - Dynamic based on selected app's graph */}
          {nodes.map((node) => {
            const getServiceLogo = () => {
              switch (node.data.name.toLowerCase()) {
                case 'postgres':
                  return <img src={postgresLogo} alt="PostgreSQL" className="h-8 w-8 object-contain" style={{ mixBlendMode: 'multiply', filter: 'brightness(1.2)' }} />
                case 'redis':
                  return <img src={redisLogo} alt="Redis" className="h-8 w-8 object-contain" style={{ mixBlendMode: 'multiply', filter: 'brightness(1.2)' }} />
                case 'mongodb':
                  return <img src={mongodbLogo} alt="MongoDB" className="h-8 w-8 object-contain" style={{ mixBlendMode: 'multiply', filter: 'brightness(1.2)' }} />
                default:
                  return (
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
                    </svg>
                  )
              }
            }

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
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/[0.08]',
                  selectedNodeId === node.id && 'bg-white/[0.12] shadow-lg'
                )}
                title={node.data.name}
              >
                {getServiceLogo()}
              </button>
            )
          })}

          {/* Cube - Gray */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-white/[0.08]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </button>

          {/* Table - Orange */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-orange-500 transition-all duration-200 hover:bg-white/[0.08]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Network - Teal */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-teal-400 transition-all duration-200 hover:bg-white/[0.08]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"/>
            </svg>
          </button>
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

          {/* Bottom Right Profile Avatar */}
          <button className="absolute bottom-4 right-4 z-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/[0.12] bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </button>

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
