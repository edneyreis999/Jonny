# Technical Implementer Inventory - Modules And Runtime Surfaces

Source index: [inventory.md](inventory.md)

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
