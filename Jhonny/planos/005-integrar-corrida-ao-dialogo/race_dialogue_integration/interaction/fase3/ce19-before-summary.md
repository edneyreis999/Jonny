# CE19 Before Summary

- Common Event: CE19 `EV_VitoriaCorrida`
- Command count: 59
- Command codes: [121, 121, 357, 657, 355, 242, 355, 655, 655, 655, 655, 111, 249, 411, 249, 412, 223, 108, 111, 357, 657, 231, 411, 357, 657, 231, 412, 357, 657, 231, 357, 657, 231, 118, 111, 230, 119, 412, 121, 235, 235, 235, 235, 235, 223, 111, 111, 122, 117, 411, 108, 118, 230, 119, 412, 411, 117, 412, 0]

## Routing Findings

- Command 47: increments `VAR_RACE_ID` with parameters `[100, 100, 1, 0, 1]`.
- Command 48: calls CE5 `EV_RaceOrchestrator`, causing victory auto-advance.
- Command 51: starts the final `FIM_LOOP` branch used by Race 3 victory.
- Command 56: calls CE18 `EV_Crash`, which is the existing defeat retry path.

## Expected Routing Targets

- Race 1 victory -> `Transfer Player [0, 5, 3, 2, 0, 0]`
- Race 2 victory -> `Transfer Player [0, 13, 4, 5, 0, 0]`
- Race 3 victory -> `Transfer Player [0, 12, 0, 0, 0, 0]`
- Defeat remains on `Map001` through CE18.

