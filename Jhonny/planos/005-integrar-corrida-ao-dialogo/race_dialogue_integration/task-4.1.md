## markdown

## status: pending

<task_context>
<domain>rpg-maker-mz/data-json/maps</domain>
<type>integration</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-3.2</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 4.1: Audit and Patch Map013 Race 3 Markers

## Source References

- Technical analysis: [Entry Points Identified](../analise-integracao-corrida-dialogo.md#pontos-de-entrada-identificados)
- Target file: `Jhonny/data/Map013.json`
- Confirmed marker text: `JOGADOR VAI PARA A CORRIDA`
- Current executable transfer evidence: command `7082` transfers to `Map006`; command `7107` transfers to `Map012`
- Required behavior: confirmed race markers set `VAR_RACE_ID = 3` and transfer to `Map001`

## Overview

Audit every `Map013` marker that says the player goes to the race, then patch confirmed executable Race 3 entry points so they enter `Map001`.

<requirements>
- Create a saved audit script at `builds/fase4/01_audit_map013_race3_markers.py`.
- Create a saved mutation script at `builds/fase4/02_patch_map013_race3_markers.py`.
- The audit script must list every `JOGADOR VAI PARA A CORRIDA` marker with surrounding command indexes, indent, and nearby executable commands.
- Patch executable race markers to set `VAR_RACE_ID = 3` and transfer to `Map001`.
- Do not blindly insert commands at comment-only markers unless the audit script can identify an unambiguous insertion point.
- Preserve branch indentation and event command order.
</requirements>

## Dependencies

- task-3.2

## Subtasks

- [ ] Run the audit script and save its report to `interaction/fase4/map013-race3-marker-audit.md`.
- [ ] Confirm every marker has a safe executable insertion or replacement point.
- [ ] Patch known executable transfer points first.
- [ ] For comment-only markers, insert commands only where the audit identifies the exact branch and insertion index.
- [ ] Assert inserted commands set `VAR_RACE_ID = 3` before transferring.
- [ ] Re-read `Map013.json` and print every patched marker summary.

## Implementation Details

The mutation script must treat `Map013` as high-risk because it has a large single event with many branches. If a marker's insertion point is ambiguous, leave it unchanged and document it in the audit report instead of guessing.

Expected command intent:

```text
near each confirmed "JOGADOR VAI PARA A CORRIDA" marker:
  Control Variables: VAR_RACE_ID = 3
  Transfer Player: Map001
```

## visual_validation

In RPG Maker MZ Playtest:

- Reach a confirmed `Map013` marker that says the player goes to the race.
- The player should transfer to `Map001`.
- Race 3 should start and the player should remain on the race map.
- The player should not transfer directly to `Map006` or `Map012` before winning the race.

## Success Criteria

- [ ] `Map013.json` parses after the scripts run.
- [ ] Every patched marker sets `VAR_RACE_ID = 3`.
- [ ] Every patched marker transfers to `Map001`.
- [ ] Ambiguous comment-only markers are documented, not guessed.
- [ ] User confirms at least one Race 3 marker works in Playtest.

## Out of Scope

- Do not change Race 1 or Race 2 entries.
- Do not change CE19 routing unless a blocking mismatch is found.
- Do not rewrite the full `Map013` event.
