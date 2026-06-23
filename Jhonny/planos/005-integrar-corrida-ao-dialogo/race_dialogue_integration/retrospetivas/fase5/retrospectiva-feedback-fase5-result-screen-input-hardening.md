# Retrospectiva Tecnica - Fase 5 Result Screen Input Hardening

## 1. Resumo da tarefa

O usuario pediu para reler a retrospectiva, os builds e as interacoes do plano `race_dialogue_integration` porque o bug de tela preta voltou apos perder uma corrida. O trabalho efetivo foi diagnosticar novamente o bug por Playtest interativo, identificar que o novo sintoma nao era a mesma falha do `CE3 EV_Preload`, e atualizar `tasks.md` com uma nova fase para hardening de input da tela de vitoria/derrota.

Resultado entregue:

- Confirmado que o patch anterior de retry-preload ainda existe estruturalmente em `CE5`: guarda `V[112] <= 1` antes de chamar `CE3`, seguido de `SW_RACE_ACTIVE ON`.
- Confirmado por trace runtime que o novo problema fica em `CE19 EV_VitoriaCorrida`, no loop `WAIT_INPUT`, repetindo `Input.isTriggered('ok')`.
- Confirmado que `CE13 EV_KeyInput` continua aceitando setas enquanto `SW_RACE_ACTIVE` esta ligado e nao verifica `SW_INPUT_LOCKED`.
- Atualizado `tasks.md` com a nova `Phase 5 - Result Screen Input Hardening`, task `task-5.1`, ordem de execucao e criterios finais.

Restricoes relevantes:

- `data/*.json` nao foi alterado; qualquer patch futuro em Common Events deve ser feito por script Python salvo no plano.
- Diagnostico runtime dependeu de comandos no console do RPG Maker MZ Playtest.
- A skill `loki-feedback` exigiu investigacao por perguntas e sem alteracao de arquivos ate haver consentimento explicito.

## 2. Decisoes tecnicas e inferencias

- **Decisao ou inferencia:** Tratar o bug como potencial regressao do retry-preload da Fase 4.
  - **Motivo:** O usuario relatou "tela preta depois que perco uma corrida", mesmo sintoma da Fase 4.
  - **Evidencia disponivel:** Retrospectiva da Fase 4 registrava stall em `CE5 -> CE3 -> SW_RACE_ACTIVE ON`.
  - **Resultado:** Funcionou parcialmente; a auditoria descartou que fosse a mesma causa.
  - **Avaliacao:** Necessaria no inicio, mas deveria ter sido descartada mais cedo com um trace focado.
  - **Melhoria futura:** Primeiro coletar `attempt`, `SW_RACE_ACTIVE`, `interpreterRunning`, `commonEventReserved` e ultimo CE executado antes de reler artefatos extensos.

- **Decisao ou inferencia:** Usar probes pequenos no console em vez de editar Common Events imediatamente.
  - **Motivo:** O sintoma era intermitente e dependia de timing de input.
  - **Evidencia disponivel:** O usuario ja havia demonstrado preferencia por debug interativo em retrospectivas anteriores.
  - **Resultado:** Funcionou.
  - **Avaliacao:** Necessaria.
  - **Melhoria futura:** Comecar com um trace filtrado por `CE19[29..58]` e `CE5[0..32]`, evitando traces que tambem capturem o preload inicial inteiro.

- **Decisao ou inferencia:** Considerar que `CE3` nao era a causa do novo bug.
  - **Motivo:** O trace com `CE3` mostrado pelo usuario ocorreu no bootstrap inicial, antes da tela de resultado.
  - **Evidencia disponivel:** No snapshot da tela preta, `attempt` permaneceu `1`, e o trace focado mostrou `CE19` repetindo `WAIT_INPUT`; nao havia child interpreter ativo.
  - **Resultado:** Funcionou.
  - **Avaliacao:** Necessaria para evitar remover um CE util sem evidencia.
  - **Melhoria futura:** Distinguir explicitamente "CE3 no bootstrap frio" de "CE3 no retry" em logs e tarefas.

