import type { Edge, Node } from '@xyflow/react'

export type ServiceStatus = 'healthy' | 'degraded' | 'down'

export type ServiceKind = 'service' | 'database'

export interface ServiceMetrics {
  cpu: number
  memory: number
  disk: number
  region: string
}

export interface ServiceNodeData {
  name: string
  status: ServiceStatus
  costPerHour: number
  metrics: ServiceMetrics
  scale: number
  description?: string
  kind: ServiceKind
  accent?: string
  isDarkMode?: boolean
  provider?: string
  [key: string]: unknown
}

export type ServiceNode = Node<ServiceNodeData>
export type ServiceEdge = Edge

export interface AppInfo {
  id: string
  name: string
  accent: string
  icon?: string
}

export interface GraphResponse {
  nodes: ServiceNode[]
  edges: ServiceEdge[]
}
