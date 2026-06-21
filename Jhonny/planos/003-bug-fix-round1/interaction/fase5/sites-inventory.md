---
status: complete
phase: 5
task_id: 5.1
generated_at: 2026-06-21
---

# Sites Inventory — THRESHOLDS Literal Migration

> Output of Task 5.1. Feeds Task 5.3 (`build_phase5_ces.py`, patch M).
> Scope: every literal `60 / 100 / 150 / 200 / 400 / 600` in
> `Jhonny/data/CommonEvents.json` and `Jhonny/js/plugins/Jhonny_RaceHelper.js`
> that participates in the victory-threshold comparison.

## Variable ID map (verified against `Jhonny_RaceHelper.js` VAR_NAMES, lines 122-133)

| Editor ID | Variable name       | Role                                          |
| --------- | ------------------- | --------------------------------------------- |
| 100       | `RACE_ID`           | Race tier (1=Lenda, 2=Rachadura, 3=Abismo)    |
| 105       | `PONTOS_GLORIA`     | Glory points accumulated during the race      |
| 117       | `VITORIA_PASSOU`    | Boolean-as-number (0/1) set by CE 19          |

Switch 101 (`INPUT_LOCKED`) and 104 (`PAUSED`) are independent of the variable
ID space — both share the numeric ID `101`/`104` with different namespaces
(`SWITCH_NAMES` vs `VAR_NAMES` in the plugin).

The plugin (`Jhonny_RaceHelper.js`) defines **no** `THRESHOLDS`, `threshold`,
or `isVictory` keyword today. Phase 5 introduces them fresh in Task 5.2.

## Search results

```
rg -n "\b(60|100|150|200|400|600)\b" data/CommonEvents.json js/plugins/Jhonny_RaceHelper.js
```

- Total hits: **154 lines**. `150` produces **0 hits** in either file — the
  spec table value for race 3 has never been inlined; only the current
  dict-with-fallback `{ 1: 200, 2: 400, 3: 600 }` and `|| 60` fallback appear.
- Plugin `rg -n "threshold"`: **0 hits**. Confirms no prior `THRESHOLDS`
  block exists in the plugin.

## Threshold-related sites

| # | File                  | JSON line | CE index | CE name              | cmd index | code | Current code (verbatim)                                                       | Replacement plan                                                                                                         |
| - | --------------------- | --------- | -------- | -------------------- | --------- | ---- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1 | `data/CommonEvents.json` | 3319      | `ces[19]` | `EV_VitoriaCorrida` | `cmd[6]`  | 355  | `const pontos = $gameVariables.value(105);`                                   | Becomes head of fallback branch; preserved verbatim inside `if (typeof window.JhonnyRace === "undefined") { ... }`.       |
| 2 | `data/CommonEvents.json` | 3326      | `ces[19]` | `EV_VitoriaCorrida` | `cmd[7]`  | 655  | `const raceId = $gameVariables.value(100);`                                   | Becomes second line of fallback branch; preserved verbatim.                                                               |
| 3 | `data/CommonEvents.json` | 3333      | `ces[19]` | `EV_VitoriaCorrida` | `cmd[8]`  | 655  | `const thresholds = { 1: 200, 2: 400, 3: 600 };`                              | Preserved verbatim inside fallback branch; dict values `200/400/600` match `JhonnyRace.Config.THRESHOLDS` in Task 5.2.     |
| 4 | `data/CommonEvents.json` | 3340      | `ces[19]` | `EV_VitoriaCorrida` | `cmd[9]`  | 655  | `const passou = pontos >= (thresholds[raceId] \|\| 60);`                       | Preserved verbatim inside fallback branch; `|| 60` matches `JhonnyRace.Config.DEFAULT_THRESHOLD = 60` in Task 5.2.        |
| 5 | `data/CommonEvents.json` | 3345\*    | `ces[19]` | `EV_VitoriaCorrida` | `cmd[10]` | 655  | `$gameVariables.setValue(117, passou ? 1 : 0);`                               | Fallback branch keeps `setValue(117, passou ? 1 : 0)`; new branch calls `window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0`. |

\* cmd[10] JSON line approximate; the contiguous script block spans
  JSON lines 3315-3350. The generator locates the block by content, not
  by absolute line number.

### Migration shape (single replacement)

