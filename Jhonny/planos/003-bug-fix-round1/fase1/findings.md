# Phase 1 Findings — Snapshot & CE Targets

## Plugin structure (`Jhonny_RaceHelper.js`, 193 lines)

- IIFE wrapper at line 49; closing `})();` at line 193.
- No `THRESHOLDS` / `isVictory` / `JhonnyRace.Config` yet (Phase 5 concern).
- `window.JhonnyRace` namespace at lines 170-179 exposes:
  `rollSceneType, rollPCena, rollD100, clamp, createPRNG, logger, logRaceEvent, captureRaceState`.
- Plugin Command registered: `Jhonny_RaceHelper.logRaceEvent`.
- Input.keyMapper extended for W/A/S/D (lines 111-117).

## Editor IDs confirmed (System.json)

### Variables (95-117; array length 118)
| ID  | Name                    |
|-----|-------------------------|
| 100 | VAR_RACE_ID             |
| 101 | VAR_SCENE_INDEX         |
| 102 | VAR_SCENE_TYPE          |
| 103 | VAR_P_CENA              |
| 104 | VAR_CONSCIENCIA         |
| 105 | VAR_PONTOS_GLORIA       |
| 106 | VAR_TAXA_SUCESSO        |
| 107 | VAR_ROLL_RESULT         |
| 108 | VAR_TIMER_FRAMES        |
| 109 | VAR_SCENE_START         |
| 110 | VAR_SEED                |
| 111 | VAR_RACE_N_CENAS        |
| 112 | VAR_ATTEMPT_N           |
| 113 | VAR_LAST_RENDERED_INDEX |
| 114 | (empty)                 |
| 115 | VAR_HOVER_LEVEL         |
| 116 | VAR_TIMER_TIMEOUT_FLAG  |
| 117 | VAR_VITORIA_PASSOU      |

### Switches (95-106; array length 107)
| ID  | Name                |
|-----|---------------------|
| 100 | SW_RACE_ACTIVE      |
| 101 | SW_INPUT_LOCKED     |
| 102 | SW_CRASH_FLAG       |
| 103 | SW_LAST_ACTION_SAFE |
| 104 | SW_PAUSED           |
| 105 | SW_IS_CURVA_DIABO   |

## CE index (20 slots)

| CE  | Name               | Trigger | Switch | Cmds | Phase-1 role |
|-----|--------------------|---------|--------|------|--------------|
| 5   | EV_RaceOrchestrator| action  | -      | 30   | Init path    |
| 6   | EV_UpdateHud       | action  | -      | 9    | Phase 3      |
| 7   | EV_RaceRenderer    | parallel| SW 100 | 44   | Calls CE 19 at end-of-race |
| 10  | **EV_RaceTimer**   | parallel| SW 100 | 20   | **Patch B target** |
| 11  | EV_OnSafe          | action  | -      | 25   | **Patch C target** (adds +10 glory at cmd[13]) |
| 12  | EV_OnRisk          | action  | -      | 37   | -            |
| 14  | EV_ResolucaoSafe   | action  | -      | 5    | -            |
| 18  | EV_Crash           | action  | -      | 28   | -            |
| 19  | **EV_VitoriaCorrida** | action | -   | 52   | **Patch A target** |

## RMMZ command semantics (verified against `rmmz_objects.js`)

- **ControlSwitch (code 121)** at line 10174: `$gameSwitches.setValue(i, params[2] === 0)`.
  → `params[2]=0` turns switch **ON**; `params[2]=1` turns switch **OFF**.
- **ConditionalBranch switch (code 111, params[0]=0)** at line 9933:
  `result = $gameSwitches.value(params[1]) === (params[2] === 0)`.
  → `params[2]=0` checks "switch ON"; `params[2]=1` checks "switch OFF".
- Both follow the same inverted convention — confirmed via source.

## Existing early-exit guards (already in place)

### CE 10 (EV_RaceTimer) top — already has Patch B
```
[1] code=111 params=[0, 100, 1]   # if SW_RACE_ACTIVE is OFF
[2] code=115 indent=1              # ExitEventProcessing
[3] code=412                        # End Branch
```

### CE 11 (EV_OnSafe) top — already has Patch C
```
[0] code=111 params=[0, 100, 1]   # if SW_RACE_ACTIVE is OFF
[1] code=115 indent=1              # ExitEventProcessing
[2] code=412                        # End Branch
```

### CE 19 (EV_VitoriaCorrida) top — MISSING the patch
```
[0] code=357 logRaceEvent VICTORY
[1] code=657 type=VICTORY
[2] code=355 erasePicture loop
```
**Nothing in CE 19 turns OFF SW 100 (RACE_ACTIVE).** This is the root cause of the
glory exploit: while CE 19 sits in its `WAIT_INPUT` loop, CE 10 (parallel) keeps
ticking the timer, eventually hits 0, and calls CE 11 (EV_OnSafe) which awards
+10 glory (`cmd[13]: code=122 params=[105, 105, 1, 0, 10]`).

## Patch plan revision (idempotent generator)

Three patches still written for symmetry; B and C will detect "already applied"
and skip:

- **Patch A (required)** — Insert at CE 19 top, before `code=357 logRaceEvent`:
  - `code=121 params=[100, 100, 1]` → SW_RACE_ACTIVE = OFF
  - `code=121 params=[101, 101, 0]` → SW_INPUT_LOCKED = ON
  - `code=121 params=[104, 104, 0]` → SW_PAUSED = ON
  - Skip condition: any of the three commands already at top of CE 19.
- **Patch B (will skip)** — Already exists at CE 10 cmds[1-3].
- **Patch C (will skip)** — Already exists at CE 11 cmds[0-2].

## CE 19 current top-of-list (for task 1.2 insertion reference)

```
[ 0] code=357 params=['Jhonny_RaceHelper', 'logRaceEvent', 'Log Race Event', {'type': 'VICTORY'}]
[ 1] code=657 params=['type = VICTORY']
[ 2] code=355 params=['for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);']
[ 3] code=242 params=[1]
[ 4] code=249 params=[{'name': 'Victory1', ...}]
```

Patch A inserts three `code=121` commands at indices [0,1,2], shifting everything else down.

## Scratch artifacts

- `ce5-dump.txt`, `ce6-dump.txt`, `ce11-dump.txt`, `ce14-dump.txt`,
  `ce18-dump.txt`, `ce19-dump.txt` — text dumps for reference.
