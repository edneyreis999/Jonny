---
status: pending
phase: 2
task_id: 2.1
---

# Task 2.1 — Inventory ME Assets and Pick a Non-Victory ME

## Objective

List the available ME assets in `Jhonny/audio/me/`, identify the existing
Victory ME (so it can be excluded), and select a non-Victory ME to use for
the defeat branch in CE 19.

## Dependencies

- task-1.3 — Phase 1 must be complete; the CE 19 top has been modified, so
  this task reads the post-Phase-1 state.

## References

- Implementation Guide §3.4 (Asset Inventory).
- Implementation Guide §3.3 Option A (Branch on outcome, distinct ME).
- User decision (session 2026-06-19): if no canonical Defeat ME exists, the
  executor picks any non-Victory `.ogg` file in `audio/me/`. This is an
  explicit override of the guide's default "block and ask" recommendation.

## Step-by-step

1. List the ME folder:
   ```
   ls -la Jhonny/audio/me/
   ```
2. Identify which file is currently used as the Victory audio. Inspect
   **CE 19 cmd[6]**: it is a `PlaySE` command (**code 249**, not Play ME /
   code 246) with `parameters[0].name = "Victory1"`. The asset
   `Victory1.ogg` lives in `audio/me/` only — there is no copy in
   `audio/se/`. This folder mismatch means the current PlaySE command
   cannot resolve the file through the SE channel; Phase 2 Patch H
   converts the command to `Play ME` (code 246) so the file resolves
   through the ME channel and the implementation-guide §3.2 BGM-resume
   semantics apply. Record `Victory1` as the Victory ME name to be
   excluded from defeat candidates.
3. Confirm the candidate defeat ME file:
   - If a file named like `Defeat.*`, `Gameover.*`, `Lose.*` exists → use it.
   - Otherwise, pick any `.ogg` file in `audio/me/` whose name is not the
     Victory ME. Prefer names that suggest loss/somber tone if available
     (e.g. `Shock1`, `Mystery`, `Sad`); record the choice and the reason.
   - **Canonical preference:** `System.json` declares
     `defeatMe = {"name": "Defeat1", ...}`, so `Defeat1.ogg` is the
     system-canonical defeat ME and wins over `Defeat2` / `Gameover1` /
     `Gameover2` when more than one candidate matches.
4. Write the choice to `fase2/me-asset-choice.md`:
   - Victory ME name (for exclusion in the next task).
   - Chosen Defeat ME name.
   - File path under `Jhonny/audio/me/`.
   - Rationale (one sentence).

## visual_validation

This is an inventory task — no game-visible change. The validation is the
existence of `fase2/me-asset-choice.md` with a named Defeat ME file that
exists on disk.

## Definition of Done

- [ ] `ls Jhonny/audio/me/` output captured.
- [ ] Victory ME name identified from CE 19 cmd[6] (currently `Victory1`
      via PlaySE code 249 — Phase 2 will convert to Play ME code 246).
- [ ] Defeat ME chosen (canonical `Defeat1` preferred; otherwise any
      non-Victory file).
- [ ] `fase2/me-asset-choice.md` written with all four fields.
- [ ] Chosen ME file exists on disk (`test -f`).
