import type { AppInfo, GraphResponse, ServiceStatus } from '../types'

/**
 * Arranges nodes in visually pleasing patterns based on count.
 * Supports layouts: single, side-by-side, T-shape, pyramid, and grid.
 */
function autoArrangeNodes(nodes: any[]) {
  const count = nodes.length
  const centerX = 520
  const topY = 50
  const bottomY = 320
  const spacing = 320

  return nodes.map((node, index) => {
    let x = centerX
    let y = topY

    if (count === 1) {
      x = centerX
      y = topY + 135
    } else if (count === 2) {
      x = centerX + (index === 0 ? -spacing / 2 : spacing / 2)
      y = topY + 135
    } else if (count === 3) {
      if (index === 0) {
        x = centerX
        y = topY
      } else {
        x = centerX + (index === 1 ? -spacing * 0.75 : spacing * 0.75)
        y = bottomY
      }
    } else if (count === 4) {
      if (index === 0) {
        x = centerX
        y = topY
      } else {
        const offset = [-spacing, 0, spacing]
        x = centerX + offset[index - 1]
        y = bottomY
      }
    } else if (count === 5) {
      if (index < 2) {
        x = centerX + (index === 0 ? -spacing / 2 : spacing / 2)
        y = topY
      } else {
        const offset = [-spacing, 0, spacing]
        x = centerX + offset[index - 2]
        y = bottomY
      }
    } else {
      const col = index % 3
      const row = Math.floor(index / 3)
      x = centerX + (col - 1) * spacing
      y = topY + row * 270
    }

    return {
      ...node,
      position: { x, y }
    }
  })
}

const apps: AppInfo[] = [
  { id: 'supertokens-golang', name: 'supertokens-golang', accent: '#6f6af8', icon: 'go' },
  { id: 'cloud-infrastructure', name: 'Cloud Infrastructure', accent: '#0ea5e9', icon: 'cloud' },
  { id: 'microservices-stack', name: 'Microservices Stack', accent: '#8b5cf6', icon: 'boxes' },
  { id: 'data-pipeline', name: 'Data Pipeline', accent: '#f59e0b', icon: 'pipeline' },
  { id: 'edge-platform', name: 'Edge Platform', accent: '#ec4899', icon: 'edge' },
]

