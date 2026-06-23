## markdown

## status: pending

<task_context>
<domain>rpg-maker-mz/playtest-validation</domain>
<type>testing</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-4.1</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 4.2: Validate Full Race Routing Matrix

## Source References

- Technical analysis: [Post-Victory Outputs](../analise-integracao-corrida-dialogo.md#saidas-pos-vitoria)
- Technical analysis: [Checklist De Implementacao](../analise-integracao-corrida-dialogo.md#checklist-de-implementacao)
- Map names: `Jhonny/data/MapInfos.json`
- Race map: `Jhonny/data/Map001.json`
- Narrative maps: `Map005`, `Map010`, `Map012`, `Map013`

## Overview

Run the final validation matrix for all race entries, losses, victories, and side-effect cleanup.

<requirements>
- Create a validation script at `builds/fase4/03_validate_race_dialogue_integration.py`.
- The script must parse all touched JSON files and print a routing summary.
- Create a manual Playtest checklist at `interaction/fase4/playtest-routing-matrix.md`.
- Confirm Race 1, Race 2, and Race 3 each handle entry, loss, victory, and cleanup.
- Confirm defeat retry does not leave `Map001` in a dead black-screen state with `SW_RACE_ACTIVE OFF`, no running interpreter, and no bootstrap path.
- Confirm defeat retry does not stall inside `CE3 EV_Preload` before `SW_RACE_ACTIVE` is turned back on.
- Confirm Race 1 and Race 2 victories return to the narrative maps, not directly into Race 3.
- Do not mark the phase complete until the user confirms Playtest behavior.
</requirements>

## Dependencies

- task-4.1

## Subtasks

- [ ] Validate JSON parsing for `Map001`, `Map005`, `Map010`, `Map012`, `Map013`, `CommonEvents`, `System`, and `MapInfos`.
- [ ] Print the configured entry routes and victory routes.
- [ ] Print the configured defeat retry bootstrap summary for CE19/CE18/Map001.
- [ ] Print the configured retry-preload summary for CE3/CE5 around the `SW_RACE_ACTIVE` bootstrap point.
- [ ] Write the Playtest checklist in `interaction/fase4/playtest-routing-matrix.md`.
- [ ] Run or ask the user to run the matrix in RPG Maker MZ Playtest.
- [ ] Record user-confirmed results in `retrospetivas/fase4/`.

## Implementation Details

The validation script is read-only. It should not modify JSON. It exists to catch accidental drift before Playtest.

Required matrix:

```text
Race 1:
  entry: Map010 -> Map001 with VAR_RACE_ID = 1
  loss: stays/restarts on Map001
  win: transfers to Map005

Race 2:
  entry: Map005 -> Map001 with VAR_RACE_ID = 2
  loss: stays/restarts on Map001
  win: transfers to Map013

Race 3:
  entry: Map013 -> Map001 with VAR_RACE_ID = 3
  loss: stays/restarts on Map001
  win: transfers to Map012
```

Additional validation focus:

```text
On any loss:
  pressing Space on the result screen must not leave the player idle on a black Map001
  Map001 must regain a valid bootstrap path for the same race
  the retry must not stop inside preload before the race parallels reactivate

On Race 1 / Race 2 win:
  transfer to the narrative destination is expected
  no automatic jump to Race 3 should occur in Phase 4 validation
```

## visual_validation

In RPG Maker MZ Playtest:

- Starting the game on `Map011` still works normally.
- Race 1 entry, loss, and victory match the matrix.
- Race 2 entry, loss, and victory match the matrix.
- Race 3 entry, loss, and victory match the matrix.
- After every loss, the race restarts instead of leaving the player on a dead black screen.
- After every loss, preload completes and the race HUD/parallels return normally.
- After every victory transfer, no race HUD, buttons, sounds, tint, or delayed input appears on the destination narrative map.

## Success Criteria

- [ ] All touched JSON files parse.
- [ ] The read-only validation script prints the expected route matrix.
- [ ] RPG Maker MZ Playtest loads without runtime errors.
- [ ] User confirms that Race 1 and Race 2 wins go to `Map005` and `Map013`, not directly to Race 3.
- [ ] User confirms that no defeat leaves `Map001` in a dead black-screen state.
- [ ] User confirms that no defeat leaves the retry stalled before `SW_RACE_ACTIVE` turns on again.
- [ ] User confirms the full visual validation matrix.
- [ ] Any residual issue is documented in `retrospetivas/fase4/`.

## Out of Scope

- Do not implement new changes in this validation task unless a separate follow-up task is created.
- Do not tune race balance.
- Do not change narrative dialogue content.

## Execution Notes

- The current validation scope must include the retry-preload path inside `CE3`/`CE5`, not only transfer routing and post-victory cleanup.
- Structural parsing alone is insufficient for this phase until the retry preload stall is fixed and revalidated in Playtest.
