# Loki Init - UX/UI Designer Inventory - Fluxos UX Inventariados

Source index: [inventory.md](inventory.md)

## Fluxos UX Inventariados

### Corrida

Fluxo documentado:

1. Inicio da corrida.
2. Seed procedural e composicao de cenas.
3. Cena binaria de Sinal ou Curva.
4. Janela de input com timer.
5. Acao safe ou risk.
6. Resolucao visual/sonora.
7. Proxima cena, crash/retry ou tela de resultado.

Runtime estatico observado:

- `CE5 EV_RaceOrchestrator` inicializa/reset defensivo, chama `CE3 EV_Preload`
  e mostra HUD inicial de consciencia.
- `CE7 EV_RaceRenderer` detecta fim de corrida, chama `CE19
  EV_VitoriaCorrida`, apaga pictures de cena, sorteia `VAR_SCENE_TYPE` e
  `VAR_P_CENA`, e chama `CE8 EV_RenderSinal` ou `CE9 EV_RenderCurva`.
- `CE10 EV_RaceTimer` roda em paralelo quando `SW_RACE_ACTIVE` esta ON,
  decrementa `VAR_TIMER_FRAMES` e reserva `CE11 EV_OnSafe` quando o timer chega
  a zero.
- `CE11 EV_OnSafe` trata acao segura, atualiza `VAR_CONSCIENCIA`,
  `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX` e chama `CE14 EV_ResolucaoSafe`.
- `CE12 EV_OnRisk` calcula `VAR_TAXA_SUCESSO`, `VAR_ROLL_RESULT`,
  atualiza consciencia/pontos, chama `CE15 EV_ResolucaoRiskOK` em sucesso ou
  `CE18 EV_Crash` em falha.
- `CE18 EV_Crash` apaga pictures 1-63 e chama `CE19 EV_VitoriaCorrida`.
- `CE19 EV_VitoriaCorrida` calcula `VAR_VITORIA_PASSOU`, mostra resultado,
  aguarda `ok`, limpa result pictures e ramifica para proxima corrida, fim ou
  retry via `CE5`.

### Tela De Resultado

Docs dizem que `EV_VitoriaCorrida` e a tela canonica de resultado. Evidencia
em `CommonEvents.json` confirma:

- `SW_INPUT_LOCKED` e ligado no inicio do CE19.
- BGM recebe fadeout.
- ME `Victory1` ou `Defeat1` e tocada conforme resultado.
- TextPictures usados:
  - Picture 53: `\C[6]VICTORY!`
  - Picture 56: `\C[18]DEFEAT!`
  - Picture 54: `Glory Score: \V[105]`
  - Picture 55: `Press [SPACE] to continue`
- Espera por input usa branch script `!Input.isPressed('ok')` com wait 1 frame.
- Saida limpa pictures 5, 53, 56, 54 e 55 e chama `clearCommonEventReservation`.

Static risk: a spec em portugues descreve labels `VITORIA/DERROTA`,
`Pontos de Gloria` e `Pressione [Espaco] para continuar`; o runtime observado
usa ingles em TextPictures de resultado. Isso e drift de localizacao/copy, nao
falha validada.

### Menus E Save/Load

Fatos observados:

- Termos default do RPG Maker estao localizados em portugues para `Salvar`,
  `Opcoes`, `Novo Jogo`, `Continuar`, mensagens de save/load e `Autossalvar`.
- `VisuMZ_0_CoreEngine` define layouts e backgrounds de `Scene_Save`,
  `Scene_Load`, `Scene_Menu`, `Scene_Options` e title commands.
- Nenhum comando `Open Menu` (`351`), `Open Save` (`352`) ou `Game Over`
  (`353`) foi encontrado em `CommonEvents.json`.
- O contrato runtime da corrida exige que, durante a tela de resultado,
  gameplay input respeite `SW_INPUT_LOCKED`; ele nao descreve uma UI especifica
  de salvar/carregar durante a corrida.

Lacuna: nao ha smoke matrix validada para save/load. Estados relevantes para
validacao futura: titulo/continue, antes de escolha, durante mensagem, durante
timer, tela de resultado, apos falha, apos sucesso e apos transferencia.
