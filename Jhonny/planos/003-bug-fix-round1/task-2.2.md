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
- Implementation Guide §3.2 — RMMZ audio stack: ME resumes BGM on
  completion; PlaySE does not. This is why the ceremonial sting belongs
  on the ME channel.
- Implementation Guide §2.3 — pseudo-code for `window.JhonnyRace.isVictory`
  helper. **Note:** Phase 5 introduces the helper; Phase 2 computes
  VITORIA_PASSOU using the existing inline logic. Do not call
  `window.JhonnyRace` here — it does not exist yet.
- **Current audio command in CE 19 cmd[6]:** `PlaySE` (code 249, **not**
  code 246). Parameters format
  `[{"name": "Victory1", "volume": 90, "pitch": 100, "pan": 0}]`. The
  asset `Victory1.ogg` lives in `audio/me/` only — there is no copy in
  `audio/se/`, so PlaySE cannot resolve it through the SE channel.
  Patch H converts the opcode 249 → 246 so the file resolves through
  the ME channel and matches the implementation-guide §3.3 spec.
- **Target audio command (after Patch H):** `Play ME` (code 246), same
  parameter dict shape and levels (`volume=90, pitch=100, pan=0`).
- RMMZ `Conditional Branch` on variable: code 111 with
  `parameters[0] === 1` (variable), `parameters[1] = <varId>`,
  `parameters[4] = 1` (operation ==), `parameters[5] = 0` (constant),
  `parameters[6] = <value>`.
- Project memory `rpg-mz-indent-skipbranch` — branch inner indent must be
  parent + 1.
- Prior art: `fase1/build_phase1_ces.py` (Phase 1 generator from this round).

## Patch specification

> **Naming convention for Phase 2.** Phase 1 v2 already introduced
> Patches D/E/F inside `build_phase1_ces.py` for `SW_PAUSED` handling
> (ceremony unlock, timer PAUSED guard, safe PAUSED guard). To keep audit
> output unambiguous across phases, Phase 2 uses letters **G** and **H**.
> Do not name Phase 2 patch functions `patch_d_*` / `patch_e_*` — those
> names collide with the Phase 1 v2 audits.

### Patch G — Compute VITORIA_PASSOU before audio command

Locate the existing `Script` block in CE 19 that computes
`VAR_VITORIA_PASSOU` (search for a `code=355` or `code=655` block referencing
`setValue(117`). The block currently occupies cmd[9–13] (5 consecutive
commands, all indent 0). The audio command currently occupies cmd[6]
(code 249 PlaySE, name `Victory1`). Move the entire script block to
immediately before cmd[6], so the `setValue(117, ...)` runs before any
audio plays.

**Do not touch:** cmd[0–1] (ceremony lock — `SW_INPUT_LOCKED=ON`,
`SW_PAUSED=ON`), cmd[29] (Label `WAIT_INPUT`), cmd[34] (`SW_PAUSED=OFF`,
the Phase 1 v2 ceremony unlock). Patch G only reorders commands in the
cmd[6–13] band.

Idempotency check: if any `setValue(117` script command already sits at an
index lower than the audio command's index, skip.

### Patch H — Replace single PlaySE with branched Play ME

Replace the existing single `PlaySE "Victory1"` (code 249) command with a
conditional branch that uses `Play ME` (code 246). The opcode conversion
249 → 246 is mandatory: `Victory1.ogg` and `Defeat1.ogg` live in
`audio/me/`, which the SE channel cannot load.

```
If VAR_VITORIA_PASSOU == 1:                          # code 111, indent 0
    Play ME "<Victory>"                              # code 246, indent 1
Else:                                                # code 411, indent 0
    Play ME "<Defeat>"                               # code 246, indent 1
End                                                  # code 412, indent 0
```

Substitute `<Victory>` and `<Defeat>` with the names from
`fase2/me-asset-choice.md`. Each Play ME parameter dict must use
`{"name": ..., "volume": 90, "pitch": 100, "pan": 0}` — same levels as
the original PlaySE.

Idempotency check: if a `code=111` branch enclosing two `code=246` (Play ME)
commands already exists at the previous PlaySE position, skip.

## Step-by-step

1. Read `fase1/build_phase1_ces.py` end-to-end. Reuse the same `C()` helper
   pattern, constant style, and `main()` structure.
2. Read `fase1/findings.md` §6 and `fase1/fase-1-completa.md` for the
   current CE 19 top-of-list layout. Post-Phase-1 v2 state: cmd[0–1] are
   the two ceremony-lock switches (`SW_INPUT_LOCKED=ON`, `SW_PAUSED=ON`);
   cmd[2–28] are the original CE 19 body (logRaceEvent, erase pictures,
   FadeoutBGM, PlaySE Victory1, Tint, threshold script, VITORIA/DERROTA
   picture branch, "Pontos de Glória" / "Pressione Espaço" pictures);
   cmd[29] is Label `WAIT_INPUT`; cmd[30–33] is the Wait/Jump loop;
   cmd[34] is `SW_PAUSED=OFF` (Phase 1 v2 ceremony unlock); cmd[35–54]
   are the post-WAIT_INPUT erase + outcome branch.
3. Dump CE 19 again (post-Phase-1 v2 state, **55 commands**) to
   `fase2/ce19-post-phase1-dump.txt`. Confirm the indices of:
   - The audio command (currently cmd[6], code 249 PlaySE, `Victory1`).
   - The script block (currently cmd[9–13], ending with `setValue(117, ...)`).
   - The ceremony-lock region (cmd[0–1]) and the `SW_PAUSED=OFF` marker
     (cmd[34]) — both must remain untouched by Patch G/H.
4. Create `Jhonny/planos/003-bug-fix-round1/fase2/build_phase2_ces.py` with:
   - Constants `VICTORY_ME`, `DEFEAT_ME` loaded from `me-asset-choice.md`
     (hardcode after reading the file — do not parse markdown at runtime).
   - `CE_INDEX_VITORIA = 19`
   - `VAR_VITORIA_PASSOU = 117`
   - `CODE_PLAY_SE = 249` and `CODE_PLAY_ME = 246` for clarity.
   - `patch_g_compute_before_audio(ces)` and `patch_h_branch_audio(ces)`.
     Patch H is responsible for the opcode conversion 249 → 246.
   - `main()` with per-patch applied/skipped prints (use the letters G/H,
     not D/E — see naming note above).
5. Match the existing CE 19 PlaySE command's `volume=90`, `pitch=100`,
   `pan=0` when constructing the branched Play ME version. Only the
   opcode changes (249 → 246); the parameter dict shape stays the same.
6. Do not run the generator in this task — task 2.3 runs and validates it.

## visual_validation

This task produces a Python file; no game-visible change. Validation is
that the file parses with `python3 -c "import ast; ast.parse(...)"` and
contains both patch functions.

## Definition of Done

- [ ] `fase2/ce19-post-phase1-dump.txt` exists and shows 55 commands.
- [ ] `fase2/build_phase2_ces.py` parses cleanly.
- [ ] Both patch functions (`patch_g_*`, `patch_h_*`) present with
      idempotency checks.
- [ ] Patch H explicitly converts opcode 249 → 246 (not just branches 246
      in place).
- [ ] ME names hardcoded from `me-asset-choice.md` match the files on disk.
- [ ] No mutations performed against `data/*.json` in this task.
