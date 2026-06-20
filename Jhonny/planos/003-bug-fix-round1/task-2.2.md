---
status: pending
phase: 2
task_id: 2.2
---

# Task 2.2 — Write `fase2/build_phase2_ces.py` (Reorder + Branch ME)

## Objective

Produce an idempotent Python generator that reorders CE 19 so
`VAR_VITORIA_PASSOU` is computed *before* the `Play ME` command, then
branches the ME on the outcome (Victory vs Defeat).

## Dependencies

- task-2.1 — `fase2/me-asset-choice.md` provides Victory ME name and Defeat
  ME name.

## References

- Implementation Guide §3.3 Option A (branch on outcome).
- Implementation Guide §4.4 — pseudo-code for the final CE 19 shape
  (compute VITORIA_PASSOU before Play ME).
- Implementation Guide §2.3 — pseudo-code for `window.JhonnyRace.isVictory`
  helper. **Note:** Phase 5 introduces the helper; Phase 2 computes
  VITORIA_PASSOU using the existing inline logic. Do not call
  `window.JhonnyRace` here — it does not exist yet.
- RMMZ `Play ME` command: code 246, parameters
  `[name, volume, pitch, pan]`. Default volume 90, pitch 100, pan 0.
- RMMZ `Conditional Branch` on variable: code 111 with
  `parameters[0] === 1` (variable), `parameters[1] = <varId>`,
  `parameters[4] = 1` (operation ==), `parameters[5] = 0` (constant),
  `parameters[6] = <value>`.
- Project memory `rpg-mz-indent-skipbranch` — branch inner indent must be
  parent + 1.
- Prior art: `fase1/build_phase1_ces.py` (Phase 1 generator from this round).

## Patch specification

### Patch D — Compute VITORIA_PASSOU before Play ME

Locate the existing `Script` command in CE 19 that computes
`VAR_VITORIA_PASSOU` (search for a `code=355` or `code=655` block referencing
`setValue(117`). If the script sits *after* the `Play ME` command, move the
entire script block (one or more consecutive `code=355` / `code=655`
commands) to a position immediately *before* the `Play ME` command.

Idempotency check: if the script block already precedes the `Play ME`
command, skip.

### Patch E — Replace single Play ME with branched Play ME

Replace the existing single `Play ME "<Victory>"` (code 246) command with a
conditional branch:

```
If VAR_VITORIA_PASSOU == 1:                          # code 111, indent 0
    Play ME "<Victory>"                              # code 246, indent 1
Else:                                                # code 411, indent 0
    Play ME "<Defeat>"                               # code 246, indent 1
End                                                  # code 412, indent 0
```

Substitute `<Victory>` and `<Defeat>` with the names from
`fase2/me-asset-choice.md`. Keep `volume`, `pitch`, `pan` identical to the
existing Victory ME command (so audio levels match).

Idempotency check: if a `code=111` branch enclosing two `code=246` commands
already exists at the previous Play ME position, skip.

## Step-by-step

1. Read `fase1/build_phase1_ces.py` end-to-end. Reuse the same `C()` helper
   pattern, constant style, and `main()` structure.
2. Read `fase1/findings.md` for the current CE 19 top-of-list layout
   (post-Phase-1 state — the three freeze switches from Patch A are at the
   top; the rest of the list is the original CE 19 body).
3. Dump CE 19 again (post-Phase-1 state) to `fase2/ce19-post-phase1-dump.txt`.
   Identify the index of the `Play ME` command and the index of the
   `setValue(117, ...)` script block.
4. Create `Jhonny/planos/003-bug-fix-round1/fase2/build_phase2_ces.py` with:
   - Constants `VICTORY_ME`, `DEFEAT_ME` loaded from `me-asset-choice.md`
     (hardcode after reading the file — do not parse markdown at runtime).
   - `CE_INDEX_VITORIA = 19`
   - `VAR_VITORIA_PASSOU = 117`
   - `patch_d_compute_before_me(ces)` and `patch_e_branch_me(ces)`.
   - `main()` with per-patch applied/skipped prints.
5. Match the existing CE 19 Play ME command's `volume`, `pitch`, `pan`
   parameters when constructing the branched version.
6. Do not run the generator in this task — task 2.3 runs and validates it.

## visual_validation

This task produces a Python file; no game-visible change. Validation is
that the file parses with `python3 -c "import ast; ast.parse(...)"` and
contains both patch functions.

## Definition of Done

- [ ] `fase2/ce19-post-phase1-dump.txt` exists.
- [ ] `fase2/build_phase2_ces.py` parses cleanly.
- [ ] Both patch functions present with idempotency checks.
- [ ] ME names hardcoded from `me-asset-choice.md` match the file on disk.
- [ ] No mutations performed against `data/*.json` in this task.
