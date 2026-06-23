# Retrospectiva Tecnica - Tasks 2.1 e 2.2 Race Dialogue Entries

## 1. Resumo da tarefa

O usuario solicitou executar a Fase 2 do plano `race_dialogue_integration`, usando:

- `FASE_ATUAL`: fase 2.
- `TASKS_MD`: `planos/005-integrar-corrida-ao-dialogo/race_dialogue_integration/tasks.md`.
- `DIR_ANALISE`: `planos/005-integrar-corrida-ao-dialogo/analise-integracao-corrida-dialogo.md`.

Resultado entregue:

- `Jhonny/data/Map010.json`: `EV001`, pagina 2, manteve `VAR_RACE_ID = 1` e alterou o destino do `Transfer Player` de `Map005` para `Map001`.
- `Jhonny/data/Map005.json`: `EV001`, pagina 3, manteve `VAR_RACE_ID = 2` e alterou o destino do `Transfer Player` de `Map013` para `Map001`.
- Scripts auditaveis foram salvos em `builds/fase2/`.
- Logs e resumo foram salvos em `interaction/fase2/`.
- `tasks.md`, `task-2.1.md` e `task-2.2.md` foram atualizados como estruturalmente concluidos, pendentes de Playtest.

Criterios de conclusao estrutural:

- `Map010.json` e `Map005.json` parsearam com `python3 -m json.tool`.
- Comandos finais confirmados:
  - `Map010`: comando `79` com `VAR_RACE_ID = 1`, comando `80` com transfer `[0, 1, 3, 2, 0, 0]`.
  - `Map005`: comando `104` com `VAR_RACE_ID = 2`, comando `105` com transfer `[0, 1, 4, 5, 0, 0]`.
- Diffs finais dos JSONs ficaram limitados ao `mapId` do comando `201`, apos correcao de formatacao.

Restricoes relevantes:

- `data/*.json` nao pode ser editado diretamente; mutacoes exigem script Python salvo.
- Runtime de RPG Maker MZ depende de Playtest e nao foi marcado como validado.
- A Fase 2 nao inclui `Map013`, vitoria, derrota, cleanup ou `EV_VitoriaCorrida`.

## 2. Decisoes tecnicas e inferencias

### Decisao 1

- **Decisao ou inferencia:** Usar `retrospetivas/fase2/` como destino desta retrospectiva.
- **Motivo:** O usuario invocou a skill sem fornecer caminho explicito no turno atual.
- **Evidencia disponivel:** Existia `retrospetivas/fase1/retrospectiva-task-1.1-map001-race-containment.md` e a estrutura `retrospetivas/fase2/` ja existia.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria para cumprir a skill sem perguntar novamente.
- **Melhoria futura:** Quando um plano ja contem `retrospetivas/faseN/`, tratar essa pasta como convencao inequívoca e anunciar o path antes de escrever.

### Decisao 2

- **Decisao ou inferencia:** Executar apenas `task-2.1` e `task-2.2`.
- **Motivo:** `FASE_ATUAL` era fase 2.
- **Evidencia disponivel:** `tasks.md` listava na Phase 2 somente `task-2.1 - Wire Map010 Race 1 entry` e `task-2.2 - Wire Map005 Race 2 entry`.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Ler primeiro as tasks especificas da fase antes de carregar referencias amplas.

### Decisao 3

- **Decisao ou inferencia:** Localizar o marcador por padrao de comandos `122` seguido de `201`, nao por substituicao textual.
- **Motivo:** Indices de comandos eram evidencias, mas o script deveria ser robusto contra pequenas mudancas de posicao.
- **Evidencia disponivel:** Tasks pediam assert de padrao atual e a analise informava comandos `79-80` e `104-105`.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Manter esse padrao em tasks futuras: localizar por `code` e `parameters`, usando indices apenas como dica de precondicao.

### Decisao 4

