---
title: "Loki Init - Runtime QA Inventory"
type: "runtime-qa-inventory"
status: "partial-runtime-pending"
agent: "runtime-qa"
project_type: "game-dev"
tags:
  - loki-init
  - runtime-qa
  - rpg-maker-mz
  - game-dev
---

# Runtime QA Inventory

Data: 2026-06-30
Consumer root: `/Users/edney/projects/coreto/summer26`
Runtime project root: `/Users/edney/projects/coreto/summer26/Jhonny`
Inventory mode: focused ownership for perceptible runtime QA surfaces.

## Summary

This inventory covers perceptible runtime surfaces for the RPG Maker MZ game
`Jhonny`, with emphasis on the race core-loop flow, input, visual/audio
feedback, save/load, integration risk, existing validation state, and human
validation gates.

The current evidence is static. No Playtest, browser run, editor run, save/load
exercise, audio playback, input test, picture rendering check, or Common Event
runtime execution was performed in this task. Therefore runtime behavior remains
`runtime-pending` even when files parse and referenced assets exist.

Recommended status:

```yaml
runtime_qa_review:
  summary: "Static runtime QA inventory completed for Jhonny/RPG Maker MZ; perceptible behavior remains pending human Playtest."
  affected_surfaces:
    - "RPG Maker MZ boot and map runtime"
    - "Race Common Events CE3, CE5-CE7, CE10-CE13, CE16, CE18, CE19"
    - "Keyboard input and W/S/A/D helper mapping"
    - "Pictures and TextPicture/ButtonPicture surfaces"
    - "BGM, ME and SE cues used by the race flow"
    - "Autosave, manual save/load and existing save files"
    - "VisuMZ CoreEngine and VNPictureBusts plugin integration"
  persona: "game-dev"
  required_checks:
    - "Boot through local server or RPG Maker MZ Playtest with visible canvas."
    - "Start the race through the documented runtime path."
    - "Exercise safe, risk, hover, timer, crash/failure, result and retry flows."
    - "Confirm input lock prevents gameplay actions during result screen."
    - "Confirm pictures, TextPictures, fades, BGM, ME and SE are perceptible and synchronized."
    - "Save and load before race, during relevant pre/post states, and after result/retry."
  evidence_needed:
    - "Human Playtest path executed."
    - "Observed expected vs actual visual, audio and input behavior."
    - "Snapshot for any black screen, stuck input, missing picture, missing audio or Common Event failure."
    - "Save/load restoration observations for race-adjacent states."
  risks:
    - "Static JSON/plugin evidence cannot prove event timing, input feel, picture visibility, audio mix or save/load compatibility."
    - "Race flow crosses Common Events, plugin commands, helper plugin state, pictures, audio and persisted switches/variables."
    - "Existing save files make compatibility a live QA surface unless declared disposable."
  recommended_status: "pending-human-validation"
  human_question: "Can you run a Playtest covering boot, race start, safe/risk input, result, retry, and save/load, then report expected vs observed behavior?"
```

