import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Cloud, Box, GitBranch, Layers, Server, Package } from 'lucide-react'

interface CreateAppDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateApp: (name: string, icon: string) => void
  isDarkMode: boolean
}

const iconOptions = [
  { value: 'cloud', icon: Cloud, label: 'Cloud' },
  { value: 'box', icon: Box, label: 'Box' },
  { value: 'git-branch', icon: GitBranch, label: 'Git Branch' },
  { value: 'layers', icon: Layers, label: 'Layers' },
  { value: 'server', icon: Server, label: 'Server' },
  { value: 'package', icon: Package, label: 'Package' },
]

export function CreateAppDialog({ isOpen, onClose, onCreateApp, isDarkMode }: CreateAppDialogProps) {
  const [appName, setAppName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('cloud')

  const handleCreate = () => {
    if (appName.trim()) {
      onCreateApp(appName.trim(), selectedIcon)
      setAppName('')
      setSelectedIcon('cloud')
      onClose()
    }
  }

  const handleCancel = () => {
    setAppName('')
    setSelectedIcon('cloud')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent
        className="sm:max-w-[425px]"
        style={{
          background: isDarkMode ? 'rgb(24,24,27)' : '#ffffff',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            Create New Application
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="app-name" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
              Application Name
            </Label>
            <Input
              id="app-name"
              placeholder="Enter application name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate()
                }
              }}
              style={{
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)',
                background: isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)',
                color: isDarkMode ? '#ffffff' : '#000000'
              }}
            />
          </div>

          <div className="space-y-2">
            <Label style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
              Select Icon
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedIcon(option.value)}
                    className="flex h-12 w-12 items-center justify-center rounded-lg transition-all"
                    style={{
                      background: selectedIcon === option.value
                        ? 'rgb(59,130,246)'
                        : (isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)'),
                      border: `1px solid ${selectedIcon === option.value ? 'rgb(59,130,246)' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)')}`,
                      color: selectedIcon === option.value ? '#ffffff' : (isDarkMode ? 'rgb(156,163,175)' : 'rgb(107,114,128)')
                    }}
                    title={option.label}
                  >
                    <IconComponent size={20} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            style={{
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)',
              background: isDarkMode ? 'rgb(38,38,38)' : 'rgb(249,250,251)',
              color: isDarkMode ? '#ffffff' : '#000000'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!appName.trim()}
            style={{
              background: appName.trim() ? 'rgb(59,130,246)' : (isDarkMode ? 'rgb(38,38,38)' : 'rgb(229,231,235)'),
              color: appName.trim() ? '#ffffff' : (isDarkMode ? 'rgb(82,82,91)' : 'rgb(156,163,175)'),
              border: 'none',
              opacity: appName.trim() ? 1 : 0.5,
              cursor: appName.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