- **Decisao ou inferencia:** Criar um terceiro script para restaurar indentacao de 4 espacos nos JSONs.
- **Motivo:** Os dois scripts iniciais gravaram com `indent=2`, produzindo diff muito grande.
- **Evidencia disponivel:** `git diff` exibiu milhares de linhas por mudanca de formatacao.
- **Resultado:** Funcionou; diff final ficou cirurgico.
- **Avaliacao:** Necessaria depois do erro, mas evitavel.
- **Melhoria futura:** Antes de escrever qualquer JSON, verificar a indentacao existente ou seguir o padrao local observado em scripts anteriores da mesma fase/plano.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta ou comando | Objetivo | Resultado | Contribuiu? | Substituivel? | Como evitar redundancia |
| --- | --- | --- | --- | --- | --- |
| `sed Jhonny/CLAUDE.md` | Carregar regras do projeto RPG Maker MZ | Confirmou script-first, Playtest e uso de parser/writer | Sim | Nao | Ler uma vez no inicio de fase `Jhonny/` |
| `sed rpg-maker-mz-data-json/SKILL.md` e `workflow.md` | Confirmar workflow obrigatorio de JSON | Confirmou script salvo antes de mutar `data/*.json` | Sim | Nao | Ler somente data-json; plugin workflow nao era necessario nesta fase |
| `sed rpg-maker-mz-plugin-workflow/SKILL.md` | Preparar possivel edicao de plugin | Nenhum plugin foi alterado | Nao diretamente | Sim | So carregar se a fase ou a analise mencionar `js/plugins` |
| `tool_search serena` + `mcp__serena.initial_instructions` + `activate_project` | Atender instrucao geral de tarefa de codigo | Criou contexto Serena e diretorio `.serena/`, depois removido | Nao diretamente | Sim | Para tarefas em `data/*.json`, usar skills RPG Maker e shell; evitar Serena se nao houver navegacao simbolica real |
| `multi_agent_v1.spawn_agent` explorer | Extrair informacoes da pre-analise em paralelo, conforme workflow do usuario | Confirmou escopo, arquivos, IDs e fora de escopo | Sim, mas redundante | Parcialmente | Como o usuario exigiu agente em paralelo, manter; se nao exigido, leitura local bastaria |
| Python read-only para imprimir comandos alvo | Confirmar eventos, paginas e comandos atuais | Confirmou `Map010` comandos `79-80` e `Map005` comandos `104-105` | Sim | Nao | Manter consulta focada; nao imprimir arquivos inteiros |
| `01_wire_map010_race1_entry.py` | Mutar `Map010.json` | Alterou transfer para `Map001`, mas gravou indentacao 2 | Sim, com falha de higiene | Nao, script era obrigatorio | Configurar indentacao correta antes da primeira execucao |
| `02_wire_map005_race2_entry.py` | Mutar `Map005.json` | Alterou transfer para `Map001`, mas gravou indentacao 2 | Sim, com falha de higiene | Nao, script era obrigatorio | Configurar indentacao correta antes da primeira execucao |
| `python3 -m json.tool` | Validar parse dos JSONs alterados | Parse OK | Sim | Nao | Rodar apos mutacoes da fase |
| `git diff` amplo dos JSONs | Verificar escopo do diff | Revelou diff massivo por indentacao | Sim, mas caro | Sim | Usar `git diff --stat` primeiro; se grande, investigar formatacao antes de despejar diff completo |
| `03_restore_map_json_formatting.py` | Restaurar indentacao local | Regravou `Map010` e `Map005` com 4 espacos e preservou marcadores | Sim | Evitavel | Evitar gravacao inicial com indentacao errada |
| `git status --short` | Verificar alteracoes pendentes | Mostrou arquivos da fase e delecoes externas em `../.codex/prompts` | Sim | Nao | Relatar alteracoes externas sem tocar nelas |

## 4. Intervencoes e correcoes do usuario

Nao houve correcao do usuario durante a execucao da Fase 2.

Houve uma notificacao automatica de subagente com o mesmo conteudo retornado por `wait_agent`; nao foi uma intervencao humana nem mudou escopo.

Regra reutilizavel:

- Diferenciar notificacoes automaticas de subagente de instrucoes do usuario. So redirecionar a execucao quando houver nova instrucao humana.

## 5. Analise de desperdicio

### Desperdicio 1

- **O que aconteceu:** Carregamento de `rpg-maker-mz-plugin-workflow`, embora a fase so alterasse `data/Map010.json` e `data/Map005.json`.
- **Impacto estimado:** Baixo.
- **Causa:** Antecipacao de possivel trabalho em plugin sem evidencia na fase.
- **Como evitar:** Carregar apenas `rpg-maker-mz-data-json` quando as tasks indicarem somente `data/*.json`.