- **Decisao ou inferencia:** Atualizar o plano antes de aplicar patch.
  - **Motivo:** O usuario pediu especificamente para atualizar `tasks.md`, nao para implementar a correcao.
  - **Evidencia disponivel:** Pedido direto: "atualiza as tasks do plano .../tasks.md".
  - **Resultado:** Funcionou.
  - **Avaliacao:** Necessaria.
  - **Melhoria futura:** Quando o usuario troca de diagnostico para planejamento, parar a investigacao e registrar a tarefa pendente.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta ou comando | Objetivo especifico | Por que foi necessario | Resultado obtido | Contribuiu diretamente | Substituivel? | Como evitar redundancia |
| --- | --- | --- | --- | --- | --- | --- |
| Leitura das skills `rpg-maker-mz-data-json`, `rpg-maker-mz-plugin-workflow`, `loki-feedback` | Confirmar regras de edicao e diagnostico | A tarefa envolvia RPG Maker MZ data JSON e feedback runtime | Impediu edicao prematura de JSON | Sim | Parcialmente | Para sessoes so de leitura, carregar apenas `loki-feedback` e a regra de JSON quando houver chance real de patch |
| `rg --files` e `rg` no plano | Localizar retrospectivas, builds e interacoes relevantes | O usuario pediu explicitamente para ler esses artefatos | Encontrou Fase 3 e Fase 4 como fontes principais | Sim | Nao | Usar termos mais focados: `CE3`, `CE5`, `WAIT_INPUT`, `SW_RACE_ACTIVE` |
| Leitura das retrospectivas Fase 3/Fase 4 | Reconstituir causa antiga e patch aplicado | O bug parecia recorrente | Confirmou que a causa antiga era `CE5 -> CE3` antes de `SW_RACE_ACTIVE ON` | Sim | Parcialmente | Ler primeiro o resumo da Fase 4 e so abrir secoes detalhadas se o estado atual bater com a causa antiga |
| `03_validate_race_dialogue_integration.py` | Validar estado estrutural atual | Precisava saber se o patch antigo ainda existia | Confirmou rotas e mostrou que o script estava parcialmente desatualizado em indices | Sim | Sim | Preferir dump direto de `CE5` quando indices podem ter mudado |
| Dumps Python de `CommonEvents.json` | Inspecionar `CE5`, `CE13`, `CE19` e eventos de input | Necessario para ligar logs runtime aos comandos reais | Identificou `CE19[29..32]`, `CE13` sem guarda de `SW_INPUT_LOCKED` e `CE5[28..31]` | Sim | Nao | Criar um script de audit reutilizavel para input da corrida |
| Probes no console do usuario | Capturar estado runtime e traces de comandos | O bug era intermitente e dependia de timing | Confirmou `Map001`, `Init Corrida` apagado, `CE19` preso em `WAIT_INPUT` | Sim | Nao | Fazer primeiro o trace focado, nao um trace que captura `CE3` inteiro |
| `apply_patch` em `tasks.md` | Registrar nova Phase 5 e task pendente | Pedido explicito do usuario | Atualizou plano, matriz, ordem e criterios finais | Sim | Nao | Sem redundancia significativa |

## 4. Intervencoes e correcoes do usuario

- **Instrucao dada pelo usuario:** Informou que o erro era intermitente e ocorria ao passar rapidamente pelas telas e apertar espaco logo em seguida.
  - **Antes da intervencao:** A investigacao ainda estava comparando o bug com o stall antigo de `CE3`.
  - **Suposicao envolvida:** Sintoma de tela preta podia ser a mesma causa anterior.
  - **Mudanca na execucao:** O foco passou para timing de input e concorrencia entre Common Events.
  - **Regra reutilizavel:** Em bugs intermitentes dependentes de input rapido, rastrear primeiro a janela de input e eventos paralelos.

