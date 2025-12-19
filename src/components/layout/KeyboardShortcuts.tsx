import { useEffect, useState } from 'react'
import { Command, Maximize2, PanelRightClose, Trash2 } from 'lucide-react'

interface KeyboardShortcutsProps {
  isDarkMode: boolean
}

/**
 * Modal overlay displaying available keyboard shortcuts.
 * Toggles with ? or Ctrl+/, dismisses with Escape.
 */
export function KeyboardShortcuts({ isDarkMode }: KeyboardShortcutsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' || ((event.ctrlKey || event.metaKey) && event.key === '/')) {
        event.preventDefault()
        setIsVisible((prev) => !prev)
      }
      if (event.key === 'Escape' && isVisible) {
        event.preventDefault()
        setIsVisible(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isVisible])

  if (!isVisible) return null

  const shortcuts = [
    { key: 'F', description: 'Fit view to canvas', icon: Maximize2 },
    { key: 'P', description: 'Toggle side panel', icon: PanelRightClose },
    { key: 'Esc', description: 'Close panel / Deselect', icon: PanelRightClose },
    { key: 'Del', description: 'Delete selected node', icon: Trash2 },
    { key: '?', description: 'Show/hide shortcuts', icon: Command },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Shortcuts Panel */}
      <div
        className="fixed left-1/2 top-1/2 z-[70] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl"
        style={{
          background: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 
              className="text-xl font-bold"
              style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
            >
              Keyboard Shortcuts
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-lg p-2 transition-colors hover:bg-white/10"
              style={{ color: isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)' }}
            >
              <Command size={20} />
            </button>
          </div>

          <div className="space-y-2">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon
              return (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors"
                  style={{
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={18} 
                      style={{ color: isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)' }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: isDarkMode ? 'rgb(229,231,235)' : 'rgb(55,65,81)' }}
                    >
                      {shortcut.description}
                    </span>
                  </div>
                  <kbd
                    className="rounded-md px-2.5 py-1.5 text-xs font-bold"
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)',
                    }}
                  >
                    {shortcut.key}
                  </kbd>
                </div>
              )
            })}
          </div>

          <div 
            className="mt-4 rounded-lg p-3 text-center text-xs"
            style={{
              background: isDarkMode ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)',
              color: isDarkMode ? 'rgb(147,197,253)' : 'rgb(59,130,246)',
            }}
          >
            Press <kbd className="font-bold">?</kbd> or <kbd className="font-bold">Ctrl+/</kbd> to toggle this menu
          </div>
        </div>
      </div>
    </>
  )
}
