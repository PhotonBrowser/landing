# Repository Guidelines

## Project Structure

This is a Vite app built with React 19 and TypeScript. Application code is in `src/`: page composition lives in `App.tsx`, reusable components in `components/`, shared UI primitives in `components/ui/`, and configuration, constants, hooks, utilities, and motion presets in their correspondingly named folders. Global styles are in `src/index.css`. Static images and the Photon brand kit live in `public/`. No test directory or test runner is currently configured.

## Development and Build Commands

Use Bun for package management and scripts:

- `bun run dev` starts the local Vite development server.
- `bun run build` runs TypeScript project checks and creates the production build.
- `bun run preview` serves the built app locally for review.
- `bun run lint` runs Biome checks, including formatting and import organization.
- `bun run lint:oxlint` runs Oxlint and the configured shadcn design-system rules.
- `bun run format` formats files with Biome.

## Coding Style

Follow the repository’s Biome settings: two-space indentation and single quotes. Use PascalCase for React component files and exports (for example, `HeroPanel.tsx`), and descriptive camelCase for utilities, hooks, and local variables. Keep components, hooks, and motion presets in their matching `src/` directories. Run both lint commands after code changes and resolve reported issues before submitting.

## Testing

There is no automated test script or test framework configured yet. For changes, run `bun run build` and both lint commands. For UI work, also review the page with `bun run dev` at desktop and mobile widths; check relevant waitlist states when changing its flow.

## Commits and Pull Requests

Recent history mixes conventional prefixes such as `feat:` and `chore:` with concise imperative summaries. Prefer a short, imperative subject with a conventional type where appropriate (for example, `fix: improve waitlist feedback`). PRs should describe the user-visible change, note relevant validation, link related issues, and include screenshots for visual changes.

## Configuration and Secrets

The waitlist integration reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the environment. Configure them locally without committing `.env` values or other credentials; never place secret service-role keys in client-side variables.
