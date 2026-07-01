# Loki Init - Scene Presentation Designer Inventory - Picture Ownership

Source index: [presentation-inventory.md](presentation-inventory.md)

## Picture Ownership

| Picture ID | Owner/uso observado | Asset/texto | Fonte |
| --- | --- | --- | --- |
| 1 | Background de cena e preload temporario | `race/bg_sinal`, `race/bg_curva` e outros no preload | CE3, CE8, CE9 |
| 5 | Resultado/cleanup defensivo | Apagado por CE19; spec menciona fundo de vitoria/derrota, mas asset nao apareceu nos comandos lidos | CE19, doc core loop |
| 10 | Opala POV | `race/opala_pov` | CE7, CE8, CE9 |
| 11 | Sinal vermelho | `race/sinal_red` | CE7, CE8 |
| 12 | Placa Curva do Diabo condicional | `race/curva_do_diabo_placa` quando switch 105 ON | CE7, CE9 |
| 20 | Barra de consciencia fundo | `race/bar_consciencia_bg` | CE5 |
| 21 | Barra de consciencia fill | `race/bar_consciencia_fill` | CE5 |
| 41 | Botao safe do sinal | `race/btn_parar`, script atribui CE11 | CE7, CE8 |
| 42 | Botao risk do sinal | `race/btn_furar`, script atribui CE12 | CE7, CE8 |
| 43 | Botao risk da curva | `race/btn_direita`, script atribui CE12 | CE7, CE9 |
| 44 | Botao safe da curva | `race/btn_esquerda`, script atribui CE11 | CE7, CE9 |
| 51 | Painel/ranking HUD | `race/bg-ranking` | CE6 |
| 52 | Tentativa | TextPicture `TRIAL \V[112]` | CE6 |
| 53 | Resultado vitoria | TextPicture `\C[6]VICTORY!` | CE19 |
| 54 | Pontos | TextPicture `Glory Score: \V[105]` | CE19 |
| 55 | Prompt | TextPicture `Press [SPACE] to continue` | CE19 |
| 56 | Resultado derrota | TextPicture `\C[18]DEFEAT!` | CE19 |
| 57 | Score HUD | TextPicture `GLORY: \V[105]/\V[119]` | CE6 |
| 58 | Barra de luck/probabilidade fundo | `race/bar_luck_bg` | CE8, CE9 |
| 59 | Barra de luck/probabilidade fill | `race/bar_luck_fill` | CE8, CE9 |
| 60 | Consciencia textual | TextPicture `\V[104]%` | CE5, CE6 |
| 61 | `P_cena` textual | TextPicture `\V[103]%` | CE8, CE9 |
| 62 | Timer textual | TextPicture `TIMER: \V[120]s` | CE6 |
| 63 | Progresso de cena | TextPicture `\V[121]/\V[111]` | CE6 |

Observacoes:

- Picture IDs 41-44 tambem sao superficie de input por script inline `mzkp_commonEventId`.
- O spec diz que `P_cena` nao deve ser mostrado numericamente, mas CE8/CE9 mostram `\V[103]%` no Picture 61. Isso e drift factual entre intencao documentada e runtime estatico, nao validacao de UX.
- Todos os assets de picture referenciados por comandos `Show Picture` em Common Events existem no listing de `Jhonny/img/pictures/race/`.
- Assets listados mas nao referenciados nos Common Events lidos: `race/!opala_pov` e `race/overlay_flash_white`.
