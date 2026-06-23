# Defeat Retry Bootstrap Summary

- Patched file: `/Users/edney/projects/coreto/summer26/Jhonny/data/CommonEvents.json`
- Common Event: `CE19 EV_VitoriaCorrida`
- Defeat branch now reboots through `CE5 EV_RaceOrchestrator` instead of `CE18 EV_Crash`.
- Existing CE19 cleanup before the retry call was preserved.
- `CE18` remains available for direct crash/fail handling during the active race loop.

## Key Commands

- Command 45: `[100, 100, 1]`
- Command 46: `$gameTemp.clearCommonEventReservation();`
- Command 60: `[5]`