- **Instrucao dada pelo usuario:** Perguntou se `CE3` fazia algo util e disse que aceitaria remove-lo se fosse so preload.
  - **Antes da intervencao:** A possibilidade de remover `CE3` ainda nao tinha sido avaliada como decisao de produto.
  - **Suposicao envolvida:** Remover preload poderia ser uma solucao aceitavel se fosse a causa.
  - **Mudanca na execucao:** Foi explicado que `CE3` e preload visual, mas a evidencia do novo bug apontava para `CE19`/`CE13`.
  - **Regra reutilizavel:** Separar "componente suspeito" de "componente comprovadamente causal" antes de remover funcionalidade.

- **Instrucao dada pelo usuario:** Relatou que setas ainda funcionam na tela de vitoria/derrota e que deveriam estar bloqueadas.
  - **Antes da intervencao:** O diagnostico mirava apenas Space/OK.
  - **Suposicao envolvida:** A tela preta poderia ser resolvida isolando o retry.
  - **Mudanca na execucao:** A investigacao incluiu `CE13 EV_KeyInput` e o plano passou a incluir bloqueio de input direcional.
  - **Regra reutilizavel:** Bugs de confirmacao em tela de resultado devem auditar todos os inputs ativos, nao apenas o botao de continuar.

- **Instrucao dada pelo usuario:** Pediu para atualizar `tasks.md`.
  - **Antes da intervencao:** Havia uma proposta de patch, mas ainda sem consentimento para alterar JSON.
  - **Suposicao envolvida:** O proximo passo poderia ser implementar a correcao.
  - **Mudanca na execucao:** A execucao parou no planejamento e atualizou somente o arquivo solicitado.
  - **Regra reutilizavel:** Quando o usuario pede artefato de plano, nao converter automaticamente em implementacao.

## 5. Analise de desperdicio

- **O que aconteceu:** Leitura extensa de artefatos da Fase 3 e Fase 4 antes de confirmar o estado runtime minimo.
  - **Impacto estimado:** Medio.
  - **Causa:** O sintoma parecia uma regressao conhecida.
  - **Como evitar:** Primeiro pedir snapshot minimo e trace focado; depois abrir artefatos apenas para interpretar o resultado.

- **O que aconteceu:** O primeiro trace capturou o `CE3` inteiro e parou antes do trecho critico de `CE19`.
  - **Impacto estimado:** Medio.
  - **Causa:** Limite de 80 logs e filtro amplo que incluia preload inicial.
  - **Como evitar:** Armar trace somente apos `CE19[29]` ou filtrar exclusivamente `CE19[29..58]` e `CE5`.

- **O que aconteceu:** O validador estrutural antigo foi usado apesar de os indices de `CE5` terem mudado.
  - **Impacto estimado:** Baixo.
  - **Causa:** Reuso de script sem verificar se seus indices ainda eram atuais.
  - **Como evitar:** Para Common Events que evoluem, usar busca por comando/parametro antes de depender de indices fixos.

- **O que aconteceu:** Houve diagnostico incremental com varias perguntas ao usuario.
  - **Impacto estimado:** Medio.
  - **Causa:** A skill de feedback favorece uma pergunta por turno, e o bug dependia de Playtest.
  - **Como evitar:** Quando permitido, pedir um unico probe composto com objetivo claro e baixa verbosidade.

## 6. Caminho minimo recomendado

1. **Acao:** Confirmar snapshot da tela preta.
   - **Entrada:** usuario na tela preta apos derrota.
   - **Ferramenta:** console do Playtest.
   - **Resultado esperado:** `mapId`, `raceId`, `victoryPassed`, `attempt`, `SW_RACE_ACTIVE`, `SW_PAUSED`, `interpreterRunning`, `commonEventReserved`, `Init Corrida._erased`.
   - **Criterio:** se `attempt` nao avanca e nao ha interpreter ativo, investigar antes do retry; se `attempt` avanca e trava antes de `SW_RACE_ACTIVE`, reabrir `CE3/CE5`.

2. **Acao:** Rodar trace focado no resultado.
   - **Entrada:** bug reproduzivel com input rapido.
   - **Ferramenta:** patch temporario de `Game_Interpreter.prototype.executeCommand` no console.
   - **Resultado esperado:** comandos de `CE19[29..58]` e chamadas a `CE5`.
   - **Criterio:** se o log repete `CE19[30..32]`, o problema esta no `WAIT_INPUT`.

