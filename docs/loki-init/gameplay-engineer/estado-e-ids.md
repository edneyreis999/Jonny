# Loki Init - Gameplay Engineer Inventory - Estado e IDs

Source index: [inventory.md](inventory.md)

## Estado e IDs

### Switches de corrida

Fonte: `Jhonny/data/System.json`, editor IDs 100-105.

| ID | Nome | Uso observado |
| --- | --- | --- |
| 100 | `SW_RACE_ACTIVE` | Ativa CEs paralelos de corrida: CE6, CE7, CE10, CE13 e CE16. |
| 101 | `SW_INPUT_LOCKED` | Bloqueia input durante resolucao/tela de resultado; consumido por CE13 e contratos runtime. |
| 102 | `SW_CRASH_FLAG` | Usado para forcar derrota/crash e reset defensivo. |
| 103 | `SW_LAST_ACTION_SAFE` | Marca ultima acao safe/risk para feedback/resolucao. |
| 104 | `SW_PAUSED` | Existe no System; uso profundo nao auditado. |
| 105 | `SW_IS_CURVA_DIABO` | Reservado/futuro segundo spec, mas aparece em operacoes de CE5/CE7/CE18. |

### Variaveis de corrida

Fonte: `Jhonny/data/System.json`, editor IDs 100-121.

| ID | Nome | Uso observado |
| --- | --- | --- |
| 100 | `VAR_RACE_ID` | Corrida atual, usada para tamanho e thresholds. |
| 101 | `VAR_SCENE_INDEX` | Indice da cena atual e condicao de fim. |
| 102 | `VAR_SCENE_TYPE` | Tipo de cena: Sinal/Curva e possivel tipo reservado. |
| 103 | `VAR_P_CENA` | Valor de risco/recompensa da cena. |
| 104 | `VAR_CONSCIENCIA` | Recurso principal, 0-100 por clamp. |
| 105 | `VAR_PONTOS_GLORIA` | Pontuacao da corrida, comparada com `VAR_GLORIA_META`. |
| 106 | `VAR_TAXA_SUCESSO` | Chance calculada de risk. |
| 107 | `VAR_ROLL_RESULT` | Roll 0-99 para risk. |
| 108 | `VAR_TIMER_FRAMES` | Timer em frames. |
| 109 | `VAR_SCENE_START` | Frame de inicio de cena. |
| 110 | `VAR_SEED` | Seed registrada no init da corrida; nao confirmada como fonte do RNG atual. |
| 111 | `VAR_RACE_N_CENAS` | Tamanho da corrida: 6/8/10 conforme race id. |
| 112 | `VAR_ATTEMPT_N` | Tentativa, incrementada no orchestrator. |
| 113 | `VAR_LAST_RENDERED_INDEX` | Controle para renderer. |
| 115 | `VAR_HOVER_LEVEL` | Nivel de hover/risco visual. |
| 116 | `VAR_TIMER_TIMEOUT_FLAG` | Flag de timeout. |
| 117 | `VAR_VITORIA_PASSOU` | Resultado da corrida, reset defensivo. |
| 119 | `VAR_GLORIA_META` | Threshold corrente exibido no HUD. |
| 120 | `VAR_TIMER_SECONDS` | Valor de timer para UI. |
| 121 | `VAR_SCENE_DISPLAY` | Display de cena atual no HUD. |
