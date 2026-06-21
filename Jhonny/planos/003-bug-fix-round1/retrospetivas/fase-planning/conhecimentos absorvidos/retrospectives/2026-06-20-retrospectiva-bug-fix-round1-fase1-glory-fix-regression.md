# Retrospectiva Técnica — Bug Fix Round 1, Fase 1 (regressão introduzida pelo Patch A)

**Data:** 2026-06-20
**Plano:** `003-bug-fix-round1`
**Fase:** 1 (Critical Glory Exploit Fix)
**Bug alvo original:** #3 — timer continua tickando na tela de Vitória/Derrota, concedendo +10 glória por ciclo
**Resultado real:** Patch A corrigiu o bug #3 mas introduziu regressão — jogador fica preso nas telas de vitória E derrota (apertar espaço não avança)

---

## 1. Resumo da tarefa

**Solicitado:**
1. Analisar se a fase 1 do plano 003 estava implementada e o que precisava para teste manual.
2. Debugar regressão reportada pelo usuário: "pressionar espaço na tela de derrota não volta mais para o jogo".
3. Reanalisar após o usuário reportar que vitória também estava quebrada.
4. Aplicar patch de correção + patch de diagnóstico para teste manual.

**Entregue:**
- Confirmação de que Patch A (CE 19) + Patch B (CE 10) + Patch C (CE 11) estavam no JSON.
- Diagnóstico da regressão: Patch A desliga `SW_RACE_ACTIVE (100)` na entrada do CE 19; CE 18 (derrota) não o religa; CE 5 (vitória) religa no cmd[20] mas algo mais impede o avanço (ainda em investigação empírica).
- Aplicado **Patch D** (`code=121 [100,100,0]` em CE 19 após WAIT_INPUT) + log de diagnóstico dentro do WAIT_INPUT via script `build_phase1_debug_patch.py`.

**Critérios de conclusão:**
- Vitória: pressionar espaço reinicia corrida com `raceId+1` (RACE_INIT log aparece).
- Derrota: pressionar espaço chama CE 18 → corrida reinicia na cena 0.
- Glória: permanece estática durante 30s+ nas telas de Vitória/Derrota.

**Restrições:**
- Projeto: RPG Maker MZ (`Jhonny/`).
- Plugin: `Jhonny_RaceHelper.js` (sem lógica de input).
- Memórias aplicáveis: `mz-playtest-pauses` (F12 pausa game loop), `user-testable-feedback`, `never-delete-common-events`, `rpg-mz-indent-skipbranch`.

---

## 2. Decisões técnicas e inferências

### 2.1 — Hipótese inicial: apenas derrota quebrada
- **Inferência:** Vitória funcionava porque CE 5 cmd[20] religa SW 100; derrota quebrada porque CE 18 não toca em SW 100.
- **Motivo:** Análise textual do JSON mostrava assimetria clara entre CE 5 e CE 18.
- **Evidência:** Dump de CE 5/CE 18 confirmou que só CE 5 escreve SW 100.
- **Resultado:** Parcialmente correta — defeito de derrota confirmado, mas vitória também quebrada.
- **Avaliação:** Decisão razoável dada a evidência disponível no momento.
- **Melhoria futura:** Validar a hipótese pedindo logs do jogo ANTES de apresentá-la como fato. Não confiar apenas em análise estática quando o usuário pode rodar o jogo.

### 2.2 — Hipótese secundária (após report de vitória): raceId=3 caindo em FIM_LOOP
- **Inferência:** Se `raceId=3`, cmd[42] do CE 19 falha e cai no `FIM_LOOP` (placeholder de tela de fim).
- **Motivo:** Tentativa de reconciliar análise estática com observação do usuário.
- **Evidência:** Logs do usuário mostraram `RACE_ID=1`, `PONTOS_GLORIA=210` (≥200 = passou), VICTORY event disparado, nenhum log após.
- **Resultado:** Descartada — raceId=1, não 3.
- **Avaliação:** Hipótese defensável mas descartada rapidamente com logs.
- **Melhoria futura:** Pedir logs antes de especular sobre raceId.

