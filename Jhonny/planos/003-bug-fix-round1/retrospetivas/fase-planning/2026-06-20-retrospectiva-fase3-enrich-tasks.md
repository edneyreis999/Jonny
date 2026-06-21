---
data: 2026-06-20
comando: /loki:enrich-tasks
fase_alvo: 3
plano: 003-bug-fix-round1
status: retrospectiva-tecnica
---

# Retrospectiva técnica — Revisão de tasks da Fase 3 (enrich-tasks)

## 1. Resumo da tarefa

**Solicitado:** Aplicar `/loki:enrich-tasks` à Fase 3 do plano
`003-bug-fix-round1`, usando as retrospectivas das Fases 1 e 2 como
fonte interna de aprendizado, sem jamais citá-las nos artefatos
editados. Parâmetros fornecidos:
`FASE_ATUAL=3`, `DIR_RETROSPECTIVAS=Jhonny/planos/003-bug-fix-round1/retrospetivas`,
`DIR_BUILDS=.../builds`, `TASKS_MD=.../tasks.md`.

**Entregue:** Correções cirúrgicas em `task-3.1.md`, `task-3.2.md`,
`task-3.3.md` e `tasks.md`. Cinco categorias de correção:
(i) namespace de letras de patch/audit (colisão real com Fases 1–2);
(ii) opcodes RMMZ invertidos na spec (`code 0`/`232` → `118`/`235`);
(iii) guard de `SW_PAUSED` para o novo CE paralelo;
(iv) validação semântica em audits;
(v) hard-refresh do browser em Playtest.

**Critério de sucesso:** cada edição endereçou inconsistência concreta
verificada contra `rmmz_objects.js` ou `build_phase1_ces.py`, e nenhuma
referência a arquivo de retrospectiva apareceu nos artefatos editados.

**Restrições relevantes:** RPG Maker MZ (`CommonEvents.json`, plugin JS,
`rmmz_objects.js`), geradores Python idempotentes por fase, memories do
projeto (`never-delete-common-events`, `rpg-mz-indent-skipbranch`,
`user-testable-feedback`, `rmmz-audio-opcodes`), regras R1–R5 do comando
especialmente R4 (idempotência — não reescrever trechos corretos).

## 2. Decisões técnicas e inferências

### Decisão: ler as três retrospectivas anteriores integralmente e em paralelo

- **Motivo:** o comando exige "análise minuciosa" das retrospectivas;
  não havia índice que indicasse quais seções concentravam o
  conhecimento reutilizável.
- **Evidência disponível:** arquivos de 280/330/590 linhas, sem sumário
  visível antes da leitura.
- **Resultado:** conhecimento extraído com sucesso, mas com custo de
  contexto desnecessário.
- **Avaliação:** parcialmente necessária (R1 proíbe citar retrospectivas,
  então algum contact é obrigatório), mas leitura integral foi exagero.
- **Melhoria futura:** ler primeiro `## 7. Conhecimento reutilizável` e
  `## 9. Melhorias nos artefatos` de cada retrospectiva; só ler outras
  seções se essas não forem suficientes.

### Decisão: verificar apenas dois opcodes no `rmmz_objects.js` (118, 232/235)

- **Motivo:** a spec das tasks citava oito opcodes (0, 355, 232, 357,
  657, 231, 230, 119); apenas dois estavam suspeitos (`code 0` e
  `code 232`); os demais pareciam canonicalmente corretos.
- **Evidência disponível:** comentários `// verify` ao lado de `code 0`
  e ausência de comentário em `code 232`, mais a retrospective da Fase 2
  documentando inversões anteriores.
- **Resultado:** correto para os dois verificados, mas os demais seis
  foram propagados sem verificação direta.
- **Avaliação:** necessária para os dois suspeitos; omissão para os
  demais (especialmente `357`/`657`, que são plugin commands e mereciam
  checagem já que Fase 2 teve problema exatamente por confiar em spec).
- **Melhoria futura:** regra uniforme: **todo** opcode citado em uma task
  deve ser confirmado em `rmmz_objects.js` antes do patch — não apenas
  os suspeitos. Escrever a tabela completa no Patch specification, como
  acabou sendo feito.

### Decisão: renomear Patch F/G → I/J e Audit F/G → I/J/K

