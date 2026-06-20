---
status: complete
phase: 1
task_id: 1.1
generated_at: 2026-06-20
revision: 2 (2026-06-20 — added §9 race-condition finding after first Playtest)
---

# Task 1.1 — Findings: CE Targets & Editor IDs for Phase 1

> Snapshot of the race scene machinery as it exists today. Phase 1 patches
> consume this document as the source of truth for CE indices and Editor IDs.

## 1. Plugin structure — `Jhonny_RaceHelper.js` (193 lines)

Pure-helper plugin (no game logic). Wraps an IIFE and exposes `window.JhonnyRace`.

**Exposed on `window.JhonnyRace`:**

| Member | Kind | Purpose |
|--------|------|---------|
| `rollSceneType()` | function | 60% SINAL (0) / 40% CURVA (1) |
| `rollPCena()` | function | Uniform on `{0,10,...,100}` |
| `rollD100()` | function | 0..99 |
| `clamp(v,min,max)` | function | Math clamp |
| `createPRNG(seed)` | function | mulberry32 (reserved v2) |
| `logger(level, ...args)` | function | Structured console logger gated by `EnableDebugLogs` |
| `logRaceEvent(args)` | function | Captures vars 100–117 / switches 100–105 → `RACE_EVENT:` JSON |
| `captureRaceState()` | function | Returns `{vars, switches}` snapshot |

**Plugin command:** `Jhonny_RaceHelper logRaceEvent { type: "STRING" }`.

**No `THRESHOLDS`, no `isVictory`, no `Config` namespace today** — Phase 5 adds these.

**Input.keyMapper patched** for W/S/A/D (keycodes 87/83/65/68).

## 2. Editor IDs (from `System.json`)

### Variables (`variables[i]`)

| Editor ID | Name | Phase 1 role |
|-----------|------|---------------|
| 100 | VAR_RACE_ID | (Phase 5 threshold lookup key) |
| 101 | VAR_SCENE_INDEX | Race scene cursor; compared with VAR_RACE_N_CENAS to fire CE 19 |
| 102 | VAR_SCENE_TYPE | 0 SINAL / 1 CURVA |
| 103 | VAR_P_CENA | Per-scene awareness delta |
| 104 | VAR_CONSCIENCIA | Awareness 0..100 |
| 105 | VAR_PONTOS_GLORIA | **Exploit target** — +10 every Safe resolution |
| 106 | VAR_TAXA_SUCESSO | HUD % (Phase 3) |
| 107 | VAR_ROLL_RESULT | D100 result |
| 108 | VAR_TIMER_FRAMES | Countdown 240→0 |
| 109 | VAR_SCENE_START | (unused in Phase 1) |
| 110 | VAR_SEED | PRNG seed |
| 111 | VAR_RACE_N_CENAS | 6 / 8 / 10 per race id |
| 112 | VAR_ATTEMPT_N | Crash-restart counter |
| 113 | VAR_LAST_RENDERED_INDEX | Renderer dedup (Phase 3) |
| 114 | (empty) | reserved |
| 115 | VAR_HOVER_LEVEL | Risk-button hover |
| 116 | VAR_TIMER_TIMEOUT_FLAG | Set when timer hits 0; CE 11 latches and clears |
| 117 | VAR_VITORIA_PASSOU | 0/1 victory flag |

### Switches (`switches[i]`)

| Editor ID | Name | Phase 1 role |
|-----------|------|---------------|
| 100 | SW_RACE_ACTIVE | **Parallel owner switch** — CEs 7/10/13/16 run while ON. Must stay ON during CE 19. |
| 101 | SW_INPUT_LOCKED | **Ceremony lock** — Patch A sets ON; CEs 10/11/12/16 read it. |
| 102 | SW_CRASH_FLAG | Crash signal (cleared by CE 18) |
| 103 | SW_LAST_ACTION_SAFE | Set by CE 11 |
| 104 | SW_PAUSED | **Currently UNUSED by any CE** (verified by grep). Patch A still sets it ON as canonical pause signal per spec §13.3; harmless. |
| 105 | SW_IS_CURVA_DIABO | Curve variant flag |

