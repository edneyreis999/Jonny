# Loki Init - Scene Presentation Designer Inventory - Timing e Cues

Source index: [presentation-inventory.md](presentation-inventory.md)

## Timing e Cues

| Superficie | Timing/cue documentado | Evidencia estatica em eventos |
| --- | --- | --- |
| Setup | 0,3s, fundo + botoes imediatamente | CE8/CE9 mostram background, POV, barras e botoes sem wait interno. |
| Input Sinal | 4,0s | Doc core loop; timer runtime em CE10, valor exato nao validado neste inventario. |
| Input Curva | 3,5s | Doc core loop; timer runtime em CE10, valor exato nao validado neste inventario. |
| Resolucao safe | 0,4s no spec | CE14 tem `Wait 12` frames e tints. |
| Resolucao risk sucesso | 0,4s no spec | CE15 tem shake, SE `pneu_cantando` e `Wait 18` frames. |
| Transicao | 0,2s no spec | CE7 apaga pictures de cena; CE5/CE14/CE15 usam waits/tints. Sincronia nao validada. |
| Resultado | Aguarda confirmacao | CE19 aguarda input no proprio CE, usa `SW_INPUT_LOCKED`, toca ME e limpa pictures. |
| Preload | 1 frame por asset | CE3 alterna Show Picture, `Wait 1`, Erase Picture. |

Audio cues observados:

- CE5: BGM `darkeletronic`, volume 90, pitch 100.
- CE11: SE `freada` e `Up1`.
- CE15: SE `pneu_cantando`.
- CE19: fadeout BGM, ME `Victory1` e `Defeat1`.

Audio cues documentados mas nao confirmados como comandos nos CEs lidos: motor subindo/caindo RPM, impacto metalico, ticks finais do timer, respiracao de restart, baixo caindo na Curva do Diabo.