### Desperdicio 2

- **O que aconteceu:** Uso de Serena para uma tarefa que nao exigia navegacao simbolica.
- **Impacto estimado:** Medio.
- **Causa:** Regra geral de "coding task" foi aplicada sem considerar que RPG Maker JSON seria tratado por scripts e leitura localizada.
- **Como evitar:** Para tarefas `data/*.json`, usar skill RPG Maker e shell; so usar Serena se houver codigo fonte com simbolos a navegar.

### Desperdicio 3

- **O que aconteceu:** Subagente confirmou informacoes ja presentes em `tasks.md` e na analise.
- **Impacto estimado:** Medio.
- **Causa:** O workflow do usuario exigia agente em paralelo quando ha pre-analise.
- **Como evitar:** Se o workflow continuar exigindo subagente, passar uma pergunta ainda mais estreita e seguir trabalhando sem esperar ate o ponto estritamente necessario.

### Desperdicio 4

- **O que aconteceu:** Scripts iniciais escreveram JSON com `indent=2`; foi necessario terceiro script para restaurar indentacao.
- **Impacto estimado:** Alto.
- **Causa:** O workflow da skill recomendava `indent=2`, mas o arquivo local usava 4 espacos e os scripts da fase 1 tambem usavam 4.
- **Como evitar:** Antes de criar scripts, verificar o estilo atual do arquivo ou copiar o helper `save_json` do script anterior da fase/plano.

### Desperdicio 5

- **O que aconteceu:** `git diff` amplo imprimiu conteudo demais quando a indentacao estava errada.
- **Impacto estimado:** Alto.
- **Causa:** Verificacao de diff detalhado antes de checar `--stat` e antes de suspeitar de reformatacao.
- **Como evitar:** Sempre rodar `git diff --stat` primeiro em JSON grande; se houver milhares de linhas, investigar formatacao e validar com diff focado.

### Desperdicio 6

- **O que aconteceu:** Leitura integral inicial de `tasks.md` e da analise, embora a fase 2 tivesse tasks especificas curtas.
- **Impacto estimado:** Baixo.
- **Causa:** Busca por contexto antes de restringir ao escopo da fase.
- **Como evitar:** Ler `tasks.md` ate a fase atual e os arquivos `task-2.1.md` / `task-2.2.md`; consultar a analise apenas para confirmar pontos de entrada.

## 6. Caminho minimo recomendado

1. **Acao:** Confirmar escopo da fase.
   - **Entrada:** `FASE_ATUAL=2`, `TASKS_MD`.
   - **Ferramenta:** `sed` ou `rg "Phase 2|task-2"`.
   - **Resultado esperado:** identificar `task-2.1` e `task-2.2`.
   - **Criterio:** nenhuma task de fase 3 ou 4 entra no escopo.

2. **Acao:** Carregar somente regras indispensaveis.
   - **Entrada:** `Jhonny/CLAUDE.md`, `rpg-maker-mz-data-json/SKILL.md`, `workflow.md`, `map.md`.
   - **Ferramenta:** `sed`.
   - **Resultado esperado:** confirmar script-first e Playtest pendente.
   - **Criterio:** nenhuma edicao direta em `data/*.json`.

3. **Acao:** Ler tasks especificas.
   - **Entrada:** `task-2.1.md`, `task-2.2.md`.
   - **Ferramenta:** `sed`.
   - **Resultado esperado:** paths, eventos, paginas, comandos e nomes esperados dos scripts.
   - **Criterio:** comandos alvo e parametros esperados estao claros.

4. **Acao:** Inspecionar comandos atuais.
   - **Entrada:** `data/Map010.json`, `data/Map005.json`.
   - **Ferramenta:** Python read-only.
   - **Resultado esperado:** confirmar `122 -> 201`, race IDs e destinos antigos.
   - **Criterio:** precondicoes batem com as tasks.

5. **Acao:** Criar scripts com indentacao local correta.
   - **Entrada:** padrao de `save_json` dos scripts anteriores ou indentacao detectada dos JSONs.
   - **Ferramenta:** `apply_patch`.
   - **Resultado esperado:** scripts em `builds/fase2/` usando `indent=4`.
   - **Criterio:** scripts localizam por `code` e `parameters`, alteram somente `parameters[1]` do transfer.

