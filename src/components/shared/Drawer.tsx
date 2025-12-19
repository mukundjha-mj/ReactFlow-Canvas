import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  isDarkMode?: boolean
}

/**
 * Reusable slide-over drawer component for mobile and desktop.
 * Used for both NodeInspector and AppList panels.
 */
export function Drawer({ isOpen, onClose, title, children, isDarkMode = true }: DrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:bg-black/10"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[90vw] max-w-sm lg:max-w-md flex-col shadow-2xl backdrop-blur-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          borderLeft: isDarkMode ? '1px solid rgb(38,38,38)' : '1px solid rgb(229,231,235)',
          background: isDarkMode ? 'rgb(23,23,23)' : 'rgb(249,250,251)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: isDarkMode ? '1px solid rgb(38,38,38)' : '1px solid rgb(229,231,235)' }}
        >
          <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            {title}
          </p>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 scrollbar-hide">{children}</div>
      </aside>
    </>
  )
}
