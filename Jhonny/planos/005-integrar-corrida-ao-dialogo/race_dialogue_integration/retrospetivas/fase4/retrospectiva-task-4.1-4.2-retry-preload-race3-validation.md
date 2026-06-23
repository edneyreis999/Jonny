# Retrospectiva Tecnica - Fase 4 Retry Preload e Corrida 3

## 1. Resumo da tarefa

- Resultado solicitado: executar a Fase 4 atualizada, corrigindo primeiro o black screen apos derrota no `Map001` e preservando a integracao da Corrida 3 em `Map013`.
- Resultado entregue: foi aplicado um patch estrutural em `CommonEvents.json` para que o retry pos-derrota pule `CE3 EV_Preload` e religue `SW_RACE_ACTIVE` diretamente via `CE5 EV_RaceOrchestrator`; os marcadores executaveis da Corrida 3 em `Map013` foram mantidos; o usuario confirmou em Playtest que o bug foi resolvido.
- Criterios de conclusao: `CommonEvents.json` e `Map013.json` continuaram parseando; o validador estrutural confirmou o novo guarda em `CE5`; o usuario confirmou "FUNCIONOU!!!" apos testar o retry.
- Restricoes e ferramentas relevantes: seguir `Jhonny/CLAUDE.md`; para `data/*.json`, usar estritamente scripts Python salvos no plano; nao editar JSON manualmente; usar `rpg-maker-mz-data-json`; Playtest do usuario e a unica validacao definitiva para comportamento runtime.

## 2. Decisoes tecnicas e inferencias

- **Decisao ou inferencia:** Tratar como confirmado que o retry ja chegava em `CE5`, e que o problema remanescente estava no preload.
  - **Motivo:** A correcao anterior em `CE19` nao eliminou a tela preta.
  - **Evidencia disponivel:** Logs do usuario mostravam `CE19 -> CE5 -> CE3`, `RACE_INIT` ocorrendo de novo com `SW_RACE_ACTIVE = false`, e ausencia do comando de `SW100 ON`.
  - **Resultado:** Funcionou.
  - **Avaliacao:** Necessaria.
  - **Melhoria futura:** A task deveria explicitar desde o inicio que o primeiro checkpoint da investigacao e distinguir "handoff para CE5 falhou" de "handoff ok, preload travou".

- **Decisao ou inferencia:** Corrigir `CE5`, nao `CE19`, `CE18` nem `Map001`.
  - **Motivo:** Ainda havia ambiguidade sobre qual ponto do bootstrap deveria ser ajustado.
  - **Evidencia disponivel:** O usuario confirmou que o retry acontecia sem reload de mapa e os traces mostraram child interpreter criado dentro de `CE5`.
  - **Resultado:** Funcionou.
  - **Avaliacao:** Necessaria.
  - **Melhoria futura:** A analise tecnica deveria registrar explicitamente que, apos `Erase Event` no `Init Corrida`, retries na mesma carga de mapa nao podem depender do autorun do evento.

- **Decisao ou inferencia:** Fazer o preload rodar apenas no bootstrap frio com guarda em `V[112] <= 1`.
  - **Motivo:** Era preciso preservar o preload original sem reexecuta-lo no retry.
  - **Evidencia disponivel:** `CE5` incrementa `V[112]` logo no inicio; no retry observado pelo usuario, `ATTEMPT_N` passava para `2`; o comando de preload estava imediatamente antes de `SW_RACE_ACTIVE ON`.
  - **Resultado:** Funcionou.
  - **Avaliacao:** Necessaria.
  - **Melhoria futura:** Se o sistema de corrida tiver evolucao futura, documentar que `V[112]` e o discriminador oficial entre cold start e retry.

