# Runtime QA Inventory - Static Evidence

Source index: [inventory.md](inventory.md)

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
