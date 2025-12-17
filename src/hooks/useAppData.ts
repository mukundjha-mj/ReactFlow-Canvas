import { useQuery } from '@tanstack/react-query'
import { fetchApps, fetchGraph } from '../lib/mockApi'
import type { AppInfo, GraphResponse } from '../types'

export const useAppsQuery = (shouldFail: boolean) =>
  useQuery<AppInfo[]>({
    queryKey: ['apps', shouldFail],
    queryFn: () => fetchApps(shouldFail),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

export const useGraphQuery = (appId: string | null, shouldFail: boolean) =>
  useQuery<GraphResponse>({
    queryKey: ['graph', appId, shouldFail],
    queryFn: () => fetchGraph(appId ?? 'supertokens-golang', shouldFail),
    enabled: Boolean(appId),
    staleTime: 5 * 60 * 1000,
    retry: false,
    placeholderData: (previous) => previous,
  })
