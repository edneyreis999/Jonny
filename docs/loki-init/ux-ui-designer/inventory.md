---
title: "Loki Init - UX/UI Designer Inventory"
tipo: "inventario ux-ui"
status: "parcial"
tags:
  - loki-init
  - ux-ui-designer
  - game-dev
  - rpg-maker-mz
---

# Loki Init - UX/UI Designer Inventory

Data: 2026-06-30
Agente: ux-ui-designer
Escopo: inventario factual de UX/UI para o projeto Jhonny em RPG Maker MZ.

## Status

Inventario `focused ownership` para UX/UI, VN controls e acessibilidade
observavel. A evidencia e estatica: docs, JSON de dados e configuracao de
plugins. Nenhum Playtest, preview visual, contraste, input feel, leitura,
timing, save/load ou comportamento runtime foi validado.

Evidence levels usados:

- `parse-valid`: JSON ou `plugins.js` foram parseados por Node.
- `editor-structural`: comandos RPG Maker MZ foram identificados por code e
  parametros em `CommonEvents.json`.
- `static-risk`: fonte estatica sugere drift ou risco, sem provar falha.
- `runtime-pending`: requer Playtest, editor, runtime ou validacao humana.

## Fontes Lidas

Fontes de contexto:

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Core Loop.md`
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`
- `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`
- `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`
- `/Users/edney/projects/coreto/loki-framework/skills/loki-rpg-maker-mz-project-inventory/references/*.md`

Fontes estruturadas:

- `Jhonny/data/System.json`
- `Jhonny/data/CommonEvents.json`
- `Jhonny/js/plugins.js`

Leitura incidental:

- `Jhonny/data/MapInfos.json`, para identificar nomes de mapas em baixo nivel.
- `Jhonny/img/pictures/race`, apenas listagem estatica de arquivos de pictures.

Essas leituras incidentais nao foram usadas como autoridade de comportamento
runtime; o ownership principal abaixo vem de docs, `System.json`,
`CommonEvents.json` e `plugins.js`.

## Mapa De Localizacao

| Superficie | Fonte principal | Observacao |
| --- | --- | --- |
| Resolucao, fonte, termos de menu/save/load | `Jhonny/data/System.json` | `advanced`, `terms.commands`, `terms.messages`. |
| Fluxo da corrida e intencao de HUD | `docs/02-Core-Loop/Corrida - Core Loop.md` | Spec de UI e feedback; contem itens marcados `[PLAYTEST]`. |
| Contrato runtime de input/resultado | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Define `SW_INPUT_LOCKED`, tela de resultado e gates. |
| HUD, botoes, TextPicture, timer e resultado implementados | `Jhonny/data/CommonEvents.json` | CEs 5-19 concentram a UI da corrida. |
| Plugins ativos que afetam UI | `Jhonny/js/plugins.js` | `TextPicture`, `ButtonPicture`, `VisuMZ_0_CoreEngine`, `VisuMZ_2_VNPictureBusts`. |
| Validacao perceptiva | `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` | Playtest humano e gate final para UI, input, audio, pictures e CEs. |

## Configuracao UI Global

Fatos observados em `System.json`:

- Titulo do jogo: `Bye Bye Jhonny`.
- Locale: `pt_BR`.
- Resolucao e area de UI: `1280x720`.
- Fonte principal e numerica: `JollyLodger-Regular.ttf`; fallback:
  `Verdana, sans-serif`.
- `fontSize`: `48`.
- `windowOpacity`: `192`.
- `picturesUpperLimit`: `100`.
- `optDrawTitle`: `true`; `title1Name` e `title2Name` vazios.
- Termos de menu/save/load em portugues incluem `Novo Jogo`, `Continuar`,
  `Salvar`, `Opcoes`, `Salvar em qual arquivo?`, `Carregar qual arquivo?`,
  `Arquivo`, `Autossalvar` e `Toque UI`.

Fatos observados em `plugins.js`:

- `TextPicture` ativo para texto renderizado como picture.
- `ButtonPicture` ativo para pictures clicaveis.
- `Jhonny_RaceHelper` ativo com `EnableDebugLogs: true`; descricao declara
  helpers para RNG, clamp, W/S/A/D e logger, mas o arquivo do plugin nao foi
  lido neste envelope.
