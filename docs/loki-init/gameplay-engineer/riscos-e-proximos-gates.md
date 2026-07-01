# Loki Init - Gameplay Engineer Inventory - Riscos e proximos gates

Source index: [inventory.md](inventory.md)

## Riscos e proximos gates

| Risco | Evidencia | Gate necessario |
| --- | --- | --- |
| Drift `sem plugins` vs runtime com TextPicture/ButtonPicture/helper. | Spec de implementacao diz sem plugins; `plugins.js` e CEs usam plugins. | `loki:tech-analysis` antes de refactor ou deploy. |
| Seed declarada vs RNG atual nao deterministico por `VAR_SEED`. | CE5 seta seed; CE7 usa `JhonnyRace.rollSceneType/rollPCena` baseados em `Math.random`. | Decisao tecnica/design + Playtest se determinismo importa. |
| Curva do Diabo reservada vs referencias runtime. | Spec diz fora do MVP; CEs manipulam switch/tipo/assets relacionados. | Revisao de escopo e Playtest de Corrida 3. |
| Save/load em estado intermediario. | `optAutosave: true` + CEs paralelos + locks + transient pictures/audio. | Save/load smoke test e possivel analise com engine source. |
| Input lock e fila de CEs. | CE13 e ButtonPicture podem reservar CE11/12; CE19 limpa reservations. | Playtest focado em duplo input, resultado e retry. |
| Debug logs ativos. | `EnableDebugLogs: true`; helper loga no console. | Decisao release/debug antes de build publico. |
