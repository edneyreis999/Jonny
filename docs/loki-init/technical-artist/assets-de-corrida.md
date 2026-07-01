# Loki Init - Technical Artist Inventory - Assets de corrida

Source index: [inventory.md](inventory.md)

## Assets de corrida

`Jhonny/img/pictures/race/` lista 21 PNGs:

- `!opala_pov.png`
- `bar_consciencia_bg.png`
- `bar_consciencia_fill.png`
- `bar_luck_bg.png`
- `bar_luck_fill.png`
- `bg-ranking.png`
- `bg_curva.png`
- `bg_sinal.png`
- `btn_direita.png`
- `btn_esquerda.png`
- `btn_furar.png`
- `btn_parar.png`
- `curva_do_diabo_placa.png`
- `opala_pov.png`
- `overlay_flash_white.png`
- `overlay_risk_high.png`
- `overlay_risk_low.png`
- `overlay_risk_med.png`
- `placa_curva_dir.png`
- `sinal_red.png`
- `timer_bar.png`

Cross-check estatico contra `Show Picture` em `CommonEvents.json`:

| Status | Assets |
| --- | --- |
| Referenciados e encontrados | `race/bar_consciencia_bg`, `race/bar_consciencia_fill`, `race/bar_luck_bg`, `race/bar_luck_fill`, `race/bg-ranking`, `race/bg_curva`, `race/bg_sinal`, `race/btn_direita`, `race/btn_esquerda`, `race/btn_furar`, `race/btn_parar`, `race/curva_do_diabo_placa`, `race/opala_pov`, `race/overlay_risk_high`, `race/overlay_risk_low`, `race/overlay_risk_med`, `race/placa_curva_dir`, `race/sinal_red`, `race/timer_bar` |
| Referenciados e ausentes | nenhum nas fontes lidas |
| Listados mas nao referenciados por `Show Picture` nos Common Events lidos | `race/!opala_pov`, `race/overlay_flash_white` |

Observacao: `placa_curva_dir.png` aparece em docs como asset criado para fase
futura/MVP adiado, mas o CE3 `EV_Preload` ainda referencia `race/placa_curva_dir`.
Isso e uma divergencia estatica entre doc de MVP e preload runtime, nao uma
falha visual validada.
