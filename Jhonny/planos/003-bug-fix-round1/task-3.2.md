---
status: done
phase: 3
task_id: 3.2
---

# Task 3.2 — Write `fase3/build_phase3_ces.py` (EV_UpdateHud + INIT Re-show)

## Objective

Produce an idempotent Python generator that creates a parallel
`EV_UpdateHud` CE (gated on `SW_RACE_ACTIVE`) which re-renders the awareness
HUD every 6 frames, AND adds an unconditional `Show Picture <HUD_ID>` to
`EV_RaceOrchestrator` INIT so the HUD is visible from frame 1 of every
attempt.

## Dependencies

- task-3.1 — `fase3/hud-findings.md` provides the HUD picture ID, the owner
  CE, and the TextPicture pattern.

## References

- Implementation Guide §6.3 Option A (refresh TextPicture every N frames).
- Implementation Guide §7.3 (Re-show the HUD in EV_RaceOrchestrator INIT).
- Implementation Guide §7.4 (link between #5 and #6 — both resolve together).
- TextPicture plugin command pattern (from fase7 retrospective): code 357 +
  657 + 231 with `name=""`.
- RMMZ parallel CE structure: `{"trigger": 2, "switchId": <id>, "list": [...]}`
  where trigger 2 = parallel.
- Project memory `never-delete-common-events` — never null a CE; if a slot
  must be reused, clean its list to the canonical empty list.
- Prior art: `fase1/build_phase1_ces.py`, `fase2/build_phase2_ces.py`.

## Ceremony-lock interaction (do not skip)

`SW_RACE_ACTIVE` (switch 100) is the **owner** of every parallel CE in the
race flow — Fase 1 established that toggling it inside a CE that still
needs to traverse `Wait`/`Label`/`Jump` kills the interpreter. The new
`EV_UpdateHud` CE must therefore coexist with the ceremony lock from
Fase 1 v2:

- During victory/defeat, `SW_PAUSED` (switch 104) is ON (set by CE 19
  head, cleared after `WAIT_INPUT`). `EV_UpdateHud` SHOULD NOT refresh
  the HUD while paused — otherwise it competes with `EV_Crash`/`EV_Clean`
  for picture slots during the ceremony transition.
- Add a guard at the top of `EV_UpdateHud`'s list:
  `If SW_PAUSED == ON → Exit Event Processing` (code 111 + code 115 +
  code 412, indent per `rpg-mz-indent-skipbranch`).
- This mirrors the pattern already present in CE 10 (timer) and CE 11
  (safe) from Fase 1 v2 — same defense, same switch, same reason.
- Verify with `rg "SW_PAUSED" fase1/build_phase1_ces.py` for the exact
  param layout (`[0, 104, 0]` means "branch taken when SW_PAUSED is ON").

## Patch specification

> **Opcode contract (verified in `Jhonny/js/rmmz_objects.js` on 2026-06-20):**
> Before writing any patch below, confirm each opcode against this table.
> Earlier drafts of this task carried two inverted codes (`code 0` for Label
> and `code 232` for Erase Picture) — both are wrong; the corrected values
> are below.
>
> | Code | Handler         | Confirmed at                |
> | ---- | --------------- | --------------------------- |
> | 118  | Label           | `rmmz_objects.js:10139`     |
> | 119  | Jump to Label   | `rmmz_objects.js:10144`     |
> | 121  | Control Switch  | (used since Fase 1)         |
> | 230  | Wait            | `rmmz_objects.js:10702`     |
> | 231  | Show Picture    | `rmmz_objects.js:10708`     |
> | 232  | Move Picture    | `rmmz_objects.js:10719` — **not Erase** |
> | 235  | Erase Picture   | `rmmz_objects.js:10762`     |
> | 357  | Plugin Command  | `rmmz_objects.js:11321`     |
>
> Patch letters continue the cross-phase namespace: Fase 1 v2 used A–F,
> Fase 2 used G–H, so this phase starts at I. Run
> `rg "patch_[a-z]_" fase*/build_phase*.py` before adding new letters.

### Patch I — Create or extend EV_UpdateHud

If a CE named `EV_UpdateHud` already exists (check `fase3/hud-findings.md`),
extend it. Otherwise, claim an empty CE slot (look for `null` or an
empty-list CE in `CommonEvents.json`); if none, **stop and surface to the
user** — do not silently overwrite a non-empty CE.

The CE structure:

```jsonc
{
  "name": "EV_UpdateHud",
  "trigger": 2,            // parallel
  "switchId": 100,         // SW_RACE_ACTIVE
  "list": [
    // Label: HUD_TICK
    {code: 118, indent: 0, parameters: ["HUD_TICK"]},  // 118 = Label (rmmz_objects.js:10139)
    // Read vars + compute taxa
    {code: 355, indent: 0, parameters: [
      "const c = $gameVariables.value(104);",        // CONSCIENCIA
      "const p = $gameVariables.value(103);",        // P_CENA
      "const taxa = Math.max(0, Math.min(100, c + p));",
      "$gameVariables.setValue(106, taxa);"          // TAXA_SUCESSO
    ]},
    // Erase picture
    {code: 235, indent: 0, parameters: [<HUD_ID>]},  // 235 = Erase Picture (rmmz_objects.js:10762)
    // Show picture via TextPicture pattern (code 357 + 657 + 231)
    {code: 357, indent: 0, parameters: ["TextPicture", "<bake command>", ...]},
    {code: 657, indent: 0, parameters: ["text=Consciência: \\V[104]%  (Taxa: \\V[106]%)"]},
    {code: 231, indent: 0, parameters: [<HUD_ID>, "", 0, <x>, <y>, ...]},
    // Wait 6 frames
    {code: 230, indent: 0, parameters: [6]},
    // Jump to label HUD_TICK
    {code: 119, indent: 0, parameters: ["HUD_TICK"]}
  ]
}
```

Verify exact code numbers from existing CE 6 (TextPicture pattern from
fase6/fase7) — the snippet above is illustrative. Reuse the exact code
sequence from `EV_RaceRenderer` or any CE that already renders TextPicture
HUD text (look in `fase3/hud-findings.md`).

Idempotency check: if a CE named `EV_UpdateHud` already exists with
`switchId == 100` and a `HUD_TICK` label, skip.

### Patch J — Add Show Picture to EV_RaceOrchestrator INIT

In CE 5 (`EV_RaceOrchestrator`), find the INIT block where state variables
are reset (`VAR_CONSCIENCIA = 0`, `VAR_PONTOS_GLORIA = 0`, `VAR_SCENE_INDEX = 0`,
`VAR_ATTEMPT_N += 1`). Immediately after the `SW_RACE_ACTIVE = ON`
ControlSwitch (if not present, insert it before the HUD show), add:

```jsonc
// Show Picture <HUD_ID> with initial text "Consciência: 0%"
{code: 357, indent: 0, parameters: ["TextPicture", "<bake command>", ...]},
{code: 657, indent: 0, parameters: ["text=Consciência: 0%  (Taxa: 0%)"]},
{code: 231, indent: 0, parameters: [<HUD_ID>, "", 0, <x>, <y>, ...]}
```

Use the same coordinates and picture ID as Patch I so the two CEs render at
the same location.

Idempotency check: if CE 5 already has a Show Picture command for the HUD
ID immediately after the SW_RACE_ACTIVE ON switch, skip.

## Step-by-step

1. Read `fase1/build_phase1_ces.py` and `fase2/build_phase2_ces.py` for the
   pattern. Reuse `C()` helper and main shape.
2. Read `fase3/hud-findings.md` for HUD_ID, owner CE, TextPicture pattern.
3. Confirm the exact RMMZ command codes by reading an existing CE that uses
   TextPicture (likely CE 6 or CE 7). Record the precise 357/657/231 argument
   layouts — they must match.
4. Find an empty CE slot for `EV_UpdateHud`:
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); [print(i, ces[i] is None or (not ces[i].get('list'))) for i in range(len(ces))]"
   ```
5. Create `Jhonny/planos/003-bug-fix-round1/fase3/build_phase3_ces.py` with
   `patch_i_create_update_hud(ces)` and `patch_j_init_reshow(ces)`. Both
   must be idempotent via pattern detection.
6. Do not run the generator in this task.

## visual_validation

This task produces a Python file; no game-visible change. Validation is
that the file parses with `python3 -c "import ast; ast.parse(...)"`, both
patch functions exist, and the EV_UpdateHud template uses a CE slot that
is currently null or empty-list.

## Definition of Done

- [ ] `fase3/build_phase3_ces.py` parses cleanly.
- [ ] Patch I template references a CE slot that is currently empty.
- [ ] Patch I uses exact RMMZ codes from an existing TextPicture CE.
- [ ] Patch J inserts after `SW_RACE_ACTIVE = ON` in CE 5.
- [ ] Both patches have idempotency checks.
- [ ] No mutations performed against `data/*.json` in this task.
