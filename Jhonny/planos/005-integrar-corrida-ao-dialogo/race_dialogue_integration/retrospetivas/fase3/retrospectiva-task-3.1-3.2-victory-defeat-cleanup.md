# Retrospectiva Tecnica - Tasks 3.1 e 3.2 Victory Defeat Cleanup

## 1. Resumo da tarefa

O usuario solicitou executar a Fase 3 do plano `race_dialogue_integration`, usando:

- `FASE_ATUAL`: fase 3.
- `TASKS_MD`: `Jhonny/planos/005-integrar-corrida-ao-dialogo/race_dialogue_integration/tasks.md`.
- `DIR_ANALISE`: `Jhonny/planos/005-integrar-corrida-ao-dialogo/analise-integracao-corrida-dialogo.md`.

Resultado entregue:

- `Jhonny/data/CommonEvents.json` foi alterado apenas no Common Event `19` `EV_VitoriaCorrida`.
- A vitoria deixou de autoavancar via `VAR_RACE_ID += 1` e `CE5`.
- A derrota permaneceu no fluxo de retry via `CE18`, sem transferir para mapas narrativos.
- Foram adicionados cleanup de corrida antes do transfer narrativo: `SW_RACE_ACTIVE OFF`, `erasePicture(1..61)` e `$gameTemp.clearCommonEventReservation();`.
- Scripts auditaveis foram salvos em `builds/fase3/`.
- Resumos e auditorias foram salvos em `interaction/fase3/`.
- `tasks.md`, `task-3.1.md` e `task-3.2.md` foram atualizados para `complete_structural_pending_playtest`.

Criterios de conclusao estrutural:

- `CommonEvents.json` parseou com `python3 -m json.tool`.
- CE19 passou a ter transfers explicitos:
  - Race 1 -> `[0, 5, 3, 2, 0, 0]`
  - Race 2 -> `[0, 13, 4, 5, 0, 0]`
  - Race 3 -> `[0, 12, 0, 0, 0, 0]`
- CE19 nao incrementa mais `VAR_RACE_ID`, nao chama mais CE5 na vitoria e nao usa mais `FIM_LOOP` para Race 3.
- Runtime continuou pendente de Playtest no RPG Maker MZ.

Restricoes relevantes:

- `data/*.json` nao pode ser editado diretamente; mutacoes exigem script Python salvo no plano.
- O escopo da Fase 3 era apenas `CommonEvents.json`, sem tocar `Map013`.
- Validacao de runtime depende de Playtest e nao pode ser assumida pela estrutura do JSON.

## 2. Decisoes tecnicas e inferencias

### Decisao 1

- **Decisao ou inferencia:** Usar `retrospetivas/fase3/` como destino desta retrospectiva.
- **Motivo:** O usuario invocou a skill sem informar path no turno atual.
- **Evidencia disponivel:** Ja existiam `retrospetivas/fase1/` e `retrospetivas/fase2/` no mesmo plano.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Tratar a pasta `retrospetivas/faseN/` como convencao explicita do plano quando ja existir para fases anteriores.

### Decisao 2

- **Decisao ou inferencia:** Concentrar a implementacao somente em CE19 `EV_VitoriaCorrida`.
- **Motivo:** Era preciso confirmar se a Fase 3 exigia tocar mapas narrativos ou `Map013`.
- **Evidencia disponivel:** `task-3.1.md` e `task-3.2.md` citavam apenas `Jhonny/data/CommonEvents.json`; a analise e o subagente confirmaram que `Map013` era escopo da Fase 4.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Ler primeiro `task-3.1.md` e `task-3.2.md`; isso sozinho ja fixa o write set.

### Decisao 3