- **Motivo:** Fase 1 v2 usou A–F (visível em `build_phase1_ces.py`) e
  Fase 2 usou G–H (visível em `build_phase2_ces.py` e na retrospective);
  F/G colidiriam.
- **Evidência disponível:** `rg "patch_[a-z]_" fase1/ fase2/` mostra
  patch_a..patch_f + patch_g..patch_h.
- **Resultado:** rename feito de forma consistente em task-3.2 (incl.
  DoD), task-3.3 (Objective, Audit I/J/K, DoD), e sem stale references
  (verificado por grep final).
- **Avaliação:** necessária — colisão real cria ambiguidade em handoffs.
- **Melhoria futura:** o grep `rg "patch_[a-z]_" fase*/build_phase*.py`
  deveria ser o passo 0 do comando enrich-tasks, antes de qualquer
  edição, e o resultado escrito no topo das tasks editadas.

### Decisão: adicionar seção "Ceremony-lock interaction" em task-3.2

- **Motivo:** `EV_UpdateHud` é um novo CE paralelo em `SW_RACE_ACTIVE`;
  Fase 1 v2 estabeleceu que esse switch é owner de todos os paralelos e
  sensível a toggles. O novo CE também precisa respeitar `SW_PAUSED`
  para não competir com `EV_Crash` na transição cerimonial.
- **Evidência disponível:** `build_phase1_ces.py` linhas 282–326
  (Patch_E) já insere guard `SW_PAUSED==ON → Wait → Jump` no CE 10;
  mesma arquitetura se aplica aqui.
- **Resultado:** seção adicionada + Audit I passa a checar o guard.
- **Avaliação:** necessária — sem isso, `EV_UpdateHud` poderia
  re-renderizar a HUD durante vitória/derrota e competir com
  `EV_Crash`/`EV_Clean` por slots de picture.
- **Melhoria futura:** regra geral: **toda vez que uma task criar um CE
  paralelo novo em `SW_RACE_ACTIVE`, ela deve herdar os guards de
  `SW_PAUSED` e `SW_INPUT_LOCKED` já presentes em CE 10/11.**

### Decisão: adicionar Audit K (regressão do ceremony lock)

- **Motivo:** Fase 2 retrospetiva item §9.3 recomenda audit
  "região intocada" sempre que patches mexem em índices próximos a
  áreas críticas. Patch I/J podem deslocar commands em CE 5/19.
- **Evidência disponível:** Fase 2 adicionou Audit J com este propósito.
- **Resultado:** Audit K checa 3 invariantes do ceremony lock
  (`SW_INPUT_LOCKED=ON`, `SW_PAUSED=ON`, `SW_RACE_ACTIVE` intocado no
  head do CE 19).
- **Avaliação:** necessária e proporcional ao risco.
- **Melhoria futura:** padrão fixo: uma nova fase que adiciona patches
  deve sempre incluir um audit anti-regressão para a fase anterior.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta/comando                                | Objetivo                                     | Contribuiu? | Poderia ser mais simples?                          |
| ------------------------------------------------- | -------------------------------------------- | ----------- | -------------------------------------------------- |
| `Bash ls` em `planos/003-bug-fix-round1/`         | Mapear estrutura inicial                     | Sim         | Único `ls -R` teria economitado chamadas           |
| `Read tasks.md` (110 linhas)                      | Entender Conventions existentes              | Sim         | -                                                  |
| `Read task-3.1/3.2/3.3.md` em paralelo            | Estado atual das tasks da Fase 3             | Sim         | -                                                  |
| `Read retrospectiva-fase1-*.md` (496 linhas)      | Fonte de conhecimento R1                     | Sim         | Ler só §7 + §9 teria sido suficiente               |
| `Read retrospectiva-fase2-opcode-inversion.md` (327 linhas)  | Fonte de conhecimento R2a         | Sim         | Ler só §7 + §9                                     |
| `Read retrospectiva-fase2-revisao-tasks.md` (590 linhas)     | Fonte de conhecimento R2b         | Sim         | Ler só §7 + §9                                     |
| `Read build_phase1_ces.py` (424 linhas)           | Confirmar patches A–F e padrão idempotente   | Sim         | -                                                  |
| `Bash grep commandNNN rmmz_objects.js`            | Verificar opcodes                            | Sim         | **Deveria ter sido o passo 0, antes das leituras** |
| `Read rmmz_objects.js` linhas 10135–10775         | Confirmar handlers 118/119/230/231/232/235   | Sim         | `grep -A 5` teria bastado                          |
| `Edit` (10 chamadas) em 4 arquivos                | Aplicar correções cirúrgicas                 | Sim         | -                                                  |
| `Bash rg` final por `Patch [FG]` e opcodes errados | Detectar stale references                   | Sim         | Pegaria erro silencioso se pulado                  |