### 2.3 — Layout de params do `code=111` (variable)
- **Inferência inicial (ERRADA):** `[1, leftVar, op, srcType, rightVal]` — operation no params[2], source no params[3].
- **Inferência correta:** `[1, leftVar, srcType, rightVal, op]` — source no params[2], value/varId no params[3], operation no params[4].
- **Motivo:** O layout correto só foi confirmado lendo `rmmz_objects.js` lines 9935-9961.
- **Evidência:** Leitura direta do engine.
- **Resultado:** A descoberta não mudou o diagnóstico principal, mas podia ter causado erro se um patch fosse escrito antes da checagem.
- **Avaliação:** Decisão necessária — sem ela qualquer patch que inserisse um branch condicional estaria errado.
- **Melhoria futura:** Em tarefas envolvendo RMMZ command semantics, ler `rmmz_objects.js` (`prototype.commandXXX`) ANTES de especular sobre params. Documentar o layout no `findings.md` da fase.

### 2.4 — Aplicar Patch D antes de confirmar causa raiz da vitória
- **Decisão:** Inserir `code=121 [100,100,0]` em CE 19 cmd[42] + log de diagnóstico em WAIT_INPUT.
- **Motivo:** Patch D é necessário para o caminho de derrota independentemente; o log acelera a identificação do bug de vitória.
- **Evidência:** CE 18 comprovadamente não restaura SW 100.
- **Resultado:** Pendente — usuário precisa testar.
- **Avaliação:** Decisão correta — paraleliza fix certo com investigação.
- **Melhoria futura:** Sempre que aplicar um fix parcial certo, anexar diagnóstico para o resto no mesmo patch.

---

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Resultado | Economizável? |
|---|---|---|---|---|
| `Read` em `tasks.md`, `fase-1-completa.md`, `findings.md` | Carregar contexto da fase | Sim | Confirmou que 3 patches estavam registrados | — |
| `python3` dumps de CE 5/7/10/11/13/18/19 | Confirmar que patches estavam no JSON | Sim, uma vez | Confirmou + revelou estrutura de branches | Sim — reusar um único script de dump ao invés de redigitar heredocs |
| `git diff CommonEvents.json` | Ver o que Patch A mudou | Sim | Mostrou exatamente as 3 ControlSwitch inseridas | — |
| `grep` em `rmmz_objects.js` por `command111`, `command117`, `command230`, `skipBranch` | Confirmar semântica dos opcodes | Sim, mas tarde demais | Confirmou layout de params | **Deveria ter sido feito primeiro** |
| Busca por readers de SW 100/101/104 em CEs | Confirmar que nada lia SW 101/104 | Sim | Confirmado — sem consumers externos | — |
| Busca por readers em Map00*.json | Confirmar que eventos de mapa não liam essas switches | Sim | Confirmado — sem consumers | — |
| `Read` em `ButtonPicture.js`, `Jhonny_RaceHelper.js` | Descartar consumo de input por plugins | Sim | Descartado | — |

### Ferramentas reduntantes ou evitáveis

1. **Múltiplos dumps de CE com heredocs Python** — repeti o mesmo padrão 4-5 vezes. Deveria ter escrito `dump_ce.py <id>` reutilizável desde o início.
2. **Refazer dump após constatar que `params` era `None` em dict-access** — bug de digitação (parâmetros estavam sob key `"parameters"` não `"params"`). Uma única checagem do schema teria poupado uma chamada.
3. **Várias explorações teóricas sobre Input.isTriggered** — investigatei 5+ hipóteses (consumer no CE 13, ButtonPicture, depth restriction, etc.) sem rodar o jogo. Deveria ter pedido logs do usuário desde o primeiro report.

---

## 4. Intervenções e correções do usuário

### 4.1 — "Vitória também está travada"
- **Antes:** Apresentei como fato que "só derrota quebra; vitória funciona porque CE 5 cmd[20] religa SW 100".
- **Causa do erro:** Análise estática do JSON sem validar empiricamente. Assumi que o fluxo de vitória funcionava pré-Patch-A sem confirmar com o usuário.
- **Mudança:** Hipóteses reordenadas — passei a investigar WAIT_INPUT como possível culprit comum.
- **Regra reutilizável:** Nunca apresentar "funciona porque X" como fato sem teste manual. Dizer "deveria funcionar porque X" e pedir validação.

