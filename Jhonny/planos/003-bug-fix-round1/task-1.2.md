---
status: pending
phase: 1
task_id: 1.2
---

# Task 1.2 — Write `fase1/build_phase1_ces.py` (Three Coordinated Patches)

## Objective

Produce an idempotent Python generator that applies three coordinated patches
to lock race side effects while the cerimonial screen is waiting for input,
closing the infinite-glory exploit without killing the CE 19 parallel owner.

## Dependencies

- task-1.1 — `fase1/findings.md` provides confirmed CE indices (CE 19, timer
  CE, Safe-resolution CE) and Editor IDs (SW_RACE_ACTIVE=100, SW_INPUT_LOCKED=101,
  SW_PAUSED=104), plus the CE that owns the parallel flow calling CE 19.

## References

- Implementation Guide section "Fix — Three-Coordinated-Changes" — three coordinated changes.
- Implementation Guide section "Pseudo-code — Final EV_VitoriaCorrida shape".
- Implementation Guide section "Variables & Switches" — `ControlSwitch` code 121 inversion
  (`params[2] === 0` → ON, `params[2] === 1` → OFF).
- Project memory `rpg-mz-indent-skipbranch` — inserted commands inside
  IF/ELSE must match surrounding indent.
- Project memory `never-delete-common-events` — never null a CE.
- Prior art: `Jhonny/planos/001-prototipo-core-loop/fase7/build_phase7_ces.py`
  uses the C() helper + idempotency-via-pattern-detection pattern. Read it
  end-to-end before writing this generator.

## Patch specification

### Patch A — CE 19 top: lock ceremony side effects

At index 0 of CE 19's list (before any existing command; remember list[0] is
the canonical "header" indent 0 command in RMMZ CE JSON), insert two
`ControlSwitch` (code 121) commands:

| Switch | Value   | `params` (code 121)              |
| ------ | ------- | -------------------------------- |
| SW_INPUT_LOCKED (101)  | ON  | `[101, 101, 0]` |
| SW_PAUSED (104)        | ON  | `[104, 104, 0]` |

Insert at indent 0. Idempotency check: detect by looking for an existing
pair of command tuples `(code=121, params=[101,101,0])` and
`(code=121, params=[104,104,0])` at the list head; if present, skip.

Do **not** insert `SW_RACE_ACTIVE = OFF` in CE 19. CE 19 is reached through a
parallel owner that depends on SW_RACE_ACTIVE; turning it off before `WAIT_INPUT`
can stop the interpreter after the first `Wait 1 frame`.

### Patch B — Timer CE top: defensive early-return

At the top of the timer CE's loop body (look for the `Label` command that
marks the TICK loop, or at index 1 if no label), insert a Conditional Branch
(code 111) on `SW_RACE_ACTIVE == OFF` followed by
`Exit Event Processing` (code 115) inside the branch, then `End` (code 412).
Also verify the existing `SW_INPUT_LOCKED == ON` branch waits 1 frame and jumps
back to `TICK` before any timer decrement.

Pseudo-structure inside the branch:

```
If SW_RACE_ACTIVE == OFF:        # code 111, indent 0
    Exit Event Processing        # code 115, indent 1
End                              # code 412, indent 0
```

Idempotency check: scan for an existing `code=111` branch whose condition
references switch 100 followed within 3 commands by `code=115`. If present, skip.

### Patch C — Safe-resolution CE top: lock guard

At the top of the Safe-resolution CE body, verify or insert a Conditional
Branch on `SW_INPUT_LOCKED == ON`. If true, `Exit Event Processing` — do not
award `+10` glory while the victory/defeat screen is active.

Idempotency check: scan for an existing `code=111` branch whose condition
references switch 101 followed within 3 commands by `code=115`. If present, skip.

## Step-by-step

1. Read `Jhonny/planos/001-prototipo-core-loop/fase7/build_phase7_ces.py`
   end-to-end. Reuse the `C()` helper, the constant definitions, and the
   `main()` shape with per-patch applied/skipped prints.
2. Create `Jhonny/planos/003-bug-fix-round1/fase1/build_phase1_ces.py` with:
   - `CE_INDEX_VITORIA = 19`
   - `CE_INDEX_TIMER`, `CE_INDEX_SAFE` from `fase1/findings.md`
   - `SW_RACE_ACTIVE = 100`, `SW_INPUT_LOCKED = 101`, `SW_PAUSED = 104`
   - Functions `patch_a_ceremony_lock(ces)`, `patch_b_timer_guards(ces)`,
     `patch_c_safe_lock_guard(ces)`. Each returns
     `("applied" | "skipped", ces)`.
   - `main()` loads `Jhonny/data/CommonEvents.json`, runs the three patches in
     order, prints one line per patch with the result, and writes back only
     if any patch applied.
3. Match RMMZ JSON conventions: each command is a dict with `code`, `indent`,
   `parameters`. Lists are dense (no trailing commas). Preserve existing
   formatting via `json.dumps(..., indent=2, ensure_ascii=False)` if the
   current file is indented, otherwise compact.
4. For each inserted branch, double-check the indent of inner commands
   matches the parent branch indent + 1 (per memory
   `rpg-mz-indent-skipbranch`).
5. Do not run the generator in this task — task 1.3 runs and validates it.

## visual_validation

This task produces a Python file; no game-visible change. The validation is
that `python3 -c "import ast; ast.parse(open('fase1/build_phase1_ces.py').read())"`
succeeds (syntax parseable) and that the file contains the three patch
function names.

## Definition of Done

- [ ] `fase1/build_phase1_ces.py` exists and parses with `python3 -c "import
      ast; ast.parse(...)"`.
- [ ] All three patch functions present (`patch_a_ceremony_lock`,
      `patch_b_timer_guards`, `patch_c_safe_lock_guard`).
- [ ] Each patch function has an idempotency check that returns "skipped" if
      the pattern is already present.
- [ ] CE 19 Patch A never inserts or restores `SW_RACE_ACTIVE`.
- [ ] No mutations performed against `data/*.json` in this task.
