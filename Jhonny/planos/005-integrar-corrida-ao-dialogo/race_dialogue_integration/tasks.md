# Implementation Task Plan - Race Dialogue Integration

## Source References

- Technical analysis: [analise-integracao-corrida-dialogo.md](../analise-integracao-corrida-dialogo.md)
- Project guidance: [Jhonny/CLAUDE.md](../../../../CLAUDE.md)
- RPG Maker MZ data workflow: `rpg-maker-mz-data-json` skill, `references/workflow.md`

This plan integrates the isolated race minigame on `Map001` with the narrative maps. The race map must own the active race loop, narrative maps must only choose the correct `VAR_RACE_ID` and transfer into `Map001`, and victory must be the only path that exits the race. Each phase is designed for visible RPG Maker MZ Playtest validation before the next phase begins.

## Phases

### Phase 1 - Map001 Race Containment

**Objective:** Stop `Map001` from transferring the player out immediately after starting `EV_RaceOrchestrator`.

**Visual validation:** entering `Map001` with `VAR_RACE_ID` set to `1`, `2`, or `3` starts the race loop and keeps the player on the race map instead of instantly transferring to `Map005`, `Map013`, or `Map012`.

**Implementation status:** complete structurally; RPG Maker MZ Playtest confirmation is still required.

- [x] task-1.1 - Audit and patch `Map001` race containment

### Phase 2 - Race 1 and Race 2 Narrative Entries

**Objective:** Route confirmed narrative entry points from `Map010` and `Map005` into `Map001` with the correct race ID.

**Visual validation:** the known dialogue marker on `Map010` starts Race 1 on `Map001`, and the known dialogue marker on `Map005` starts Race 2 on `Map001`; in both cases the player remains in the race loop.

**Implementation status:** complete structurally; RPG Maker MZ Playtest confirmation is still required.

- [x] task-2.1 - Wire `Map010` Race 1 entry
- [x] task-2.2 - Wire `Map005` Race 2 entry

### Phase 3 - Victory, Defeat, and Cleanup Lifecycle

**Objective:** Move race exit ownership to `EV_VitoriaCorrida`, keep defeat inside `Map001`, and clean race side effects before any narrative transfer.

**Visual validation:** losing a race restarts the same race on `Map001`; winning Race 1 transfers to `Map005`, winning Race 2 transfers to `Map013`, and no race HUD/buttons/audio continue on the narrative map.

- [ ] task-3.1 - Update `EV_VitoriaCorrida` victory and defeat routing
- [ ] task-3.2 - Add and validate race cleanup before narrative transfer

### Phase 4 - Race 3 Map013 Integration

**Objective:** Convert confirmed `Map013` race markers into Race 3 entries and verify the final post-victory transfer to `Map012`.

**Visual validation:** confirmed `Map013` markers start Race 3 on `Map001`; losing keeps retrying Race 3; winning transfers to `Map012` with no race state leaking into the dialogue map.

- [ ] task-4.1 - Audit and patch `Map013` Race 3 markers
- [ ] task-4.2 - Validate full race routing matrix

## Task Matrix

| ID | Title | Phase | Dependencies | Estimate |
| --- | --- | --- | --- | --- |
| task-1.1 | Audit and patch `Map001` race containment | 1 | none | 2-4h |
| task-2.1 | Wire `Map010` Race 1 entry | 2 | task-1.1 | 2-4h |
| task-2.2 | Wire `Map005` Race 2 entry | 2 | task-1.1 | 2-4h |
| task-3.1 | Update `EV_VitoriaCorrida` victory and defeat routing | 3 | task-2.1, task-2.2 | 2-4h |
| task-3.2 | Add and validate race cleanup before narrative transfer | 3 | task-3.1 | 2-4h |
| task-4.1 | Audit and patch `Map013` Race 3 markers | 4 | task-3.2 | 2-4h |
| task-4.2 | Validate full race routing matrix | 4 | task-4.1 | 2-4h |

## Recommended Execution Order

```text
task-1.1
  -> task-2.1
  -> task-2.2
  -> task-3.1
  -> task-3.2
  -> task-4.1
  -> task-4.2
```

`task-2.1` and `task-2.2` are independent after `task-1.1`, but both should be completed before the Phase 3 lifecycle work.

## Global Implementation Rules

- Do not edit `data/*.json` directly.
- Every JSON mutation must be made by a saved Python script under `builds/faseN/`.
- Each mutation script must load UTF-8 JSON, assert current preconditions, mutate only intended records, write with stable formatting, re-read the file, and print validation output.
- Leave every mutation script on disk as an audit artifact.
- Runtime behavior is not fully validated until the user confirms RPG Maker MZ Playtest results.

## Final Acceptance Criteria

- [ ] RPG Maker MZ loads the project without JSON parse errors.
- [ ] Player start on `Map011` remains unchanged.
- [x] `Map010` marker structurally targets Race 1 on `Map001`.
- [x] `Map005` marker structurally targets Race 2 on `Map001`.
- [ ] Confirmed `Map013` markers start Race 3 on `Map001`.
- [ ] Losing any race never transfers out of `Map001` and never advances `VAR_RACE_ID`.
- [ ] Winning Race 1 transfers to `Map005`.
- [ ] Winning Race 2 transfers to `Map013`.
- [ ] Winning Race 3 transfers to `Map012`.
- [ ] `SW_RACE_ACTIVE`, race pictures, race audio, and queued race inputs do not leak into narrative maps.