> **ControlSwitch inversion reminder.** Code 121 `params[2]===0` → ON; `params[2]===1` → OFF.
> `SW_PAUSED = ON` → `[104,104,0]`; `SW_INPUT_LOCKED = ON` → `[101,101,0]`.

## 3. Common Events relevant to Phase 1

| CE | Name | Trigger | Switch | Cmds | Role |
|----|------|---------|--------|------|------|
| 3 | EV_Preload | called | — | 49 | Asset warmup |
| 5 | EV_RaceOrchestrator | called | — | 30 | Race init + reset |
| 6 | EV_UpdateHud | called | — | 9 | HUD refresh |
| 7 | EV_RaceRenderer | **parallel (2)** | **100** | 44 | **Parallel owner that calls CE 19** |
| 8 | EV_RenderSinal | called | — | 13 | Sinal scene render |
| 9 | EV_RenderCurva | called | — | 15 | Curva scene render |
| 10 | **EV_RaceTimer** | **parallel (2)** | **100** | 20 | **TIMER CE — Patch B target** |
| 11 | **EV_OnSafe** | called | — | 25 | **SAFE-RESOLUTION CE — Patch C target (awards +10 glory)** |
| 12 | EV_OnRisk | called | — | 37 | Risk handler (no glory award) |
| 13 | EV_KeyInput | parallel (2) | 100 | 8 | WASD/arrow input router |
| 14 | EV_ResolucaoSafe | called | — | 5 | Post-safe cleanup (wait 12f + unlock input) — **NOT the glory awarder** |
| 15 | EV_ResolucaoRiskOK | called | — | 7 | Post-risk-ok cleanup |
| 16 | EV_HoverRiskButton | parallel (2) | 100 | 33 | Risk-button hover state |
| 18 | EV_Crash | called | — | 28 | Crash flash + restart |
| 19 | **EV_VitoriaCorrida** | called | — | 52 | **Ceremony screen — Patch A target** |

### 3.1 Critical correction vs. implementation guide

The implementation guide (§4.3 Change 3) refers to "**EV_ResolucaoSafe**" as the
glory-awarding CE. That is incorrect.

- **CE 14 (EV_ResolucaoSafe)** is a 5-command cleanup CE: erase event, wait 12
  frames, `SW_INPUT_LOCKED = OFF`. It does **not** touch `VAR_PONTOS_GLORIA`.
- **CE 11 (EV_OnSafe)** is the actual glory awarder:
  - cmd[13] `code=122 [105, 105, 1, 0, 10]` — **`VAR_PONTOS_GLORIA += 10`** (the exploit line).
  - cmd[3] `code=111 [0, 101, 0]` — `SW_INPUT_LOCKED == ON` guard already present, followed by cmd[4] `ExitEventProcessing`.

**Patch C must target CE 11, not CE 14.** The Audit C check (any CE with both
the INPUT_LOCKED guard at `code=111 [0,101,0]` and a glory award at
`code=122 [105,105,...]`) only matches CE 11. Findings below use
`CE_INDEX_SAFE = 11`.

### 3.2 How CE 19 is reached

CE 19 is a **called** CE (`trigger=0`). Its sole caller is **CE 7
(EV_RaceRenderer), cmd[5]**, inside this branch:

```
CE[7] cmd[4] code=111 [1, 101, 1, 111, 1]   # If VAR_SCENE_INDEX >= VAR_RACE_N_CENAS
CE[7] cmd[5]   code=117 [19]                 #   Call EV_VitoriaCorrida (CE 19)
CE[7] cmd[6]   code=115                      #   Exit Event Processing
CE[7] cmd[7] code=412                        # End
```

