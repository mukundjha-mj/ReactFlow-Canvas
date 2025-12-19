interface ProviderBadgeProps {
  provider: string
  size?: 'sm' | 'md'
}

/**
 * Reusable provider badge component for displaying cloud provider (AWS, Azure, GCP).
 */
export function ProviderBadge({ provider, size = 'sm' }: ProviderBadgeProps) {
  const providerColors: Record<string, string> = {
    aws: '#ff9900',
    azure: '#0078d4',
    gcp: '#4285f4',
  }

  const color = providerColors[provider.toLowerCase()] || '#ff9900'
  const fontSize = size === 'sm' ? '11px' : '13px'

  return (
    <span 
      className="font-semibold" 
      style={{ 
        color, 
        opacity: 0.8,
        fontSize 
      }}
    >
      {provider.toLowerCase()}
    </span>
  )
}
