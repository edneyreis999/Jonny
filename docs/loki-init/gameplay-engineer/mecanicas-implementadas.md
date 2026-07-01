# Loki Init - Gameplay Engineer Inventory - Mecanicas implementadas

Source index: [inventory.md](inventory.md)

## Mecanicas implementadas

### Loop safe/risk

Fatos atuais:

- A spec define uma corrida como QTE binario por cena: tipo `Sinal` ou `Curva`, cada uma com acao safe e risk.
- `EV_RenderSinal` (CE8) cria botoes/pictures e atribui Common Event de safe/risk por script a pictures 41/42.
- `EV_RenderCurva` (CE9) cria botoes/pictures e atribui safe/risk por script a pictures 43/44.
- `EV_KeyInput` (CE13, trigger 2, switch 100) usa `Input.isTriggered` para reservar CE11 ou CE12 via teclado quando `SW_INPUT_LOCKED` esta falso.
- `Jhonny_RaceHelper.js` estende `Input.keyMapper` para `A/D/S/W` alem das direcoes padrao.

Inferencias estaticas:

- Mouse/touch depende da integracao `ButtonPicture` + propriedade `mzkp_commonEventId` escrita nos objetos de picture.
- Teclado depende do helper para W/S/A/D e do runtime RPG Maker para `Input.isTriggered`.

Validacao pendente:

- Input feel, prioridade entre teclado e clique, duplo input, mobile/touch e ausencia de filas de Common Events exigem Playtest.

### Acao safe

Fatos atuais em `EV_OnSafe` (CE11):

- Recebe callers por timeout via CE10 e por input via CE8/CE9/CE13.
- Chama `EV_ResolucaoSafe` (CE14).
- Usa plugin command `Jhonny_RaceHelper.logRaceEvent` com `type: SAFE_CLICK`.
- Opera `VAR_CONSCIENCIA` (+10 e clamp defensivo para 100), `VAR_PONTOS_GLORIA` (+10), `VAR_SCENE_INDEX` (+1), `VAR_TIMER_TIMEOUT_FLAG` reset 0.
- Altera `SW_INPUT_LOCKED` e `SW_LAST_ACTION_SAFE`.
- Toca SE `freada` e `Up1`.

### Acao risk

Fatos atuais em `EV_OnRisk` (CE12):

- Recebe callers por scripts de input e ButtonPicture, nao por `code:117` direto.
- Calcula `VAR_TAXA_SUCESSO = clamp(VAR_CONSCIENCIA + VAR_P_CENA, 0, 100)`.
- Calcula `VAR_ROLL_RESULT = Math.floor(Math.random() * 100)`.
- Em sucesso, chama `EV_ResolucaoRiskOK` (CE15), incrementa cena e soma `VAR_P_CENA * 2` a `VAR_PONTOS_GLORIA`.
- Em falha, chama `EV_Crash` (CE18).
- Reduz `VAR_CONSCIENCIA` por `VAR_P_CENA` e faz clamp para 0.
- Usa `Jhonny_RaceHelper.logRaceEvent` com `RISK_SUCCESS` e `RISK_FAIL`.

### Timer e timeout

Fatos atuais:

- `EV_RaceTimer` (CE10, trigger 2, switch 100) decrementa `VAR_TIMER_FRAMES`, seta `VAR_TIMER_TIMEOUT_FLAG` e chama CE11 quando o tempo encerra.
- A spec de design diz que timeout executa safe automatico; a evidencia dos CEs confirma chamada para CE11.
- `EV_UpdateHud` (CE6, trigger 2, switch 100) calcula `VAR_TIMER_SECONDS` e atualiza TextPictures de HUD.

Validacao pendente:

- Frequencia real do tick, conversao frame/segundo, exibicao do timer e comportamento no frame limite exigem runtime.

### Renderer, RNG e sequencia

Fatos atuais:

- `EV_RaceRenderer` (CE7, trigger 2, switch 100) chama `EV_VitoriaCorrida` (CE19) quando `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`.
- CE7 chama `EV_RenderSinal` (CE8) e `EV_RenderCurva` (CE9).
- CE7 usa scripts `JhonnyRace.rollSceneType()`, `JhonnyRace.rollPCena()` e `Graphics.frameCount`.
- `Jhonny_RaceHelper.rollSceneType()` retorna Sinal 60% / Curva 40%.
- `Jhonny_RaceHelper.rollPCena()` retorna multiplos de 10 entre 0 e 100.
- `Jhonny_RaceHelper.createPRNG(seed)` existe, mas esta marcado como reservado para v2 e CE7 usa `Math.random` por helper.

Drift estatico:

- A spec descreve seed deterministica por corrida via `VAR_SEED`; o runtime atual seta `VAR_SEED`, mas o sorteio observado em CE7 usa helper baseado em `Math.random`, nao `createPRNG(seed)`. Isso e drift de implementacao a validar/decidir, nao bug runtime confirmado.

### Resultado, vitoria, derrota e retry

Fatos atuais:

- `EV_VitoriaCorrida` (CE19) recebe chamadas de CE7 e CE18.
- CE19 apaga pictures, faz fadeout de BGM, toca ME `Victory1` ou `Defeat1`, usa TextPicture para `VICTORY!`, `DEFEAT!`, `Glory Score: \V[105]` e `Press [SPACE] to continue`.
- `Jhonny_RaceHelper.Config.THRESHOLDS` define `{1: 200, 2: 400, 3: 600}` e `DEFAULT_THRESHOLD = 60`.
- `Jhonny_RaceHelper.isVictory(pontosGloria, raceId)` compara `VAR_PONTOS_GLORIA` contra threshold.
- CE19 chama CE5 para progredir para nova corrida quando aplicavel e transfere para mapas 5, 13 ou 16 conforme branches observados.
- CE18 chama CE19 para caminho de crash/resultado.

Drift estatico:

- `Corrida - Core Loop.md` diz em um trecho que risk action falha e timer expira causam crash/restart imediato, mas em secoes posteriores e nos CEs atuais timeout vai para safe automatico. A evidencia runtime atual favorece timeout como safe automatico, mas Playtest ainda e necessario.
- A spec contem aviso de que Curva do Diabo esta fora do MVP e `SW_IS_CURVA_DIABO` fica reservado. Common Events mostram referencias a `SW_IS_CURVA_DIABO`, tipo 2 e assets de Curva do Diabo em preload/render; isto e superficie a revisar antes de qualquer conclusao de produto.
