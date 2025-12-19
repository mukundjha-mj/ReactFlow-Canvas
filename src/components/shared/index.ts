/**
 * Shared Components Index
 * 
 * This barrel export file provides centralized access to all shared/reusable components.
 * These components are used across multiple features to maintain consistency and reduce duplication.
 * 
 * Component categories:
 * - Node-specific: NodeCard, NodeMetrics, NodeScaleSlider, ServiceIconContainer
 * - Status & Badges: StatusBadge, ProviderBadge
 * - Layout: Drawer, Card
 * - States: EmptyState, ErrorState
 * - Inputs: SearchInput
 */

// Node components
export { NodeCard } from './NodeCard'
export { NodeMetrics } from './NodeMetrics'
export { NodeScaleSlider } from './NodeScaleSlider'
export { ServiceIconContainer } from './ServiceIconContainer'
export { StatusBadge } from './StatusBadge'
export { ProviderBadge } from './ProviderBadge'

// Layout components
export { Drawer } from './Drawer'
export { Card } from './Card'

// State components
export { EmptyState } from './EmptyState'
export { ErrorState } from './ErrorState'

// Input components
export { SearchInput } from './SearchInput'
