## Purpose

Guidance for AI coding assistants working in this repository. Keep changes minimal, correct, and verified. Propose before you edit, and operate file-by-file.

## Repository layout

- Root is an npm workspaces monorepo (npm v7+ required)
- Workspaces:
  - 3dc-data-recording — Motion Canvas project
  - template — Motion Canvas starter

## Setup and common workspace commands

- Install dependencies at the root (generates a single lockfile for all workspaces): run npm install at the repository root.
- Start dev server for a workspace: run npm run start -w 3dc-data-recording (or -w template).
- Build a workspace: run npm run build -w 3dc-data-recording (or -w template).
- Prefer workspace-scoped commands over per-folder installs; do not create node_modules inside workspaces manually.

Notes on Motion Canvas configuration
- Scene wiring belongs in TypeScript (makeProject with scenes).
- Visual settings like canvas size and fps live in project.meta (not in TypeScript). Do not add a size property to ProjectSettings; adjust size in project.meta or via the editor UI.

## Safety and permissions

- Propose then wait for approval before any code or config change.
- Make edits one file at a time to minimize blast radius.
- Ask before:
  - Adding or removing dependencies (always use the package manager; never hand-edit package.json)
  - Running long builds or E2E suites
  - Deleting files or changing permissions
  - Changing CI or release configuration
- Allowed without prompt: read/list files, local type checks, formatting, linting of a single file, small refactors within an already-approved file.

## Coding and project standards

- Monorepo/workspaces
  - Use npm workspaces from the root; target a workspace with -w <name>.
  - Keep each workspace name unique and aligned with its folder name.
- Code quality
  - Use explicit, descriptive names; avoid magic numbers (extract constants).
  - Prefer guard clauses and clear control flow; avoid deep nesting and nested ternaries.
  - TypeScript: avoid any; prefer narrow types, discriminated unions, and type guards.
  - Comments only when non-obvious (business rules, invariants, caveats). Remove redundant comments.
  - Robust error handling and security-minded changes; consider performance.
- Imports & structure
  - Import components directly from their implementation files; do not add index.ts re-exports.
- React/UI conventions (if applicable in UI workspaces)
  - Avoid useEffect unless strictly necessary for real side effects; prefer direct state or derived data.
  - Prefer extracting large render logic into named components in the same folder.
  - Use Gravity UI components where available; prefer Flex from @gravity-ui/uikit over ad-hoc flex CSS.
  - Use design tokens (e.g., spacing and color tokens); avoid hardcoded values. Check GRAVITY_UI_VARIABLES.md if present.
  - BEM class naming with a b() helper if present in the codebase; keep class names aligned with component names.
- Validation & i18n (when applicable)
  - Use Zod schemas next to types for validation; for enums use z.nativeEnum(...).catch(defaultValue).
  - Move user-facing strings into the i18n system; avoid literals in UI.
- Testing
  - Add or update unit tests for changed logic where applicable.
  - E2E tests: use classes and class methods for element locators.

## Verification checklist before declaring work complete

- Presented a plan and received approval.
- Scoped the change to a single file and preserved existing behavior.
- Searched for all usages of modified APIs and updated callers as needed.
- Built the affected workspace to catch type and build errors.
- Ran the local workspace dev server for smoke testing when UI-affecting.
- Considered security, performance, and edge cases.
- Avoided introducing new dependencies unless justified and approved.
- Followed commit/PR conventions (below).

## Git and PR conventions

- Conventional Commits for messages (e.g., feat:, fix:, docs:, chore:). Keep messages concise and scoped.
- Increment versions per Semantic Versioning if/when releases are introduced.
- Small, reviewable PRs. Link issues when relevant. Ensure all checks pass.

## References

- npm workspaces — Using workspaces (official docs)
  - https://docs.npmjs.com/cli/v10/using-npm/workspaces
- Conventional Commits specification
  - https://www.conventionalcommits.org/en/v1.0.0/
- Semantic Versioning 2.0.0
  - https://semver.org
- GitHub PR reviews and collaboration
  - https://docs.github.com/en/pull-requests
- GitHub Actions security hardening (if CI is added)
  - https://docs.github.com/actions/security-guides/security-hardening-for-github-actions
- Motion Canvas docs (project settings, media, editor)
  - https://motioncanvas.io/docs


