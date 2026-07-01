# Loki Init - Gameplay Engineer Inventory - Runtime surfaces

Source index: [inventory.md](inventory.md)

## Runtime surfaces

| Surface | Evidencia | Risco/validacao |
| --- | --- | --- |
| Common Events paralelos | CE6, CE7, CE10, CE13, CE16 usam trigger 2 e switch 100. | Ordem de execucao, starvation, fila e locks sao `runtime-pending`. |
| Common Event child calls | `code:117` liga CE5->CE3, CE7->CE19/8/9, CE10->CE11, CE11->CE14, CE12->CE15/18, CE18->CE19, CE19->CE5. | `command117` sincronico e citado como invariante nos docs; sem engine source nesta execucao. |
| Script calls inline | CEs usam scripts para helper, variables, picture callback, input e clear reservation. | Syntax de JSON parse ok; sem execucao runtime. |
| Pictures/UI | Preload CE3, renderer CE8/CE9, HUD CE6, resultado CE19 usam Show/Move/Erase Picture e TextPicture. | Visual fit, layers, cleanup e loading exigem Playtest. |
| Audio | CE5 BGM `darkeletronic`; CE11 SE `freada`/`Up1`; CE15 SE; CE19 ME `Victory1`/`Defeat1`. | Playback/mix/timing nao validado. |
| Input | ButtonPicture picture IDs e `EV_KeyInput`; helper W/S/A/D. | Input lock e prioridade de eventos nao validados. |
| Transfers | CE19 transfere para map IDs 5, 13 e 16; start map e ID 11 `Prologo`. | Reachability e coordenadas nao validadas sem Map JSON/Playtest. |
| Debug/logging | `EnableDebugLogs: true`; helper usa `console.log`, `console.warn`, `console[level]`. | Util para Playtest; release readiness depende de decisao futura. |
