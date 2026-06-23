# Defeat Retry Bootstrap Audit

## Scope

- Target Common Events: `CE5`, `CE18`, `CE19`
- Target map event: `Map001` event `1` `Init Corrida`

## Map001 Bootstrap

- Page 1: trigger `3`, variable condition `100` = `1`
  - Command 0: code `117`, parameters `[5]`
  - Command 1: code `214`, parameters `[]`
- Page 2: trigger `3`, variable condition `100` = `2`
  - Command 0: code `117`, parameters `[5]`
  - Command 1: code `214`, parameters `[]`
- Page 3: trigger `3`, variable condition `100` = `3`
  - Command 0: code `117`, parameters `[5]`
  - Command 1: code `214`, parameters `[]`

## CE19 Defeat Handoff

- CE19 name: `EV_VitoriaCorrida`
- CE19 command count: `63`
- Defeat handoff currently occurs at command `60`.

### Cleanup Before Handoff

- Command 38: code `121`, indent `0`, parameters `[104, 104, 1]`
- Command 39: code `235`, indent `0`, parameters `[5]`
- Command 40: code `235`, indent `0`, parameters `[53]`
- Command 41: code `235`, indent `0`, parameters `[56]`
- Command 42: code `235`, indent `0`, parameters `[54]`
- Command 43: code `235`, indent `0`, parameters `[55]`
- Command 44: code `223`, indent `0`, parameters `[[0, 0, 0, 0], 6, False]`
- Command 45: code `121`, indent `0`, parameters `[100, 100, 1]`
- Command 46: code `355`, indent `0`, parameters `['$gameTemp.clearCommonEventReservation();']`

### Current Defeat Branch

- Command 59: code `411`, indent `0`, parameters `[]`
- Command 60: code `117`, indent `1`, parameters `[18]`
- Command 61: code `412`, indent `0`, parameters `[]`

## CE18 Retry Behavior

- CE18 name: `EV_Crash`

- Command 8: code `122`, indent `0`, parameters `[104, 104, 0, 0, 0]`
- Command 9: code `122`, indent `0`, parameters `[105, 105, 0, 0, 0]`
- Command 10: code `122`, indent `0`, parameters `[101, 101, 0, 0, 0]`
- Command 11: code `122`, indent `0`, parameters `[113, 113, 0, 0, -1]`
- Command 12: code `122`, indent `0`, parameters `[108, 108, 0, 0, 240]`
- Command 13: code `122`, indent `0`, parameters `[106, 106, 0, 0, 0]`
- Command 14: code `122`, indent `0`, parameters `[107, 107, 0, 0, 0]`
- Command 15: code `122`, indent `0`, parameters `[117, 117, 0, 0, 0]`
- Command 16: code `122`, indent `0`, parameters `[112, 112, 1, 0, 1]`
- Command 17: code `355`, indent `0`, parameters `['$gameVariables.setValue(110, Math.floor(Math.random() * 1000000000));']`
- Command 18: code `121`, indent `0`, parameters `[102, 102, 1]`
- Command 19: code `121`, indent `0`, parameters `[101, 101, 1]`
- Command 20: code `121`, indent `0`, parameters `[103, 103, 1]`
- Command 21: code `355`, indent `0`, parameters `['for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);']`
- Command 22: code `235`, indent `0`, parameters `[32]`
- Command 23: code `223`, indent `0`, parameters `[[0, 0, 0, 0], 12, False]`
- Command 24: code `117`, indent `0`, parameters `[8]`
- Command 25: code `230`, indent `0`, parameters `[6]`

## CE5 Canonical Rebootstrap

- CE5 name: `EV_RaceOrchestrator`
- CE5 attempt increment command: Command 4: code `122`, indent `0`, parameters `[112, 112, 1, 0, 1]`
- CE5 race activation command: Command 20: code `121`, indent `0`, parameters `[100, 100, 0]`
- CE5 preload command: Command 19: code `117`, indent `0`, parameters `[3]`

## Findings

- `Map001` still boots the race through an autorun event followed by `Erase Event`.
- `CE19` already performs the necessary post-result cleanup before deciding victory or defeat.
- The current defeat branch delegates to `CE18`, which was designed for in-race crash recovery rather than post-result retry.
- Rebooting the race through `CE5` avoids depending on the erased `Map001` autorun during the same map load.

## Recommended Patch

- Replace the post-result defeat handoff in `CE19` from `Call Common Event 18` to `Call Common Event 5`.
- Keep `CE18` unchanged for direct crash/fail states that happen during the active race loop.
- Preserve the existing CE19 cleanup block before the retry call.