## Sources Read

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`
- `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`
- `Jhonny/CLAUDE.md`
- `Jhonny/data/System.json`
- `Jhonny/data/CommonEvents.json`
- `Jhonny/data/MapInfos.json`
- `Jhonny/js/plugins.js`
- `Jhonny/js/plugins/Jhonny_RaceHelper.js`
- `Jhonny/js/rmmz_managers.js`
- `Jhonny/js/rmmz_objects.js`
- `Jhonny/img/pictures/race/**` file listing
- `Jhonny/audio/**` selected referenced cue existence
- `Jhonny/save/**` top-level file listing

## Static Evidence

### Project And Runtime Signature

- `Jhonny/` is a complete RPG Maker MZ project according to local routing and
  the observed runtime structure.
- `System.json` declares `gameTitle: Bye Bye Jhonny`, `locale: pt_BR`,
  `screenWidth: 1280`, `screenHeight: 720`, `uiAreaWidth: 1280`,
  `uiAreaHeight: 720`, `mainFontFilename: JollyLodger-Regular.ttf`,
  `numberFontFilename: JollyLodger-Regular.ttf`, `windowOpacity: 192`, and
  `optAutosave: true`.
- Start position from `System.json`: map 11 at `(13, 6)`.
- `MapInfos.json` lists 16 maps. Runtime-relevant named maps include `Prologo`
  map 11, race/test maps `mapa-semaforo`, `mapa-atalho`, `Mapa-fase2`,
  road/VN maps, ending maps, `Celular`, `CelularVazio`, and `Batida`.

### State Registry For Race QA

The race runtime state is concentrated in switch and variable IDs 100+.

Switches observed in `System.json`:

| ID | Name |
| --- | --- |
| 100 | `SW_RACE_ACTIVE` |
| 101 | `SW_INPUT_LOCKED` |
| 102 | `SW_CRASH_FLAG` |
| 103 | `SW_LAST_ACTION_SAFE` |
| 104 | `SW_PAUSED` |
| 105 | `SW_IS_CURVA_DIABO` |

Variables observed in `System.json`:

| ID | Name |
| --- | --- |
| 101 | `VAR_SCENE_INDEX` |
| 102 | `VAR_SCENE_TYPE` |
| 103 | `VAR_P_CENA` |
| 104 | `VAR_CONSCIENCIA` |
| 105 | `VAR_PONTOS_GLORIA` |
| 106 | `VAR_TAXA_SUCESSO` |
| 107 | `VAR_ROLL_RESULT` |
| 108 | `VAR_TIMER_FRAMES` |
| 109 | `VAR_SCENE_START` |
| 110 | `VAR_SEED` |
| 111 | `VAR_RACE_N_CENAS` |
| 112 | `VAR_ATTEMPT_N` |
| 113 | `VAR_LAST_RENDERED_INDEX` |
| 115 | `VAR_HOVER_LEVEL` |
| 116 | `VAR_TIMER_TIMEOUT_FLAG` |
| 117 | `VAR_VITORIA_PASSOU` |
| 119 | `VAR_GLORIA_META` |
| 120 | `VAR_TIMER_SECONDS` |
| 121 | `VAR_SCENE_DISPLAY` |

### Executable Flow Surfaces

The durable runtime document identifies these Common Events as the race graph:

| CE | Name | Static role |
| --- | --- | --- |
| 3 | `EV_Preload` | Preloads race pictures with show/wait/erase pattern. |
| 5 | `EV_RaceOrchestrator` | Initializes race state, BGM, preload and HUD; calls CE3. |
| 6 | `EV_UpdateHud` | Parallel HUD updater under `SW_RACE_ACTIVE`. |
| 7 | `EV_RaceRenderer` | Parallel renderer; calls CE19 at terminal condition and CE8/CE9 for scene rendering. |
| 10 | `EV_RaceTimer` | Parallel timer; can call CE11 on timeout path. |
| 11 | `EV_OnSafe` | Safe action path; updates state, plays SE, calls CE14. |
| 12 | `EV_OnRisk` | Risk action path; branches success/failure, calls CE15 or CE18. |
| 13 | `EV_KeyInput` | Parallel keyboard input surface under `SW_RACE_ACTIVE`. |
| 16 | `EV_HoverRiskButton` | Parallel hover feedback surface. |
| 18 | `EV_Crash` | Crash/failure cleanup path; calls CE19. |
| 19 | `EV_VitoriaCorrida` | Result screen; sets input lock, fades BGM, plays victory/defeat ME, shows TextPictures, waits for OK, transfers or retries. |

Observed command surfaces from `CommonEvents.json` include Common Event calls
(`code 117`), plugin commands (`code 357`), pictures (`code 231/235`), waits,
switch and variable operations, conditional branches, labels/jumps, BGM/ME/SE,
fade/tint, and transfers.

Local engine semantics were sampled from `rmmz_objects.js`: button conditional
branches use `Input.isPressed`, `Input.isTriggered`, or `Input.isRepeated`.
This supports the static claim that event command input checks depend on the
engine `Input` state, but it does not validate actual keyboard focus or player
feel.

### Input Surfaces

- `Jhonny_RaceHelper.js` extends `Input.keyMapper` so W/S/A/D map to
  up/down/left/right in addition to the engine defaults.
- `VisuMZ_0_CoreEngine` has `KeyboardInput.WASD:eval` set to `false`, so the
  project-specific W/S/A/D mapping appears to come from `Jhonny_RaceHelper`.
- Durable docs state that `SW_INPUT_LOCKED` must block gameplay input during
  the result screen and transition states.
- `CE13 EV_KeyInput`, `CE11 EV_OnSafe`, `CE12 EV_OnRisk`, `CE16
  EV_HoverRiskButton`, and `CE10 EV_RaceTimer` are runtime-sensitive because
  input locking, event reservation and Common Event timing are only observable
  in Playtest.

Runtime-pending checks:

- Keyboard focus after boot and after DevTools/F12 use.
- W/S/A/D and arrow behavior in the race flow.
- Result screen confirmation via OK/space.
- No safe/risk reservations while `SW_INPUT_LOCKED` is on.
- Pointer/click behavior for picture buttons, if enabled by the runtime path.

### Visual And UI Surfaces

- `System.json` uses 1280x720 screen and UI area.
- Race pictures referenced by Common Events exist under
  `Jhonny/img/pictures/race/`, including `bg_sinal`, `bg_curva`,
  `btn_parar`, `btn_furar`, `btn_direita`, `btn_esquerda`,
  `bar_consciencia_bg`, `bar_consciencia_fill`, `bg-ranking`,
  `curva_do_diabo_placa`, `overlay_*`, `placa_curva_dir`, `sinal_red`, and
  `timer_bar`.
- `TextPicture` is active and used by CE5, CE6 and CE19 for HUD/result text.
- `ButtonPicture` is active, but this pass did not deep-audit all picture
  button binding calls across maps/events.
- `VisuMZ_2_VNPictureBusts` is active with 90 percent scale on X and Y.
- `Jhonny_RaceHelper` patches `Scene_Map.update` to apply a race start effect
  using screen flash, zoom, fade out, reset zoom and fade in.

Runtime-pending checks:

- Picture load, scaling, opacity, layer order and cleanup.
- TextPicture readability and fit at 1280x720.
- Result screen composition, victory/defeat branches and confirmation text.
- Race transition flash/zoom/fade timing and motion comfort.
- HUD updates and no stale pictures after retry, crash or transfer.

### Audio Surfaces

Observed race-related audio references exist as files:

| Cue | Channel | Static source |
| --- | --- | --- |
| `darkeletronic.ogg` | BGM | CE5 starts race BGM. |
| `freada.ogg` | SE | CE11 safe action path. |
| `Up1.ogg` | SE | CE11 safe action path. |
| `Victory1.ogg` | ME | CE19 victory branch. |
| `Defeat1.ogg` | ME | CE19 defeat branch. |

CE19 also fades out BGM before result ME. File presence is static-only; browser
autoplay, volume, mix, timing, fades and perceived cue clarity require Playtest.

### Plugin And Integration Surfaces

Active plugins from `plugins.js`:

| Order | Plugin | Status | Runtime relevance |
| --- | --- | --- | --- |
| 1 | `TextPicture` | active | Picture-rendered text in HUD/result. |
| 2 | `ButtonPicture` | active | Picture click interaction surface. |
| 3 | `Jhonny_RaceHelper` | active | W/S/A/D mapping, race RNG helpers, debug logging, threshold helper, race transition patch. |
| 4 | `VisuMZ_0_CoreEngine` | active | Broad engine/UI/input/runtime modifications; `OpenConsole`, F6/F7, shortcut scripts and modern controls are enabled. |
| 5 | `VisuMZ_2_VNPictureBusts` | active | VN bust presentation. |

`Jhonny_RaceHelper` registers plugin command `logRaceEvent`; Common Events use
that command in race init, safe/risk, crash and victory paths. Debug logging is
enabled through plugin parameter `EnableDebugLogs: true`.

Integration risks:

- Broad plugin stack affects input, pictures, UI and debug behavior.
- The helper plugin exposes `window.JhonnyRace` and patches `Scene_Map.update`;
  this is a valid integration surface but needs Playtest after any behavior
  change.
- VisuMZ CoreEngine has `OpenConsole`, `F6key`, `F7key` and `ShortcutScripts`
  enabled in static parameters; this is useful for development but should be
  reviewed before release readiness.

### Save And Load Surfaces

- `System.json` has autosave enabled.
- Existing save-related files were observed: `config.rmmzsave`,
  `file0.rmmzsave`, and `global.rmmzsave`.
- Local engine `DataManager.makeSaveContents` persists system, screen, timer,
  switches, variables, self switches, actors, party, map and player.
- Local engine `StorageManager` uses local files under NW.js/local mode and
  `localforage` otherwise.

Runtime-pending checks:

- Continue from title with existing save state.
- Save/load before race entry.
- Save/load after race or result screen.
- Autosave behavior around transfers and retry.
- Whether race switches/variables, pictures, screen/tint/timer and map state
  restore without black screen, stale input lock or stale pictures.

Existing saves must be treated as compatibility surfaces unless the user
explicitly declares them disposable.

## Existing Validation State

Documented gates already exist:

- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` states that Playtest is
  required when engine, input, pictures, audio, helper plugin or Common Events
  are affected.
- `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` states that human Playtest is
  the final gate for visual behavior, input, audio, pictures, plugins and
  Common Events.
- The debug doc defines the minimum snapshot for black screen or stuck flow:
  map and player position, active event, pictures, opacity/tint/fade, race
  switches/variables, result variables/pictures, interpreter state, event
  reservation and plugin activation.

Validation not performed by this agent:

- No RPG Maker MZ Playtest.
- No browser/local server run.
- No save/load run.
- No input, pointer, audio, picture or plugin-command runtime observation.
- No editor acceptance check for Common Events.
- No full map event reachability audit.

## Runtime QA Checklist

Minimum human Playtest path:

1. Boot the game through local server or RPG Maker MZ Playtest with the canvas
   visible.
2. Start a new game from map 11 and reach the race entry path.
3. Confirm race preload/transition shows expected pictures/fade/flash without
   blank or stale screen.
4. Exercise keyboard input: arrows and W/S/A/D where applicable.
5. Exercise safe action, risk action, hover, timer timeout and crash/failure.
6. Confirm BGM, SE and ME cues play with acceptable timing and no missing cue.
7. Reach victory and defeat/result screen branches.
8. Confirm `SW_INPUT_LOCKED` behavior perceptibly: gameplay inputs do not fire
   during result, while OK/space confirmation still works.
9. Confirm retry does not repeat the VN/preload path unexpectedly and does not
   leave stale pictures/audio/tint/input lock.
10. Save/load smoke: before race, after race result, after retry or transfer,
    and continue from title using existing save files if they are in scope.

For any failure, capture the snapshot from `RPG Maker MZ - Debug Playtest`
before editing.

## Coverage And Limits

Inspected in detail:

- Runtime QA contract.
- Durable race runtime and debug docs.
- `System.json` fields relevant to visible runtime and save/load.
- Focused Common Event command summaries for race CEs.
- Active plugin order and race/helper plugin integration surfaces.
- Race picture file presence.
- Race audio cue file presence.
- Engine save/load and input semantics relevant to QA ownership.

Mapped only:

- `MapInfos.json` map list.
- Existing save file presence.
- VisuMZ plugin parameters relevant to input/debug/presentation.

Not inspected:

- Full `docs/index.xml` content beyond context already provided by common
  inventory.
- Full map event graphs and transfers.
- All database JSON files.
- Full vendor plugin internals.
- Binary asset dimensions, audio duration/format validation and image
  dimensions.
- Save file contents.
- Runtime/editor behavior.

## Location Map

- Durable project docs: `docs/index.xml`, `docs/02-Core-Loop/**`,
  `docs/03-Tech/**`.
- Runtime project root: `Jhonny/`.
- Engine source: `Jhonny/js/rmmz_*.js`.
- Generated plugin activation: `Jhonny/js/plugins.js`.
- Project helper plugin: `Jhonny/js/plugins/Jhonny_RaceHelper.js`.
- RPG Maker data JSON: `Jhonny/data/*.json`.
- Race pictures: `Jhonny/img/pictures/race/`.
- Audio cues: `Jhonny/audio/bgm/`, `Jhonny/audio/me/`, `Jhonny/audio/se/`.
- Save/local persistence files: `Jhonny/save/`.

## Residual Risks

- Static event graphs can miss runtime ordering, interpreter lifecycle,
  reservation timing, frame timing, plugin patch behavior, map reload behavior
  and editor-specific acceptance.
- Result/retry behavior crosses parallel CEs, synchronous CE calls, switch
  lifecycle, input lock, plugin commands, pictures, audio and transfer paths.
- Save/load compatibility depends on persisted map/screen/timer/switch/variable
  state and cannot be inferred from file presence.
- Debug logs are enabled and VisuMZ debug/shortcut parameters are active; this
  is useful for development but remains a release-readiness review item.