3. **Acao:** Auditar eventos paralelos de input.
   - **Entrada:** `data/CommonEvents.json`.
   - **Ferramenta:** dump Python de CEs com `Input.is*`, `reserveCommonEvent`, `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`.
   - **Resultado esperado:** identificar `CE13` e qualquer outro CE que aceite input durante tela de resultado.
   - **Criterio:** se input paralelo nao checa lock, incluir na task de hardening.

4. **Acao:** Definir patch minimo.
   - **Entrada:** evidencias dos passos 1-3.
   - **Ferramenta:** nenhuma ate consentimento.
   - **Resultado esperado:** proposta: `CE13` respeitar `SW_INPUT_LOCKED`; `CE19` usar confirmacao robusta para Space/OK.
   - **Criterio:** zero duvidas sobre causa e arquivo alvo antes de alterar JSON.

5. **Acao:** Atualizar tasks ou implementar, conforme pedido do usuario.
   - **Entrada:** instrucao explicita do usuario.
   - **Ferramenta:** `apply_patch` para Markdown; script Python salvo para JSON.
   - **Resultado esperado:** plano ou patch aplicado de forma auditavel.
   - **Criterio:** arquivo atualizado e leitura final confirma conteudo.

## 7. Conhecimento reutilizavel

### Fatos confirmados

- `CE3 EV_Preload` faz preload visual por `Show Picture -> Wait -> Erase Picture`; ele reduz pop-in, mas nao foi a causa demonstrada do bug atual.
- O patch antigo de retry-preload esta em `CE5`: `V[112] <= 1` guarda a chamada a `CE3`, e `SW_RACE_ACTIVE ON` vem depois.
- No novo bug, `CE19 EV_VitoriaCorrida` ficou preso em `WAIT_INPUT`, repetindo `Input.isTriggered('ok')`.
- `Input.isTriggered('ok')` pode perder input se o jogador ja estiver segurando Space antes da janela de confirmacao.
- `CE13 EV_KeyInput` e paralelo por `SW_RACE_ACTIVE` e reserva `CE11/CE12` com setas sem checar `SW_INPUT_LOCKED`.
- Durante a tela de resultado, `SW_RACE_ACTIVE` ainda pode estar ligado, deixando inputs de corrida ativos.

### Preferencias do usuario

- Prefere debug interativo com comandos curtos e objetivo explicito.
- Aceita remover preload visual se ele for causa comprovada de tela preta.
- Quer que setas fiquem bloqueadas na tela de vitoria/derrota; somente Space/OK deve continuar.

### Restricoes tecnicas

- `data/*.json` deve ser modificado apenas por script Python salvo no plano.
- Playtest manual e necessario para validar comportamento de input, timing, pictures e Common Events.
- Traces de interpreter devem ser filtrados e auto-limitados para evitar flood.

### Armadilhas conhecidas

- Confundir `CE3` executado no bootstrap frio com `CE3` executado no retry.
- Usar limite de trace pequeno enquanto tambem captura preload inteiro.
- Depender de indices fixos em Common Events que ja foram alterados por fases posteriores.
- Tratar `SW_RACE_ACTIVE` como proxy suficiente de "corrida jogavel"; na tela de resultado ele pode continuar ligado.

### Heuristicas recomendadas

- Para tela preta apos derrota, primeiro descobrir se o fluxo morreu antes ou depois de `CE5`.
- Para tela de resultado, auditar simultaneamente input de confirmacao e eventos paralelos de gameplay.
- Se `CE19` repete `WAIT_INPUT`, verificar `isTriggered` vs `isPressed` antes de mexer em preload ou transfer.
- Um lock de input deve ser verificado no ponto que reserva Common Events, nao apenas nos CEs chamados.

## 8. Informacoes que deveriam estar no prompt inicial

