# Runtime QA Inventory - Runtime QA Checklist

Source index: [inventory.md](inventory.md)

## Runtime QA Checklist

Minimum human Playtest path:

1. Boot the game through local server or RPG Maker MZ Playtest with the canvas
   visible.
2. Start a new game from map 11 and reach the race entry path.
3. Confirm race preload/transition shows expected pictures/fade/flash without
   blank or stale screen.
4. Exercise keyboard input: arrows and W/S/A/D where applicable.
5. Exercise safe action, risk action, hover, timer timeout and crash/failure.
6. Confirm BGM, SE and ME cues play with acceptable timing and no missing cue.
7. Reach victory and defeat/result screen branches.
8. Confirm `SW_INPUT_LOCKED` behavior perceptibly: gameplay inputs do not fire
   during result, while OK/space confirmation still works.
9. Confirm retry does not repeat the VN/preload path unexpectedly and does not
   leave stale pictures/audio/tint/input lock.
10. Save/load smoke: before race, after race result, after retry or transfer,
    and continue from title using existing save files if they are in scope.

For any failure, capture the snapshot from `RPG Maker MZ - Debug Playtest`
before editing.