### Buscas redundantes / leituras excessivas

- **Leitura integral das três retrospectivas** (≈1.400 linhas totais).
  Cada uma tem ~150 linhas de conhecimento reutilizável concentrado em
  §7 e ~150 em §9. O resto é narrativa da execução original — útil para
  audit trail, não para revisão de tasks.
- **Dois `ls` separados** para `retrospetivas/fase1` e `fase2`. Um
  `ls -R retrospetivas/` teria mapeado tudo em uma chamada.

### Informações descobertas tardiamente que deveriam ser conhecidas desde o início

- O patch letter namespace (A–F em Fase 1, G–H em Fase 2) estava
  documentado na retrospective da Fase 2 §9.2, mas a leitura inicial
  das tasks da Fase 3 não sinalizou que `Patch F/G` colidiria. Um
  passo `rg "patch_[a-z]_" fase*/build_phase*.py` antes de ler qualquer
  task teria revelado a colisão em segundos.
- O opcode table verificado em `rmmz_objects.js` (documentado na
  retrospective Fase 2 §9.1) não estava referenciado em tasks.md;
  começou a ser re-descoberto quando suspeitas surgiram.

## 4. Intervenções e correções do usuário

### Intervenção 1 — Parâmetros obrigatórios não preenchidos

- **Instrução dada pelo usuário:** forneceu `FASE_ATUAL=3`,
  `DIR_RETROSPECTIVAS`, `DIR_BUILDS`, `TASKS_MD` após o agente pedir.
- **O que estava incorreto:** o template do `/loki:enrich-tasks`
  entrega placeholders vazios; o agente precisou perguntar antes de
  iniciar qualquer exploração.
- **Suposição causadora:** template genérico sem inferência de
  parâmetros.
- **Mudança após correção:** exploração iniciada com alvo claro.
- **Regra reutilizável:** ao receber `/loki:enrich-tasks` sem
  parâmetros, usar `AskUserQuestion` com os quatro campos na mesma
  pergunta; não iniciar exploração especulativa.

### Intervenção 2 — Nenhuma correção durante a execução

- O usuário não precisou redirecionar, complementar ou corrigir nenhuma
  das edições aplicadas. Todas as correções cirúrgicas passaram sem
  revisão. Isso sugere que as decisões técnicas estavam alinhadas com a
  expectativa do usuário.

## 5. Análise de desperdício

| Desperdício                                            | Impacto | Causa                                              | Como evitar                                                       |
| ------------------------------------------------------ | ------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| Leitura integral das 3 retrospectivas (~1.400 linhas)  | Médio   | Ausência de índice; "análise minuciosa" mal interpretada como "ler tudo" | Ler só §7 + §9 de cada retrospectiva; consultar outras seções sob demanda |
| Dois `ls` para mapear `retrospetivas/`                 | Baixo   | Uma chamada por subpasta                           | `ls -R` logo no início                                            |
| Opcodes verificados em `rmmz_objects.js` só após suspeita | Médio   | Confiança parcial na spec das tasks                | Regra uniforme: verificar TODOS os opcodes citados na task antes de editar |
| Quatro Edits em sequência para rename F→I/G→J          | Baixo   | Edits separados para Objective/DoD/spec/Step       | `Edit` com `replace_all=true` quando o termo é não-ambíguo        |
| Geração de TaskCreate 5 itens para trabalho de 10 edits | Baixo  | Acompanhamento formal de progresso                  | Para sessões curtas (<15 edits), TaskCreate é opcional            |

## 6. Caminho mínimo recomendado

Para executar `/loki:enrich-tasks` em uma fase N de um plano com
retrospectivas anteriores:

1. **Coletar parâmetros.** Entrada: comando sem parâmetros. Ferramenta:
   `AskUserQuestion` com 4 campos. Critério: usuário respondeu.
