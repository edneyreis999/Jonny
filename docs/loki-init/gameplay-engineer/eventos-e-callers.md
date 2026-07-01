# Loki Init - Gameplay Engineer Inventory - Eventos e callers

Source index: [inventory.md](inventory.md)

## Eventos e callers

| CE | Nome | Trigger/switch | Callers observados | Chama | Papel |
| --- | --- | --- | --- | --- | --- |
| 3 | `EV_Preload` | trigger 0 | CE5 | nenhum | Preload estatico de pictures de corrida. |
| 5 | `EV_RaceOrchestrator` | trigger 0 | CE19 | CE3 | Inicializa corrida, thresholds, seed, tentativa e estado base. |
| 6 | `EV_UpdateHud` | trigger 2 / switch 100 | paralelo por switch | nenhum | Atualiza HUD via TextPicture e move barra. |
| 7 | `EV_RaceRenderer` | trigger 2 / switch 100 | paralelo por switch | CE19, CE8, CE9 | Renderiza cena e detecta fim. |
| 8 | `EV_RenderSinal` | trigger 0 | CE7 | nenhum | Mostra sinal e liga pictures aos CEs 11/12. |
| 9 | `EV_RenderCurva` | trigger 0 | CE7 | nenhum | Mostra curva e liga pictures aos CEs 11/12. |
| 10 | `EV_RaceTimer` | trigger 2 / switch 100 | paralelo por switch | CE11 | Decrementa timer e timeout safe. |
| 11 | `EV_OnSafe` | trigger 0 | CE10, CE8/CE9/CE13 por input | CE14 | Resolve acao safe. |
| 12 | `EV_OnRisk` | trigger 0 | CE8/CE9/CE13 por input | CE15, CE18 | Resolve acao risk. |
| 13 | `EV_KeyInput` | trigger 2 / switch 100 | paralelo por switch | reserva CE11/CE12 via script | Input teclado. |
| 14 | `EV_ResolucaoSafe` | trigger 0 | CE11 | nenhum | Resolucao visual/timing safe. |
| 15 | `EV_ResolucaoRiskOK` | trigger 0 | CE12 | nenhum | Resolucao risk bem-sucedido. |
| 16 | `EV_HoverRiskButton` | trigger 2 / switch 100 | paralelo por switch | nenhum | Limpa/atualiza hover de risco. |
| 18 | `EV_Crash` | trigger 0 | CE12 | CE19 | Cleanup e rota de crash/derrota. |
| 19 | `EV_VitoriaCorrida` | trigger 0 | CE7, CE18 | CE5 | Tela de resultado, threshold e progressao/retry. |
