import { Zap, Cloud, Box, Workflow, Layers } from 'lucide-react'
import { SiGo } from 'react-icons/si'

interface GetAppIconProps {
  iconName?: string
  className?: string
}

export function getAppIcon({ iconName, className = "h-5 w-5" }: GetAppIconProps) {
  switch (iconName) {
    case 'go':
      return <SiGo className={className} />
    case 'cloud':
      return <Cloud className={className} />
    case 'boxes':
      return <Box className={className} />
    case 'pipeline':
      return <Workflow className={className} />
    case 'edge':
      return <Layers className={className} />
    default:
      return <Zap className={className} />
  }
}