**CE 7 is parallel, owned by `SW_RACE_ACTIVE`.** When it calls CE 19, CE 19 runs
synchronously inside CE 7's interpreter — CE 7 is blocked on the call while
CE 19's `WAIT_INPUT` loop spins. Meanwhile the other parallel CEs (10/13/16)
keep ticking. This is why `SW_RACE_ACTIVE` must stay ON for the duration of
CE 19's WAIT_INPUT: turning it OFF would kill CE 7 mid-call.

## 4. Patch-by-patch state of the world

### 4.1 Patch A — CE 19 head: **MISSING** (must apply)

CE 19 begins with a `logRaceEvent VICTORY` PluginCommand (code 357). The first
six commands contain **no `code=121` (ControlSwitch)**:

```
[0] code=357 ['Jhonny_RaceHelper', 'logRaceEvent', 'Log Race Event', {'type': 'VICTORY'}]
[1] code=657 ['type = VICTORY']                                  # PluginCommand arg continuation
[2] code=355 ['for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);']
[3] code=242 [1]                                                  # FadeoutBGM 1s
[4] code=249 [{'name':'Victory1',...}]                            # PlaySE Victory1 (Phase 2 bug)
[5] code=223 [[60,20,-120,60], 12, False]                         # TintPicture gold
```

**Action:** insert two `code=121` commands at index 0 (indent 0):

| Switch | Value | params |
|--------|-------|--------|
| SW_INPUT_LOCKED (101) | ON | `[101, 101, 0]` |
| SW_PAUSED (104) | ON | `[104, 104, 0]` |

**Idempotency:** skip if the list head already contains both
`(code=121, params=[101,101,0])` and `(code=121, params=[104,104,0])` in the
first 8 commands. Never insert or restore `SW_RACE_ACTIVE = OFF`
(`[100,100,1]`).

### 4.2 Patch B — CE 10 timer guards: **ALREADY PRESENT** (will skip)

CE 10 already has both required guards at the top of its `TICK` loop:

```
[0] code=118 ['TICK']                       # Label TICK
[1] code=111 [0, 100, 1]                     # If SW_RACE_ACTIVE == OFF
[2]   code=115 []                            #   ExitEventProcessing
[3] code=412 []                              # End
[4] code=111 [0, 101, 0]                     # If SW_INPUT_LOCKED == ON
[5]   code=230 [1]                           #   Wait 1 frame
[6]   code=119 ['TICK']                      #   JumpToLabel TICK
[7] code=412 []                              # End
[8] code=111 [1, 108, 0, 0, 2]               # If VAR_TIMER_FRAMES <= 0 (negative guard)
...
```

Audit B (task 1.3) will pass on the current JSON. **Patch B function should
still exist in the generator for defense-in-depth and future-proofing**, but
its idempotency check will return `"skipped"` on the current data.

### 4.3 Patch C — CE 11 safe-resolution lock guard: **ALREADY PRESENT** (will skip)

CE 11 already has the `SW_INPUT_LOCKED == ON → ExitEventProcessing` guard
**before** the glory award:

```
[ 3] code=111 [0, 101, 0]                    # If SW_INPUT_LOCKED == ON
[ 4]   code=115 []                           #   ExitEventProcessing
[ 5] code=412 []                             # End
[ 6] code=121 [101, 101, 0]                  # SW_INPUT_LOCKED = ON (re-lock for animation)
...
[13] code=122 [105, 105, 1, 0, 10]           # VAR_PONTOS_GLORIA += 10  ⚠️ exploit line
```

Guard index (3) < Award index (13). Audit C will pass on the current JSON.
**Patch C function should still exist** with idempotency check returning
`"skipped"`.

