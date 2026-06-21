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

## Hypotheses

| ID | Mechanism                                     | Likelihood |
| -- | --------------------------------------------- | ---------- |
| H1 | `Show Picture` (x, y) coordinates are swapped | High       |
| H2 | The picture file `label_safe.png` actually renders "Risk" (or vice versa) | Low |
| H3 | Conditional `If VAR_SCENE_TYPE == CURVA` is inverted (`!=` vs `==`) | Medium |
| H4 | Opcode numeric drift — a `Show Text`/`Show Picture`/`Conditional Branch` command carries an MV-era or swapped code, so the engine interprets the command differently and renders labels in the wrong order | Medium |
| H5 | Labels are rendered via `TextPicture` with `\V[N]` and the referenced variable is not yet set (or holds the previous scene value) at the moment of the `Show Picture`, baking the wrong text into the picture | Medium |

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
   - Spec §5 (corrected): Direita = Risk, Esquerda = Safe.
   - On a 816×624 screen, "left" is roughly x < 408, "right" is x > 408.
   - If the Risk label has x < 408 and Safe has x > 408, that is the swap
     (i.e., Risk appears on the left when it should appear on the right).
5. **Diagnose H2 (file swap):** Open each candidate picture file in the
   `find` output. Verify the file content matches the file name. (This
   requires visual inspection by the user.)
6. **Diagnose H3 (condition inversion):** Examine the conditional branch
   (code 111) that gates label rendering. Check whether the operation is
   `==` (parameters[4] = 0) for the Curve scene type vs another scene type.
7. **Diagnose H4 (opcode drift):** For every command code referenced by the
   label-rendering CE (e.g. `101` Show Text, `231` Show Picture, `111`
   Conditional Branch, `655` Script Continue), confirm the code-to-handler
   mapping by grepping `Game_Interpreter.prototype.commandNNN` in
   `Jhonny/js/rmmz_objects.js`. Do not trust opcode labels from textual
   dumps — they can carry MV-era codes that silently render differently.
8. **Diagnose H5 (TextPicture bake timing):** If any label uses `TextPicture`
   with a `\V[N]` placeholder, find every write site for variable `N` and
   confirm the variable is set to the intended scene value *before* the
   `Show Picture` command runs. TextPicture bakes the value at `Show Picture`
   time and does not update it afterwards.
9. Write `fase4/diagnosis.md` with:
   - Confirmed hypothesis (H1 / H2 / H3 / H4 / H5).
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
- [ ] Opcode-to-handler mapping for every command in the label CE confirmed
      against `Jhonny/js/rmmz_objects.js` (rejects H4 if all codes match).
- [ ] TextPicture usage (if any) verified against variable write timing
      (rejects H5 if the variable is set before `Show Picture`).
- [ ] One of H1 / H2 / H3 / H4 / H5 confirmed (or marked as best-guess with
      evidence).
- [ ] `fase4/diagnosis.md` written with the change specification.
