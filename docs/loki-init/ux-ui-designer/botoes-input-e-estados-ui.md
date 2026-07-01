# Loki Init - UX/UI Designer Inventory - Botoes, Input E Estados UI

Source index: [inventory.md](inventory.md)

## Botoes, Input E Estados UI

### Botoes Picture-Based

Sinal (`CE8 EV_RenderSinal`):

- Picture 41 `race/btn_parar` em `(336, 440)` chama `CE11 EV_OnSafe`.
- Picture 42 `race/btn_furar` em `(592, 440)` chama `CE12 EV_OnRisk`.

Curva (`CE9 EV_RenderCurva`):

- Picture 43 `race/btn_direita` em `(624, 408)` chama `CE12 EV_OnRisk`.
- Picture 44 `race/btn_esquerda` em `(368, 408)` chama `CE11 EV_OnSafe`.

O binding e feito por script inline em `_gameScreen.picture(...).mzkp_commonEventId`.
A semantica exata desse campo depende do `ButtonPicture`, cujo plugin file nao
foi lido neste envelope.

### Teclado

`CE13 EV_KeyInput` roda em paralelo com `SW_RACE_ACTIVE` e respeita
`SW_INPUT_LOCKED`. O script observado reserva:

- Se `VAR_SCENE_TYPE === 0`: `down` -> safe, `up` -> risk.
- Caso contrario: `left` -> safe, `right` -> risk.

Docs citam tambem `S/W` e `A/D`. `plugins.js` informa que
`Jhonny_RaceHelper` tem helpers W/S/A/D, mas `VisuMZ_0_CoreEngine` esta com
`WASD: false` e o plugin file nao foi lido. Portanto W/S/A/D ficam
`runtime-pending`.

### Estados De Input/Lock

Estados estaticos relevantes:

- `SW_RACE_ACTIVE` (ID 100): liga Common Events paralelos da corrida.
- `SW_INPUT_LOCKED` (ID 101): bloqueia input de gameplay durante resultado,
  resolucao e transicoes.
- `SW_CRASH_FLAG` (ID 102): usado para derrota/crash.
- `SW_LAST_ACTION_SAFE` (ID 103): distingue safe/risk.
- `SW_PAUSED` (ID 104): reservado/observado no System, sem fluxo UX mapeado
  neste inventario.
- `SW_IS_CURVA_DIABO` (ID 105): condiciona placa da Curva do Diabo em `CE9`.

Estados de botao nao observados estaticamente: hover real, pressed, disabled,
focus, selected, keyboard focus ring, touch feedback e erro de clique
simultaneo. `CE16 EV_HoverRiskButton` existe, mas o conteudo observado apenas
zera `VAR_HOVER_LEVEL` e apaga pictures 22-24; sem Playtest nao ha prova de
hover/custo perceptivel.