> **Why the exploit still occurs today even with Patch C in place:**
> Patch C's guard only fires when `SW_INPUT_LOCKED == ON`. **Today, nothing
> sets `SW_INPUT_LOCKED = ON` when CE 19 enters its ceremony screen.** CE 11
> cmd[3] reads OFF, so the guard doesn't trigger, so the timer (CE 10) keeps
> ticking, calling CE 11 every time VAR_TIMER_FRAMES hits 0, and each call
> awards +10 glory. **Patch A is the linchpin** — once CE 19 sets the lock
> ON at entry, both Patch B (timer wait-loop) and Patch C (safe abort) become
> active and the exploit closes.

## 5. Writers/readers summary for the three switches

### 5.1 SW_RACE_ACTIVE (100) — never written inside CE 19 (confirmed)

Writers in scope: CE 5 cmd[20] `ON` (race init). CE 19 itself contains no
`code=121` writes to switch 100. **Patch A must not add one.**

### 5.2 SW_INPUT_LOCKED (101)

| CE | Cmd | Op | Value |
|----|-----|----|-------|
| 5 (Orchestrator) | 18 | WRITE | ON (race init) |
| 7 (Renderer) | 37 | WRITE | ON |
| 7 (Renderer) | 39 | WRITE | OFF |
| 10 (Timer) | 4 | READ | ON (wait-loop) |
| 11 (OnSafe) | 3 | READ | ON (abort guard) |
| 11 (OnSafe) | 6 | WRITE | ON (animation lock) |
| 12 (OnRisk) | 3 | READ | ON (abort guard) |
| 12 (OnRisk) | 6 | WRITE | ON (animation lock) |
| 14 (ResolucaoSafe) | 3 | WRITE | OFF (cleanup) |
| 15 (ResolucaoRiskOK) | 5 | WRITE | OFF (cleanup) |
| 16 (HoverRiskButton) | 1 | READ | ON (skip hover) |
| 18 (Crash) | 19 | WRITE | OFF (restart cleanup) |
| **19 (VitoriaCorrida)** | — | **never** | **Patch A adds ON at head, OFF before exit is NOT needed** |

> **Why no OFF at CE 19 exit:** every CE 19 exit path lands in either
> CE 5 (orchestrator, which sets INPUT_LOCKED ON at cmd[18] then drives the
> normal init flow that eventually clears it) or CE 18 (crash, which sets
> INPUT_LOCKED OFF at cmd[19]). Adding an explicit OFF before those calls is
> harmless but redundant; the spec only requires Patch A's ON at entry.

### 5.3 SW_PAUSED (104) — unused

Grep across all CEs: **zero readers, zero writers**. Patch A sets it ON at
CE 19 entry as the canonical pause signal per spec §13.3. No cleanup needed
(no one reads it). Phase 1 leaves it ON after exit; if a later phase starts
reading it, that phase owns its lifecycle.

## 6. Confirmed top-of-list commands of CE 19 (insertion point for Patch A)

Insertion goes **before index 0**. After insertion, the existing index 0
(PluginCommand logRaceEvent VICTORY) shifts to index 2.

```
INSERT [0] code=121 [101, 101, 0]            # SW_INPUT_LOCKED = ON
INSERT [1] code=121 [104, 104, 0]            # SW_PAUSED = ON
   [2] code=357 [...logRaceEvent VICTORY...]  # (was [0])
   [3] code=657 [...]                         # (was [1])
   [4] code=355 [erase pictures 1..60]        # (was [2])
   ... (all subsequent commands shift by +2)
```

Indents of the inserted commands: **0** (top-level, before any branch).

## 7. CE indices for the Phase 1 generator

```python
CE_INDEX_VITORIA = 19      # Patch A target
CE_INDEX_TIMER   = 10      # Patch B target (already present, will skip)
CE_INDEX_SAFE    = 11      # Patch C target (already present, will skip)
SW_RACE_ACTIVE   = 100
SW_INPUT_LOCKED  = 101
SW_PAUSED        = 104
```

## 8. Phase 5 note (out of scope for Phase 1, recorded for later)