6. **Acao:** Executar scripts e salvar logs.
   - **Entrada:** scripts salvos.
   - **Ferramenta:** `python3 script.py > interaction/fase2/name.log`.
   - **Resultado esperado:** `Map010` e `Map005` alterados.
   - **Criterio:** logs mostram antes/depois dos transfers.

7. **Acao:** Validar parse e comandos finais.
   - **Entrada:** JSONs alterados.
   - **Ferramenta:** `python3 -m json.tool` e Python read-only.
   - **Resultado esperado:** parse OK, comandos finais corretos.
   - **Criterio:** `Map010` transfere para `Map001` com race 1; `Map005` transfere para `Map001` com race 2.

8. **Acao:** Verificar diff comecando por estatistica.
   - **Entrada:** worktree alterada.
   - **Ferramenta:** `git diff --stat`, depois diff focado.
   - **Resultado esperado:** JSONs com poucas linhas alteradas.
   - **Criterio:** se diff for grande, corrigir formatacao antes de atualizar documentos.

9. **Acao:** Atualizar artefatos da fase.
   - **Entrada:** validacao estrutural e logs.
   - **Ferramenta:** `apply_patch`.
   - **Resultado esperado:** tasks marcadas como `complete_structural_pending_playtest` e resumo em `interaction/fase2/`.
   - **Criterio:** Playtest permanece pendente.

## 7. Conhecimento reutilizavel

### Fatos confirmados

- `VAR_RACE_ID` usa ID `100`.
- `Map010`, `EV001`, pagina 2, comando `79` seta `VAR_RACE_ID = 1`.
- `Map010`, comando `80`, era transfer para `Map005` e deve ser transfer para `Map001`.
- `Map005`, `EV001`, pagina 3, comando `104` seta `VAR_RACE_ID = 2`.
- `Map005`, comando `105`, era transfer para `Map013` e deve ser transfer para `Map001`.
- `Transfer Player` usa comando `201`; o `mapId` fica em `parameters[1]`.
- A Fase 2 nao deve alterar `Map013`, `CommonEvents.json`, `EV_VitoriaCorrida` ou cleanup.
- O padrao local dos JSONs de mapa nesta execucao era indentacao de 4 espacos.

### Preferencias do usuario

- Executar o plano por fase, sem replanejar.
- Manter scripts e logs dentro da pasta do plano.
- Nao marcar runtime como validado sem Playtest no RPG Maker MZ.
- Produzir retrospectivas dentro de `retrospetivas/faseN/` quando a estrutura existir.

### Restricoes tecnicas

- Toda mutacao em `data/*.json` deve ser feita por script Python salvo.
- O script deve reabrir e validar o JSON apos escrever.
- Diffs em mapas grandes devem permanecer cirurgicos; reformatacao ampla e indesejada.
- `.agents/` e alteracoes externas nao relacionadas nao devem ser copiadas, revertidas ou misturadas.

### Armadilhas conhecidas

- Seguir cegamente `indent=2` da referencia geral pode conflitar com o padrao real do arquivo.
- Rodar `git diff` detalhado em JSON grande antes de `--stat` pode consumir contexto demais.
- Carregar skills/ferramentas por possibilidade abstrata aumenta custo sem melhorar a solucao.
- Notificacao de subagente pode duplicar conteudo ja recebido via `wait_agent`.

### Heuristicas recomendadas

- Para mudancas de destino de `Transfer Player`, alterar somente `parameters[1]`.
- Usar indices de comando como evidencia, mas scripts devem localizar por forma do comando.
- Em JSON grande, validar primeiro: parse, comando final, `git diff --stat`.
- Copiar o estilo de escrita dos scripts auditaveis anteriores do mesmo plano quando existir.

## 8. Informacoes que deveriam estar no prompt inicial

- **Obrigatorio:** `FASE_ATUAL`, `TASKS_MD`.
- **Util:** caminho da analise tecnica. Foi informado e reduziu ambiguidade.
- **Util:** indicar explicitamente que os JSONs de mapa devem preservar indentacao de 4 espacos.
- **Util:** informar que a fase 2 nao requer carregar workflow de plugin.
- **Opcional:** nome desejado do arquivo de retrospectiva.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na analise tecnica

#### Melhoria 1

