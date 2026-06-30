---
title: "Technical Implementer Inventory"
type: "loki-init-agent-inventory"
agent: "technical-implementer"
status: "static-inventory"
tags:
  - loki-init
  - technical-implementer
  - game-dev
  - rpg-maker-mz
---

# Technical Implementer Inventory

Date: 2026-06-30
Consumer root: `/Users/edney/projects/coreto/summer26`
Target runtime inspected: `Jhonny/`
Mode: static implementation inventory, no runtime edits and no Playtest.

## Scope Inventoried

This inventory covers current technical implementation surfaces relevant to a
future implementer: architecture, entry points, modules, scripts,
configuration, dependencies, build and test surfaces, technical constraints,
and future validators.

This inventory does not implement changes. It does not validate gameplay,
input, audio, pictures, Common Event execution, plugin behavior, save/load, or
deployment.

## Sources Read

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`
- `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`
- `Jhonny/CLAUDE.md`
- `Jhonny/package.json`
- `Jhonny/index.html`
- `Jhonny/js/main.js`
- `Jhonny/data/System.json`
- `Jhonny/data/CommonEvents.json`
- `Jhonny/data/MapInfos.json`
- `Jhonny/js/plugins.js`
- `Jhonny/js/plugins/Jhonny_RaceHelper.js`
- `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`

Structured inspection commands used read-only:

- `jq` over `Jhonny/package.json`, `Jhonny/data/System.json`,
  `Jhonny/data/CommonEvents.json`, and `Jhonny/data/MapInfos.json`.
- Node `vm` parsing of `Jhonny/js/plugins.js` to extract `$plugins` without
  editing the generated file.
- `find`, `grep`, and `sed` for local source discovery and excerpts.

## Current Architecture Facts

The consumer root is an AI-agent workspace and Obsidian vault, but the actual
game runtime identified for implementation work is `Jhonny/`.

`Jhonny/` is an RPG Maker MZ project. The static project signature includes:

- `Jhonny/game.rmmzproject`
- `Jhonny/index.html`
- `Jhonny/js/main.js`
- `Jhonny/js/rmmz_core.js`
- `Jhonny/js/rmmz_managers.js`
- `Jhonny/js/rmmz_objects.js`
- `Jhonny/js/rmmz_scenes.js`
- `Jhonny/js/rmmz_sprites.js`
- `Jhonny/js/rmmz_windows.js`
- `Jhonny/data/*.json`
- `Jhonny/js/plugins.js`
- `Jhonny/js/plugins/**`
- asset roots under `Jhonny/audio/`, `Jhonny/img/`, `Jhonny/fonts/`,
  `Jhonny/effects/`, and `Jhonny/movies/`.

The runtime bootstrap path is:

1. `Jhonny/index.html` loads `js/main.js`.
2. `js/main.js` loads library scripts: `pixi.js`, `pako.min.js`,
   `localforage.min.js`, `effekseer.min.js`, and `vorbisdecoder.js`.
3. `js/main.js` loads RPG Maker MZ core files:
   `rmmz_core.js`, `rmmz_managers.js`, `rmmz_objects.js`,
   `rmmz_scenes.js`, `rmmz_sprites.js`, and `rmmz_windows.js`.
4. `js/main.js` loads `js/plugins.js`.
5. When all scripts load, `PluginManager.setup($plugins)` runs.
6. After the Effekseer runtime initializes, `SceneManager.run(Scene_Boot)`
   starts the game.

`Jhonny/package.json` has no `scripts`, `dependencies`, or
`devDependencies` fields. It defines `main: "index.html"` and an NW.js style
window titled `Bye Bye Jhonny` with size `1280x720`.

## Fact And Inference Boundary

Facts in this inventory come from local files and structured parsing listed in
`Sources Read`.

Inferences are limited to implementation routing:

- Because `Jhonny/` contains RPG Maker MZ signature files, future runtime work
  should treat `Jhonny/` as the project root.
- Because race behavior crosses `CommonEvents.json`, `plugins.js`, and
  `Jhonny_RaceHelper.js`, future race implementation work should route through
  both data JSON and plugin workflow checks when those surfaces are touched.
- Because `Jhonny/package.json` has no scripts or dependency declarations,
  there is no npm-based build/test surface evidenced by that file.

These inferences do not validate runtime behavior.

## Entry Points

Implementation entry points currently visible:

- App shell: `Jhonny/index.html`.
- Main runtime loader: `Jhonny/js/main.js`.
- Engine modules: `Jhonny/js/rmmz_*.js`.
- RPG Maker data: `Jhonny/data/*.json`.
- Plugin activation list: `Jhonny/js/plugins.js`.
- Project helper plugin: `Jhonny/js/plugins/Jhonny_RaceHelper.js`.
- Race Common Events: `Jhonny/data/CommonEvents.json`, especially CEs 3,
  5-7, 10-13, 16, 18, and 19.
- Start position from `System.json`: map 11 at `(13, 6)`.
- Map inventory from `MapInfos.json`: 16 named maps, including `Prologo`,
  `Estrada_VN1`, `Estrada_VN3`, ending maps, and `Batida`.

## Modules And Runtime Surfaces

### Engine Modules

`Jhonny/CLAUDE.md` identifies the RPG Maker MZ core split:

- `rmmz_core.js`: base utilities and managers such as `Utils`,
  `AudioManager`, `ImageManager`, `SceneManager`, and `StorageManager`.
- `rmmz_managers.js`: managers such as `DataManager`, `BattleManager`, and
  `PluginManager`.
- `rmmz_objects.js`: game objects and interpreter behavior.
- `rmmz_scenes.js`: scene controllers.
- `rmmz_sprites.js`: sprite presentation.
- `rmmz_windows.js`: UI window components.

For future command semantics, the runtime doc says to confirm command codes in
`js/rmmz_objects.js`, especially `Game_Interpreter.prototype.commandNNN`.

### Data JSON

`System.json` facts extracted statically:

- `gameTitle`: `Bye Bye Jhonny`
- `locale`: `pt_BR`
- `advanced.screenWidth`: `1280`
- `advanced.screenHeight`: `720`
- `advanced.uiAreaWidth`: `1280`
- `advanced.uiAreaHeight`: `720`
- `advanced.picturesUpperLimit`: `100`
- `startMapId`: `11`
- `startX`: `13`
- `startY`: `6`

Race-related names in the 101+ ID range were observed in `System.json`:

- Switches 101-106: `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`,
  `SW_CRASH_FLAG`, `SW_LAST_ACTION_SAFE`, `SW_PAUSED`,
  `SW_IS_CURVA_DIABO`.
- Variables 101-122 include `VAR_RACE_ID`, `VAR_SCENE_INDEX`,
  `VAR_SCENE_TYPE`, `VAR_P_CENA`, `VAR_CONSCIENCIA`,
  `VAR_PONTOS_GLORIA`, `VAR_TAXA_SUCESSO`, `VAR_ROLL_RESULT`,
  `VAR_TIMER_FRAMES`, `VAR_SCENE_START`, `VAR_SEED`,
  `VAR_RACE_N_CENAS`, `VAR_ATTEMPT_N`, `VAR_LAST_RENDERED_INDEX`,
  `VAR_HOVER_LEVEL`, `VAR_TIMER_TIMEOUT_FLAG`, `VAR_VITORIA_PASSOU`,
  `VAR_GLORIA_META`, `VAR_TIMER_SECONDS`, and `VAR_SCENE_DISPLAY`.

### Common Events

Static Common Event map for the race implementation:

| CE | Name | Trigger | Switch | Static role evidence |
| --- | --- | --- | --- | --- |
| 3 | `EV_Preload` | 0 | 1 | Picture preload pattern with show/wait/erase commands. |
| 5 | `EV_RaceOrchestrator` | 0 | 1 | Initializes race flow, calls CE3, uses plugin commands. |
| 6 | `EV_UpdateHud` | 2 | 100 | Parallel HUD updater using TextPicture commands. |
| 7 | `EV_RaceRenderer` | 2 | 100 | Parallel renderer, calls result/render CEs. |
| 8 | `EV_RenderSinal` | 0 | 1 | Called by CE7. |
| 9 | `EV_RenderCurva` | 0 | 1 | Called by CE7. |
| 10 | `EV_RaceTimer` | 2 | 100 | Parallel timer, can call CE11. |
| 11 | `EV_OnSafe` | 0 | 1 | Safe action handler, calls CE14 and logs `SAFE_CLICK`. |
| 12 | `EV_OnRisk` | 0 | 1 | Risk action handler, calls CE15 and CE18, logs risk events. |
| 13 | `EV_KeyInput` | 2 | 100 | Parallel keyboard input surface. |
| 14 | `EV_ResolucaoSafe` | 0 | 1 | Called by CE11. |
| 15 | `EV_ResolucaoRiskOK` | 0 | 1 | Called by CE12. |
| 16 | `EV_HoverRiskButton` | 2 | 100 | Parallel hover/cost feedback surface. |
| 18 | `EV_Crash` | 0 | 1 | Crash cleanup/restart path, calls CE19. |
| 19 | `EV_VitoriaCorrida` | 0 | 1 | Result screen path, calls CE5 on retry branch. |

Static callers found through command code `117`:

- CE5 calls CE3.
- CE7 calls CE19, CE8, and CE9.
- CE10 calls CE11.
- CE11 calls CE14.
- CE12 calls CE15 and CE18.
- CE18 calls CE19.
- CE19 calls CE5.

Plugin command code `357` references include:

- `Jhonny_RaceHelper.logRaceEvent` with event types `RACE_INIT`,
  `SAFE_CLICK`, `RISK_SUCCESS`, `RISK_FAIL`, `CRASH`, and `VICTORY`.
- `TextPicture.set` for HUD and result text.

### Plugins

Active plugins from `plugins.js`:

- `TextPicture`
- `ButtonPicture`
- `Jhonny_RaceHelper`
- `VisuMZ_0_CoreEngine`
- `VisuMZ_2_VNPictureBusts`

`Jhonny_RaceHelper.js` facts:

- Declares `@target MZ`.
- Parameter: `EnableDebugLogs`, currently `true` in `plugins.js`.
- Extends `Input.keyMapper` for W/S/A/D.
- Exposes `window.JhonnyRace`.
- Exposes helpers for random scene type, random scene percentage, d100,
  clamp, PRNG, race start effect, logging, race state capture, threshold
  lookup, and victory check.
- Registers plugin command `logRaceEvent`.
- Patches `Scene_Map.prototype.update` to update a race start effect.
- Defines threshold config `{1: 200, 2: 400, 3: 600}` and default threshold
  `60`.

The helper plugin uses `console.log`, `console.warn`, and `console[level]`.
That is an existing runtime fact, not a recommendation. Any future coding work
must account for the repository-level logging rule separately from existing
RPG Maker plugin practice.

## Scripts, Configs, And Dependencies

Configuration surfaces:

- `Jhonny/package.json`: app shell metadata only; no package scripts or npm
  dependency declarations.
- `Jhonny/js/plugins.js`: generated RPG Maker plugin activation list. The file
  itself states it should not be edited directly.
- `Jhonny/data/System.json`: engine, locale, UI, variables, switches, and start
  position configuration.
- `Jhonny/data/CommonEvents.json`: event-command runtime behavior.

Historical scripts found under `Jhonny/planos/**` include Python builders and
mutators such as:

- `build_phase3_ces.py`
- `build_phase4_ces.py`
- `setup_phase4_system.py`
- `apply_task_5_6.py`
- `build_phase5_ces.py`
- `inject_debug_logs.py`
- `inject_debug_logs_v2.py`
- `remove_debug_logs.py`
- `setup_phase5_system.py`
- `build_phase6_ces.py`
- `setup_phase6_system.py`
- `build_phase7_ces.py`
- `build_phase1_ces.py`
- `build_phase2_ces.py`
- `apply_joices_phase1.py`
- `01_find_player_name_refs.py`
- `02_standardize_player_speaker_to_chance.py`

Per `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`, these scripts are
historical evidence by default. They must not be treated as current
re-runnable tools without preflight, structured comparison against current
state, and explicit approval.

## Build And Test Surfaces

Current local build/test surfaces identified:

- Open `Jhonny/index.html` in a browser for basic game launch.
- For full playtesting with save/load, run a local server from `Jhonny/`, for
  example `python3 -m http.server 8000` or `npx serve .`.
- For plugin syntax after future plugin edits, `node -c` is an appropriate
  JavaScript syntax check.
- For data JSON after future JSON edits, parse with `jq` or another JSON
  parser and review a restricted diff.
- For RPG Maker runtime behavior, Playtest and human validation remain the
  final gate.

No build, lint, unit test, or npm script surface is declared in
`Jhonny/package.json`.

## Technical Constraints

- Do not treat the consumer root as the game runtime root. The runtime root is
  `Jhonny/`.
- Do not edit `Jhonny/data/*.json` without the RPG Maker MZ data JSON workflow
  and structured parsing.
- Do not edit `Jhonny/js/plugins/**` or `Jhonny/js/plugins.js` without the RPG
  Maker MZ plugin workflow.
- Do not directly modify `rmmz_*.js`; project guidance says to use plugins for
  extension.
- `js/plugins.js` is generated by RPG Maker and says not to edit it directly.
- `CommonEvents.json` JSON validity does not prove the RPG Maker editor or the
  runtime will accept behavior changes.
- Static inspection does not validate player-visible behavior.
- Playtest is required before claiming validation for engine, visuals, input,
  picture loading, audio playback, Common Events, save/load, retry, result
  screen, or deployment.
- Historical scripts in `Jhonny/planos/**` require classification before any
  execution. Mutators require explicit preflight and approval.
- The root workspace instructions said this repository is not a Git repo, but
  the init inventory reports a valid Git worktree. Future agents should check
  current Git state directly before relying on either statement.

## Future Validators

Use the smallest validator set matching the future change:

- Documentation-only change:
  - Confirm writes are inside approved docs or plan paths.
  - Review rendered Markdown/frontmatter if the note is user-facing in
    Obsidian.
- `data/*.json` change:
  - Load `loki-rpg-maker-mz-data-json`.
  - Parse target JSON before and after.
  - Confirm IDs and names in `System.json`.
  - Confirm event command semantics in local `rmmz_objects.js`.
  - Review a restricted diff for only approved IDs/commands.
  - Require Playtest for behavior.
- Plugin change:
  - Load `loki-rpg-maker-mz-plugin-workflow`.
  - Validate metadata, plugin command registration, and activation surface.
  - Run `node -c` on edited plugin files.
  - Review `plugins.js` activation if affected.
  - Require Playtest for behavior.
- Historical script reuse:
  - Classify script as read-only audit, validator, mutator, generator, or
    cleanup/debug.
  - Reconstruct historical intent with Git and same-phase task/retro docs.
  - Compare intended changes to current state using structured parsing.
  - Do not run mutators without approval.
- Runtime defect or perceptible behavior:
  - Use `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`.
  - Collect minimum Playtest snapshot before editing.
  - Require human validation.

## Location Map

| Need | Primary location |
| --- | --- |
| Durable documentation routing | `docs/index.xml` |
| Current init context | `docs/loki-init/project-inventory.md`, `docs/loki-init/technology-context.md` |
| Race runtime contract | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` |
| Historical script procedure | `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md` |
| Game project guidance | `Jhonny/CLAUDE.md` |
| App bootstrap | `Jhonny/index.html`, `Jhonny/js/main.js` |
| Engine source | `Jhonny/js/rmmz_*.js` |
| Global engine config | `Jhonny/data/System.json` |
| Event runtime behavior | `Jhonny/data/CommonEvents.json`, `Jhonny/data/Map*.json` |
| Plugin activation | `Jhonny/js/plugins.js` |
| Helper plugin | `Jhonny/js/plugins/Jhonny_RaceHelper.js` |
| Historical plans/scripts | `Jhonny/planos/**` |
| Assets | `Jhonny/audio/**`, `Jhonny/img/**`, `Jhonny/fonts/**`, `Jhonny/effects/**`, `Jhonny/movies/**` |
| Save/local state | `Jhonny/save/**`, browser/localforage runtime state |

## Coverage

Inspected in detail:

- Init contracts and technical implementer specialty contract.
- Common inventory and technology context.
- Documentation catalog and selected runtime/script docs.
- `Jhonny/CLAUDE.md`.
- `package.json`, `index.html`, `main.js`.
- Structured slices of `System.json`, `CommonEvents.json`, and
  `MapInfos.json`.
- `plugins.js` plugin list and selected key plugin parameters.
- Full `Jhonny_RaceHelper.js`.

Mapped but not deeply inspected:

- Full RPG Maker engine implementation in `rmmz_*.js`.
- Full `data/*.json` database.
- Full `Map*.json` event commands.
- Full plugin parameter payloads for VisuMZ plugins.
- Asset file contents and dimensions.
- Historical plan scripts and all plan docs.

Not found or not available in inspected surfaces:

- npm build, lint, or test scripts.
- Declared package dependencies in `Jhonny/package.json`.
- Evidence of automated tests as a first-class project surface.

Not validated:

- Playtest.
- Runtime Common Event execution.
- Visual presentation, audio, input, save/load, deploy, performance, or
  compatibility with existing saves.