const graphs: Record<string, GraphResponse> = {
  'supertokens-golang': {
    nodes: [
      {
        id: 'api-gateway',
        type: 'service',
        position: { x: 520, y: 50 },
        data: {
          name: 'API Gateway',
          status: 'healthy',
          costPerHour: 0.05,
          metrics: { cpu: 1.2, memory: 2.5, disk: 20, region: 'us-east-1' },
          scale: 45,
          description: 'Main API gateway service',
          kind: 'service',
          accent: '#38bdf8',
        },
      },
      {
        id: 'auth-service',
        type: 'service',
        position: { x: 200, y: 320 },
        data: {
          name: 'Auth Service',
          status: 'healthy',
          costPerHour: 0.04,
          metrics: { cpu: 0.8, memory: 1.8, disk: 15, region: 'us-east-1' },
          scale: 35,
          description: 'Authentication service',
          kind: 'service',
          accent: '#f43f5e',
        },
      },
      {
        id: 'postgres',
        type: 'service',
        position: { x: 520, y: 320 },
        data: {
          name: 'Postgres',
          status: 'healthy',
          costPerHour: 0.03,
          metrics: { cpu: 0.5, memory: 4.0, disk: 100, region: 'us-east-1' },
          scale: 22,
          description: 'Primary relational database',
          kind: 'database',
          accent: '#22c55e',
        },
      },
      {
        id: 'redis',
        type: 'service',
        position: { x: 840, y: 320 },
        data: {
          name: 'Redis',
          status: 'healthy',
          costPerHour: 0.02,
          metrics: { cpu: 0.3, memory: 2.0, disk: 10, region: 'us-east-1' },
          scale: 18,
          description: 'In-memory cache database',
          kind: 'database',
          accent: '#f43f5e',
        },
      },
    ],
    edges: [
      { id: 'edge-gateway-auth', source: 'api-gateway', target: 'auth-service', animated: false, type: 'smoothstep' },
      { id: 'edge-gateway-postgres', source: 'api-gateway', target: 'postgres', animated: false, type: 'smoothstep' },
      { id: 'edge-gateway-redis', source: 'api-gateway', target: 'redis', animated: false, type: 'smoothstep' },
      { id: 'edge-auth-postgres', source: 'auth-service', target: 'postgres', animated: false, type: 'smoothstep' },
    ],
  },
  'cloud-infrastructure': {
    nodes: [
      {
        id: 'load-balancer',
        type: 'service',
        position: { x: 520, y: 50 },
        data: {
          name: 'Load Balancer',
          status: 'healthy',
          costPerHour: 0.06,
          metrics: { cpu: 1.5, memory: 3.2, disk: 25, region: 'us-west-2' },
          scale: 60,
          description: 'Traffic load balancer',
          kind: 'service',
          accent: '#10b981',
        },
      },
      {
        id: 'app-service',
        type: 'service',
        position: { x: 200, y: 320 },
        data: {
          name: 'App Service',
          status: 'healthy',
          costPerHour: 0.04,
          metrics: { cpu: 0.9, memory: 2.0, disk: 30, region: 'us-west-2' },
          scale: 35,
          description: 'Application service',
          kind: 'service',
          accent: '#3b82f6',
        },
      },
      {
        id: 'mysql',
        type: 'service',
        position: { x: 520, y: 320 },
        data: {
          name: 'MySQL',
          status: 'healthy',
          costPerHour: 0.03,
          metrics: { cpu: 0.6, memory: 3.5, disk: 80, region: 'us-west-2' },
          scale: 28,
          description: 'MySQL database',
          kind: 'database',
          accent: '#3b82f6',
        },
      },
      {
        id: 'elasticsearch',
        type: 'service',
        position: { x: 840, y: 320 },
        data: {
          name: 'Elasticsearch',
          status: 'degraded',
          costPerHour: 0.07,
          metrics: { cpu: 1.2, memory: 5.5, disk: 120, region: 'us-west-2' },
          scale: 42,
          description: 'Search and analytics database',
          kind: 'database',
          accent: '#0078d4',
        },
      },
    ],
    edges: [
      { id: 'edge-lb-app', source: 'load-balancer', target: 'app-service', type: 'smoothstep' },
      { id: 'edge-app-mysql', source: 'app-service', target: 'mysql', type: 'smoothstep' },
      { id: 'edge-app-elastic', source: 'app-service', target: 'elasticsearch', type: 'smoothstep' },
    ],
  },
  'microservices-stack': {
    nodes: [
      {
        id: 'kafka',
        type: 'service',
        position: { x: 520, y: 50 },
        data: {
          name: 'Kafka',
          status: 'healthy',
          costPerHour: 0.06,
          metrics: { cpu: 0.04, memory: 0.10, disk: 80, region: 'us-west-2' },
          scale: 45,
          description: 'Message broker',
          kind: 'service',
          accent: '#000000',
        },
      },
      {
        id: 'rabbitmq',
        type: 'service',
        position: { x: 280, y: 320 },
        data: {
          name: 'RabbitMQ',
          status: 'healthy',
          costPerHour: 0.04,
          metrics: { cpu: 0.02, memory: 0.06, disk: 30, region: 'us-west-2' },
          scale: 32,
          description: 'Queue service',
          kind: 'service',
          accent: '#ff6600',
        },
      },
      {
        id: 'elasticsearch',
        type: 'service',
        position: { x: 760, y: 320 },
        data: {
          name: 'Elasticsearch',
          status: 'degraded',
          costPerHour: 0.10,
          metrics: { cpu: 0.07, memory: 0.15, disk: 120, region: 'us-west-2' },
          scale: 68,
          description: 'Search engine',
          kind: 'database',
          accent: '#fec514',
        },
      },
    ],
    edges: [
      { id: 'edge-kafka-rabbitmq', source: 'kafka', target: 'rabbitmq', type: 'smoothstep' },
      { id: 'edge-kafka-elasticsearch', source: 'kafka', target: 'elasticsearch', type: 'smoothstep' },
    ],
  },
  'data-pipeline': {
    nodes: [
      {
        id: 'aws',
        type: 'service',
        position: { x: 520, y: 50 },
        data: {
          name: 'AWS S3',
          status: 'healthy',
          costPerHour: 0.05,
          metrics: { cpu: 0.02, memory: 0.04, disk: 500, region: 'us-east-1' },
          scale: 25,
          description: 'Object storage',
          kind: 'database',
          accent: '#ff9900',
        },
      },
      {
        id: 'apache',
        type: 'service',
        position: { x: 280, y: 320 },
        data: {
          name: 'Apache',
          status: 'healthy',
          costPerHour: 0.03,
          metrics: { cpu: 0.02, memory: 0.05, disk: 15, region: 'us-east-1' },
          scale: 28,
          description: 'Web server',
          kind: 'service',
          accent: '#d22128',
        },
      },
      {
        id: 'analytics-engine',
        type: 'service',
        position: { x: 760, y: 320 },
        data: {
          name: 'Analytics',
          status: 'healthy',
          costPerHour: 0.08,
          metrics: { cpu: 0.06, memory: 0.14, disk: 200, region: 'us-east-1' },
          scale: 62,
          description: 'Data processing',
          kind: 'service',
          accent: '#8b5cf6',
        },
      },
    ],
    edges: [
      { id: 'edge-aws-apache', source: 'aws', target: 'apache', type: 'smoothstep' },
      { id: 'edge-aws-analytics', source: 'aws', target: 'analytics-engine', type: 'smoothstep' },
    ],
  },
  'edge-platform': {
    nodes: [
      {
        id: 'cloudflare',
        type: 'service',
        position: { x: 520, y: 50 },
        data: {
          name: 'Cloudflare',
          status: 'healthy',
          costPerHour: 0.04,
          metrics: { cpu: 0.02, memory: 0.05, disk: 20, region: 'global' },
          scale: 18,
          description: 'CDN & DDoS protection',
          kind: 'service',
          accent: '#f38020',
        },
      },
      {
        id: 'edge-node',
        type: 'service',
        position: { x: 200, y: 320 },
        data: {
          name: 'Edge Node',
          status: 'healthy',
          costPerHour: 0.03,
          metrics: { cpu: 0.02, memory: 0.04, disk: 10, region: 'us-east-2' },
          scale: 24,
          description: 'Edge computing',
          kind: 'service',
          accent: '#a855f7',
        },
      },
      {
        id: 'vercel',
        type: 'service',
        position: { x: 520, y: 320 },
        data: {
          name: 'Vercel',
          status: 'healthy',
          costPerHour: 0.02,
          metrics: { cpu: 0.01, memory: 0.03, disk: 8, region: 'global' },
          scale: 15,
          description: 'Frontend platform',
          kind: 'service',
          accent: '#000000',
        },
      },
      {
        id: 'workers',
        type: 'service',
        position: { x: 840, y: 320 },
        data: {
          name: 'Workers',
          status: 'degraded',
          costPerHour: 0.03,
          metrics: { cpu: 0.02, memory: 0.05, disk: 15, region: 'global' },
          scale: 30,
          description: 'Serverless compute',
          kind: 'service',
          accent: '#8b5cf6',
        },
      },
    ],
    edges: [
      { id: 'edge-cloudflare-edge', source: 'cloudflare', target: 'edge-node', type: 'smoothstep' },
      { id: 'edge-cloudflare-vercel', source: 'cloudflare', target: 'vercel', type: 'smoothstep' },
      { id: 'edge-cloudflare-workers', source: 'cloudflare', target: 'workers', type: 'smoothstep' },
    ],
  },
  'supertokens-java': {
    nodes: [
      {
        id: 'core-api',
        type: 'service',
        position: { x: 520, y: 160 },
        data: {
          name: 'Core API',
          status: 'healthy',
          costPerHour: 0.04,
          metrics: { cpu: 0.03, memory: 0.08, disk: 20, region: 'eu-west-1' },
          scale: 42,
          description: 'Handles auth and session lifecycle',
          kind: 'service',
          accent: '#7c3aed',
        },
      },
      {
        id: 'cache',
        type: 'service',
        position: { x: 360, y: 360 },
        data: {
          name: 'Cache',
          status: 'healthy',
          costPerHour: 0.02,
          metrics: { cpu: 0.01, memory: 0.04, disk: 5, region: 'eu-west-1' },
          scale: 28,
          description: 'Low-latency cache',
          kind: 'service',
          accent: '#22c55e',
        },
      },
      {
        id: 'analytics',
        type: 'service',
        position: { x: 700, y: 360 },
        data: {
          name: 'Analytics',
          status: 'degraded',
          costPerHour: 0.05,
          metrics: { cpu: 0.05, memory: 0.06, disk: 30, region: 'eu-west-1' },
          scale: 60,
          description: 'Events pipeline consumer',
          kind: 'service',
          accent: '#facc15',
        },
      },
    ],
    edges: [
      { id: 'edge-core-cache', source: 'core-api', target: 'cache', type: 'smoothstep' },
      { id: 'edge-core-analytics', source: 'core-api', target: 'analytics', type: 'smoothstep' },
    ],
  },
  'supertokens-python': {
    nodes: [
      {
        id: 'api',
        type: 'service',
        position: { x: 520, y: 140 },
        data: {
          name: 'API',
          status: 'healthy',
          costPerHour: 0.03,
          metrics: { cpu: 0.02, memory: 0.04, disk: 12, region: 'ap-south-1' },
          scale: 35,
          description: 'Python backend',
          kind: 'service',
          accent: '#60a5fa',
        },
      },
      {
        id: 'queue',
        type: 'service',
        position: { x: 360, y: 340 },
        data: {
          name: 'Queue',
          status: 'healthy',
          costPerHour: 0.02,
          metrics: { cpu: 0.01, memory: 0.03, disk: 6, region: 'ap-south-1' },
          scale: 25,
          description: 'Async worker queue',
          kind: 'service',
          accent: '#f97316',
        },
      },
      {
        id: 'storage',
        type: 'service',
        position: { x: 700, y: 340 },
        data: {
          name: 'Storage',
          status: 'healthy',
          costPerHour: 0.03,
          metrics: { cpu: 0.01, memory: 0.04, disk: 50, region: 'ap-south-1' },
          scale: 48,
          description: 'Object store',
          kind: 'database',
          accent: '#22c55e',
        },
      },
    ],
    edges: [
      { id: 'edge-api-queue', source: 'api', target: 'queue', type: 'smoothstep' },
      { id: 'edge-api-storage', source: 'api', target: 'storage', type: 'smoothstep' },
    ],
  },
  'supertokens-ruby': {
    nodes: [
      {
        id: 'frontend',
        type: 'service',
        position: { x: 520, y: 140 },
        data: {
          name: 'Frontend',
          status: 'healthy',
          costPerHour: 0.02,
          metrics: { cpu: 0.01, memory: 0.03, disk: 5, region: 'us-west-2' },
          scale: 15,
          description: 'Rails UI',
          kind: 'service',
          accent: '#ec4899',
        },
      },
      {
        id: 'jobs',
        type: 'service',
        position: { x: 360, y: 340 },
        data: {
          name: 'Jobs',
          status: 'degraded',
          costPerHour: 0.03,
          metrics: { cpu: 0.03, memory: 0.05, disk: 12, region: 'us-west-2' },
          scale: 32,
          description: 'Background workers',
          kind: 'service',
          accent: '#f59e0b',
        },
      },
      {
        id: 'sql',
        type: 'service',
        position: { x: 700, y: 340 },
        data: {
          name: 'Postgres',
          status: 'healthy',
          costPerHour: 0.04,
          metrics: { cpu: 0.02, memory: 0.06, disk: 25, region: 'us-west-2' },
          scale: 50,
          description: 'Primary DB',
          kind: 'database',
          accent: '#38bdf8',
        },
      },
    ],
    edges: [
      { id: 'edge-frontend-jobs', source: 'frontend', target: 'jobs', type: 'smoothstep' },
      { id: 'edge-frontend-sql', source: 'frontend', target: 'sql', type: 'smoothstep' },
    ],
  },
  'supertokens-go': {
    nodes: [
      {
        id: 'edge-node',
        type: 'service',
        position: { x: 520, y: 140 },
        data: {
          name: 'Edge Node',
          status: 'healthy',
          costPerHour: 0.03,
          metrics: { cpu: 0.02, memory: 0.05, disk: 10, region: 'us-east-2' },
          scale: 24,
          description: 'Edge routing layer',
          kind: 'service',
          accent: '#22c55e',
        },
      },
      {
        id: 'workers',
        type: 'service',
        position: { x: 360, y: 340 },
        data: {
          name: 'Workers',
          status: 'healthy',
          costPerHour: 0.025,
          metrics: { cpu: 0.02, memory: 0.05, disk: 15, region: 'us-east-2' },
          scale: 30,
          description: 'Go worker pool',
          kind: 'service',
          accent: '#c084fc',
        },
      },
      {
        id: 'storage-go',
        type: 'service',
        position: { x: 700, y: 340 },
        data: {
          name: 'Storage',
          status: 'degraded',
          costPerHour: 0.03,
          metrics: { cpu: 0.02, memory: 0.04, disk: 18, region: 'us-east-2' },
          scale: 44,
          description: 'Artifacts storage',
          kind: 'database',
          accent: '#38bdf8',
        },
      },
    ],
    edges: [
      { id: 'edge-edge-workers', source: 'edge-node', target: 'workers', type: 'smoothstep' },
      { id: 'edge-edge-storage', source: 'edge-node', target: 'storage-go', type: 'smoothstep' },
    ],
  },
}

const latency = () => 400 + Math.random() * 600

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const withLatency = async <T,>(value: T, shouldFail: boolean): Promise<T> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Mock API error — flip the toggle to recover.'))
        return
      }

      resolve(clone(value))
    }, latency())
  })

export const fetchApps = (shouldFail: boolean) => withLatency(apps, shouldFail)

export const fetchGraph = (appId: string, shouldFail: boolean) => {
  const graph = graphs[appId] ?? graphs['supertokens-golang']
  const arrangedGraph = {
    ...graph,
    nodes: autoArrangeNodes(graph.nodes)
  }
  return withLatency(arrangedGraph, shouldFail)
}

export const statusLabel: Record<ServiceStatus, string> = {
  healthy: 'Success',
  degraded: 'Warning',
  down: 'Error',
}
