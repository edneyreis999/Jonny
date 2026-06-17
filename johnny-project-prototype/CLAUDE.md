# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A PixiJS **v8** rendering prototype. Vite 6 + TypeScript 5.7, strict mode. No framework, no tests, no backend — a single-entry canvas app for experimenting with PixiJS v8 APIs.

## Commands

```bash
npm run dev      # Vite dev server on http://localhost:8080 (auto-opens browser)
npm start        # alias for dev
npm run lint     # ESLint (flat config, eslint.config.mjs)
npm run build    # lint → tsc (type-check, no emit) → vite build → dist/
```

There is **no test runner** configured and no `tsc --watch` script. For type-checking during development, run `npx tsc --noEmit`.

## Architecture

Single-file entry: `src/main.ts` is an async IIFE that:
1. Constructs `new Application()` and awaits `app.init({ background, resizeTo: window })` — the v8 async init pattern (v7 was synchronous).
2. Appends `app.canvas` (not `app.view`, which is removed in v8) to `#pixi-container`.
3. Loads `/assets/bunny.png` via `Assets.load()` and builds a `Sprite`.
4. Registers a ticker callback that mutates `bunny.rotation` scaled by `time.deltaTime` (frame-independent).

`index.html` mounts the script as a native ESM module — Vite handles the dev/bundle split. Static assets live in `public/` and are served at root (`/assets/bunny.png`, `/style.css`, `/favicon.png`).

## PixiJS v8 specifics (load-bearing)

This project targets **PixiJS v8.8.x**, which has breaking changes from v7. When extending code:

- **Always use the async init pattern**: `const app = new Application(); await app.init({...})`. The v7 `new Application({ ... })` constructor-options form is gone.
- Use `app.canvas`, not `app.view`.
- Import everything from the root `"pixi.js"` package — the `@pixi/*` sub-packages are deprecated.
- `Graphics` is shape-then-fill: `g.rect(x,y,w,h).fill(color)` — not `beginFill()/endFill()`.
- `BaseTexture` is replaced by `TextureSource`; prefer `Assets.load()` for textures.
- Constructor options objects (`ContainerOptions`, `SpriteOptions`, etc.) replace chained setters where possible.
- For any non-trivial PixiJS work, invoke the `pixijs-*` skills (`pixijs-application`, `pixijs-scene-*`, `pixijs-assets`, `pixijs-ticker`, etc.) instead of writing from memory — v8 APIs diverge meaningfully from v7/training data.

## Skills-first workflow (load-bearing)

Whenever touching PixiJS code in this repo — writing new scene-graph code, filters, assets, events, math, ticker, performance, environments, or debugging v7→v8 issues — Claude MUST:

1. **Invoke the relevant `pixijs-*` skill via the `Skill` tool BEFORE writing code.** The skills are the source of truth for v8 idioms (constructor options objects, async `app.init`, `app.canvas`, `Graphics` shape-then-fill, `Assets` pipeline, `Filter.from` with GLSL/WGSL, `ParticleContainer+Particle`, `DOMContainer`, event modes, etc.). Do not re-derive this knowledge from memory — training data is stale and frequently confuses v7 and v8.
   - Use `pixijs` (the router skill) first when unsure which specialized skill applies.
   - Use `pixijs-migration-v8` whenever diagnosing broken code that may have been written against v7 patterns.
2. **Consult the `context7` MCP server for current documentation.** Resolve `pixijs` (or `/pixijs/pixijs`) first, then `query-docs` with the specific question. Use this even for APIs you think you know — the v8 docs change between minor releases (`8.4`, `8.5`, `8.6`, `8.8` all shipped meaningful shifts). Fetch fresh rather than relying on cached knowledge.
3. **Cross-check both.** Skills encode curated best-practice guidance; context7 encodes the live upstream docs. When they disagree, prefer the live docs and flag the discrepancy.

This mirrors the parent repo's Skills-First pattern (`.claude/` config root) — agents invoke skills rather than duplicating domain knowledge inline.

## TypeScript posture

`tsconfig.json` is strict and additionally enables `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`. The build runs `tsc` before `vite build`, so type errors fail CI locally. `any` and non-null assertions should be avoided per the parent repo's coding rules.

## Where to put new code

There is no folder convention yet (no `src/scenes/`, `src/entities/`). When the prototype grows, establish a feature/layout split before adding a second file — don't leave a growing `main.ts`.