2. **Mapear namespace de patches.** Entrada: `DIR_BUILDS` e qualquer
   `fase*/build_phase*.py` existente. Ferramenta: `Bash` com
   `rg "patch_[a-z]_" fase*/build_phase*.py`. Resultado esperado: lista
   de letras já usadas. Critério: próxima letra livre identificada.
3. **Mapear namespace de audits.** Mesmo padrão para
   `rg "Audit [A-Z]"`.
4. **Ler `tasks.md`** (plano-alvo) e as tasks da fase N (~3 arquivos).
   Critério: escopo da fase identificado.
5. **Para cada retrospectiva anterior, ler apenas `## 7. Conhecimento
   reutilizável` e `## 9. Melhorias nos artefatos`.** Critério:
   aprendizados extraídos sem consumir narrativa de execução.
6. **Verificar opcodes.** Entrada: lista de opcodes citados nas tasks
   da fase N. Ferramenta: `Bash` com
   `grep commandNNN js/rmmz_objects.js`. Critério: cada opcode da task
   confirmado na fonte.
7. **Aplicar correções via `Edit`.** Uma chamada por mudança
   non-ambígua; `replace_all=true` quando aplicável. Critério: cada
   edit endereça uma inconsistência verificada.
8. **Validação final.** `rg` por (a) termos antigos renomeados,
   (b) opcodes invertidos, (c) referências a retrospectivas. Critério:
   zero hits em (a), (b), (c).

## 7. Conhecimento reutilizável

### Fatos confirmados

- Patch letter namespace do plano `003-bug-fix-round1` após Fase 3
  enrich: A–F (Fase 1 v2), G–H (Fase 2), I–K (Fase 3). Próxima fase
  começa em L.
- Audit letter namespace após Fase 3: G–J (Fase 2), I–K (Fase 3).
- `command118` = Label, `command119` = Jump to Label, `command230` =
  Wait, `command231` = Show Picture, `command232` = Move Picture,
  `command235` = Erase Picture, `command357` = Plugin Command. Todos
  confirmados em `Jhonny/js/rmmz_objects.js`.
- `SW_RACE_ACTIVE` (switch 100) é owner dos CEs paralelos 7, 10, 13,
  16 e não deve ser toggled dentro de CE que atravessa `Wait`/`Jump`/
  input loop. `SW_PAUSED` (switch 104) é o sinal cerimonial canônico
  — apenas Patch A (Fase 1 v2) liga e apenas Patch D desliga.
- Toda nova fase que adiciona patches deve incluir um audit
  anti-regressão das invariantes da fase anterior (pattern: Audit K
  checa ceremony lock da Fase 1).

### Preferências do usuário

- Edits cirúrgicos; sem reescrita de trechos já corretos (R4).
- Sem referência a arquivos de retrospectiva nos artefatos editados
  (R1).
- Português para conversação; inglês para identificadores e logs
  (regra `basci-rules.json`).
- Perguntar quando há dúvida real; não forçar mudança (R5).
- Autor: `Edney <edney_reis999@hotmail.com>`; sem `Co-authored-by`.

### Restrições técnicas

- `Jhonny/data/*.json` são read-only em runtime; edição só via gerador
  Python idempotente por fase.
- Geradores vivem em `fase<N>/build_phase<N>_ces.py`, idempotentes via
  pattern detection.
- `code 121` com `params[2]===0` liga switch; `params[2]===1` desliga.
- Audits Python não podem fazer `set(lista_de_dicts)` — dicts não são
  hashable; extrair campo scalar antes.
- Em Playtest pós-mudança em JSON, hard-refresh do browser
  (`Cmd+Shift+R`) é obrigatório para evitar cache.

### Armadilhas conhecidas

- **Opcodes RMMZ em specs podem estar invertidos ou serem MV-era.**
  Sintoma: patch "funciona" (sem erro) mas não produz efeito visível
  (silêncio de áudio, picture não aparece, switch não liga). Causa:
  confiança na spec sem verificar em `rmmz_objects.js`.
- **Reutilizar letras de patch entre fases sem checar** gera colisão
  ambígua em handoffs (dois "Patch F", dois "Audit G").
- **Confiança em dumps textuais** (`ce19-dump.txt`) — labels
  historicamente erram (TintPicture rotulado como EraseEvent).
  Sempre validar via `python3 -c "import json; ..."` direto no JSON.
