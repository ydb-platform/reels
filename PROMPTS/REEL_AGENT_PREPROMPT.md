## YDB Reels — Agent Preprompt

### Purpose
- Build Motion Canvas reels that explain YDB internals. Each workspace is a reel; scenes are animated explanations.

### How this repo works
- Monorepo with npm workspaces. Workspaces: `3dc-data-recording`, `template`.
- Scene wiring lives in TypeScript: `src/project.ts` via `makeProject` with `scenes`.
- Visual settings (canvas size, fps, exporter) live in `src/project.meta` only.
- Dev/build (from repo root): install `npm install`; start `npm run start -w <workspace>`; build `npm run build -w <workspace>`.


### Creating a new reel
- Copy `template` to a new folder at the repo root (e.g., `joins-explained`).
- Add the new folder to the root `package.json` `workspaces` array.
- In `YOUR_REEL/src/project.ts`, import your first scene with `?scene` and list it in `scenes`.
- Set canvas size/fps in `YOUR_REEL/src/project.meta` (e.g., 1080×1920 vertical via `shared.size`).

### Creating a new scene
- Create `YOUR_REEL/src/scenes/MyScene.tsx` exporting a 2D scene.
- In `YOUR_REEL/src/project.ts`, import `./scenes/MyScene?scene` and add it to the `scenes` array (order = playback).

### Icon library (components + metadata)
- Location: `template/src/assets/icons/`
- Metadata type: `IconMeta` (fields: `id`, `name`, `description`, optional `tags`, `recommended` with `scale`, `x`, `y`, `colorNotes`).
- Usage pattern: import the icon component from its file and place it in your scene; animate via standard Node props/signals (`x`, `y`, `scale`, `opacity`, etc.). Keep brand colors unless the storyboard requires overrides.

### Available icons
- YdbIcon
  - id: `ydb-icon`
  - name: YDB Logo
  - description: Official YDB logo as vector Paths for Motion Canvas; use for branding/intros in YDB-related scenes; supports standard Node props and animations.
  - tags: logo, ydb, brand, database
  - recommended: `scale: 5`, `x: -195`, `y: -165`, `colorNotes: primary #2399FF; white inner paths`
  - File: `template/src/assets/icons/YdbIcon.tsx`
  - Notes: Keep proportions when scaling; sub-paths are animatable if needed.
 - DiskIcon
  - id: `disk-icon`
  - name: Disk
  - description: Stylized disk glyph for racks/storage visuals; animatable as a Node; use DISK_COLOR for default, SUCCESS_DISK_COLOR for highlight, ERROR_COLOR for failures.
  - tags: disk, storage, rack, ydb
  - recommended: `scale: 2`, `x: -105`, `y: 0`, `colorNotes: default via DISK_COLOR; animate fill for transitions`
  - File: `template/src/assets/icons/DiskIcon.tsx`
 - ClusterIcon
  - id: `cluster-icon`
  - name: Cluster
  - description: Cluster/datacenter topology icon for YDB infrastructure visuals. Use for cluster overviews, datacenter representations, or infrastructure diagrams.
  - tags: cluster, datacenter, infrastructure, topology, ydb
  - recommended: `scale: 0.5`, `x: 0`, `y: 0`, `colorNotes: uses currentColor fill; set fill prop to override`
  - File: `template/src/assets/icons/ClusterIcon.tsx`
 - DatabasesIcon
  - id: `databases-icon`
  - name: Databases
  - description: Database/storage icon for YDB database representations. Use for database listings, storage visualizations, or data management scenes.
  - tags: databases, storage, data, management, ydb
  - recommended: `scale: 3`, `x: 0`, `y: 0`, `colorNotes: uses currentColor fill; set fill prop to override`
  - File: `template/src/assets/icons/DatabasesIcon.tsx`
 - MonitoringIcon
  - id: `monitoring-icon`
  - name: Monitoring
  - description: Chart/monitoring icon for YDB metrics and monitoring visuals. Use for monitoring dashboards, metrics charts, or performance visualization scenes.
  - tags: monitoring, charts, metrics, performance, ydb
  - recommended: `scale: 4`, `x: 0`, `y: 0`, `colorNotes: uses currentColor fill; set fill prop to override`
  - File: `template/src/assets/icons/MonitoringIcon.tsx`

### Color palette

- Global/brand
  - YDB_BLUE: #2399FF

- Template (default reel palette)
  - TEXT_COLOR: #2399FF
  - SUCCESS_COLOR: #00fa92ff
  - ERROR_COLOR: #ff1100ff
  - PRIMARY_COLOR: #0317f4ff
  - BORDER_COLOR: #1a52f9ff

- 3dc-data-recording (workspace-specific palette)
  - DC_COLOR: #a8b2ffff
  - DISK_COLOR: #1185f8ff
  - DISK_ACTIVE_COLOR: #9BB5D1
  - SUCCESS_DISK_COLOR: #00ff6aff
  - TEXT_COLOR: #0053f9ff
  - SUCCESS_COLOR: #00fa92ff
  - ERROR_COLOR: #ff1100ff
  - PRIMARY_COLOR: #0317f4ff
  - FAILURE_DC_COLOR: #ff000080
  - BORDER_COLOR: #1a52f9ff

Usage
- Import colors from `YOUR_REEL/src/assets/colors.ts` instead of hardcoded hex values.
- Example: `import {TEXT_COLOR, PRIMARY_COLOR} from '../assets/colors';`

### Authoring tips
- Keep scene files focused; extract reusable visuals (like icons) under `src/assets/`.
- Order `scenes` in `src/project.ts` by playback sequence.
- Use `project.meta` to tweak fps/export; do not hardcode visual settings in TypeScript.
- Prefer diagrams and schemas for explanations; make them dynamic and representative (animate flows, states, and interactions rather than static slides).

### Verification
- Build the affected workspace after nontrivial edits.
- If you change any API or shared asset, search usages and update callers.