- **Decisao ou inferencia:** Nao tocar novamente nos marcadores executaveis da Corrida 3 ao corrigir o preload.
  - **Motivo:** Havia risco de misturar dois problemas independentes.
  - **Evidencia disponivel:** O bug reproduzido acontecia em Corrida 1 e 2, antes de qualquer entrada pela Corrida 3.
  - **Resultado:** Funcionou parcialmente; preservou o que ja estava certo, mas a matriz completa da Corrida 3 continua pendente de validacao final.
  - **Avaliacao:** Necessaria.
  - **Melhoria futura:** Separar claramente "fix de retry runtime" de "routing de Race 3" nas tasks evita regressao acidental.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta ou comando | Objetivo especifico | Por que foi necessario | Resultado obtido | Contribuiu diretamente | Poderia ser mais simples | Como evitar redundancia |
| --- | --- | --- | --- | --- | --- | --- |
| `mcp__serena.initial_instructions` e `activate_project` | Cumprir precondicao operacional | Exigencia do ambiente | Projeto `Jhonny` ativado | Indiretamente | Nao | Fazer imediatamente no inicio de toda fase de implementacao |
| `sed` em `Jhonny/CLAUDE.md`, `SKILL.md`, `workflow.md`, `task-4.1.md`, `task-4.2.md` | Carregar regras e escopo | Restricoes de workflow e task | Confirmou script-first e escopo da fase | Sim | Parcialmente | Ler apenas os arquivos estritamente necessarios; evitar reabrir docs ja carregados na mesma retomada |
| Scripts Python inline de leitura de `CommonEvents.json` e `Map013.json` | Inspecionar `CE3`, `CE5`, `CE18`, `CE19` e os indexes da Corrida 3 | Confirmar estrutura real antes de patch | Identificou `CE5[19] = call CE3` e `CE5[20] = SW100 ON` | Sim | Sim | Esse deveria ser o primeiro passo da investigacao runtime, antes de solicitar muitos comandos ao usuario |
| `04_audit_retry_preload_stall.py` | Auditar o estado exato do preload/retry | Registrar evidencia no plano e validar precondicoes do patch | Confirmou handoff em `CE19[60]`, preload em `CE5[19]`, sem guarda | Sim | Sim | Reaproveitar esse modelo de audit em bugs futuros de Common Events |
| `05_fix_retry_preload_stall.py` | Aplicar a correcao em `CommonEvents.json` | Workflow obrigatorio para `data/*.json` | Inseriu guarda `111` em `CE5[19]`, deslocando `SW100 ON` para `CE5[22]` | Sim | Nao | Em casos semelhantes, priorizar patch pequeno e local em vez de reestruturar varios events |
| `03_validate_race_dialogue_integration.py` | Validacao estrutural pos-patch | Confirmar parse e janela correta do bootstrap | Confirmou guarda em `CE5` e rotas da fase | Sim | Nao | Manter esse script atualizado e usa-lo apos cada mutacao relevante |
| Comandos de console pedidos ao usuario na etapa anterior | Coletar estado runtime nao observavel estaticamente | O bug era no runtime do RPG Maker | Confirmaram child interpreter em `CE3` e ausencia de `SW100 ON` | Sim | Parcialmente | Reduzir o numero de probes; apos provar `CE19 -> CE5 -> CE3` e que `SW100 ON` nao ocorre, parar de pedir variantes do mesmo trace |

## 4. Intervencoes e correcoes do usuario

- **Instrucao dada pelo usuario:** informou repetidamente logs de `RACE_EVENT`, `CE_TRACE`, `CE_AFTER`, `SW_TRACE` e estados do console.
  - **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** A investigacao ainda testava hipoteses amplas sobre `Erase Event`, `Map001` e `CE19`.
  - **Qual suposicao ou interpretacao causou o problema:** Suposicao inicial de que o retry falhava por nao conseguir reinvocar o bootstrap apos `Erase Event`.
  - **Como a execucao mudou depois da correcao:** A investigacao foi afunilada para `CE5` e depois para `CE3 EV_Preload`.
  - **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Em bugs de retry no RPG Maker, primeiro localizar o ultimo common event que executa antes do stall e o primeiro comando esperado que nao executa.