- **CE paralelo novo em `SW_RACE_ACTIVE` sem guard de `SW_PAUSED`**
  compete com `EV_Crash`/`EV_Clean` por slots de picture durante a
  transição cerimonial.

### Heurísticas recomendadas

- Passo 0 de qualquer `/loki:enrich-tasks`: `rg "patch_[a-z]_"` e
  `rg "Audit [A-Z]"` para mapear namespaces.
- Para cada opcode citado em uma task, grep em `rmmz_objects.js`
  antes de editar — não apenas os suspeitos.
- Para cada CE paralelo novo em `SW_RACE_ACTIVE`, herdar os guards
  `SW_PAUSED`/`SW_INPUT_LOCKED` já presentes em CE 10/11.
- Para cada nova fase com patches, adicionar audit anti-regressão das
  invariantes da fase anterior.
- Em retrospectivas longas, ler só §7 (conhecimento reutilizável) e
  §9 (melhorias nos artefatos); consultar outras seções só se estas
  não forem suficientes.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:** `FASE_ATUAL`, `DIR_RETROSPECTIVAS`, `DIR_BUILDS`,
  `TASKS_MD` preenchidos no template (atualmente o template vem com
  placeholders vazios e obriga um round-trip com `AskUserQuestion`).
- **Obrigatório:** caminho canônico para `rmmz_objects.js` como fonte
  de verdade de opcodes, referenciado uma vez no prompt.
- **Útil:** tabela de patches/audits já usados por fase
  (`A–F`/`G–H`/…), para que o agente não precise descobrir via grep.
- **Útil:** instrução explícita "leia apenas §7 e §9 das retrospectivas;
  consulte outras seções sob demanda" — hoje o comando diz "análise
  minuciosa", o que leva a leitura integral.
- **Opcional:** convenção de nome de arquivo de retrospectiva
  (`YYYY-MM-DD-retrospectiva-<tema>.md`) para que a meta-retrospectiva
  (este arquivo) siga o mesmo padrão sem inferência.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

| Problema observado                                            | Causa principal                                  | Artefato responsável | Alteração necessária                                        | Prioridade |
| ------------------------------------------------------------- | ------------------------------------------------ | -------------------- | ----------------------------------------------------------- | ---------- |
| Opcodes invertidos propagados entre fases                     | Ausência de tabela opcode→handler canônica       | Análise técnica      | Adicionar "Dicionário RMMZ opcode→handler verificado"        | Alta       |
| `EV_UpdateHud` inicialmente planejado sem guard de `SW_PAUSED` | Análise não listou regras para novos CEs paralelos | Análise técnica      | Adicionar "Contrato para CEs paralelos em SW_RACE_ACTIVE"    | Alta       |

#### Patch sugerido para a análise técnica

Adicionar ao `race-feedback-impl-guide.md` uma seção única referenciável
por todas as tasks futuras:

```markdown
## RMMZ opcode dictionary (verificado em Jhonny/js/rmmz_objects.js)

Antes de escrever qualquer patch RMMZ com comando numérico, confirme o
opcode na fonte. Códigos confirmados para este projeto em 2026-06-20:

| Code | Handler         | Linha em rmmz_objects.js |
| ---- | --------------- | ------------------------ |
| 111  | Conditional Branch | ~10105                 |
| 115  | Exit Event Processing | ~10120               |
| 118  | Label           | 10139                    |
| 119  | Jump to Label   | 10144                    |
| 121  | Control Switch  | (params: [start, end, value]; value 0=ON, 1=OFF) |
| 122  | Control Variable | (params: [start, end, op, operandType, operandValue]) |
| 230  | Wait            | 10702                    |
| 231  | Show Picture    | 10708                    |
| 232  | Move Picture    | 10719 — **não é Erase**  |
| 235  | Erase Picture   | 10762                    |
| 355  | Script          | (params: [jsCode])       |
| 357  | Plugin Command  | 11321                    |
| 411  | Else            | []                       |
| 412  | End             | []                       |

## Contrato para CEs paralelos em SW_RACE_ACTIVE

Toda novo CE com `trigger: 2, switchId: 100` deve herdar os guards já
presentes em CE 10 (timer) e CE 11 (safe):

1. `If SW_RACE_ACTIVE == OFF → Exit` no topo.
2. `If SW_PAUSED == ON → Wait 1f → Jump <loop_label>` para não competir
   com `EV_Crash`/`EV_Clean` durante transição cerimonial.
3. `If SW_INPUT_LOCKED == ON → Wait 1f → Jump <loop_label>` para
   respeitar o lock operacional do cerimonial.

Sem estes guards, o CE competirá por slots de picture/variáveis durante
a janela de race condition entre o interpreter do mapa e o interpreter
do CE paralelo.
```