- **Decisao ou inferencia:** Reusar como parametros de `Transfer Player` os destinos narrativos ja existentes do projeto.
- **Motivo:** As tasks especificavam os mapas de destino, mas nao fixavam explicitamente todos os seis parametros dos comandos `201`.
- **Evidencia disponivel:** `Map010` ja usava `[0, 5, 3, 2, 0, 0]`, `Map005` ja usava `[0, 13, 4, 5, 0, 0]`, `Map012` ja aparecia com transfer `[0, 12, 0, 0, 0, 0]`.
- **Resultado:** Funcionou estruturalmente.
- **Avaliacao:** Necessaria por falta de especificacao completa.
- **Melhoria futura:** Registrar nas tasks os parametros exatos de transfer esperados para cada race.

### Decisao 4

- **Decisao ou inferencia:** Preservar a derrota via CE18 em vez de reconstruir um fluxo novo dentro de CE19.
- **Motivo:** Era preciso manter retry em `Map001` sem introduzir novas ramificacoes nao especificadas.
- **Evidencia disponivel:** A analise previa e a inspeccao de CE18 mostravam que o evento ja fazia reset parcial e reinicio estrutural da corrida.
- **Resultado:** Funcionou estruturalmente.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Incluir na task um resumo do contrato esperado de CE18 para evitar releitura ampla.

### Decisao 5

- **Decisao ou inferencia:** Inserir `$gameTemp.clearCommonEventReservation();` como script event command em CE19.
- **Motivo:** Havia risco de vazamento de clicks/inputs reservados via `ButtonPicture` e `CE13`.
- **Evidencia disponivel:** `rmmz_objects.js` expunha `Game_Temp.clearCommonEventReservation`; `CE13` e `ButtonPicture.js` usavam `reserveCommonEvent`.
- **Resultado:** Funcionou estruturalmente.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** A analise tecnica deveria trazer essa verificacao de API segura antes da fase de implementacao.

### Decisao 6

- **Decisao ou inferencia:** Expandir o cleanup de pictures de `1..60` para `1..61`.
- **Motivo:** A task ja suspeitava de vazamento, mas era preciso confirmar o limite superior real.
- **Evidencia disponivel:** `CE8` e `CE9` usavam picture `61`; o cleanup antigo em CE18 e CE19 apagava apenas `1..60`.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Esse fato deveria estar consolidado na analise tecnica e na task 3.2 como dado confirmado, nao apenas como observacao.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta ou comando | Objetivo | Resultado | Contribuiu? | Substituivel? | Como evitar redundancia |
| --- | --- | --- | --- | --- | --- |
| `sed Jhonny/CLAUDE.md` | Confirmar regras do projeto RPG Maker MZ | Confirmou Playtest, parser/writer e cuidado com `data/*.json` | Sim | Nao | Ler uma vez no inicio da fase |
| `sed tasks.md`, `task-3.1.md`, `task-3.2.md`, analise | Confirmar escopo e criterios da Fase 3 | Fixou CE19 como alvo principal | Sim | Nao | Comecar pelas tasks antes da analise ampla |
| `sed rpg-maker-mz-data-json/SKILL.md`, `workflow.md`, `CommonEvents.md`, `map.md` | Confirmar workflow script-first e schema | Confirmou obrigacao de script salvo e indices de Common Events | Sim | `map.md` foi pouco util | Em Fase 3, `CommonEvents.md` bastava; `map.md` era desnecessario |
| `tool_search` + `spawn_agent` | Atender o workflow do usuario de usar agente em paralelo | O primeiro `spawn_agent` falhou por combinacao invalida com `fork_context`; o segundo funcionou e confirmou o diagnostico | Parcialmente | So o `spawn_agent` valido era necessario | Pular `tool_search`; a ferramenta ja estava disponivel. Nao usar `fork_context=true` com `agent_type` customizado |
| `rg` em `data/` e `js/` | Localizar `EV_VitoriaCorrida`, `SW_RACE_ACTIVE` e API de queue cleanup | Encontrou CE19, `reserveCommonEvent` e `clearCommonEventReservation` | Sim | Nao | Fazer uma busca focada desde o inicio; evitar buscas amplas em diretorios inexistentes |
| `rg` em `Jhonny/builds` | Procurar scripts existentes | Falhou porque o diretorio nao existia | Nao | Sim | Procurar diretamente em `planos/.../race_dialogue_integration/builds` |
| Python read-only sobre `CommonEvents.json` | Imprimir CE5, CE18, CE19 e common events correlatos | Confirmou fluxo real, indices e command codes | Sim | Nao | Limitar a CE19 e CE18 depois que o escopo estiver claro |
| Python read-only sobre `Map005`, `Map010`, `Map012`, `Map013` | Inferir parametros completos de transfer | Confirmou transfers-base usados para montar CE19 | Sim | Poderia ser menor | Ler apenas os maps que fornecem os tres destinos necessarios |
| `01_update_victory_defeat_routing.py` | Reescrever o branch final de CE19 | Removeu auto-advance e adicionou transfers por `VAR_RACE_ID` | Sim | Nao, script era obrigatorio | Manter a ideia de validar a sequencia de `code`s antes de escrever |
| `02_add_race_cleanup_before_transfer.py` | Inserir cleanup antes dos transfers | Adicionou `SW_RACE_ACTIVE OFF`, `1..61` e queue clear | Sim | Poderia ser um unico script | Unificar num script se a task permitir; aqui a separacao seguiu as duas tasks da fase |
| `python3 -m py_compile` | Validar sintaxe dos scripts antes de rodar | Sem erros | Sim | Nao | Manter em fases com scripts maiores |
| `python3 -m json.tool CommonEvents.json` | Validar parse do JSON final | Parse OK | Sim | Nao | Rodar uma vez ao final da fase |
| Leitura dos arquivos de retrospectiva anteriores | Descobrir convencao de nome e nivel de detalhe | Confirmou o path de destino | Sim | Sim | Bastava `find` e abertura parcial de um arquivo; dois arquivos completos foi excesso |