- **Instrucao dada pelo usuario:** informou que o jogo ficava parado enquanto comandos de console eram executados.
  - **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** Alguns probes foram pensados como se o log fosse observado em tempo real sem congelar a simulacao.
  - **Qual suposicao ou interpretacao causou o problema:** Subestimar o impacto operacional do console pausando ou desviando a atencao do playtest.
  - **Como a execucao mudou depois da correcao:** Os comandos passaram a ser desenhados com foco em snapshots e probes pontuais.
  - **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Em debug interativo com Playtest, assumir que cada probe deve produzir o maximo de informacao util em uma unica captura.

- **Instrucao dada pelo usuario:** reclamou que um `EXEC_TRACE` flodou o terminal.
  - **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** Um hook muito verboso foi proposto sem limitacao de frequencia.
  - **Qual suposicao ou interpretacao causou o problema:** Aceitar um trace continuo quando um gate por frame ou por indice seria suficiente.
  - **Como a execucao mudou depois da correcao:** A investigacao passou a privilegiar hooks focalizados em comandos e indices especificos.
  - **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Toda instrumentacao runtime deve ter throttle, filtro por comando ou auto-desligamento.

- **Instrucao dada pelo usuario:** disse explicitamente que adorou o debug interativo.
  - **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** Nao havia ainda uma preferencia formal do usuario para esse estilo.
  - **Qual suposicao ou interpretacao causou o problema:** Nenhuma; foi uma preferencia nova.
  - **Como a execucao mudou depois da correcao:** O estilo de investigacao passou a ser um conhecimento reutilizavel do usuario.
  - **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Para bugs runtime nesse projeto, favorecer diagnostico interativo com probes curtos em vez de longas explicacoes teoricas.

- **Instrucao dada pelo usuario:** deixar mais claro onde cada debug quer chegar, com uma linha curta de explicacao.
  - **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** Alguns comandos eram enviados sem explicitar qual hipotese estavam tentando provar ou descartar.
  - **Qual suposicao ou interpretacao causou o problema:** Suposicao de que o objetivo do probe ficaria obvio apenas pelo contexto acumulado.
  - **Como a execucao mudou depois da correcao:** Fica estabelecida uma preferencia operacional de sempre contextualizar o probe antes do comando.
  - **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Antes de cada comando de debug pedido ao usuario, incluir uma frase curta no formato `Objetivo: provar X` ou `Objetivo: descartar Y`.

## 5. Analise de desperdicio

- **O que aconteceu:** Muitas rodadas de probes diferentes provaram a mesma tese geral: o retry voltava a algum bootstrap, mas `SW_RACE_ACTIVE` nao era religado.
  - **Impacto estimado:** alto.
  - **Causa:** Falta de um criterio de parada claro para a fase diagnostica.
  - **Como evitar:** Encerrar a coleta assim que tres fatos estiverem confirmados: `CE19` chamou `CE5`, `CE5` chamou `CE3`, e o `SW100 ON` esperado nao ocorreu.

- **O que aconteceu:** Hipotese inicial sobre `Erase Event` dominou a investigacao por tempo demais.
  - **Impacto estimado:** medio.
  - **Causa:** A primeira correcao estrutural parecia plausivel e contaminou a leitura dos sintomas posteriores.
  - **Como evitar:** Tratar cada reteste do usuario como nova evidencia primaria; se o bug persiste apos patch, reabrir a arvore de causas sem apego ao fix anterior.

- **O que aconteceu:** Alguns comandos de observacao foram verbosos demais para o contexto de playtest.
  - **Impacto estimado:** medio.
  - **Causa:** Instrumentacao sem throttle ou sem alvo unico.
  - **Como evitar:** Preferir hooks que logam uma vez por transicao de switch, chamada de common event ou faixa curta de indices.

