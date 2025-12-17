import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { useUIStore } from '../../store/appStore'
import { Badge } from '../ui/badge'
import {
  AlignJustify,
  CheckCircle2,
  LayoutGrid,
  Moon,
  RotateCcw,
  Zap,
} from 'lucide-react'

interface TopBarProps {
  onFitView?: () => void
}

export function TopBar({ onFitView }: TopBarProps) {
  const shouldFail = useUIStore((s) => s.shouldFail)
  const setShouldFail = useUIStore((s) => s.setShouldFail)
  const toggleMobilePanel = useUIStore((s) => s.toggleMobilePanel)

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/[0.06] bg-[rgb(10,13,18)] px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-primary">
          <LayoutGrid size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[rgb(154,164,178)]">
            App Graph Builder
            <Badge variant="success" className="gap-1 px-2 py-0.5 text-[10px]">
              <CheckCircle2 size={11} />
              Active
            </Badge>
          </div>
          <p className="text-sm font-semibold tracking-tight text-white">ReactFlow Canvas</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8 text-[rgb(154,164,178)] transition-colors hover:bg-white/[0.04]', shouldFail && 'text-red-400')}
          onClick={() => setShouldFail(!shouldFail)}
          title="Toggle mock error"
        >
          <Zap size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[rgb(154,164,178)] transition-colors hover:bg-white/[0.04]"
          onClick={onFitView}
          title="Fit to view"
        >
          <RotateCcw size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[rgb(154,164,178)] transition-colors hover:bg-white/[0.04]">
          <Moon size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[rgb(154,164,178)] transition-colors hover:bg-white/[0.04] lg:hidden"
          onClick={() => toggleMobilePanel(true)}
          title="Open details"
        >
          <AlignJustify size={16} />
        </Button>
      </div>
    </header>
  )
}