CE 19 cmd[7–11] inlines the threshold table as **`{1: 200, 2: 400, 3: 600}`**,
with a fallback of `60`. This contradicts both the spec (60/100/150) and the
implementation guide (60/100/150). **Phase 5 must use the actual values
200/400/600 from the current code, not the spec values** — otherwise the
victory thresholds silently change. Confirm with the user before Phase 5
whether 200/400/600 or 60/100/150 is canonical.

## Definition of Done — Task 1.1

- [x] `Jhonny_RaceHelper.js` read end-to-end (193 lines).
- [x] System.json slice produced; every referenced Editor ID is named.
- [x] CE index listing produced; timer CE (10) and Safe-resolution CE (11) identified.
- [x] CE 5/7/10/11/12/14/18/19 dumps written under `fase1/`.
- [x] `fase1/findings.md` exists with all sections filled.
- [x] `fase1/findings.md` identifies the CE 19 parallel owner (CE 7, SW_RACE_ACTIVE)
      and the relevant switch readers/writers.
- [x] No edits made to runtime files (`data/*.json`, `js/plugins/*.js`).

## 9. Race condition discovered in first Playtest (revision 2)

### 9.1 Symptom

First Playtest (Fase 1 v1, only Patch A): Patch A worked on attempt 1 but
**failed on attempt 2+** — glory kept increasing (+10 every ~3s) while idle
on the defeat screen. ATTEMPT_N=3 in the logs.

RACE_EVENT timeline (all on attempt 3):

| Frame | Event         | SCENE_INDEX | PONTOS_GLORIA | TIMER_FRAMES | TIMEOUT_FLAG |
|-------|---------------|-------------|---------------|--------------|--------------|
| 6580  | SAFE_CLICK    | 5           | 50            | 180          | 0            |
| 6646  | SAFE_CLICK    | 6           | 60            | 186          | 0            |
| 6646  | VICTORY       | 6           | 60            | 186          | 0            |
| 6843  | SAFE_CLICK    | 7           | 70            | 0            | 1            |

Between the VICTORY log (frame 6646, TIMER_FRAMES=186) and the post-VICTORY
SAFE_CLICK (frame 6843, TIMER_FRAMES=0, TIMEOUT_FLAG=1), the timer
decremented 186 times — meaning `SW_INPUT_LOCKED` was OFF for ~186 frames
despite Patch A setting it ON at CE 19 entry.

### 9.2 Root cause — CE 14 race condition

CE 14 (`EV_ResolucaoSafe`) cmd[3] unconditionally sets `SW_INPUT_LOCKED=OFF`
as the post-Safe cleanup. CE 14 is called from CE 11 (`EV_OnSafe`) cmd[20].
CE 14 cmd[2] is a `Wait 12 frames`, which **blocks the map interpreter for 12
frames**.

When the player completes the race with a Safe action:

1. Player clicks `btn_parar` (picture 41) → `ButtonPicture.js` line 89 fires
   `$gameTemp.reserveCommonEvent(11)` → CE 11 is **queued on the map
   interpreter** (async).
2. Map interpreter picks up CE 11. Runs through cmd[6] (`SET INPUT_LOCKED=ON`),
   cmd[13] (`+10`), cmd[16] (`SCENE_INDEX += 1`), cmd[18] (`log SAFE_CLICK`),
   cmd[20] (`Call CE 14`).
3. CE 14 cmd[2] `Wait 12 frames` **blocks the map interpreter** for 12 frames.
4. **During those 12 frames**, CE 7's parallel interpreter (independent)
   ticks, sees `SCENE_INDEX >= RACE_N_CENAS` at cmd[4], calls CE 19 at cmd[5].
5. CE 19 Patch A fires **on CE 7's interpreter**: `SET INPUT_LOCKED=ON`,
   `SET PAUSED=ON`. Logs VICTORY. Enters `WAIT_INPUT`.