- **O que aconteceu:** Foram criados artefatos intermediarios da primeira tentativa de Fase 4 que depois se mostraram insuficientes.
  - **Impacto estimado:** baixo.
  - **Causa:** A fase foi tratada como concluida estruturalmente antes do Playtest do retry.
  - **Como evitar:** Em bugs runtime, nao declarar "complete structurally" para o ponto de maior risco sem antes haver um checkpoint manual minimo naquele fluxo.

## 6. Caminho minimo recomendado

1. Ler `task-4.1.md`, `task-4.2.md`, `Jhonny/CLAUDE.md` e a skill `rpg-maker-mz-data-json`.
   - Entrada: paths do plano e do projeto.
   - Ferramenta: `sed`.
   - Resultado esperado: escopo e regras de mutacao confirmados.
   - Criterio para seguir: saber quais JSONs podem ser tocados e onde salvar scripts.

2. Inspecionar localmente `CE3`, `CE5`, `CE19` e `Map001 Init Corrida`.
   - Entrada: `data/CommonEvents.json`, `data/Map001.json`.
   - Ferramenta: script Python de leitura ou snippet de shell.
   - Resultado esperado: localizar o comando de preload, o comando de `SW_RACE_ACTIVE ON` e a forma de retry.
   - Criterio para seguir: identificar se o retry depende de reload de mapa ou de bootstrap explicito.

3. Se o usuario ja reportou que o retry chega em `CE5`, testar primeiro a hipotese "preload bloqueia retry".
   - Entrada: logs do usuario ou traces equivalentes.
   - Ferramenta: leitura dos logs existentes; so pedir novo probe se faltar provar uma transicao.
   - Resultado esperado: confirmar ou refutar `CE19 -> CE5 -> CE3` e ausencia do `SW100 ON`.
   - Criterio para seguir: se confirmado, parar a investigacao ampla e desenhar patch local em `CE5`.

4. Criar um audit script salvo.
   - Entrada: estrutura atual de `CE5`.
   - Ferramenta: Python salvo em `builds/fase4/`.
   - Resultado esperado: registrar os indices criticos e precondicoes do patch.
   - Criterio para seguir: audit executa sem falhar.

5. Criar e executar um script de mutacao minimo em `CommonEvents.json`.
   - Entrada: indices confirmados de `CE5`.
   - Ferramenta: Python salvo em `builds/fase4/`.
   - Resultado esperado: `CE3` protegido por guarda de attempt; `SW_RACE_ACTIVE ON` intacto apos o bloco.
   - Criterio para seguir: JSON reparseado e asserts pos-escrita aprovados.

6. Rodar o validador estrutural.
   - Entrada: JSONs modificados.
   - Ferramenta: `03_validate_race_dialogue_integration.py`.
   - Resultado esperado: parse limpo e resumo correto da janela de bootstrap.
   - Criterio para seguir: validador confirma o guarda e as rotas.

7. Pedir ao usuario um Playtest curto e objetivo.
   - Entrada: cenario minimo "perder Corrida 1 ou 2 e apertar Espaco".
   - Ferramenta: nenhuma.
   - Resultado esperado: confirmacao do runtime.
   - Criterio para encerrar: usuario confirma que o black screen sumiu ou reporta novo sintoma com log novo.

## 7. Conhecimento reutilizavel

### Fatos confirmados

- O black screen remanescente nao era mais causado pelo `Init Corrida` de `Map001`; o retry ja chegava em `CE5 EV_RaceOrchestrator`.
- O stall ocorria dentro de `CE3 EV_Preload`, antes do comando de `SW_RACE_ACTIVE ON` em `CE5`.
- `CE5` incrementa `V[112]` no inicio e esse valor pode distinguir bootstrap frio de retry.
- O patch funcional foi: executar `CE3` apenas quando `V[112] <= 1`, e pular preload nos retries.
- Os marcadores executaveis da Corrida 3 em `Map013` continuam sendo os pontos nos arredores dos comandos `7082/7083` e `7108/7109`.