## 4. Intervencoes e correcoes do usuario

### Intervencao 1

- **Instrucao dada pelo usuario:** Invocacao de `$loki-retrospectiva-tecnica`.
- **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** A implementacao da fase ja tinha terminado; faltava apenas o artefato de retrospectiva.
- **Qual suposicao ou interpretacao causou o problema:** Nao houve erro anterior; foi uma nova solicitacao.
- **Como a execucao mudou depois da correcao:** A execucao passou de implementacao para documentacao retrospectiva.
- **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Separar claramente pedidos de implementacao e pedidos de documentacao final; nao presumir retrospectiva se o usuario nao pediu.

Nao houve correcao do usuario sobre a execucao tecnica da Fase 3.

## 5. Analise de desperdicio

### Desperdicio 1

- **O que aconteceu:** Houve uma tentativa inicial de `spawn_agent` que falhou por combinacao invalida de `fork_context=true` com `agent_type`.
- **Impacto estimado:** Baixo.
- **Causa:** Uso desnecessario de uma opcao incompatível com a forma escolhida de delegacao.
- **Como evitar:** Chamar `spawn_agent` de forma minima quando o agente so precisa ler o codebase.

### Desperdicio 2

- **O que aconteceu:** Busca em `Jhonny/builds` retornou erro porque o diretorio correto estava dentro do plano.
- **Impacto estimado:** Baixo.
- **Causa:** Assuncao de path baseada no nome do plano, sem verificar a estrutura real.
- **Como evitar:** Usar o proprio `TASKS_MD` como ancora e procurar `builds/` relativo ao diretório da task.

### Desperdicio 3

- **O que aconteceu:** Leitura de `map.md` e leitura ampla de maps e common events antes de fechar a necessidade exata.
- **Impacto estimado:** Medio.
- **Causa:** Exploracao maior que o necessario para uma fase cujo write set era um unico Common Event.
- **Como evitar:** Validar primeiro a task alvo e depois abrir apenas arquivos que contribuam para um valor ainda desconhecido.

### Desperdicio 4

