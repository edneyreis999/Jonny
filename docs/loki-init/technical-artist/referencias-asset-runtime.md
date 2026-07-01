# Loki Init - Technical Artist Inventory - Referencias asset-runtime

Source index: [inventory.md](inventory.md)

## Referencias asset-runtime

Resumo de assets por callers de `Show Picture`:

| Asset runtime | Picture IDs | Callers |
| --- | --- | --- |
| `race/bg_sinal` | 1 | CE3 `EV_Preload`, CE8 `EV_RenderSinal` |
| `race/bg_curva` | 1 | CE3 `EV_Preload`, CE9 `EV_RenderCurva` |
| `race/opala_pov` | 1, 10 | CE3, CE8, CE9 |
| `race/sinal_red` | 1, 11 | CE3, CE8 |
| `race/curva_do_diabo_placa` | 1, 12 | CE3, CE9 |
| `race/btn_parar` | 1, 41 | CE3, CE8 |
| `race/btn_furar` | 1, 42 | CE3, CE8 |
| `race/btn_direita` | 1, 43 | CE3, CE9 |
| `race/btn_esquerda` | 1, 44 | CE3, CE9 |
| `race/bar_consciencia_bg` | 1, 20 | CE3, CE5 |
| `race/bar_consciencia_fill` | 1, 21 | CE3, CE5 |
| `race/bg-ranking` | 51 | CE6 |
| `race/bar_luck_bg` | 58 | CE8, CE9 |
| `race/bar_luck_fill` | 59 | CE8, CE9 |
| `race/timer_bar` | 1 | CE3 preload only |
| `race/overlay_risk_low/med/high` | 1 | CE3 preload only |
| TextPicture runtime-generated | 52, 53, 54, 55, 56, 57, 60, 61, 62, 63 | CE5, CE6, CE8, CE9, CE19 |

CE8 assigns `mzkp_commonEventId = 11` to picture 41 and `= 12` to picture 42.
CE9 assigns `mzkp_commonEventId = 12` to picture 43 and `= 11` to picture 44.
This creates a runtime boundary between button artwork and gameplay Common
Events via `ButtonPicture`/picture metadata.