- **Obrigatorio:** o bug e intermitente e aparece principalmente ao apertar Space rapidamente/segurar Space ao passar pelas telas.
- **Obrigatorio:** setas ainda funcionam na tela de vitoria/derrota e isso tambem deve ser corrigido.
- **Util:** o patch anterior de `CE3` ainda parecia funcional antes da regressao.
- **Util:** o usuario aceita remover `CE3` se for causa comprovada, mas prefere evitar tela preta.
- **Opcional:** indicar se o objetivo do turno e implementar patch ou apenas atualizar plano.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na analise tecnica

- **Problema observado durante a execucao:** A analise anterior nao destacava que a tela de resultado ainda roda enquanto `SW_RACE_ACTIVE` pode estar ligado.
- **Informacao ausente ou incorreta:** `SW_RACE_ACTIVE` nao significa necessariamente "inputs de corrida devem ser aceitos"; a tela de resultado precisa de um contrato proprio de input.
- **Por que pertence a analise tecnica:** E um contrato estrutural entre `CE19`, `CE13` e os CEs de acao.
- **Secao sugerida:** `Riscos Tecnicos` ou `Contratos de input`.
- **Texto sugerido:** `Durante telas de resultado, eventos paralelos de gameplay nao devem aceitar input mesmo se SW_RACE_ACTIVE permanecer ligado para manter o lifecycle da corrida. CE13 EV_KeyInput deve respeitar SW_INPUT_LOCKED ou um lock equivalente antes de reservar CE11/CE12.`
- **Impacto esperado:** Evita diagnosticar a tela preta apenas como problema de retry/preload.

### 9.2 Melhorias no plano de implementacao

- **Problema observado durante a execucao:** A matriz de validacao verificava derrota/vitoria, mas nao explicitava input rapido nem setas durante a tela de resultado.
- **Deficiencia do plano:** Falta de checkpoint de stress de input na tela de resultado.
- **Etapa afetada:** Fase 4/validacao final.
- **Alteracao recomendada:** Adicionar fase ou checkpoint especifico de hardening de input antes da matriz final.
- **Texto sugerido:** `Antes da validacao final, executar hardening da tela de resultado: pressionar/segurar Space durante a transicao para vitoria/derrota e pressionar setas na tela de resultado. O fluxo deve aceitar somente confirmacao e nunca reservar acoes de corrida.`
- **Como reduz custo/risco:** Detecta regressao de timing antes de atribui-la ao preload ou ao bootstrap.

### 9.3 Melhorias nas tasks da fase executada

- **Task afetada:** `task-5.1`.
- **Informacao ausente, ambigua ou incorreta:** A task nao existia antes desta sessao.
- **Consequencia observada:** A investigacao precisou redescobrir escopo, componentes e criterios.
- **Alteracao recomendada:** Manter a task adicionada em `tasks.md` e, no arquivo detalhado futuro, incluir alvos e validacoes.
- **Texto sugerido:** `Alvos: CE19 WAIT_INPUT e CE13 EV_KeyInput. CE13 deve ignorar inputs se SW_INPUT_LOCKED estiver ON. CE19 deve aceitar confirmacao robusta por Space/OK sem permitir que segurar Space antes da janela deixe o fluxo preso. Validar com presses rapidos, Space segurado e setas durante tela de resultado.`
- **Como validar:** Playtest deve provar que Space avanca exatamente uma vez e setas nao alteram variaveis nem reservam CE11/CE12 na tela de resultado.

### 9.4 Problemas fora do escopo dos artefatos

- **Problema observado:** O bug e intermitente e depende do timing humano de input.
  - **Por que fora do escopo:** Mesmo uma especificacao boa nao garante reproducao deterministica sem Playtest.
  - **Como tratar:** Usar probes focados e cenarios de stress de input.
  - **Acao:** Protecao operacional em debug; nao inflar a especificacao com traces completos.