- **Problema observado durante a execucao:** Scripts iniciais produziram reformatacao ampla dos mapas.
- **Informacao ausente ou incorreta:** A analise tecnica nao registrava o padrao de formatacao dos JSONs alvo.
- **Por que essa informacao pertence a analise tecnica:** E uma restricao do estado existente dos arquivos e afeta risco de diff em arquivos grandes.
- **Secao da analise tecnica:** Adicionar em `Pontos de Entrada Identificados` ou nova secao `Restricoes de Edicao`.
- **Texto sugerido:**

```markdown
## Restricoes de Edicao dos Mapas

Os arquivos `Map010.json` e `Map005.json` estao formatados com indentacao de 4 espacos.
Qualquer script de mutacao deve preservar esse padrao para evitar diffs massivos em arquivos de mapa.
Antes de escrever, reutilize o padrao de `save_json` dos scripts auditaveis existentes no plano ou confirme a indentacao local.
```

- **Impacto esperado:** Evita o terceiro script corretivo e reduz custo de diff/revisao.

### 9.2 Melhorias no plano de implementacao

#### Melhoria 1

- **Problema observado durante a execucao:** Validacao de diff detalhada ocorreu tarde, depois de gerar saida muito grande.
- **Deficiencia do plano de implementacao:** O plano exigia parse e logs, mas nao explicitava checkpoint de higiene de diff para JSONs grandes.
- **Etapa afetada:** Global Implementation Rules.
- **Alteracao recomendada:** Adicionar checkpoint de diff estatistico antes de documentar conclusao.
- **Texto sugerido:**

```markdown
- After running mutation scripts against large `Map*.json` files, run `git diff --stat` before reviewing full diffs. If a map diff shows broad formatting churn, fix formatting with a saved audit script before marking the task structurally complete.
```

- **Como a mudanca reduziria custo, risco ou retrabalho:** Detecta reformatacao ampla cedo e impede que uma LLM despeje diffs enormes no contexto.

### 9.3 Melhorias nas tasks da fase executada

#### Melhoria 1

- **Task afetada:** `task-2.1` e `task-2.2`.
- **Informacao ausente, ambigua ou incorreta:** As tasks mandavam usar scripts salvos, mas nao especificavam preservar a indentacao existente de 4 espacos.
- **Consequencia observada durante a execucao:** Os scripts usaram `indent=2`, geraram diff massivo e exigiram um script corretivo.
- **Alteracao recomendada:** Adicionar requisito explicito de formatacao e diff.
- **Texto sugerido para incluir em ambas as tasks:**

```markdown
- Preserve the existing 4-space JSON indentation used by the target `Map*.json` file.
- After running the script, run `git diff --stat` and confirm the target map diff is limited to the intended `Transfer Player` destination.
```

- **Como validar que a nova instrucao e suficiente:** `git diff --stat` deve mostrar poucas linhas alteradas no mapa; diff focado deve mostrar somente `parameters[1]` do comando `201`.

#### Melhoria 2

- **Task afetada:** `task-2.1` e `task-2.2`.
- **Informacao ausente, ambigua ou incorreta:** As tasks pediam registrar output em `interaction/fase2/`, mas nao definiam se usar `tee` ou redirecionamento.
- **Consequencia observada durante a execucao:** Nenhum erro funcional; logs foram criados com redirecionamento.
- **Alteracao recomendada:** Nenhuma alteracao necessaria. A ambiguidade foi inofensiva.
- **Texto sugerido para incluir ou substituir na task:** Nao aplicavel.
- **Como validar que a nova instrucao e suficiente:** Nao aplicavel.

### 9.4 Problemas fora do escopo dos artefatos

#### Problema 1

- **Problema observado:** Uso de Serena criou `.serena/`, removido depois.
- **Por que esta fora do escopo dos artefatos:** Foi uma decisao operacional da LLM causada por instrucao geral de ferramenta, nao por falta do plano.
- **Como deveria ser tratado:** Evitar Serena em tarefas que alteram apenas RPG Maker JSON.
- **Protecao operacional:** Regra operacional da LLM; nao poluir tasks com instrucoes sobre Serena.

#### Problema 2