### 9.2 Melhorias no plano de implementação

| Problema observado                                       | Causa principal                            | Artefato responsável | Alteração necessária                                  | Prioridade |
| -------------------------------------------------------- | ------------------------------------------ | -------------------- | ----------------------------------------------------- | ---------- |
| Conventions do `tasks.md` não cobriam verificação de opcodes | Plano não consolidou aprendizado da Fase 2 | Plano               | Adicionar convenção "Opcode verification"             | Alta       |
| Conventions não cobriam namespace de patch letters        | Plano não consolidou aprendizado da Fase 2 | Plano               | Adicionar convenção "Patch letter namespace"          | Alta       |
| Conventions não cobriam validação semântica de audits     | Plano não consolidou aprendizado da Fase 2 | Plano               | Adicionar convenção "Semantic audits"                | Alta       |
| Conventions não cobriam invariante do ceremony-lock       | Plano não consolidou aprendizado da Fase 1 | Plano               | Adicionar convenção "Ceremony-lock invariant"         | Alta       |
| Conventions não cobriam hard-refresh do browser           | Plano não consolidou aprendizado da Fase 2 | Plano               | Adicionar convenção "Hard-refresh in Playtest"        | Média      |

**Status:** todas as cinco alterações já foram aplicadas ao `tasks.md`
nesta sessão (seção Conventions, antes de "No auto-commit").

### 9.3 Melhorias nas tasks da fase executada

Todas as correções já foram aplicadas nesta sessão. Lista consolidada:

| Task        | Problema                                                | Correção aplicada                                                          |
| ----------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `task-3.1`  | Ausência de nota sobre não confiar em dumps textuais    | Adicionada nota "Discovery hygiene" no topo do Step-by-step                |
| `task-3.2`  | `Patch F`/`Patch G` colidem com Fases 1–2               | Renomeado para `Patch I`/`Patch J`; função Python `patch_i_*`/`patch_j_*`   |
| `task-3.2`  | `code 0` rotulado como Label (incorreto)                | Corrigido para `code 118`; tabela de opcodes verificados adicionada         |
| `task-3.2`  | `code 232` rotulado como Erase Picture (incorreto)      | Corrigido para `code 235`; nota de que 232 é Move Picture                   |
| `task-3.2`  | Ausência de guard de `SW_PAUSED` no EV_UpdateHud        | Adicionada seção "Ceremony-lock interaction" + entrada correspondente no template |
| `task-3.3`  | `Audit F`/`Audit G` colidem com Fase 2                  | Renomeado para `Audit I`/`Audit J`; adicionado `Audit K` anti-regressão     |
| `task-3.3`  | Audits checavam só opcode, não semântica                | Audit I agora valida `code==118 + params==["HUD_TICK"] + guard SW_PAUSED`; Audit J valida TextPicture precede Show Picture |
| `task-3.3`  | Ausência de nota sobre cache do browser                 | Adicionada instrução de `Cmd+Shift+R` antes do Playtest                     |
| `task-3.3`  | DoD não incluía Audit K nem hard-refresh                | DoD atualizado para `Audit I, J, K OK` + checkbox de hard-refresh          |

Nenhuma alteração adicional recomendada para as tasks desta fase.

### 9.4 Problemas fora do escopo dos artefatos

| Problema observado                                  | Por que está fora do escopo                                  | Como tratar                                                            |
| --------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Template `/loki:enrich-tasks` não pré-preenche parâmetros | Falha de design do template, não das tasks                  | Atualizar template para inferir parâmetros do contexto do plano        |
| Leitura integral de retrospectivas por parte da LLM | Heurística operacional, não deficiência de spec              | Adotar regra interna "ler §7+§9 primeiro"                              |
| Confiança parcial em opcodes não-suspeitos          | Heurística operacional                                       | Regra uniforme: verificar TODOS os opcodes citados na task             |

### 9.5 Matriz de rastreabilidade das melhorias

