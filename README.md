# ReactFlow Canvas

Small responsive “App Graph Builder” that mirrors the provided layout: left nav rail, dotted canvas with ReactFlow, and a right drawer for app selection + node inspector.

## Stack
- React + Vite + TypeScript (strict)
- ReactFlow (xyflow)
- shadcn/ui (Radix-based inputs, tabs, slider, badges, buttons)
- Zustand (UI + selection state)
- TanStack Query (mock API fetching with latency/error toggle)
- Tailwind CSS

## Running locally
```bash
npm install
npm run dev
```

## Available scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type build then Vite build
- `npm run preview` – preview production build
- `npm run lint` – ESLint (flat config + prettier compatibility)
- `npm run typecheck` – TypeScript type-only check

## Features
- Three-plus nodes & edges per app, draggable, zoom/pan, fit-to-view
- Select node → inspector shows status pill, tabs (Config/Runtime), synced slider + numeric input, editable name/description
- Delete selected node via Delete/Backspace
- Right panel becomes a mobile slide-over; opens from top bar or on node select
- Mock APIs (`/apps`, `/apps/:id/graph`) with latency and toggle-able failure; TanStack Query caching + loading/error states
- Zustand state: `selectedAppId`, `selectedNodeId`, `isMobilePanelOpen`, `activeInspectorTab`, `shouldFail`

## Notes
- Mock error toggle (lightning icon) forces the next fetch to fail so loading/error UI can be exercised.
- Fit View button in the top bar re-centers the canvas; initial load also auto-fits.