### 4.2 — Envio dos 3 logs do console
- **Antes:** Pedindo 3 esclarecimentos em sequência (raceId, sintoma pós-space, teste Enter/Z).
- **Causa:** Eu estava speculando em vez de pedir evidência observável.
- **Mudança:** Logs descartaram Hipótese A (FIM_LOOP), confirmaram raceId=1 e VICTORY event disparado sem continuação.
- **Regra reutilizável:** Em bug de RPG Maker MZ, a primeira pergunta deve ser "mande os RACE_EVENT logs ao redor do sintoma". Logs são baratos e informativos.

---

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|---|---|---|---|
| Apresentar "vitória funciona" como fato sem teste | Alto | Confiança em análise estática | Pedir validação empírica antes de declarar causalidade |
| Investigar 5+ hipóteses sobre Input.isTriggered sem logs do usuário | Alto | Tentativa de fechar o bug só com leitura de código | Pedir logs no primeiro report |
| Múltiplos heredocs Python para dump de CE | Médio | Não tinha script reutilizável | Criar `dump_ce.py <id>` no início |
| 12+ chamadas Read consecutivas em `rmmz_objects.js` | Médio | Verificar semântica opcode-por-opcode em vez de checar schema primeiro | Manter cheat-sheet de opcodes no findings.md do plano |
| Confirmar layout de params do `code=111` só no meio da sessão | Médio | Assumi layout por analogia | Sempre validar params lendo `prototype.commandXXX` antes de escrever patches |
| Hooks do sistema avisando "10/12 leituras consecutivas" | Baixo | Padrão de exploração sem escrita | Critério: parar de ler após 3 checagens sem decision point |

---

## 6. Caminho mínimo recomendado

Para reproduzir a tarefa (analisar implementação + debugar regressão em fase de bug fix):

1. **Carregar o plano e a fase.** Ler `tasks.md` + `findings.md` + `fase-N-completa.md`.
   - *Entrada:* caminho do plano.
   - *Ferramenta:* Read.
   - *Critério:* saber quais patches eram esperados e seu estado registrado.

2. **Verificar patches no JSON.** Dump dos CEs mencionados.
   - *Entrada:* IDs de CE alvo.
   - *Ferramenta:* `dump_ce.py <id>` reutilizável.
   - *Critério:* cada patch esperado deve estar visível.

3. **Pedir logs do jogo imediatamente.** Não especular sobre comportamento sem evidência.
   - *Entrada:* screenshot ou copy-paste dos `RACE_EVENT` ao redor do sintoma.
   - *Critério:* ter timestamp, frame, vars e switches no momento do bug.

4. **Confirmar semântica de opcodes relevantes.** Para qualquer opcode envolvido (111, 117, 121, 122, 230), checar `rmmz_objects.js` `prototype.commandXXX`.
   - *Entrada:* lista de opcodes suspeitos.
   - *Ferramenta:* grep + Read (uma passada).
   - *Critério:* layout de params confirmado.

5. **Traçar o fluxo CE-por-CE.** Quem chama quem, quem lê/escreve cada switch/var.
   - *Entrada:* IDs de CE envolvidos.
   - *Ferramenta:* dump_ce.py + script de busca por switch/var.
   - *Critério:* gráfico de call/dependency concluído.

6. **Formular hipótese única e pedi logs que a confirmariam/refutariam.**
   - *Entrada:* hipótese + teste manual específico.
   - *Critério:* usuário consegue executar o teste em < 5 min.

7. **Aplicar patch mínimo (idempotente) + diagnóstico inline.**
   - *Entrada:* mudança exata no JSON.
   - *Ferramenta:* Python script que escreve JSON formatado.
   - *Critério:* `python3 -m json.tool` passa + auditoria programática passa.

8. **Validar com Playtest.** Usuário roda, observa resultado, reporta.
   - *Critério:* critério de sucesso da fase atendido.

---