- **O que aconteceu:** O subagente confirmou em paralelo grande parte do que ja era observavel localmente.
- **Impacto estimado:** Medio.
- **Causa:** O workflow do usuario exigia agente em paralelo quando havia pre-analise.
- **Como evitar:** Se a regra continuar, delegar uma pergunta ainda mais estreita, por exemplo apenas "quais indices/parametros de CE19 mudam".

### Desperdicio 5

- **O que aconteceu:** Leitura de duas retrospectivas anteriores para descobrir convencao de path e formato.
- **Impacto estimado:** Baixo.
- **Causa:** Confirmacao excessiva do padrao.
- **Como evitar:** Um `find` do diretorio e abertura parcial de um unico exemplo basta.

## 6. Caminho minimo recomendado

1. **Acao:** Ler `tasks.md` apenas ate a Fase 3 e abrir `task-3.1.md` e `task-3.2.md`.
   - **Entrada:** `FASE_ATUAL=3`, `TASKS_MD`.
   - **Ferramenta:** `sed`.
   - **Resultado esperado:** fixar que o alvo unico e `CommonEvents.json`, CE19.
   - **Criterio:** nenhum arquivo de mapa entra no write set.

2. **Acao:** Carregar somente as regras indispensaveis.
   - **Entrada:** `Jhonny/CLAUDE.md`, `rpg-maker-mz-data-json/SKILL.md`, `workflow.md`, `CommonEvents.md`.
   - **Ferramenta:** `sed`.
   - **Resultado esperado:** confirmar script-first e parse/Playtest obrigatorios.
   - **Criterio:** nenhuma edicao direta em `data/*.json`.

3. **Acao:** Inspecionar CE19 e CE18 com um script read-only.
   - **Entrada:** `Jhonny/data/CommonEvents.json`.
   - **Ferramenta:** Python read-only.
   - **Resultado esperado:** confirmar `VAR_RACE_ID += 1`, `CE5`, `FIM_LOOP`, `CE18` e os indices do branch final.
   - **Criterio:** estrutura real bate com a task; se divergir, criar blocker e parar.

4. **Acao:** Inspecionar apenas os transfers-base necessarios.
   - **Entrada:** `Map010.json`, `Map005.json`, `Map012.json`.
   - **Ferramenta:** Python read-only.
   - **Resultado esperado:** obter os parametros completos dos transfers narrativos a reusar.
   - **Criterio:** os tres arrays de `Transfer Player` estao definidos.

5. **Acao:** Verificar a API de limpeza da fila reservada.
   - **Entrada:** `js/rmmz_objects.js`, `data/CommonEvents.json`, `js/plugins/ButtonPicture.js`.
   - **Ferramenta:** `rg` e `sed`.
   - **Resultado esperado:** confirmar `reserveCommonEvent` e `clearCommonEventReservation`.
   - **Criterio:** a task 3.2 pode inserir script call segura.

6. **Acao:** Criar os scripts da fase.
   - **Entrada:** estrutura confirmada de CE19.
   - **Ferramenta:** `apply_patch`.
   - **Resultado esperado:** `01_update_victory_defeat_routing.py` e `02_add_race_cleanup_before_transfer.py`.
   - **Criterio:** cada script valida precondicoes por sequencia de `code`s e parametros.

7. **Acao:** Validar sintaxe dos scripts e executa-los.
   - **Entrada:** scripts salvos.
   - **Ferramenta:** `python3 -m py_compile` e `python3 script.py`.
   - **Resultado esperado:** JSON alterado com auditoria escrita em `interaction/fase3/`.
   - **Criterio:** scripts imprimem os transfers finais e o cleanup inserido.

8. **Acao:** Validar o JSON final e reler apenas o trecho modificado de CE19.
   - **Entrada:** `CommonEvents.json`.
   - **Ferramenta:** `python3 -m json.tool` e Python read-only.
   - **Resultado esperado:** parse OK e branch final coerente.
   - **Criterio:** CE19 termina em `code 0`, derrota segue para CE18, vitoria nao tem mais `CE5` nem `FIM_LOOP`.

