# Loki Init - Game Designer Inventory - Sistemas afetados e superficies de balanceamento

Source index: [inventory.md](inventory.md)

## Sistemas afetados e superficies de balanceamento

| Sistema | Superficie de tuning | Estado atual |
| --- | --- | --- |
| Dificuldade temporal | Timer sinal 240 frames, curva 210 frames; sugestoes de encurtar na corrida 3 marcadas como Playtest. | Configurado em CE7; ajuste futuro exige Playtest. |
| Economia de risco | Safe `+10/+10`; risk `taxa=C+P`, custo `P`, recompensa `P*2`. | Implementado em CE11/CE12. |
| Distribuicao procedural | Tipo via `JhonnyRace.rollSceneType()`; `P_cena` via `JhonnyRace.rollPCena()`. | Chamadas existem em CE7; sem leitura do plugin nesta tarefa. |
| Thresholds | 200/400/600, `VAR_GLORIA_META` em 119. | Implementado por CE5/CE19; fairness pendente. |
| Restart | Nova seed no CE5; `EV_Crash` chama CE19 segundo parse atual. | Fluxo exato de retry requer runtime/tech-analysis. |
| Curva do Diabo | Switch 105 e branch CE7 para corrida 3 cena 9. | Conflito com nota de MVP adiado; precisa decisao antes de mexer. |
| UI/HUD | Pictures/TextPictures, ids 22-24, 52-56, 5 e HUD. | Inventariado parcialmente; assets nao foram lidos. |
| Input | CE13 usa setas; docs tambem citam W/S/A/D e mouse. | Teclado por setas confirmado; mouse/WASD dependem de surfaces nao lidas. |