- `VisuMZ_0_CoreEngine` ativo. Parametros relevantes: `ModernControls: true`,
  `ShowButtons: true`, `SideButtons: true`, `RightMenus: true`,
  `ButtonHeight: 52`, `BackOpacity: 192`, `LineHeight: 36`,
  `ShowScrollBar: true`.
- `VisuMZ_2_VNPictureBusts` ativo com escala `90%`, anchor `0.5/0.95`,
  `ScreenX` centralizado com buffer lateral de 200 px e `ScreenY` no rodape.

Limite: plugin files nao foram inspecionados; sem engine/runtime nao ha prova
de renderizacao efetiva, foco, clique, hover, layout, contraste ou leitura.

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

## HUD E Textos Em Tela

HUD implementado estaticamente:

- Barra de consciencia:
  - Picture 20 `race/bar_consciencia_bg`
  - Picture 21 `race/bar_consciencia_fill`
  - Picture 60 TextPicture `\V[104]%`
  - Atualizacao via `CE6 EV_UpdateHud`, com `picture(21).move(... scaleX =
    clamp(VAR_CONSCIENCIA))`.
- Ranking/glory:
  - Picture 51 `race/bg-ranking`
  - Picture 57 TextPicture `\FS[40]\C[15] GLORY: \V[105]/\V[119]`
- Tentativa:
  - Picture 52 TextPicture `TRIAL \V[112]`
- Timer:
  - Picture 62 TextPicture `\C[0]TIMER: \V[120]s`
- Progresso de cena:
  - Picture 63 TextPicture `\C[0]\V[121]/\V[111]`
- Valor de risco/tentacao:
  - `CE8` e `CE9` mostram TextPicture `\V[103]%` em Picture 61.

Static risk: a spec diz que `P_cena` nao deve ser mostrado numericamente e que
a tentacao deveria ser visual. O runtime observado mostra `\V[103]%` em cenas
de Sinal e Curva. Esse e um conflito factual entre design documentado e
CommonEvents atuais.

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

## Dialog Boxes E VN Controls

Nas Common Events de corrida inspecionadas:

- Nenhum `Show Text` (`101`) foi encontrado.
- Nenhum `Show Choices` (`102`) foi encontrado.
- Nenhum `Input Number`, `Select Item` ou `Scrolling Text` foi encontrado.
- Textos de HUD e resultado sao `TextPicture`, nao janelas de dialogo
  tradicionais.

Superficie VN observada:

- `VisuMZ_2_VNPictureBusts` esta ativo em `plugins.js`.
- CEs 20-23 (`Fala-ID1` a `Fala-ID4`) existem como paralelos por switches
  43-46, mas nao foram auditados em profundidade porque o foco autorizado era
  a UI da corrida e fontes listadas.

VN controls nao encontrados nas fontes lidas: backlog/history, skip, auto mode,
text speed dedicado, quick save, quick load, nameplate customizada e controle
de overlap bust/dialog. Ausencia aqui significa "nao observado neste
inventario", nao inexistencia global.

## Feedback Visual E Sonoro Observado

Feedback visual estatico:

- Preload (`CE3`) aquece pictures de corrida com `Show Picture -> Wait -> Erase`.
- `CE8` mostra background de sinal, POV do carro, sinal vermelho, barras de
  luck, valor `P_cena` e botoes.
- `CE9` mostra background de curva, POV do carro, placa da Curva do Diabo
  quando `SW_IS_CURVA_DIABO` esta ON, barras de luck, valor `P_cena` e botoes.
- `CE14 EV_ResolucaoSafe` aplica tint verde/escuro e espera 12 frames.
- `CE15 EV_ResolucaoRiskOK` toca SE, aplica tint azul, screen shake, retorna
  tint e espera 18 frames.
- `CE19` aplica tint de resultado e mostra TextPictures de vitoria/derrota.

Feedback sonoro estatico:

- `CE11 EV_OnSafe` toca SE `freada` e `Up1`.
- `CE15 EV_ResolucaoRiskOK` toca SE `pneu_cantando`.
- `CE19 EV_VitoriaCorrida` toca ME `Victory1` ou `Defeat1`.

