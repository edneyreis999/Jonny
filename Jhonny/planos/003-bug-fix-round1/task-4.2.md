---
status: pending
phase: 4
task_id: 4.2
---

# Task 4.2 — Apply Curve Label Fix (Direct Edit or Generator)

## Objective

Apply the fix specified in `fase4/diagnosis.md`. The implementation choice
(direct edit vs Python generator) depends on the confirmed hypothesis.

## Dependencies

- task-4.1 — `fase4/diagnosis.md` exists with confirmed hypothesis and
  exact change specification.

## References

- Implementation Guide §5.3 (Fix per hypothesis).
- Project memory `never-delete-common-events` — applies if a CE must be
  cleaned (unlikely for this task).

## Visual Context (from screenshots)

The Curve choice UI shows two hand-drawn arrows:
- A **right-pointing arrow** rendered on the RIGHT side of the screen.
- A **left-pointing arrow** rendered on the LEFT side of the screen.

Arrow **placement is visually correct**. The bug is in **event binding**:
pressing Right (keyboard `→` or click) currently triggers the **Safe**
event; pressing Left triggers the **Risk** event. This is inverted.

**Expected convention (corrected):** Right → **Risk**, Left → **Safe**.

**Reference — Sinaleiro scene** (already correct in-game):
- Up arrow → Risk (Furar); Down arrow → Safe (Parar).
- Layout: brake/Down on the LEFT, accelerate/Up on the RIGHT.

By analogy, Curve must place the "aggressive" option on the RIGHT
(Right = Risk) and the "cautious" option on the LEFT (Left = Safe),
mirroring how Sinaleiro places "aggressive" (Furar/Up) on the right.

> Note: the previous convention written into this plan
> (`Direita = Safe, Esquerda = Risk`) matched the buggy implementation
> and has been corrected in the spec `Corrida - Core Loop.md` §5.

## Implementation choice

- **If H1 (coord swap, single line edit in one Show Picture command):**
  - Use a direct JSON edit via a small Python script.
  - File: `fase4/fix_curve_labels.py`.
  - One patch function: `swap_label_coords(ces)`.
  - Idempotency check: detect by reading current x-coords; if already
    correct, skip.

- **If H2 (file rename):**
  - Rename the asset file under `Jhonny/img/pictures/` so its name matches
    its semantic. No CE edit needed. Document the rename in
    `fase4/fase-4-completa.md`.

- **If H3 (condition inversion):**
  - Use a Python generator (`fase4/build_phase4_ces.py`) because the fix
    involves changing a conditional branch (code 111) which may have nested
    commands.
  - Patch function: `fix_curve_condition(ces)`.
  - Idempotency check: detect correct operator already in place.
  - Before naming the patch function, identify the next free patch letter
    by running `rg "patch_[a-z]_" fase*/build_phase*.py`; phase letters are
    reserved per phase to avoid audit ambiguity in handoffs.

## Step-by-step

1. Read `fase4/diagnosis.md` and follow the Recommended Implementation.
2. Before writing any patch, confirm the numeric code of every command it
   touches by grepping `Game_Interpreter.prototype.commandNNN` in
   `Jhonny/js/rmmz_objects.js`. For H1 that means `231` (Show Picture); for
   H3 that means `111` (Conditional Branch). Specifications and textual
   dumps can carry inverted or MV-era codes; the engine source is the only
   authoritative mapping.
3. **For H1:** Write `fase4/fix_curve_labels.py`:
   ```python
   import json, sys
   PATH = "Jhonny/data/CommonEvents.json"
   CE_INDEX = <from diagnosis>
   CMD_INDEX = <from diagnosis>
   SAFE_X, RISK_X = <correct values from spec>

   def swap_label_coords(ces):
       lst = ces[CE_INDEX]["list"]
       cmd = lst[CMD_INDEX]
       if cmd["code"] != 231:
           print(f"skip: cmd at {CMD_INDEX} is not Show Picture")
           return ces
       current_x = cmd["parameters"][4]
       new_x = RISK_X if current_x == SAFE_X else (SAFE_X if current_x == RISK_X else None)
       if new_x is None:
           print(f"skip: current x={current_x} not in expected pair")
           return ces
       cmd["parameters"][4] = new_x
       print(f"applied: x {current_x} -> {new_x}")
       return ces

   if __name__ == "__main__":
       with open(PATH) as f: ces = json.load(f)
       ces = swap_label_coords(ces)
       with open(PATH, "w") as f: json.dump(ces, f, indent=2, ensure_ascii=False)
   ```
4. **For H2:** `git mv Jhonny/img/pictures/<wrong>.png Jhonny/img/pictures/<right>.png`
   for each affected file. Confirm with `ls`.
5. **For H3:** Write `fase4/build_phase4_ces.py` following the pattern from
   `fase1/build_phase1_ces.py`. The patch inverts the conditional operator
   (parameters[4]: 0 ↔ 1) on the relevant branch.
6. Do not run the script in this task — task 4.3 runs and validates it.

## visual_validation

This task produces a script or asset rename; no game-visible change yet.
Validation is that the script parses cleanly and matches the diagnosis.

## Definition of Done

- [ ] Implementation choice matches `fase4/diagnosis.md` recommendation.
- [ ] For H1: `fase4/fix_curve_labels.py` parses cleanly, swap logic correct.
- [ ] For H2: asset rename complete; `ls` confirms new names.
- [ ] For H3: `fase4/build_phase4_ces.py` parses cleanly with idempotency check.
- [ ] No mutations performed against `data/*.json` in this task.
