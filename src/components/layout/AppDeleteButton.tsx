import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'

export function AppDeleteButton({ onClick, isDarkMode }: { onClick: () => void, isDarkMode: boolean }) {
  return (
    <Button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      size="icon"
      variant="ghost"
      className="ml-1"
      style={{ color: isDarkMode ? '#ef4444' : '#dc2626', background: 'transparent' }}
      title="Delete app"
    >
      <Trash2 size={16} />
    </Button>
  )
}
