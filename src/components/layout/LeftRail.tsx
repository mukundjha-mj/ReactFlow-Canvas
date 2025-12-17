import {
  Database,
  GitBranch,
  Globe2,
  Hexagon,
  LayoutPanelLeft,
  Settings,
  Timer,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const items = [
  { icon: GitBranch, label: 'Graph' },
  { icon: Database, label: 'Data' },
  { icon: Globe2, label: 'Regions' },
  { icon: Timer, label: 'Activity' },
  { icon: Settings, label: 'Settings' },
  { icon: LayoutPanelLeft, label: 'Layout' },
  { icon: Hexagon, label: 'Stacks' },
]

export function LeftRail() {
  return (
    <aside className="hidden h-full w-16 shrink-0 flex-col items-center gap-3 border-r border-white/5 bg-card/70 px-2 py-4 shadow-glass backdrop-blur md:flex">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition hover:text-white',
            index === 0 && 'bg-primary/15 text-primary shadow-inner',
          )}
          title={item.label}
        >
          <item.icon size={18} />
        </div>
      ))}
    </aside>
  )
}
