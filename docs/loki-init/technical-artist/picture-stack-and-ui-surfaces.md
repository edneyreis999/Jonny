# Loki Init - Technical Artist Inventory - Picture stack and UI surfaces

Source index: [inventory.md](inventory.md)

## Picture stack and UI surfaces

Known picture ID bands from Common Events:

| Surface | IDs | Evidence |
| --- | --- | --- |
| Main race background | 1 | CE8/CE9, also reused by CE3 preload |
| Car/scene signage | 10-12 | `opala_pov`, `sinal_red`, `curva_do_diabo_placa` |
| Consciousness bar | 20-21 plus TextPicture 60 | CE5, CE6 |
| Risk overlays | 22-24 erased in CE16 but only preloaded as assets in CE3 | Potential ownership gap: no `Show Picture` found for IDs 22-24 in inspected Common Events |
| Action buttons | 41-44 | CE8/CE9 button pictures |
| Ranking/result/HUD | 51-63 | CE6 and CE19 TextPictures and `bg-ranking` |
| Cleanup | 1-63 | CE18 and CE19 scripts erase picture range defensively |

Static risk: the runtime uses many concurrent picture IDs on a 1280x720 screen,
including generated text pictures and image pictures. Without runtime capture,
layer order, overlap, input hitboxes, cleanup timing and readability remain
unknown.
