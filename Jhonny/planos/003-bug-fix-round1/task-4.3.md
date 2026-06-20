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
- Spec `Corrida - Core Loop.md` §5 — Direita = Safe, Esquerda = Risk.

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
   that the renamed files exist on disk.
5. Hand off to the user for Playtest:
   - Trigger a Curve scene (race 1, specific scene type from spec).
   - Observe the two label positions on screen.
   - Confirm: left button (visually on the left side) reads "Risk",
     right button reads "Safe".

## visual_validation

On Playtest:

- Two visible labels on the Curve scene.
- Left-side label reads **Risk**.
- Right-side label reads **Safe**.

The visible signal is the label text on screen, positioned correctly relative
to the arrows.

## Definition of Done

- [ ] Fix applied (or asset renamed).
- [ ] JSON validates.
- [ ] For H1/H3: script idempotent (2nd run = "skipped" + empty diff).
- [ ] Audit H prints "OK".
- [ ] User confirms: left=Risk, right=Safe in Curve scene.
- [ ] `fase4/fase-4-completa.md` written with audit output and Playtest
      summary.
