---
status: pending
phase: 4
task_id: 4.1
---

# Task 4.1 — Diagnose Curve Label Inversion (H1 vs H2 vs H3)

## Objective

Inspect the renderer CE that shows Risk/Safe labels in the Curve scene and
determine which of the three hypotheses (coord swap, file swap, condition
inversion) explains the inverted labels. The chosen hypothesis drives whether
task 4.2 uses a direct edit or a Python generator.

## Dependencies

- task-3.3 — Phase 3 must be complete. The HUD CE is in place.

## References

- Implementation Guide §5.1 (Symptom Analysis).
- Implementation Guide §5.2 (Verification Procedure) — the four diagnostic
  commands.
- Spec `Corrida - Core Loop.md` §5 — Direita = Safe, Esquerda = Risk.

## Hypotheses

| ID | Mechanism                                     | Likelihood |
| -- | --------------------------------------------- | ---------- |
| H1 | `Show Picture` (x, y) coordinates are swapped | High       |
| H2 | The picture file `label_safe.png` actually renders "Risk" (or vice versa) | Low |
| H3 | Conditional `If VAR_SCENE_TYPE == CURVA` is inverted (`!=` vs `==`) | Medium |

## Step-by-step

1. Find Show Picture commands referencing Risk/Safe labels:
   ```
   rg -n "Risk|Safe|risk|safe" Jhonny/data/CommonEvents.json | head -30
   ```
2. Find picture files matching label / risk / safe:
   ```
   find Jhonny/img/pictures -name "*label*" -o -name "*risk*" -o -name "*safe*" 2>/dev/null
   ```
3. For each CE that shows a Risk or Safe label, dump the Show Picture
   command (code 231) and capture `parameters`: picture ID, picture name,
   origin, x, y, width, height, opacity, blend mode.
4. **Diagnose H1 (coord swap):** Are the Risk label x-coordinate and the
   Safe label x-coordinate swapped relative to their semantic meaning?
   - Spec §5: Direita = Safe, Esquerda = Risk.
   - On a 816×624 screen, "left" is roughly x < 408, "right" is x > 408.
   - If the Safe label has x < 408 and Risk has x > 408, that is the swap.
5. **Diagnose H2 (file swap):** Open each candidate picture file in the
   `find` output. Verify the file content matches the file name. (This
   requires visual inspection by the user.)
6. **Diagnose H3 (condition inversion):** Examine the conditional branch
   (code 111) that gates label rendering. Check whether the operation is
   `==` (parameters[4] = 0) for the Curve scene type vs another scene type.
7. Write `fase4/diagnosis.md` with:
   - Confirmed hypothesis (H1 / H2 / H3).
   - Exact CE index and command index that needs to change.
   - Old value, new value.
   - Recommended implementation (direct edit vs generator).

## visual_validation

Discovery task. Validation is `fase4/diagnosis.md` existing with one
confirmed hypothesis and the exact command index to change. If the
diagnosis is ambiguous, mark the recommended hypothesis as "best guess"
with a fallback Playtest.

## Definition of Done

- [ ] `rg Risk|Safe` output captured.
- [ ] All Show Picture commands for Risk/Safe labels dumped.
- [ ] One of H1 / H2 / H3 confirmed (or marked as best-guess with evidence).
- [ ] `fase4/diagnosis.md` written with the change specification.
