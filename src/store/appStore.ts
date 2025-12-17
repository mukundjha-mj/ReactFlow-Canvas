import { create } from 'zustand'

interface UIState {
  selectedAppId: string | null
  selectedNodeId: string | null
  isMobilePanelOpen: boolean
  activeInspectorTab: 'config' | 'runtime'
  shouldFail: boolean
  setSelectedAppId: (id: string | null) => void
  setSelectedNodeId: (id: string | null) => void
  toggleMobilePanel: (value?: boolean) => void
  setActiveInspectorTab: (tab: 'config' | 'runtime') => void
  setShouldFail: (value: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  shouldFail: false,
  setSelectedAppId: (id) => set({ selectedAppId: id }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  toggleMobilePanel: (value) =>
    set((state) => ({ isMobilePanelOpen: value ?? !state.isMobilePanelOpen })),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  setShouldFail: (value) => set({ shouldFail: value }),
}))