6. After 12 frames, CE 14 cmd[3] fires **on the map interpreter**:
   `SET INPUT_LOCKED=OFF` — **overrides Patch A**.
7. CE 14 returns, CE 11 returns, map interpreter is free.
8. CE 10's parallel interpreter now sees `INPUT_LOCKED=OFF` at cmd[4],
   decrements `TIMER_FRAMES`.
9. Eventually timer hits 0 → CE 10 cmd[15] calls CE 11.
10. CE 11 cmd[3] guard sees `INPUT_LOCKED=OFF` — guard doesn't fire. CE 11
    runs the full body: `+10 glory`, `SCENE_INDEX += 1`, calls CE 14, CE 14
    clears INPUT_LOCKED again.
11. Cycle repeats every ~240 frames.

### 9.3 Why attempt 1 appeared to work

Timing variance. On attempt 1, CE 7 happens to call CE 19 **after** CE 14
finishes its Wait 12 frames and clears INPUT_LOCKED. Patch A's `SET ON` then
survives because there is no further CE 14 in the pipeline. On attempt 2+
(after CE 18 restart, which doesn't re-call CE 5), the timing differs and
CE 7 wins the race. The bug is latent on all attempts — attempt 1 was lucky.

### 9.4 Why `SW_INPUT_LOCKED` is the wrong signal for the ceremony lock

`SW_INPUT_LOCKED` is a **multi-purpose operational lock** owned by the Safe /
Risk resolution pipeline:

- CE 11 cmd[6] sets it ON (lock during Safe animation)
- CE 14 cmd[3] sets it OFF (release after Safe cleanup)
- CE 12 cmd[6] sets it ON (lock during Risk animation)
- CE 15 cmd[5] sets it OFF (release after Risk cleanup)
- CE 7 cmd[37/39] toggles it for scene-render animation

Adding Patch A as another writer of `SW_INPUT_LOCKED=ON` puts Patch A in
conflict with all of these clearers. Any clear that fires after Patch A's
set undoes the ceremony lock.

### 9.5 Fix — promote `SW_PAUSED` to the ceremony signal

`SW_PAUSED` (Editor ID 104) is **unused** by any reader/writer in the entire
CE codebase (verified by grep). It exists in `System.json` as the canonical
pause signal per spec §13.3 but was never wired up.

Three new patches make `SW_PAUSED` the **robust** ceremony signal that CE 14
cannot clear:

| Patch | CE | Change |
|-------|----|--------|
| D (new) | 19 | Insert `SW_PAUSED=OFF` after `WAIT_INPUT` loop ends, before `ErasePicture`. |
| E (new) | 10 | Insert `If SW_PAUSED==ON: Wait 1, Jump TICK` after RACE_ACTIVE check, before INPUT_LOCKED check. |
| F (new) | 11 | Insert `If SW_PAUSED==ON: Exit` at head, before RACE_ACTIVE check. |

Now the lifecycle is closed:

- **ON**: only Patch A sets `SW_PAUSED=ON` at CE 19 entry.
- **OFF**: only Patch D sets `SW_PAUSED=OFF` at CE 19 exit.
- **Read**: CE 10 (Patch E) gates timer decrement; CE 11 (Patch F) gates
  glory award.

Even when CE 14 races Patch A and clears `INPUT_LOCKED`, the `PAUSED`
guards in CE 10 and CE 11 hold — the timer doesn't decrement and CE 11
doesn't award glory. The race is defused.

`SW_INPUT_LOCKED` continues to serve its original Safe/Risk animation
purpose; the ceremony lock now has its own dedicated signal.

### 9.6 Generator v2

`fase1/build_phase1_ces.py` extended with three new patch functions
(`patch_d_ceremony_unlock`, `patch_e_timer_paused_guard`,
`patch_f_safe_paused_guard`) and three new audits (D/E/F). All six patches
remain idempotent — re-running the generator prints "skipped" x6 with empty
git diff.

