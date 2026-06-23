# CE19 Cleanup Summary

- Common Event: CE19 `EV_VitoriaCorrida`
- Command count: 63

## Cleanup Checks

- Command 4 now erases pictures with script: `for (let i = 1; i <= 61; i++) $gameScreen.erasePicture(i);`
- Command 45 turns `SW_RACE_ACTIVE` OFF with parameters `[100, 100, 1]`.
- Command 46 clears reserved Common Events with script: `$gameTemp.clearCommonEventReservation();`
- Command 44 still resets tint with parameters `[[0, 0, 0, 0], 6, False]`.
- Command 5 still fades out BGM with parameters `[1]`.

## Victory Transfers

- Command 49: `Transfer Player [0, 5, 3, 2, 0, 0]`
- Command 52: `Transfer Player [0, 13, 4, 5, 0, 0]`
- Command 55: `Transfer Player [0, 12, 0, 0, 0, 0]`