### Preferencias do usuario

- O usuario gosta de debug interativo com comandos curtos para rodar no console/terminal e devolver a saida.
- O usuario prefere que cada comando de debug venha com uma linha curta explicando o que ele tenta provar ou descartar.
- O usuario tolera iteracao exploratoria, mas percebe e sinaliza quando os probes ficam repetitivos ou sem progresso.

### Restricoes tecnicas

- `data/*.json` so podem ser alterados por scripts Python salvos no plano.
- `CommonEvents.json` e `Map*.json` sao fontes de verdade; nao editar manualmente.
- Validacao final de comportamento depende de Playtest do usuario.
- Em Playtest com console aberto, alguns probes afetam a capacidade de observar o jogo em tempo real.

### Armadilhas conhecidas

- Assumir cedo demais que `Erase Event` e a unica causa de um retry quebrado.
- Instrumentar o interpreter inteiro com logs continuos.
- Declarar fase resolvida estruturalmente antes de testar o fluxo runtime de maior risco.

### Heuristicas recomendadas

- Em retry bugado de RPG Maker, rastrear primeiro o ultimo command index que certamente executou e o primeiro command index esperado que nao executou.
- Se um common event child interpreter esta envolvido, inspecionar a fronteira "call child -> return -> switch on" antes de mexer em transferencias ou paginas de mapa.
- Reusar variavel de attempt ja existente e mais seguro do que introduzir nova state flag para separar cold start de retry.

## 8. Informacoes que deveriam estar no prompt inicial

- **Obrigatorio:** que o diagnostico confirmado era `CE19 -> CE5 -> CE3`, com stall antes de `SW_RACE_ACTIVE ON`.
- **Obrigatorio:** que a tarefa deveria priorizar um patch local em `CE5` antes de reabrir `CE19`, `CE18` ou `Map001`.
- **Util:** ultimo resumo dos probes relevantes ja coletados, para evitar pedir novamente traces equivalentes.
- **Util:** observacao de que o console durante o Playtest pode atrapalhar a observacao em tempo real.
- **Opcional:** nome sugerido para a retrospectiva da fase.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na analise tecnica

- **Problema observado durante a execucao:** A investigacao inicial da Fase 4 reabriu hipoteses sobre `Map001` e `Erase Event` mesmo apos o retry ja estar entrando em `CE5`.
  - **Informacao que estava ausente ou incorreta:** Faltava registrar que o risco tecnico principal era "retry sem reload de mapa pode falhar dentro do bootstrap chamado por common event, mesmo quando o handoff aconteceu".
  - **Por que essa informacao pertence a analise tecnica:** Descreve arquitetura e risco estrutural do sistema de corrida.
  - **Em qual secao da analise tecnica ela deveria ser adicionada ou alterada:** `Causa Raiz Confirmada` ou nova secao `Riscos Tecnicos`.
  - **Texto sugerido para a alteracao:** `Risco adicional: apos a correcao do handoff de derrota para CE5, o retry na mesma carga de Map001 nao pode depender do autorun Init Corrida. Se o bootstrap for refeito via common event, deve-se validar que qualquer preload filho retorna antes do ponto que religa SW_RACE_ACTIVE.`
  - **Impacto esperado na proxima execucao:** Reduz exploracao desnecessaria em `Map001` e move o foco mais cedo para `CE3/CE5`.

### 9.2 Melhorias no plano de implementacao

- **Problema observado durante a execucao:** A Fase 4 foi tratada como "complete structurally" antes de um checkpoint manual minimo do fluxo de derrota.
  - **Deficiencia do plano de implementacao:** O plano nao exigia um gate de Playtest logo apos o fix do bootstrap de derrota, antes de considerar a fase estruturalmente fechada.
  - **Etapa afetada:** Fase 4.
  - **Alteracao recomendada:** Inserir um checkpoint obrigatorio de Playtest curto logo apos o patch do retry, antes de consolidar a validacao da Corrida 3.
  - **Texto sugerido para a alteracao:** `Antes de considerar a Fase 4 estruturalmente concluida, executar um checkpoint manual minimo: perder Corrida 1 ou 2, pressionar Espaco na tela de resultado e confirmar que SW_RACE_ACTIVE volta a ligar sem tela preta.`
  - **Como a mudanca reduziria custo, risco ou retrabalho:** Evita declarar conclusao prematura e reduz artefatos reabertos depois.