## 7. Conhecimento reutilizável

### Fatos confirmados

- `code=111` (ConditionalBranch) layout: `params[0]=type, params[1]=leftVar/switchId, params[2]=srcType-or-op, params[3]=rightVal-or-op, params[4]=op`. Para type=1 (variable): `[1, leftVar, srcType, rightVal, op]`. Para type=0 (switch): `[0, switchId, value]` onde `value=0` significa ON, `value=1` significa OFF.
- `code=121` (ControlSwitch): `params=[startId, endId, value]` onde `value=0` liga, `value=1` desliga.
- `code=117` (Common Event) é **síncrono** (`setupChild`) — roda como child interpreter no mesmo frame, bloqueando o pai até terminar.
- `code=115` (ExitEventProcessing) seta `_index = _list.length`.
- Parallel CEs (`trigger=2`) rodam em interpreter próprio; re-setup apenas quando o anterior termina.
- `Input.isTriggered(name)` retorna true por exatamente 1 frame após keydown; leitura não consome.
- Em `Jhonny/` atualmente, **SW 101 (INPUT_LOCKED) e SW 104 (PAUSED) não têm nenhum reader** em CEs, plugins ou eventos de mapa — são vestigiais ou reservados.
- O `Jhonny_RaceHelper.js` plugin **não toca em Input** além de estender `keyMapper` com WASD.

### Preferências do usuário

- Querer diagnóstico + fix no mesmo patch quando aplicável (paralelização).
- Tabelas e bullets curtos em vez de prosa longa.
- Hipóteses alternativas explicitamente elencadas quando há ambiguidade.
- Perguntas claras e numeradas quando precisar de esclarecimento.

### Restrições técnicas

- **F12 pausa o game loop** quando tem foco (`mz-playtest-pauses`). Testes de input exigem clicar no canvas primeiro.
- `CommonEvents.json` é carregado em tempo de boot; mudanças exigem restart do Playtest.
- Scripts de patch devem ser **idempotentes** (pattern detection) e produzir `git diff` vazio na segunda run.
- Indentação de comandos dentro de IF/ELSE deve seguir o indent do branch (`rpg-mz-indent-skipbranch`).

### Armadilhas conhecidas

- **Assumir que análise estática reflete comportamento runtime.** Resultou em apresentar "vitória funciona" sem validar. Sempre pedir logs.
- **Confundir layout de params de opcodes RMMZ.** Valer a pena um cheat-sheet no `findings.md` de cada plano.
- **CE A chamar CE B via code=117 quando B tem dependência de switch state** — quem chama deve garantir o estado, porque B pode não restaurar.
- **Caminhos de "vitória" e "derrota" muitas vezes compartilham entry point mas divergem em state restoration.** Auditar ambos quando patchear entry point.

### Heurísticas recomendadas

- Para bug de RPG Maker MZ, **primeira pergunta ao usuário: "mande os logs em torno do sintoma."** Logs do `Jhonny_RaceHelper.logRaceEvent` são detalhados (frame + vars + switches).
- Antes de especular sobre raceId ou thresholds, **verificar os logs**. Eles contêm essa informação explicitamente.
- Ao patchear CE compartilhado entre paths, **auditar cada path** pós-WAIT_INPUT/branch para identificar quem restaura state.
- Manter script `dump_ce.py` e `find_switch_refs.py` reutilizáveis na pasta do plano.

---

## 8. Informações que deveriam estar no prompt inicial

| Item | Classificação |
|---|---|
| Incluir 3-5 RACE_EVENT logs do console capturados no momento do bug | **Obrigatório** |
| Confirmar raceId da sessão de teste | **Obrigatório** |
| Indicar se DevTools/F12 estava aberto durante o teste (afeta input) | **Obrigatório** |
| Descrever sintoma visível específico ("pictures somem", "tela preta", "texto fica visível") | **Útil** |
| Indicar se plugin foi modificado desde o último Playtest | **Útil** |
| Passar caminho do script de dump de CE se já existir | **Opcional** |

