# YDB Reels

Motion canvas animations about YDB internals.

## Overview

This repository contains animated explanations of YDB internals created with Motion Canvas. These animations help visualize complex database concepts and internal processes. While it currently contains a single example reel, the project is designed to host multiple reels covering various aspects of YDB.

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 7+ (required for npm workspaces)

## Available Scenes (Workspaces)

Currently available workspaces:
- `3dc-data-recording` — Demonstrates 3D data recording concepts in YDB
- `template` — Motion Canvas starter for creating a new reel

*More scenes will be added over time, covering various aspects of YDB internals.*

### Installation and run (npm workspaces)

Install dependencies at the repo root (single lockfile for all workspaces):
```bash
npm install
```

Start a workspace dev server:
```bash
npm run start -w 3dc-data-recording
# or
npm run start -w template
```

Build a workspace:
```bash
npm run build -w 3dc-data-recording
# or
npm run build -w template
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Add a new reel as a new folder in the repo root using the `template` workspace as a starter
4. Add the new folder name to the root `package.json` `workspaces` array
5. Commit your changes (`feat(reel): add <new-reel-name>`) following Conventional Commits
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a pull request

## AI-assisted reel creation

To create a reel with an AI agent:

1. Open `PROMPTS/REEL_AGENT_PREPROMPT.md` and copy its contents as the preprompt.
2. Ask the AI agent to create a new reel using this preprompt, following the docs-driven workflow and brand intro/outro rules.
3. Use the `template` workspace as the base and follow the preprompt’s instructions for imports, icons, diagrams, and verification.

## Acknowledgments

- [Motion Canvas](https://motion-canvas.github.io/) - Animation framework used for creating the visualizations
- [YDB](https://ydb.tech/) - Yandex Database documentation and resources