9. **Acao:** Atualizar `task-3.1.md`, `task-3.2.md`, `tasks.md` e `interaction/fase3/execution-summary.md`.
   - **Entrada:** validacao estrutural concluida.
   - **Ferramenta:** `apply_patch`.
   - **Resultado esperado:** fase marcada como `complete_structural_pending_playtest`.
   - **Criterio:** somente Playtest permanece pendente.

## 7. Conhecimento reutilizavel

### Fatos confirmados

- CE19 `EV_VitoriaCorrida` era o unico ponto da Fase 3 que precisava de mutacao.
- O branch antigo de vitoria usava `VAR_RACE_ID += 1`, depois `CE5`, e Race 3 caia em `FIM_LOOP`.
- O branch de derrota antigo chamava `CE18 EV_Crash`.
- `SW_RACE_ACTIVE` e o switch `100`.
- `SW_PAUSED` e o switch `104`.
- `VAR_RACE_ID` e a variavel `100`.
- `VAR_VITORIA_PASSOU` e a variavel `117`.
- A fila de common events pode ser limpa com `$gameTemp.clearCommonEventReservation();`.
- A corrida usa picture `61`; cleanup `1..60` e insuficiente.
- Os transfers narrativos finais usados na Fase 3 foram:
  - Race 1 -> `[0, 5, 3, 2, 0, 0]`
  - Race 2 -> `[0, 13, 4, 5, 0, 0]`
  - Race 3 -> `[0, 12, 0, 0, 0, 0]`

### Preferencias do usuario

- Executar o plano por fase, sem replanejar.
- Salvar scripts, logs, summaries e retrospectivas dentro da pasta do proprio plano.
- Quando houver pre-analise, usar agente em paralelo para extrair informacoes relevantes.
- Nao considerar comportamento de RPG Maker MZ como validado sem Playtest.

### Restricoes tecnicas

- `data/*.json` deve ser mutado somente por script Python salvo no plano.
- A task deve parar e documentar blocker se a estrutura real do event command list divergir da task.
- CE19 depende de command codes e indentacao coerente; pequenas mudancas no branch final quebram asserts.

### Armadilhas conhecidas

- As tasks da Fase 3 nao fixavam todos os parametros de `Transfer Player`; sem checagem local e facil usar coordenadas erradas.
- Buscar `builds/` na raiz de `Jhonny/` gera falso negativo; os scripts ficam sob o diretorio do plano.
- O subagente pode repetir descobertas obvias se a pergunta delegada for ampla demais.
- Ler maps que nao participam da fase aumenta contexto sem mudar o write set.

### Heuristicas recomendadas

- Em fases de Common Event, comece pela task especifica e por CE19/CE18; nao abra mapas antes de precisar de um valor exato.
- Quando a task falar em "cleanup antes de transfer", verifique sistematicamente: switch de loop, pictures, tint, audio e queue reservation.
- Para `Transfer Player`, reutilize um comando existente do proprio projeto quando a task nao fixar o array completo.
- Se a task exigir comportamento "sem vazar para o mapa narrativo", valide tambem queue reservation, nao so HUD/pictures.

## 8. Informacoes que deveriam estar no prompt inicial

- **Obrigatorio:** arrays completos esperados dos `Transfer Player` de Race 1, 2 e 3.
- **Util:** contrato resumido de CE18, deixando explicito que ele deve ser preservado como fluxo de derrota.
- **Util:** confirmacao explicita de que picture `61` faz parte do HUD da corrida.
- **Util:** path convencional das retrospectivas do plano, para evitar releitura de exemplos.
- **Opcional:** instruir se a retrospectiva deve cobrir apenas a fase executada ou tambem a meta-execucao da skill.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na analise tecnica

#### Melhoria 1