The 5 commands above (cmd[6] through cmd[10]) form a contiguous block of
`code=355` followed by four `code=655` Script commands. Task 5.3 rewrites
them in-place to a single if/else block whose two branches each compute
`$gameVariables.setValue(117, ...)`:

```javascript
// Fallback (plugin missing — preserves current behavior verbatim):
if (typeof window.JhonnyRace === "undefined") {
    const pontos = $gameVariables.value(105);
    const raceId = $gameVariables.value(100);
    const thresholds = { 1: 200, 2: 400, 3: 600 };
    const passou = pontos >= (thresholds[raceId] || 60);
    $gameVariables.setValue(117, passou ? 1 : 0);
} else {
    const raceId = $gameVariables.value(100);
    const pontos = $gameVariables.value(105);
    $gameVariables.setValue(117, window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0);
}
```

The block MUST stay a contiguous sequence of one `code=355` + N `code=655`
Script commands (it cannot become two separate Script commands, or the
downstream `code=111` Conditional Branch and `WAIT_INPUT` Label shift).

## Unrelated literal hits (sampled — not exhaustive)

All 149 other hits are unrelated to the threshold comparison. Representative
categories:

| Literal | Typical context                                                   | Why unrelated                                                                                              |
| ------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `100`   | `code=231 Show Picture` `params[6]`/`params[7]` (zoom scale %)    | Picture zoom percentage; baked into every Show Picture command.                                            |
| `100`   | `code=231 Show Picture` `params[8]` (opacity 0-255 is unrelated)  | Opacity is on a different param slot; `100` here is always zoom.                                           |
| `100`   | `code=122 Control Variables` operands                             | Math operands for VAR_RACE_N_CENAS, VAR_TIMER_FRAMES, etc. — unrelated to glory thresholds.               |
| `100`   | `code=111` Conditional Branch `params[0]=1` (variable) `params[1]=100` | Branch on `VAR_RACE_ID === ...` — that's the `raceId` argument, not the threshold value.                  |
| `100`   | `code=121 ControlSwitch` `params=[100, 100, 0/1]`                 | Operates on `SW_RACE_ACTIVE` (switch 100), not on a threshold.                                             |
| `100`   | `code=231 Show Picture` `params[5]` (y coordinate)                | Vertical position of a picture; not a threshold.                                                           |
| `100`   | `switchId: 100` (top-level CE metadata)                           | CE parallel-trigger switch assignment; not a threshold.                                                    |
| `60`    | `code=231 Show Picture` `params[0]` (picture ID 60)               | Picture ID — within the race-owned 1-60 erase range; not a threshold.                                      |
| `60`    | `for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);`      | Loop bound for defensive picture wipe; not a threshold.                                                   |
| `60`    | `code=223 Tint Picture` `params[0]=[60, 20, -120, 60]`            | RGBA tint color (R=60, G=20, B=-120, A=60); cosmetic gold fallback.                                        |
| `200`   | `code=231 Show Picture` `params[5]` (y=200)                       | Y coordinate for the VITÓRIA/DERROTA text pictures (53, 56); not a threshold.                              |
| `400`   | `code=231 Show Picture` `params[5]` (y=400)                       | Y coordinate for picture 58 (`race/bar_luck_bg`); not a threshold.                                         |
| `600`   | `code=231 Show Picture` `params[4]` (x=600)                       | X coordinate for picture 58; not a threshold.                                                              |
| `150`   | (none)                                                            | 0 hits. The spec §8.2 race-3 value has never been inlined as a literal anywhere in CE JSON or the plugin.  |

> The 149 unrelated entries above are illustrative, not exhaustive — the
> generator in Task 5.3 locates the threshold block by content match
> (`value(105)` + `{ 1:` + `thresholds[raceId]` + `|| 60`), so any
> unrelated `60`/`100`/`200`/`400`/`600` hit is structurally invisible to
> the migration.

## Conclusion

- **Single migration site** in CE 19 (`EV_VitoriaCorrida`), cmd[6]-cmd[10].
- **Plugin has no existing `THRESHOLDS`** — Task 5.2 introduces it fresh.
- **All literal hits outside CE 19 cmd[6-10] are unrelated** and must not be touched.
- **`150` literal does not exist anywhere** — the dict `{ 1: 200, 2: 400, 3: 600 }`
  with `|| 60` fallback is the only threshold representation in the project.

Ready for Task 5.2 (add namespace) and Task 5.3 (replace CE 19 block).