---

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema observado:** Durante a execução, precisei descobrir empiricamente que `code=111` variable layout é `[1, leftVar, srcType, rightVal, op]` e não `[1, leftVar, op, srcType, rightVal]`.

**Informação ausente:** Cheat-sheet de opcodes RMMZ utilizados no projeto.

**Por que pertence à análise técnica:** É conhecimento estrutural sobre o engine, reutilizável em todas as fases.

**Seção-alvo:** `Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md` (ou um novo `rmmz-opcodes.md` no plano).

**Patch sugerido:**
```markdown
## RMMZ opcode cheat-sheet (verify against rmmz_objects.js)

- code=111 (ConditionalBranch):
  - Switch:  params=[0, switchId, value]  (value=0 → ON, value=1 → OFF)
  - Variable: params=[1, leftVar, srcType, rightVal, op]
    - srcType: 0=const, 1=var
    - op: 0=eq, 1=ge, 2=le, 3=gt, 4=lt, 5=ne
  - Script:  params=[12, "JS expression"]
- code=117 (Common Event): synchronous child interpreter
- code=121 (ControlSwitch): params=[startId, endId, value]
  - value=0 → ON, value=1 → OFF
- code=122 (ControlVariable): params=[startId, endId, op, srcType, value]
  - op: 0=set, 1=add, 2=sub, 3=mul, 4=div, 5=mod
- code=230 (Wait): params=[frames]
- code=235 (ErasePicture): params=[pictureId]
- code=242 (Fadeout Screen): params=[frames]
- code=249 (Play ME): params=[{name, volume, pitch, pan}]
```

**Impacto esperado:** Elimina redescoberta do layout de params; previne patches errados.

### 9.2 Melhorias no plano de implementação

**Problema observado:** Fase 1 foi marcada "completa (pré-Playtest)" sem validar os dois caminhos pós-WAIT_INPUT (vitória e derrota).

**Deficiência do plano:** Critério de sucesso da fase considerava só o bug do glory leak (que só testa o estado DURANTE o WAIT_INPUT), não o comportamento APÓS o space.

**Etapa afetada:** task-1.3 (Playtest validation).

**Patch sugerido em `tasks.md` fase 1:**
```markdown
### task-1.3 — Run generator + audit + Playtest

Critérios de aceitação (todos obrigatórios):
1. **Glória estática** durante 30s+ nas telas de Vitória e Derrota (valida Patch A).
2. **Caminho de Vitória**: pressionar espaço reinicia a corrida com `raceId+1`.
   - Evidência: RACE_INIT log aparece no console após space.
3. **Caminho de Derrota**: pressionar espaço chama CE 18 → cena 0 reinicia.
   - Evidência: cena 0 visível e responsiva a W/A/S/D após space.
4. DevTools FECHADO durante teste de input (canvas com foco).
```

**Como reduziria custo:** Teria flagrado a regressão ANTES de marcar fase 1 como completa.

### 9.3 Melhorias nas tasks da fase executada

**Task afetada:** task-1.2 (`build_phase1_ces.py`).

**Informação ausente:** Patch A não incluiu restauração de SW 100 no caminho de derrota.

**Consequência observada:** Jogador preso na tela de derrota.

**Alteração recomendada:** Adicionar Patch D ao gerador da fase 1.

**Patch sugerido em `task-1.2.md`:**
```markdown
### Patch D (obrigatório) — Restore SW 100 after WAIT_INPUT

Insert `code=121 params=[100, 100, 0]` (SW_RACE_ACTIVE = ON) in CE 19,
immediately after the WAIT_INPUT loop's End Branch and before the `passou`
branch (`code=111 params=[1, 117, 0, 1, 0]`).

Justification: Patch A turns SW 100 OFF at CE 19 entry (timer stop). CE 5
(victory) restores it at cmd[20], but CE 18 (defeat) does NOT touch SW 100.
Without Patch D, the renderer dies after defeat and the player is stuck.

Idempotency: skip if any cmd=121 params=[100,100,0] exists in the window
between WAIT_INPUT end and the passou branch.
```

**Validação da nova instrução:** Auditoria programática confirma exatamente 1 ocorrência do patch no intervalo pós-WAIT_INPUT.