### 9.3 Melhorias nas tasks da fase executada

- **Task afetada:** `task-4.1`.
  - **Informacao ausente, ambigua ou incorreta:** O texto dizia para auditar `CE19/CE18/Map001`, mas nao priorizava explicitamente a fronteira `CE5 -> CE3 -> SW_RACE_ACTIVE`.
  - **Consequencia observada durante a execucao:** A investigacao consumiu muitas interacoes antes de isolar o ponto exato do stall.
  - **Alteracao recomendada:** Adicionar um checkpoint de ordem de investigacao.
  - **Texto sugerido para incluir ou substituir na task:** `Ordem obrigatoria de diagnostico do retry: (1) confirmar se CE19 chama CE5, (2) confirmar se CE5 chega ao child CE3, (3) localizar se o primeiro comando nao executado esta antes ou depois do SW_RACE_ACTIVE ON. Somente se uma dessas etapas falhar reabrir hipoteses em Map001 ou CE18.`
  - **Como validar que a nova instrucao e suficiente:** A proxima execucao deve conseguir desenhar o patch sem pedir probes redundantes sobre `Map001`.

- **Task afetada:** `task-4.2`.
  - **Informacao ausente, ambigua ou incorreta:** A task nao exigia um reteste minimo imediato apos cada patch do retry.
  - **Consequencia observada durante a execucao:** O fluxo chegou a gerar validacao estrutural antes do risco principal ser testado manualmente.
  - **Alteracao recomendada:** Exigir reteste curto pos-patch antes de fechar qualquer subtask estrutural do retry.
  - **Texto sugerido para incluir ou substituir na task:** `Apos qualquer mutacao em CE19, CE5, CE18 ou Map001 relacionada ao retry, pedir imediatamente um Playtest curto do usuario focado em derrota de Corrida 1 ou 2 antes de registrar a task como completa estruturalmente.`
  - **Como validar que a nova instrucao e suficiente:** A proxima execucao deve detectar cedo se o patch corrige ou nao o black screen.

### 9.4 Problemas fora do escopo dos artefatos

- **Problema observado:** O console/traces podem pausar ou atrapalhar a observacao do jogo em tempo real.
  - **Por que ele esta fora do escopo dos artefatos:** E uma limitacao operacional do modo de debug, nao da especificacao.
  - **Como deveria ser tratado:** Como regra operacional do agente durante investigacao interativa.
  - **Se exige alguma protecao operacional, automacao, documentacao separada ou nenhuma acao:** Exige protecao operacional: usar probes pontuais e throttled.

- **Problema observado:** Um trace muito verboso flodou o terminal do usuario.
  - **Por que ele esta fora do escopo dos artefatos:** Foi falha de instrumentacao da execucao, nao ausencia de requisito.
  - **Como deveria ser tratado:** Melhor desenho de hooks e logs durante o debug.
  - **Se exige alguma protecao operacional, automacao, documentacao separada ou nenhuma acao:** Exige heuristica operacional, nao mudanca na especificacao.

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsavel | Alteracao necessaria | Prioridade |
| --- | --- | --- | --- | --- |
| Investigacao longa demais em `Map001` apos retry ja entrar em `CE5` | Risco estrutural nao documentado | Analise tecnica | Registrar explicitamente o risco de stall dentro do bootstrap chamado por common event | Alta |
| Fase 4 marcada cedo demais como estruturalmente concluida | Falta de gate minimo de Playtest do retry | Plano de implementacao | Inserir checkpoint manual curto apos patch do retry | Alta |
| Muitos probes para provar o mesmo ponto entre `CE5` e `CE3` | Ordem de diagnostico nao estava explicita | Task | Definir ordem obrigatoria de diagnostico do retry | Alta |
| Validacao estrutural produzida antes do reteste minimo pos-patch | Falta de regra pos-mudanca em task de validacao | Task | Exigir reteste curto imediato apos mutacoes no retry | Media |
| Flood de logs no terminal | Hook operacional ruim | Fora do escopo | Adotar throttle e filtros em toda instrumentacao | Media |