- **Problema observado:** `git status` mostrou delecoes em `../.codex/prompts/*.md` que nao pertenciam a tarefa.
- **Por que esta fora do escopo dos artefatos:** Eram alteracoes preexistentes ou externas ao escopo da fase.
- **Como deveria ser tratado:** Apenas relatar e nao reverter.
- **Protecao operacional:** Seguir regra de worktree suja; nenhuma alteracao nos artefatos do plano.

#### Problema 3

- **Problema observado:** Subagente duplicou informacoes ja lidas localmente.
- **Por que esta fora do escopo dos artefatos:** O workflow do usuario exigia agente em paralelo quando havia pre-analise.
- **Como deveria ser tratado:** Manter a delegacao, mas estreitar a pergunta e nao esperar por ela ate precisar fechar escopo.
- **Protecao operacional:** Melhor desenho de subtarefa; nao exige mudanca na analise/plano/tasks.

### 9.5 Matriz de rastreabilidade das melhorias

| **Problema observado** | **Causa principal** | **Artefato responsavel** | **Alteracao necessaria** | **Prioridade** |
| --- | --- | --- | --- | --- |
| Reformatacao ampla dos mapas | Scripts usaram `indent=2` contra arquivos com 4 espacos | Analise tecnica e tasks | Documentar/pedir preservacao da indentacao local | Alta |
| Diff detalhado enorme | `git diff` amplo antes de `--stat` | Plano de implementacao | Adicionar checkpoint `git diff --stat` para mapas grandes | Media |
| Plugin workflow carregado sem uso | Antecipacao operacional da LLM | Fora do escopo | Carregar apenas skills diretamente acionadas pela fase | Baixa |
| Serena usada sem necessidade | Aplicacao ampla de regra de coding task | Fora do escopo | Evitar Serena quando nao ha codigo simbolico a navegar | Media |
| Subagente redundante | Workflow do usuario exigia paralelo | Fora do escopo | Estreitar pergunta delegada e seguir com trabalho local | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a analise tecnica

Adicionar:

```markdown
## Restricoes de Edicao dos Mapas

Os arquivos `Map010.json` e `Map005.json` estao formatados com indentacao de 4 espacos.
Qualquer script de mutacao deve preservar esse padrao para evitar diffs massivos em arquivos de mapa.
Antes de escrever, reutilize o padrao de `save_json` dos scripts auditaveis existentes no plano ou confirme a indentacao local.
```

#### Patch sugerido para o plano de implementacao

Adicionar em `Global Implementation Rules`:

```markdown
- After running mutation scripts against large `Map*.json` files, run `git diff --stat` before reviewing full diffs. If a map diff shows broad formatting churn, fix formatting with a saved audit script before marking the task structurally complete.
```

#### Patch sugerido para as tasks da fase executada

Adicionar em `task-2.1` e `task-2.2`, dentro de `<requirements>`:

```markdown
- Preserve the existing 4-space JSON indentation used by the target `Map*.json` file.
- After running the script, run `git diff --stat` and confirm the target map diff is limited to the intended `Transfer Player` destination.
```

#### Acoes fora do fluxo de especificacao

- Evitar carregar `rpg-maker-mz-plugin-workflow` quando a fase so toca `data/*.json`.
- Evitar Serena em tarefas de mutacao de RPG Maker JSON sem necessidade de navegacao simbolica.
- Comecar revisao de JSON grande por `git diff --stat`, nao por diff completo.

## 10. Checklist operacional

- [ ] Confirmar `FASE_ATUAL` e listar somente tasks dessa fase.
- [ ] Carregar `Jhonny/CLAUDE.md`, `rpg-maker-mz-data-json/SKILL.md` e `workflow.md`.
- [ ] Verificar se a fase toca apenas `data/*.json`; se sim, nao carregar plugin workflow.
- [ ] Inspecionar comandos alvo por Python read-only antes de escrever.
- [ ] Criar scripts salvos em `builds/faseN/`, nunca mutar JSON diretamente.
- [ ] Preservar a indentacao existente dos `Map*.json`.
- [ ] Alterar somente `parameters[1]` do comando `201` nos transfers alvo.
- [ ] Salvar logs em `interaction/faseN/`.
- [ ] Validar parse com `python3 -m json.tool` e comandos finais com Python read-only.
- [ ] Rodar `git diff --stat`; se houver churn de formatacao, corrigir antes de marcar a fase como estruturalmente concluida.
