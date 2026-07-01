# Runtime QA Inventory - Summary

Source index: [inventory.md](inventory.md)

## Summary

This inventory covers perceptible runtime surfaces for the RPG Maker MZ game
`Jhonny`, with emphasis on the race core-loop flow, input, visual/audio
feedback, save/load, integration risk, existing validation state, and human
validation gates.

The current evidence is static. No Playtest, browser run, editor run, save/load
exercise, audio playback, input test, picture rendering check, or Common Event
runtime execution was performed in this task. Therefore runtime behavior remains
`runtime-pending` even when files parse and referenced assets exist.

Recommended status:

```yaml
runtime_qa_review:
  summary: "Static runtime QA inventory completed for Jhonny/RPG Maker MZ; perceptible behavior remains pending human Playtest."
  affected_surfaces:
    - "RPG Maker MZ boot and map runtime"
    - "Race Common Events CE3, CE5-CE7, CE10-CE13, CE16, CE18, CE19"
    - "Keyboard input and W/S/A/D helper mapping"
    - "Pictures and TextPicture/ButtonPicture surfaces"
    - "BGM, ME and SE cues used by the race flow"
    - "Autosave, manual save/load and existing save files"
    - "VisuMZ CoreEngine and VNPictureBusts plugin integration"
  persona: "game-dev"
  required_checks:
    - "Boot through local server or RPG Maker MZ Playtest with visible canvas."
    - "Start the race through the documented runtime path."
    - "Exercise safe, risk, hover, timer, crash/failure, result and retry flows."
    - "Confirm input lock prevents gameplay actions during result screen."
    - "Confirm pictures, TextPictures, fades, BGM, ME and SE are perceptible and synchronized."
    - "Save and load before race, during relevant pre/post states, and after result/retry."
  evidence_needed:
    - "Human Playtest path executed."
    - "Observed expected vs actual visual, audio and input behavior."
    - "Snapshot for any black screen, stuck input, missing picture, missing audio or Common Event failure."
    - "Save/load restoration observations for race-adjacent states."
  risks:
    - "Static JSON/plugin evidence cannot prove event timing, input feel, picture visibility, audio mix or save/load compatibility."
    - "Race flow crosses Common Events, plugin commands, helper plugin state, pictures, audio and persisted switches/variables."
    - "Existing save files make compatibility a live QA surface unless declared disposable."
  recommended_status: "pending-human-validation"
  human_question: "Can you run a Playtest covering boot, race start, safe/risk input, result, retry, and save/load, then report expected vs observed behavior?"
```
