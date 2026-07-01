# Loki Init - Technical Artist Inventory - Animacoes, efeitos e feedback visual

Source index: [inventory.md](inventory.md)

## Animacoes, efeitos e feedback visual

Common Events do not contain `Show Animation` command `212` in the inspected
data. Visual feedback is represented by:

- `Show Picture` / `Erase Picture` for scene composition and cleanup.
- `Tint Screen` command `223`: startup fade, safe tint, risk tint, victory tint.
- `Shake Screen` command `225`: one inspected use in CE15 `EV_ResolucaoRiskOK`
  with parameters `[3, 5, 8, false]`.
- `Wait` command `230`: preload waits, transition waits and frame pacing.
- `TextPicture set`: HUD text, percentages, timer, scene count, victory/defeat
  copy and instructions.
- Plugin command `VisuMZ_2_VNPictureBusts`: CEs 20-23 apply tone and scale
  states to VN bust picture IDs 1-4.

Docs describe richer visual intent: signal pulse, risk hover red flash,
safe/risk flashes, motion blur, crash shake, particles/fume, fade to black,
Curva do Diabo plaque and visual communication of `P_cena`. Static data confirms
some tint/shake/picture infrastructure, but not the full authored motion,
particle or readability behavior.
