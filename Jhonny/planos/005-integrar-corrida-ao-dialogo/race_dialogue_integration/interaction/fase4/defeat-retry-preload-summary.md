# Defeat Retry Preload Summary

- Patched file: `/Users/edney/projects/coreto/summer26/Jhonny/data/CommonEvents.json`
- Common Event: `CE5 EV_RaceOrchestrator`
- Added a guard so `CE3 EV_Preload` runs only when `V[112] <= 1`.
- Retry attempts now skip the preload child interpreter and continue directly to `SW_RACE_ACTIVE ON`.
- Cold bootstrap still keeps the original preload call before the race loops reactivate.

## Key Commands

- Command 19: `[1, 112, 0, 1, 2]`
- Command 20: `[3]`
- Command 21: `[]`
- Command 22: `[100, 100, 0]`