### 9.4 Problemas fora do escopo dos artefatos

| Problema | Por que está fora do escopo | Tratamento |
|---|---|---|
| Análise estática apresentada como fato sem teste manual | Falha operacional da LLM, não deficiência da especificação | Próxima execução deve pedir logs antes de declarar causalidade |
| Múltiplos heredocs Python redundantes | Ineficiência operacional da LLM | Criar script `dump_ce.py` reutilizável como ação operacional |
| F12 pausando game loop durante teste de input | Condição ambiental já documentada em `mz-playtest-pauses` | Nenhuma alteração de especificação; reforçar na próxima execução |

### 9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| Layout de params de `code=111` redescoberto | Falta cheat-sheet de opcodes | Análise técnica | Adicionar cheat-sheet em `race-feedback-impl-guide.md` | Alta |
| Regressão não detectada antes de marcar fase como completa | Critério de sucesso só testava glory leak | Plano (task-1.3) | Adicionar critérios pós-space para vitória e derrota | Alta |
| Patch D ausente do gerador | CE 18 não restaura SW 100 (não mapeado) | Task (task-1.2) | Adicionar Patch D obrigatório | Alta |
| Hipótese apresentada como fato | Falha operacional LLM | Fora do escopo | Nenhuma alteração de especificação | — |
| Scripts Python reescritos múltiplas vezes | Ineficiência operacional LLM | Fora do escopo | Criar `dump_ce.py` reutilizável como ação operacional | Médio |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Ver seção 9.1 — adicionar cheat-sheet de opcodes RMMZ a `race-feedback-impl-guide.md`.

#### Patch sugerido para o plano de implementação

Ver seção 9.2 — atualizar task-1.3 em `tasks.md` com critérios pós-space para ambos os caminhos.

#### Patch sugerido para as tasks da fase executada

Ver seção 9.3 — adicionar Patch D ao gerador em `task-1.2.md`. Aplicar patch correspondente no `fase1/build_phase1_ces.py` (ou documentar como complemento via `build_phase1_debug_patch.py`).

#### Ações fora do fluxo de especificação

- Criar `Jhonny/planos/003-bug-fix-round1/scripts/dump_ce.py` reutilizável para inspecionar qualquer CE por ID.
- Criar `Jhonny/planos/003-bug-fix-round1/scripts/find_switch_refs.py` para mapear todas as referências a um intervalo de switches.

---

## 10. Checklist operacional

Antes e durante a próxima execução similar, verificar:

1. **Logs do jogo em mãos** (3-5 RACE_EVENT em torno do sintoma) antes de apresentar qualquer hipótese como fato.
2. **DevTools fechado** durante teste de input — confirmar com o usuário.
3. **raceId da sessão** identificado antes de especular sobre FIM_LOOP.
4. **Cheat-sheet de opcodes** consultado antes de escrever patches com `code=111/121/122`.
5. **Todos os caminhos pós-branch** auditados quando patchear entry point de CE.
6. **Quem escreve/lê cada switch/var** mapeado para qualquer switch envolvido no patch.
7. **Script de dump reutilizável** (`dump_ce.py <id>`) usado em vez de heredocs ad-hoc.
8. **Patch idempotente**: segunda run produz `git diff` vazio.
9. **JSON validado** com `python3 -m json.tool` após qualquer edição.
10. **Critério de sucesso da fase** cobre todos os caminhos (vitória + derrota), não só o bug primário.

---

## Estado atual

- Patch A (CE 19 cmd 0-2): aplicado, corrige bug #3 (glory leak).
- Patch B (CE 10 cmd 1-3): já existia.
- Patch C (CE 11 cmd 0-2): já existia.
- **Patch D (CE 19 cmd 42): aplicado** — restaura SW 100 pós-WAIT_INPUT. Deveria corrigir caminho de derrota.
- **Debug log (CE 19 cmd 31): aplicado** — diagnosticar se WAIT_INPUT está efetivamente registrando espaço no caminho de vitória.

Aguardando Playtest do usuário para:
- Confirmar Patch D corrige derrota.
- Identificar causa raiz do bug de vitória via debug log.
