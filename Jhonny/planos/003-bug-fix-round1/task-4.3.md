---
status: pending
phase: 4
task_id: 4.3
---

# Task 4.3 — Run Fix, Audit, and Playtest Phase 4

## Objective

Apply the curve label fix, validate JSON (or confirm asset rename), run
programmatic audit, and confirm via Playtest that left=Risk and right=Safe
in the Curve scene.

## Dependencies

- task-4.2 — Fix script (or rename) is ready.

## References

- Implementation Guide §5 (Issue #4 — Curve Scene Asset Inversion).
- Implementation Guide §8.3 (Testing Strategy — #4 curve labels).
- Spec `Corrida - Core Loop.md` §5 — Direita = Risk, Esquerda = Safe
  (corrected; see Visual Context above for rationale).

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

## Step-by-step

1. Run the fix (adjust to the implementation choice):
   - **H1:** `python3 Jhonny/planos/003-bug-fix-round1/fase4/fix_curve_labels.py`
   - **H2:** No script — rename already applied in task 4.2.
   - **H3:** `python3 Jhonny/planos/003-bug-fix-round1/fase4/build_phase4_ces.py`
2. Validate JSON: `python3 -m json.tool Jhonny/data/CommonEvents.json`.
3. Re-run the script (for H1/H3). Expected: "skipped" with empty `git diff`.
4. Programmatic audit:

   **Audit H** — Risk label x-coord < Safe label x-coord (left=Risk, right=Safe):
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); <inspect Show Picture commands per diagnosis.md — verify x_Risk < x_Safe>; print('Audit H OK')"
   ```
   The exact audit depends on the diagnosis. For H2 (asset rename), audit
   that the renamed files exist on disk. For H3, audit the conditional
   branch operator on the patched CE (e.g. `parameters[4]` of the relevant
   `code 111` command equals the expected value). For H4/H5, audit the
   semantic shape of the affected command (text content, variable
   reference) rather than the numeric opcode — audits that only re-check
   the opcode the patch wrote are tautological and miss regressions.
5. After writing to any `data/*.json` and before Playtest, the user must
   hard-refresh the browser (`Cmd+Shift+R`) so the engine reloads the
   cached JSON — otherwise the fix is masked by stale data.
6. Hand off to the user for Playtest:
   - Trigger a Curve scene (race 1, specific scene type from spec).
   - Observe the two label positions on screen.
   - Confirm: left button (visually on the left side) reads "Safe",
     right button reads "Risk".

## visual_validation

On Playtest:

- Two visible labels on the Curve scene.
- Left-side label reads **Safe**.
- Right-side label reads **Risk**.

The visible signal is the label text on screen, positioned correctly relative
to the arrows.

## Definition of Done

- [ ] Fix applied (or asset renamed).
- [ ] JSON validates.
- [ ] For H1/H3: script idempotent (2nd run = "skipped" + empty diff).
- [ ] Audit prints "OK" against the semantic shape that matches the
      confirmed hypothesis (coords for H1, files for H2, branch operator
      for H3, opcode-to-handler mapping for H4, variable bake state for H5).
- [ ] User confirms: left=Safe, right=Risk in Curve scene.
- [ ] `fase4/fase-4-completa.md` written with audit output and Playtest
      summary.