### 9.6 Resultado final recomendado

#### Patch sugerido para a analise tecnica

```md
## Riscos Tecnicos

- Risco adicional: apos a correcao do handoff de derrota para `CE5`, o retry na mesma carga de `Map001` nao pode depender do autorun `Init Corrida`.
- Se o bootstrap for refeito via common event, validar especificamente a cadeia `CE5 -> child preload -> SW_RACE_ACTIVE ON`.
- Um stall dentro do child interpreter de preload produz tela preta com `SW_RACE_ACTIVE = false`, mesmo quando o handoff de derrota ocorreu corretamente.
```

#### Patch sugerido para o plano de implementacao

```md
### Phase 4 - Race 3 Map013 Integration

Checkpoint obrigatorio antes de considerar a fase estruturalmente concluida:
- perder Corrida 1 ou Corrida 2;
- pressionar Espaco na tela de resultado;
- confirmar que `SW_RACE_ACTIVE` volta a ligar sem tela preta morta.

Somente apos esse checkpoint o restante da matriz de Race 3 deve ser consolidado.
```

#### Patch sugerido para as tasks da fase executada

```md
Task 4.1
- Ordem obrigatoria de diagnostico do retry:
  1. confirmar se `CE19` chama `CE5`;
  2. confirmar se `CE5` chega ao child `CE3`;
  3. localizar se o primeiro comando nao executado esta antes ou depois do `SW_RACE_ACTIVE ON`.
- Somente se uma dessas etapas falhar reabrir hipoteses em `Map001` ou `CE18`.
```

```md
Task 4.2
- Apos qualquer mutacao em `CE19`, `CE5`, `CE18` ou `Map001` relacionada ao retry, pedir imediatamente um Playtest curto do usuario focado em derrota de Corrida 1 ou 2 antes de registrar a task como completa estruturalmente.
```

#### Acoes fora do fluxo de especificacao

- Padronizar probes de debug com throttle, filtro por command index e auto-desligamento.
- Em novas investigacoes runtime, parar a coleta quando o ultimo comando executado e o primeiro comando faltante ja estiverem comprovados.

## 10. Checklist operacional

- [ ] Ler `Jhonny/CLAUDE.md` e `rpg-maker-mz-data-json` antes de tocar em `data/*.json`.
- [ ] Confirmar que qualquer mutacao em JSON sera feita por script Python salvo no plano.
- [ ] Inspecionar primeiro `CE3`, `CE5`, `CE19` e `Map001` localmente antes de pedir novos probes ao usuario.
- [ ] Se o retry ja chega em `CE5`, testar imediatamente a fronteira `CE3 -> SW_RACE_ACTIVE ON`.
- [ ] Nao reabrir hipoteses em `Map001` sem evidencia de que `CE5` nao foi alcancado.
- [ ] Toda instrumentacao runtime deve ter throttle ou filtro.
- [ ] Todo probe pedido ao usuario deve vir com uma linha curta de objetivo antes do comando.
- [ ] Aplicar patches pequenos e locais em common events antes de reestruturar varios fluxos.
- [ ] Rodar o validador estrutural apos cada script de mutacao.
- [ ] Pedir um Playtest curto imediatamente apos qualquer patch do retry.
- [ ] Encerrar a execucao somente apos confirmacao manual do usuario para o fluxo runtime corrigido.