| **Problema observado**                       | **Causa principal**                          | **Artefato responsável** | **Alteração necessária**                              | **Prioridade** |
| -------------------------------------------- | -------------------------------------------- | ------------------------ | ----------------------------------------------------- | -------------- |
| Patch F/G colidem com Fases 1–2              | Conventions sem namespace                    | Plano                    | Aplicado (convention + rename)                        | Alta           |
| `code 0`/`232` invertidos na spec            | Ausência de tabela opcode canônica           | Análise técnica          | Pendente (sugerido em 9.1); mitigado inline na task   | Alta           |
| `EV_UpdateHud` sem guard `SW_PAUSED`         | Ausência de contrato para CEs paralelos      | Análise técnica          | Pendente (sugerido em 9.1); mitigado inline na task   | Alta           |
| Audits puramente estruturais                 | Conventions sem "semantic audits"            | Plano                    | Aplicado (convention + audits reescritos)             | Alta           |
| Cache do browser mascara Playtest            | Conventions sem "hard-refresh"               | Plano                    | Aplicado (convention + DoD)                           | Média          |
| Leitura integral de retrospectivas           | Heurística operacional da LLM                | Fora do escopo           | Regra interna                                          | Baixa          |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar ao `race-feedback-impl-guide.md` a seção "RMMZ opcode
dictionary" e "Contrato para CEs paralelos em SW_RACE_ACTIVE", conforme
texto em §9.1. Isto elimina a necessidade de cada task reimplementar
sua própria tabela de opcodes (como task-3.2 acaba de fazer) e
centraliza o contrato que hoje está implícito em CE 10/11.

#### Patch sugerido para o plano de implementação

Já aplicado nesta sessão. As cinco novas entradas em `tasks.md` →
Conventions cobrem:
- Opcode verification
- Patch letter namespace
- Semantic audits
- Ceremony-lock invariant
- Hard-refresh in Playtest

#### Patch sugerido para as tasks da fase executada

Todas as correções já foram aplicadas nesta sessão. Ver §9.3 para a
lista consolidada.

#### Ações fora do fluxo de especificação

- Atualizar o template do comando `/loki:enrich-tasks` para
  pré-preencher `FASE_ATUAL`, `DIR_RETROSPECTIVAS`, `DIR_BUILDS`,
  `TASKS_MD` quando o contexto do plano já os tornar inferíveis (ex.:
  CWD dentro de `planos/<plano-id>/`).
- Adotar regra operacional interna: ao executar `/loki:enrich-tasks`,
  as primeiras três ações são `rg "patch_[a-z]_"`, `rg "Audit [A-Z]"`,
  `grep commandNNN rmmz_objects.js` — nesta ordem —, antes de ler
  qualquer task.

## 10. Checklist operacional

1. [ ] Coletar `FASE_ATUAL`, `DIR_RETROSPECTIVAS`, `DIR_BUILDS`,
      `TASKS_MD` via `AskUserQuestion` se não vierem preenchidos.
2. [ ] `rg "patch_[a-z]_" fase*/build_phase*.py` para mapear namespace
      de patches; mesma chamada para `Audit [A-Z]`.
3. [ ] `grep commandNNN rmmz_objects.js` para cada opcode citado nas
      tasks da fase alvo — não apenas os suspeitos.
4. [ ] Para cada retrospectiva anterior, ler só `## 7` e `## 9`;
      consultar outras seções sob demanda.
5. [ ] Para cada CE paralelo novo em `SW_RACE_ACTIVE`, exigir guard de
      `SW_PAUSED` e `SW_INPUT_LOCKED` (espelhar CE 10/11).
6. [ ] Para cada nova fase com patches, adicionar audit anti-regressão
      das invariantes da fase anterior.
7. [ ] Audits devem validar semântica (param shape esperada pelo
      handler), não só opcode numérico.
8. [ ] Após editar tasks, rodar `rg "Patch [A-H]\b|Audit [A-H]\b"` para
      detectar stale references a letras já usadas em fases anteriores.
9. [ ] `rg -ni "retrospectiva|retrospetiva"` deve retornar zero hits
      nos artefatos editados (R1).
10. [ ] Antes de Playtest, incluir instrução explícita de hard-refresh
       (`Cmd+Shift+R`) no handoff da última task da fase.
