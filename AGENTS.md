# AGENTS.md

Vite + React 19 + TypeScript project. Package manager is `bun`.

## Commands

- `bun run dev` — start dev server
- `bun run build` — typecheck (`tsc -b`) + production build
- `bun run preview` — preview production build

## Lint

After making changes, run both linters and fix all errors:

- `bun run lint` — Biome (format, lint, organize imports)
- `bun run lint:oxlint` — Oxlint, hosts `@shadcn/lint` design-system rules

Formatting (2-space, single quotes) is enforced by Biome with format-on-save
in `.zed/settings.json`.