- **Problema observado durante a execucao:** Foi necessario inspecionar maps narrativos para inferir os parametros completos dos `Transfer Player`.
- **Informacao que estava ausente ou incorreta:** A analise listava apenas o mapa de destino pos-vitoria, nao o array completo do comando `201`.
- **Por que essa informacao pertence a analise tecnica:** E um detalhe do comportamento existente e da integracao entre mapas, nao uma instrucao operacional da task.
- **Em qual secao da analise tecnica ela deveria ser adicionada ou alterada:** `Saidas Pos-Vitoria`.
- **Texto sugerido para a alteracao:**

```markdown
## Saidas Pos-Vitoria

Os transfers narrativos a serem reutilizados em `EV_VitoriaCorrida` sao:

- `VAR_RACE_ID = 1` -> `Transfer Player [0, 5, 3, 2, 0, 0]`
- `VAR_RACE_ID = 2` -> `Transfer Player [0, 13, 4, 5, 0, 0]`
- `VAR_RACE_ID = 3` -> `Transfer Player [0, 12, 0, 0, 0, 0]`
```

- **Impacto esperado na proxima execucao:** Elimina uma inferencia operacional e evita leitura desnecessaria de mapas.

#### Melhoria 2

- **Problema observado durante a execucao:** Foi necessario confirmar tardiamente que `clearCommonEventReservation()` existia e era a chamada correta para evitar vazamento de input.
- **Informacao que estava ausente ou incorreta:** A analise mencionava risco de fila reservada, mas nao registrava a API concreta disponivel no engine.
- **Por que essa informacao pertence a analise tecnica:** Trata-se de uma capacidade tecnica do engine relevante para a estrategia de cleanup.
- **Em qual secao da analise tecnica ela deveria ser adicionada ou alterada:** `Efeitos Colaterais Confirmados`, subseção `Fila de Common Events`.
- **Texto sugerido para a alteracao:**

```markdown
### Fila de Common Events

`ButtonPicture` e `EV_KeyInput` podem reservar Common Events via `$gameTemp.reserveCommonEvent(...)`.
O engine expõe `$gameTemp.clearCommonEventReservation()` em `rmmz_objects.js`, permitindo limpeza explicita da fila antes do `Transfer Player`.
```

- **Impacto esperado na proxima execucao:** Reduz investigacao no core e acelera a implementacao da task 3.2.

### 9.2 Melhorias no plano de implementacao

#### Melhoria 1

- **Problema observado durante a execucao:** A fase precisou descobrir durante a implementacao quais coordenadas narrativas seriam usadas nos transfers finais.
- **Deficiencia do plano de implementacao:** O objetivo da Phase 3 definia destinos por mapa, mas nao listava os parametros completos dos transfers nem o fato de que eles deveriam ser reutilizados do fluxo narrativo atual.
- **Etapa afetada:** `Phase 3 - Victory, Defeat, and Cleanup Lifecycle`.
- **Alteracao recomendada:** Acrescentar uma nota operacional curta sob o objetivo da fase.
- **Texto sugerido para a alteracao:**

```markdown
Implementation note: reuse the existing narrative `Transfer Player` parameters already present in the current map flows for `Map005`, `Map013`, and `Map012` rather than inventing new landing coordinates.
```

- **Como a mudanca reduziria custo, risco ou retrabalho:** Evita leitura exploratoria de mapas e diminui risco de coordenada incorreta.

### 9.3 Melhorias nas tasks da fase executada

#### Melhoria 1

- **Task afetada:** `task-3.1.md`
- **Informacao ausente, ambigua ou incorreta:** A task dizia para transferir por `VAR_RACE_ID`, mas nao fixava os arrays completos esperados.
- **Consequencia observada durante a execucao:** Foi necessario inferir coordenadas e direcao a partir de outros mapas.
- **Alteracao recomendada:** Adicionar os tres arrays esperados em `Implementation Details` ou `requirements`.
- **Texto sugerido para incluir ou substituir:**