- **Problema observado:** O primeiro trace gerou informacao demais sobre `CE3`.
  - **Por que fora do escopo:** Foi escolha operacional da LLM, nao falha da task.
  - **Como tratar:** Usar filtros por CE e indice desde o inicio.
  - **Acao:** Heuristica de debug para traces com limite e ponto de armamento.

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsavel | Alteracao necessaria | Prioridade |
| --- | --- | --- | --- | --- |
| Setas ativas na tela de resultado | `CE13` aceita input so com `SW_RACE_ACTIVE` | Analise tecnica | Registrar contrato de input e lock durante resultado | Alta |
| Space rapido/segurado prende `WAIT_INPUT` | Uso fragil de `Input.isTriggered('ok')` | Task | Task especifica para confirmacao robusta | Alta |
| Validacao nao cobria stress de input | Matriz final focava rotas e cleanup | Plano | Checkpoint de hardening antes de validar matriz completa | Alta |
| Trace inicial capturou `CE3` demais | Filtro amplo e limite pequeno | Fora do escopo | Melhorar pratica operacional de probes | Media |
| Validador antigo usava indices defasados | Common Events evoluiram | Nenhuma alteracao | Preferir busca por comando em novos audits | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a analise tecnica

```md
## Contratos de input da tela de resultado

- Durante `EV_VitoriaCorrida`, a tela de resultado pode aparecer enquanto `SW_RACE_ACTIVE` ainda esta ligado.
- Eventos paralelos de gameplay nao devem interpretar setas, W/A/S/D ou reservar acoes de corrida durante essa tela.
- `EV_KeyInput` deve respeitar `SW_INPUT_LOCKED` ou lock equivalente antes de reservar `EV_OnSafe`/`EV_OnRisk`.
- A confirmacao da tela de resultado deve tolerar Space/OK pressionado rapidamente ou segurado durante a transicao.
```

#### Patch sugerido para o plano de implementacao

```md
Antes da validacao final da matriz de corridas, executar uma fase de hardening da tela de resultado:

- validar Space/OK rapido e segurado na tela de vitoria/derrota;
- validar que setas e W/A/S/D nao disparam acoes da corrida nessa tela;
- so entao executar a matriz completa de entrada, derrota, retry, vitoria e cleanup.
```

#### Patch sugerido para as tasks da fase executada

```md
task-5.1 - Harden result-screen input gating and retry confirmation

Alvos:
- `CE19 EV_VitoriaCorrida`, comandos `WAIT_INPUT`;
- `CE13 EV_KeyInput`, reserva de `CE11/CE12`.

Requisitos:
- `CE13` deve ignorar input quando `SW_INPUT_LOCKED` estiver ON.
- `CE19` deve aceitar confirmacao por Space/OK de forma robusta, sem depender de um unico frame de `Input.isTriggered('ok')`.
- Setas e W/A/S/D nao podem alterar variaveis de corrida nem reservar Common Events enquanto a tela de resultado estiver ativa.

Validacao:
- perder uma corrida, segurar Space antes da tela de resultado, confirmar que o fluxo continua;
- perder uma corrida, pressionar Space rapidamente repetidas vezes, confirmar que avanca exatamente uma vez;
- pressionar setas na tela de resultado, confirmar que nada da corrida e acionado.
```

#### Acoes fora do fluxo de especificacao

- Usar traces runtime filtrados por CE e indice quando investigar bugs intermitentes de Common Event.
- Evitar traces que capturem `CE3 EV_Preload` inteiro quando a hipotese atual esta na tela de resultado.

## 10. Checklist operacional

- [ ] Confirmar se o objetivo do turno e diagnosticar, atualizar plano ou implementar patch.
- [ ] Para tela preta apos derrota, coletar snapshot minimo antes de ler muitos artefatos.
- [ ] Se `attempt` nao avanca, investigar antes de `CE5`; se avanca e trava, investigar `CE5/CE3`.
- [ ] Em tela de resultado, auditar `CE19 WAIT_INPUT` e `CE13 EV_KeyInput`.
- [ ] Verificar se eventos paralelos respeitam `SW_INPUT_LOCKED`.
- [ ] Nao remover `CE3` sem evidencia de que ele participa do bug atual.
- [ ] Se alterar `data/*.json`, criar script Python salvo em `builds/faseN/`.
- [ ] Validar com Space rapido, Space segurado e setas na tela de resultado.
- [ ] Considerar concluido somente apos Playtest manual confirmar ausencia de tela preta.
