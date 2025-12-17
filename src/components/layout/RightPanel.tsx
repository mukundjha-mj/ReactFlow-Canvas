import type { AppInfo, ServiceNode, ServiceNodeData } from '../../types'
import { useUIStore } from '../../store/appStore'
import { AppList } from './AppList'
import { NodeInspector } from './NodeInspector'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface RightPanelProps {
  apps?: AppInfo[]
  isLoadingApps: boolean
  isErrorApps: boolean
  onRetryApps: () => void
  selectedAppId: string | null
  onSelectApp: (id: string) => void
  selectedNode?: ServiceNode
  onUpdateNode: (data: Partial<ServiceNodeData>) => void
}

export function RightPanel({
  apps,
  isLoadingApps,
  isErrorApps,
  onRetryApps,
  selectedAppId,
  onSelectApp,
  selectedNode,
  onUpdateNode,
}: RightPanelProps) {
  const isMobilePanelOpen = useUIStore((s) => s.isMobilePanelOpen)
  const toggleMobilePanel = useUIStore((s) => s.toggleMobilePanel)

  const content = (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto px-4 pb-4 pt-2">
      <AppList
        apps={apps}
        isLoading={isLoadingApps}
        isError={isErrorApps}
        onRetry={onRetryApps}
        selectedAppId={selectedAppId}
        onSelect={onSelectApp}
      />
      <NodeInspector node={selectedNode} onUpdate={onUpdateNode} />
    </div>
  )

  return (
    <>
      <aside className="hidden h-full w-[360px] shrink-0 border-l border-white/5 bg-gradient-to-b from-card/80 to-card/60 shadow-glass backdrop-blur lg:block">
        {content}
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden',
          isMobilePanelOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => toggleMobilePanel(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-[90vw] max-w-sm translate-x-full border-l border-white/5 bg-card/90 shadow-2xl backdrop-blur-lg transition-transform duration-300 lg:hidden',
          isMobilePanelOpen && 'translate-x-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <p className="text-sm font-semibold">Details</p>
          <Button variant="ghost" size="icon" onClick={() => toggleMobilePanel(false)}>
            <X size={18} />
          </Button>
        </div>
        {content}
      </aside>
    </>
  )
}