```markdown
Expected transfer parameters:

- Race 1 -> `Transfer Player [0, 5, 3, 2, 0, 0]`
- Race 2 -> `Transfer Player [0, 13, 4, 5, 0, 0]`
- Race 3 -> `Transfer Player [0, 12, 0, 0, 0, 0]`
```

- **Como validar que a nova instrucao e suficiente:** O executor nao precisa abrir nenhum mapa narrativo para montar CE19.

#### Melhoria 2

- **Task afetada:** `task-3.2.md`
- **Informacao ausente, ambigua ou incorreta:** A task dizia para investigar `clearCommonEventReservation`, mas nao informava onde a reserva ocorria nem que a API ja existia no engine.
- **Consequencia observada durante a execucao:** Houve busca exploratoria adicional em `js/` e `data/`.
- **Alteracao recomendada:** Registrar explicitamente as duas fontes de reserva e a API segura esperada.
- **Texto sugerido para incluir ou substituir:**

```markdown
Known reservation sources:

- `CE13 EV_KeyInput` uses `$gameTemp.reserveCommonEvent(11/12)`.
- `ButtonPicture.js` reserves Common Events on picture clicks.

Expected cleanup call:

- Clear the queue with `$gameTemp.clearCommonEventReservation();` before any narrative transfer unless the engine contract has changed.
```

- **Como validar que a nova instrucao e suficiente:** O executor so precisa confirmar que a API ainda existe no engine, sem redescobrir o problema.

#### Melhoria 3

- **Task afetada:** `task-3.2.md`
- **Informacao ausente, ambigua ou incorreta:** O texto falava em apagar pictures ate `61`, mas nao explicitava que `61` era de fato usada na corrida.
- **Consequencia observada durante a execucao:** Foi necessario reler CE8 e CE9 para confirmar a necessidade.
- **Alteracao recomendada:** Promover o dado de observacao para precondicao confirmada.
- **Texto sugerido para incluir ou substituir:**

```markdown
Confirmed race picture usage includes picture `61` in CE8/CE9, so cleanup limited to `1..60` is insufficient.
```

- **Como validar que a nova instrucao e suficiente:** O executor pode modificar o cleanup imediatamente e depois apenas confirmar a estrutura final.

### 9.4 Problemas fora do escopo dos artefatos

#### Problema 1

- **Problema observado:** A primeira tentativa de `spawn_agent` falhou por uso incorreto da API.
- **Por que ele esta fora do escopo dos artefatos:** Nao e um problema de analise, plano ou task; e erro operacional da LLM ao chamar ferramenta.
- **Como deveria ser tratado:** Ajuste de disciplina operacional ao delegar.
- **Se exige alguma protecao operacional, automacao, documentacao separada ou nenhuma acao:** Nenhuma alteracao nos artefatos; basta simplificar a chamada da ferramenta.

#### Problema 2

- **Problema observado:** Busca em `Jhonny/builds` errou o path.
- **Por que ele esta fora do escopo dos artefatos:** O `TASKS_MD` ja apontava o diretorio correto do plano; a falha foi de navegacao operacional.
- **Como deveria ser tratado:** Derivar paths relativos a partir de `TASKS_MD`.
- **Se exige alguma protecao operacional, automacao, documentacao separada ou nenhuma acao:** Nenhuma alteracao nos artefatos.

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsavel | Alteracao necessaria | Prioridade |
| --- | --- | --- | --- | --- |
| Inferencia manual dos arrays completos de transfer | Analise e task listavam apenas mapas de destino | Analise tecnica e task | Registrar os arrays completos de `Transfer Player` | Alta |
| Investigacao extra sobre limpeza da fila reservada | Analise mencionava o risco, mas nao a API disponivel | Analise tecnica e task | Citar `clearCommonEventReservation()` e as fontes de reserva | Media |
| Confirmacao tardia de que picture 61 vazava | Task tratava `1..61` como observacao, nao como fato confirmado | Task | Declarar explicitamente o uso de picture `61` em CE8/CE9 | Media |
| Falha na primeira chamada de subagente | Uso incorreto da ferramenta | Fora do escopo | Nenhuma mudanca em artefatos; corrigir estrategia operacional | Baixa |
| Busca em path inexistente `Jhonny/builds` | Navegacao operacional frouxa | Fora do escopo | Derivar `builds/` do diretorio do plano | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a analise tecnica

