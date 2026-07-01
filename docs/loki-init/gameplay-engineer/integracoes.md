# Loki Init - Gameplay Engineer Inventory - Integracoes

Source index: [inventory.md](inventory.md)

## Integracoes

### Plugins ativos

Fonte: `Jhonny/js/plugins.js`.

| Ordem | Plugin | Status | Relevancia gameplay |
| --- | --- | --- | --- |
| 1 | `TextPicture` | ativo | Renderiza textos de HUD e resultado como pictures. |
| 2 | `ButtonPicture` | ativo | Base para picture clickable usada por safe/risk. |
| 3 | `Jhonny_RaceHelper` | ativo | Helper custom de RNG, input, debug, threshold e transicao. |
| 4 | `VisuMZ_0_CoreEngine` | ativo | Core plugin; parametros observados incluem console/F6 em Playtest e ModernControls. |
| 5 | `VisuMZ_2_VNPictureBusts` | ativo | VN/presentation; sem ownership direto de corrida confirmado neste recorte. |

### `Jhonny_RaceHelper`

Fatos atuais:

- Declara `@command logRaceEvent`.
- Registra `PluginManager.registerCommand(pluginName, "logRaceEvent", logRaceEvent)`.
- Expoe `window.JhonnyRace` com `rollSceneType`, `rollPCena`, `rollD100`, `clamp`, `createPRNG`, `playRaceStartEffect`, `logger`, `logRaceEvent`, `captureRaceState`, `isVictory` e `thresholdFor`.
- Patches `Input.keyMapper` para A/D/S/W.
- Patches `Scene_Map.prototype.update` para `updateJhonnyRaceStartEffect`.
- Captura variaveis 100-121 e switches 100-105 em logs.
- Usa `console.log`/`console.warn`/`console[level]` quando debug esta ativo.

Observacao:

- O header diz que nao implementa logica de jogo, mas thresholds e `isVictory` estao no helper. Isso e uma integracao de regra/tuning a preservar em futuras analises.