Docs descrevem feedback adicional como flash, opala freando/acelerando,
motion blur, crash visual, hover vermelho, ticks finais e haptic. Esses itens
sao direcao/expectativa de design ou polish `runtime-pending` enquanto nao
houver Playtest ou auditoria de assets/plugins apropriada.

## Acessibilidade Observada

Superficies positivas observaveis:

- O jogo expõe pelo menos duas modalidades de acao para a corrida:
  clique em pictures e teclado por setas.
- Termo `Toque UI` existe em `System.json`, e `VisuMZ_0_CoreEngine` tem
  `ShowButtons: true`.
- `ButtonHeight` global do VisuMZ e `52`, mas os botoes de corrida sao
  pictures customizadas; tamanho efetivo depende do asset e nao foi medido.
- O resultado usa texto e ME; nao depende apenas de audio.

Gaps de acessibilidade:

- Contraste e non-text contrast nao foram medidos.
- Tamanho real dos touch targets nao foi medido.
- Font legibility da `JollyLodger-Regular.ttf` em HUD, timer e resultado nao
  foi validada.
- Dependencia de cor: estados usam vermelho/dourado/azul/verde; nao ha
  evidencia de fallback textual/shape para todos os estados.
- Timing: timer de 3,5s/4,0s nao tem evidencia de ajuste, pausa acessivel ou
  modo sem tempo.
- Remapeamento: setas sao observadas; WASD fica pendente; remapping nao foi
  observado.
- Motion/flash: tint, shake e flashes aparecem em docs/CEs; risco de conforto
  visual requer gate humano.
- Haptic citado em docs nao foi confirmado no runtime.

## Validacao Pendente

Nao declarar validado sem gate humano:

- Composicao visual do HUD em 1280x720.
- Leitura de `GLORY`, `TRIAL`, timer, `P_cena`, consciencia e resultado.
- Contraste da paleta e estados de cor.
- Tamanho e posicao dos botoes em mouse/touch.
- Confiabilidade de clique via `ButtonPicture`.
- Input por setas e possivel input W/S/A/D.
- Input lock na tela de resultado.
- Hover/custo de risk.
- Timer, timeout e feedback de safe automatico.
- Resultado, retry, progressao entre corridas e limpeza de pictures.
- Save/load antes, durante e depois da corrida.
- Backlog/skip/auto/text speed/quick save/load se o escopo VN vier a depender
  desses controles.

## Riscos E Perguntas Abertas

- `P_cena` numerico aparece no runtime estatico, contrariando a spec de que a
  tentacao nao deve ser numerica.
- Copy de resultado no runtime esta em ingles, enquanto termos do sistema e
  docs de UI estao em portugues.
- `CE16 EV_HoverRiskButton` existe, mas nao evidencia os tres niveis discretos
  de custo descritos na spec.
- `Jhonny_RaceHelper` esta com `EnableDebugLogs: true`; isso e util para
  diagnostico, mas pode ser risco de release/polish.
- `ButtonPicture` ownership nao foi confirmado por leitura de plugin file.
- A tela de resultado usa `SPACE` no texto, mas o loop verifica `Input.isPressed('ok')`;
  confirmar se isso comunica corretamente em teclado, controle e touch.
- O inventario nao prova que `Scene_Save`/`Scene_Load` restauram estado da
  corrida sem picture/input drift.

## Proximo Caminho Minimo

Para uma futura `loki:tech-analysis` de UX/UI da corrida:

1. Ler `Jhonny/js/plugins/ButtonPicture.js`, `TextPicture.js` e
   `Jhonny_RaceHelper.js` com skill de plugin workflow em modo read-only.
2. Auditar `CE8`, `CE9`, `CE16`, `CE19` contra a spec de HUD/resultado.
3. Executar Playtest com snapshot minimo do debug doc cobrindo boot, corrida,
   clique, setas, timeout, safe, risk success, risk fail, resultado, retry e
   save/load.
4. Pedir human-validation para leitura, contraste, input feel, timing,
   acessibilidade e clareza do resultado.