```markdown
## Saidas Pos-Vitoria

Os transfers narrativos a serem reutilizados em `EV_VitoriaCorrida` sao:

- `VAR_RACE_ID = 1` -> `Transfer Player [0, 5, 3, 2, 0, 0]`
- `VAR_RACE_ID = 2` -> `Transfer Player [0, 13, 4, 5, 0, 0]`
- `VAR_RACE_ID = 3` -> `Transfer Player [0, 12, 0, 0, 0, 0]`

### Fila de Common Events

`ButtonPicture` e `EV_KeyInput` podem reservar Common Events via `$gameTemp.reserveCommonEvent(...)`.
O engine expõe `$gameTemp.clearCommonEventReservation()` em `rmmz_objects.js`, permitindo limpeza explicita da fila antes do `Transfer Player`.
```

#### Patch sugerido para o plano de implementacao

```markdown
### Phase 3 - Victory, Defeat, and Cleanup Lifecycle

Implementation note: reuse the existing narrative `Transfer Player` parameters already present in the current map flows for `Map005`, `Map013`, and `Map012` rather than inventing new landing coordinates.
```

#### Patch sugerido para as tasks da fase executada

```markdown
## Task 3.1

Expected transfer parameters:

- Race 1 -> `Transfer Player [0, 5, 3, 2, 0, 0]`
- Race 2 -> `Transfer Player [0, 13, 4, 5, 0, 0]`
- Race 3 -> `Transfer Player [0, 12, 0, 0, 0, 0]`

## Task 3.2

Known reservation sources:

- `CE13 EV_KeyInput` uses `$gameTemp.reserveCommonEvent(11/12)`.
- `ButtonPicture.js` reserves Common Events on picture clicks.

Expected cleanup call:

- Clear the queue with `$gameTemp.clearCommonEventReservation();` before any narrative transfer unless the engine contract has changed.

Confirmed race picture usage includes picture `61` in CE8/CE9, so cleanup limited to `1..60` is insufficient.
```

#### Acoes fora do fluxo de especificacao

- Simplificar a chamada de `spawn_agent`; nao usar combinacao invalida de parametros.
- Derivar buscas de `builds/` e `interaction/` a partir do diretorio de `TASKS_MD`, nao da raiz do projeto.

## 10. Checklist operacional

- [ ] Ler primeiro `task-3.1.md` e `task-3.2.md`; confirmar que o write set e apenas CE19.
- [ ] Carregar `Jhonny/CLAUDE.md` e o workflow `rpg-maker-mz-data-json` antes de tocar `data/*.json`.
- [ ] Inspecionar CE19 e CE18 antes de escrever qualquer script.
- [ ] Confirmar que a estrutura real de CE19 bate com as precondicoes; se nao bater, criar blocker e parar.
- [ ] Reusar arrays completos de `Transfer Player` do fluxo narrativo existente.
- [ ] Garantir que a vitoria nao deixa `VAR_RACE_ID += 1`, `CE5` nem `FIM_LOOP`.
- [ ] Garantir cleanup minimo antes do transfer: `SW_RACE_ACTIVE OFF`, pictures `1..61`, tint normal, fadeout BGM, queue clear.
- [ ] Validar sintaxe dos scripts com `py_compile` antes de executa-los.
- [ ] Validar `CommonEvents.json` com `python3 -m json.tool` apos as mutacoes.
- [ ] Fechar a fase como estruturalmente concluida, mas manter Playtest como pendente.
