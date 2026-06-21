---
data: 2026-06-21
fase: 5
processo: loki:enrich-tasks
artefatos_editados:
  - Jhonny/planos/003-bug-fix-round1/task-5.1.md
  - Jhonny/planos/003-bug-fix-round1/task-5.2.md
  - Jhonny/planos/003-bug-fix-round1/task-5.3.md
  - Jhonny/planos/003-bug-fix-round1/tasks.md
---

# Retrospectiva Técnica — enrich-tasks Fase 5 (THRESHOLDS refactor)

## 1. Resumo da tarefa

**Solicitado:** executar `/loki:enrich-tasks` para revisar os artefatos de
planejamento da Fase 5 do plano `003-bug-fix-round1` (refatoração dos
thresholds hardcoded para `window.JhonnyRace.Config`), incorporando
aprendizados de retrospectivas e builds anteriores, sem citar essas fontes
nos artefatos editados.

**Entregue:** 4 arquivos editados cirurgicamente (`task-5.1.md`,
`task-5.2.md`, `task-5.3.md`, `tasks.md`). Conflito crítico de valores de
threshold resolvido com o usuário antes da edição.

**Critérios de sucesso:**
- Aprendizados aplicáveis transformados em regras técnicas objetivas.
- Nenhuma menção a retrospectivas, builds anteriores ou arquivos internos.
- Escopo restrito à Fase 5 (R6).
- Idempotência (R4) e segurança (R7) verificadas.

**Restrições relevantes:**
- RPG Maker MZ (`data/*.json` + `js/plugins/*.js`).
- Plugin `Jhonny_RaceHelper.js` tem IIFE e já expõe `window.JhonnyRace`.
- CE 19 (`EV_VitoriaCorrida`) é o site da lógica de vitória.
- Convenções do plano: patch letters A-L (Fases 1-4), audit semântico,
  generator idempotente, hard-refresh no Playtest, ceremony-lock invariant.

## 2. Decisões técnicas e inferências

### 2.1 Valores de threshold (60/100/150 vs 200/400/600)

- **Decisão:** Perguntar ao usuário; resposta = preservar código atual
  (200/400/600 com fallback `|| 60`).
- **Motivo:** Spec `Corrida - Core Loop.md` §8.2 diz 60/100/150; código
  atual no CE 19 cmd[8] diz `{ 1: 200, 2: 400, 3: 600 }`. Conflito real
  com impacto direto em `THRESHOLDS`, no fallback defensivo e nos testes
  de boundary.
- **Evidência disponível:** verificação empírica via
  `python3 -c "import json; ..."` em `CommonEvents.json` + leitura da
  spec §8.2. Duas retrospectivas também sinalizavam o conflito, mas com
  estados de código diferentes em datas diferentes — só a verificação
  empírica dirimiu.
- **Resultado:** Funcionou. Tasks agora consistentes com a escolha do
  usuário.
- **Avaliação:** Necessária. Refatoração sem decisão explícita poderia
  acidentalmente "alinhar à spec" e mudar o balanceamento (corrida 1
  ficaria 3x mais fácil).
- **Melhoria futura:** Em qualquer tarefa de refatoração que envolva
  constantes numéricas, comparar spec vs código atual ANTES de editar, e
  perguntar ao usuário se divergirem.

### 2.2 Estrutura do fallback defensivo (dict vs ternário)

- **Decisão:** Reescrever o fallback para replicar a estrutura
  dict-with-`|| 60` do código atual, não o ternário 60/100/150
  mencionado no Implementation Guide.
- **Motivo:** task-5.3.md original apresentava um "before" que não
  existia no código (ternário inexistente). Qualquer implementador que
  seguisse o exemplo falharia em achar o padrão.
- **Evidência disponível:** dump empírico do CE 19 cmd[6-10] mostrando
  `const thresholds = { 1: 200, ... }; const passou = pontos >= (thresholds[raceId] || 60);`.
- **Resultado:** Funcionou. Task agora instruciona o implementador a
  capturar verbatim e preservar a estrutura dict.
- **Avaliação:** Necessária. Era um bug latente na especificação.
- **Melhoria futura:** Toda task que descreve "before/after" em refatoração
  deve validar o "before" contra o código atual antes de ser finalizada.

### 2.3 Patch letter M, Audit M (não I)

- **Decisão:** Renomear "Audit I" (colisão com Fase 3) para "Audit M",
  alinhado com o patch letter M da Fase 5.
- **Motivo:** Ausência de verificação prévia do namespace de audit
  letters na task-5.3 original.
- **Evidência disponível:** tarefas.md + retrospectivas confirmam
  Fase 1=A-F, Fase 2=G-H, Fase 3=I-J, Fase 4=K-L.
- **Resultado:** Funcionou.
- **Avaliação:** Necessária.
- **Melhoria futura:** Antes de citar qualquer "Audit X" ou "Patch X" em
  uma nova task, rodar `rg "Audit [A-Z]"` e `rg "patch_[a-z]_"` em
  `fase*/build_phase*.py` para confirmar o namespace livre.

### 2.4 Namespace block via accumulator pattern

- **Decisão:** Exigir `window.JhonnyRace = window.JhonnyRace || {}` no
  bloco de namespace, em vez de reatribuição.
- **Motivo:** Descoberta empírica de que `window.JhonnyRace = { ... }`
  já existe no plugin (linha 170) e expõe APIs usadas em outro lugar.
- **Evidência disponível:** `grep "window\.JhonnyRace" Jhonny_RaceHelper.js`.
- **Resultado:** Funcionou. Task agora exige inspecionar a API existente
  antes de inserir e proíbe clobbering.
- **Avaliação:** Necessária — sem isso, o implementador poderia
  silenciosamente remover `logFrameDebug` e outras APIs.
- **Melhoria futura:** Para qualquer plugin com namespace global,
  verificar via grep se a global já existe antes de prescrever uma
  estratégia de inserção.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta/comando                                | Objetivo                                            | Necessário? | Contribuiu? | Poderia evitar?                                |
|---------------------------------------------------|-----------------------------------------------------|-------------|-------------|------------------------------------------------|
| `ls` + `find` no plano                            | Inventariar estrutura antes de sugerir parâmetros   | Sim         | Sim         | Manter — baixo custo, alta orientação          |
| `Read` tasks.md + 3 task files (paralelo)         | Carregar contexto da Fase 5                         | Sim         | Sim         | Manter                                         |
| `Agent` x3 (fase-planning, fase1-4, builds)       | Análise paralela de 13 arquivos de fonte interna    | Sim         | Sim         | Reduzir para 2 agentes; builds poderiam entrar no de fase1-4 |
| `Bash` `python3 -c` dump CE 19                    | Verificação empírica do estado atual do código      | Sim         | Crítico     | Deveria ter sido o PASSO 1, antes dos agentes  |
| `Bash` `grep "window\.JhonnyRace"` no plugin      | Verificar API existente                             | Sim         | Crítico     | Mesmo — deveria ter vindo antes               |
| `Bash` `grep "threshold"` na spec §8.2            | Confirmar spec normativa                            | Sim         | Sim         | Poderia ter sido evitado se a spec fosse lida primeiro |
| `Edit` x7                                         | Aplicar mudanças cirúrgicas                         | Sim         | Sim         | Manter                                         |
| `Bash` `rg` final para termos proibidos           | R7 safety check                                     | Sim         | Sim         | Manter — pegou uma phrase borderline ("earlier phases") |

**Buscas redundantes:** Nenhuma crítica. Os 3 agentes produziram alguma
sobreposição conceitual (todos mencionaram patch letter M, indent=4,
audit semântico), mas isso foi consolidado antes das edições.

**Informações descobertas tardiamente que deveriam ter sido verificadas
primeiro:**
1. **Valores reais no CE 19** (200/400/600). Se verificados no passo 1,
   teriam eliminado a necessidade do Agente A relatar o conflito.
2. **`window.JhonnyRace` já existe** no plugin. Verificação simples via
   grep — teria poupado uma inferência.

## 4. Intervenções e correções do usuário

### 4.1 Confirmação de fase + caminhos

- **Instrução:** "Fase 5" + "Sim, todos corretos".
- **O que estava ambíguo antes:** sem essa confirmação, poderia estar
  editando a fase errada (Fase 4 já estava implementada).
- **Causa:** o usuário invocou o comando sem passar os 4 parâmetros
  obrigatórios.
- **Mudança após correção:** prossegui com Fase 5.
- **Regra reutilizável:** quando um comando exige N parâmetros
  obrigatórios e o usuário não os passa, listar os parâmetros
  inferidos + pedir confirmação em uma única pergunta agregada.

### 4.2 Valores de threshold

- **Instrução:** "Preservar código atual (200/400/600)".
- **O que estava incorreto antes:** task-5.2 e task-5.3 hardcoded em
  60/100/150 (seguindo a spec), mas o código dizia 200/400/600.
- **Causa:** Spec divergence não tinha sido flaggada explicitamente nas
  tasks. A análise técnica ou a escrita das tasks teria pego isso se
  tivesse comparado spec vs código na hora da criação.
- **Mudança após correção:** todos os valores atualizados para
  200/400/600 (incluindo fallback, audit regex, boundary tests).
- **Regra reutilizável:** para refatorações que movem constantes,
  SEMPRE validar o valor no código atual antes de citar valores na
  especificação.

Nenhuma das duas intervenções foi correção de erro da LLM — foram
esclarecimentos de ambiguidades reais que o prompt do comando já previa
(seção 3.3 — perguntar quando fontes aplicáveis e plausíveis divergem).

## 5. Análise de desperdício

| Desperdício                                                    | Impacto | Causa                                                                | Como evitar                                                            |
|----------------------------------------------------------------|---------|----------------------------------------------------------------------|------------------------------------------------------------------------|
| 3 agentes paralelos quando 2 bastavam                          | Médio   | Partição arbitrária fase-planning / fase1-4 / builds                 | Em retrospectivas de plano grande, particionar por tema (valores, padrões de generator, convenções), não por pasta |
| Verificação empírica do CE 19 veio DEPOIS dos 3 agentes        | Médio   | Ordem operacional — fui direto para a análise de fontes internas     | Fazer a verificação empírica do site alvo ANTES de lançar agentes; isso já resolve ou refina a maioria dos conflitos |
| agents produziram sobreposição conceitual (patch letter M etc.)| Baixo   | Cada agente recebeu task-list + tasks.md como contexto               | Em análises paralelas, designar um agente como "dono" de cada tema transversal |
| Pergunta sobre "destino do retro" no início desta retrospeção  | Baixo   | Convenção de meta-retros (fase-planning) vs retro de fase (fase5/) não estava definida | Documentar a convenção no tasks.md do plano ou no CLAUDE.md           |

Não houve: leitura integral desnecessária, tentativas sem validar
pré-condições, buscas amplas, artefatos intermediários inúteis, ou
perguntas cuja resposta já estava no contexto.

## 6. Caminho mínimo recomendado

Para uma próxima execução de `/loki:enrich-tasks` sobre uma fase de
refatoração com constantes numéricas:

1. **Confirmar parâmetros com o usuário** (fase + 3 caminhos) em uma
   única `AskUserQuestion`. *Entrada:* contexto do plano. *Saída:* 4
   valores confirmados.
2. **Verificação empírica do site alvo** (BEFORE de ler fontes
   internas). Para Fase 5 seria: `python3 -c "import json; ..."` para
   dumpar CE 19 cmd[6-10] + `grep "window.JhonnyRace" no plugin`. *Entrada:* lista
   de sites impactados da task. *Saída:* estado atual do código. *Critério:* ter
   o snapshot real antes de qualquer outra leitura.
3. **Ler spec normativa** que rege os valores/estrutura do site alvo.
   *Saída:* verdade normativa.
4. **Comparar spec vs código.** Se divergirem em valores/comportamento,
   preparar pergunta ao usuário. *Critério:* ou convergedores iguais,
   ou conflito explicitado.
5. **Ler tasks.md + arquivos de task da fase** (paralelo, 1 batch).
6. **Ler fontes internas (retrospectives/builds)** em paralelo (1-2
   agentes, não 3). *Entrada:* lista de arquivos. *Saída:* aprendizados
   estruturados por arquivo + síntese cross-file.
7. **Consolidar aprendizados + resolver conflitos** internamente quando
   possível (R3.4); perguntar ao usuário só os genuínulos (R3.3).
8. **Aplicar edições cirúrgicas** com `Edit`. *Critério:* uma alteração
   por regra técnica aplicável, sem reescrever seções corretas.
9. **R7 safety check** via `rg` por termos proibidos.
10. **Relatório final** com Resumo / Arquivos alterados / Não alterados
    / Pendências.

Critério objetivo de conclusão: todas as regras aplicáveis foram
convertidas em instruções técnicas; nenhum termo proibido sobreviveu;
escopo preservado; idempotência (R4) satisfeita.

## 7. Conhecimento reutilizável

### Fatos confirmados

- CE 19 = `EV_VitoriaCorrida` no índice 0-based 19 de `CommonEvents.json`.
- CE 19 cmd[6-10] contém a lógica de threshold:
  - cmd[6] code=355: `const pontos = $gameVariables.value(105);`
  - cmd[7] code=655: `const raceId = $gameVariables.value(100);`
  - cmd[8] code=655: `const thresholds = { 1: 200, 2: 400, 3: 600 };`
  - cmd[9] code=655: `const passou = pontos >= (thresholds[raceId] || 60);`
  - cmd[10] code=655: `$gameVariables.setValue(117, passou ? 1 : 0);`
- Variáveis: `RACE_ID = 100`, `PONTOS_GLORIA = 105`, `VITORIA_PASSOU = 117`.
- `window.JhonnyRace` já existe em `Jhonny_RaceHelper.js` (~linha 170),
  dentro do IIFE, expondo APIs como `logFrameDebug` e `rollPCena`.
- Spec `Corrida - Core Loop.md` §8.2 prescreve 60/100/150 — diverge do
  código (200/400/600). Decisão do usuário (2026-06-21): preservar
  código.
- Patch letter namespace: Fase 1 v2=A-F, Fase 2=G-H, Fase 3=I-J,
  Fase 4=K-L, Fase 5=M.
- `CommonEvents.json` usa `indent=4`, `ensure_ascii=False`, com
  trailing newline; sem `sort_keys`.
- Plugin IIFE abre com `(() => {` e fecha com `})();`.

### Preferências do usuário

- Para refatorações que movem constantes, **preservar o código atual**
  — não aproveitar a refatoração para alinhar à spec. Mudança de
  balanceamento é escopo separado.
- Perguntas agregadas em uma única `AskUserQuestion` quando possível,
  não múltiplas em sequência.

### Restrições técnicas

- R1 do `/loki:enrich-tasks` é estrita: proibido citar retrospectivas,
  builds anteriores, "na fase passada", "no build anterior", "foi
  aprendido anteriormente", "as seen in", ou nomear arquivos analisados
  como fonte. A frase "earlier phases in this round" foi considerada
  borderline e reescrita para "Generator conventions (see existing
  generators under the `fase<N>/build_phase<N>_ces.py` pattern)".
- Citar o padrão glob `fase<N>/build_phase<N>_ces.py` é OK (é vocabulário
  do projeto, não revela fonte interna).
- Citar o arquivo-alvo da implementação (e.g. `Jhonny_RaceHelper.js`) é
  OK — não é retrospectiva nem build anterior.

### Armadilhas conhecidas

- Assumir que spec normativa reflete o código atual. Aqui não refletia.
- Assumir que a estrutura do "before" na task corresponde ao código.
- Audit letters colidem entre fases se não verificado via `rg`.
- Reescrever `window.JhonnyRace = { ... }` como object literal clobba
  APIs existentes — usar accumulator.
- Especificar fallback defensivo com estrutura diferente do código
  atual (ternário vs dict) muda o behavior em caso de falha.

### Heurísticas recomendadas

- Para refatoração de constantes: verifique o código antes de confiar
  na spec.
- Para qualquer patch em CE: empilhe `rg "patch_[a-z]_"` e
  `rg "Audit [A-Z]"` antes de nomear um novo patch/audit.
- Para plugins com namespace global: grep pela global antes de
  prescrever como inserir.
- Para `Edit` em tasks: uma chamada por regra aplicável; nunca
  reescreva seção que já está correta.
- Após todas as edições: rode `rg` por uma lista fixa de termos
  proibidos ("retrospect", "previous build/phase", "prior art",
  "was learned", "as seen in", "fase passada", "build anterior") como
  check R7 final.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:** FASE_ATUAL, DIR_RETROSPECTIVAS, DIR_BUILDS,
  TASKS_MD (os 4 parâmetros que o comando exige). Sem eles, a LLM tem
  que inferir e confirmar.
- **Obrigatório:** estado atual do(s) site(s) alvo da fase — qual o
  código real hoje. Sem isso, especulação sobre "before" é inevitável.
  Para esta sessão especificamente: snapshot de CE 19 cmd[6-10] +
  listagem da API `window.JhonnyRace` existente.
- **Útil:** divergências conhecidas entre spec e código (e.g., "spec
  diz 60/100/150 mas código diz 200/400/600; decisão = preservar
  código"). Teria eliminado a pergunta ao usuário.
- **Útil:** namespace atual de patch/audit letters (Hoje: A-L patches,
  A-K audits — confirmar via rg no início).
- **Opcional:** preferência por perguntas agregadas em uma única
  `AskUserQuestion`.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema:** spec §8.2 prescreve 60/100/150; código atual diz
200/400/600. Análise técnica não flaggeou.

**Informação ausente:** tabela de "estado atual dos componentes
impactados" com snapshot verbatim do código.

**Por que pertence à análise técnica:** divergências spec-vs-código são
estruturais — não são detalhe operacional de uma task.

**Seção onde adicionar:** `race-feedback-impl-guide.md` §2.4 (Migration
Safety), sub-seção "Known divergences".

**Texto sugerido:**
```markdown
### Known divergences (spec vs current code)

- **THRESHOLDS values**: spec §8.2 prescribes {1:60, 2:100, 3:150}.
  Current code in CE 19 cmd[8] has {1:200, 2:400, 3:600} with `|| 60`
  fallback. Phase 5 refactor MUST preserve code values; aligning to
  spec is a separate rebalance task out of scope.
- **Defensive fallback structure**: current code uses dict-with-`|| 60`,
  not a ternary. The fallback MUST replicate the dict form verbatim.
```

**Impacto esperado:** elimina a pergunta ao usuário sobre valores;
elimina a especulação do Agente A sobre qual conjunto é canônico.

### 9.2 Melhorias no plano de implementação

**Problema:** `tasks.md` descrevia validação visual da Fase 5 como
"Victory at 60 glory, defeat at 59" — incorreto dado o código atual.

**Deficiência:** validação visual não foi ancorada no estado atual do
código; foi ancorada na spec normativa.

**Etapa afetada:** Phase 5 Visual validation + task-5.1 description.

**Alteração recomendada:** já aplicada nesta sessão. Para o futuro:
adicionar ao `tasks.md` Conventions uma regra:

**Texto sugerido (acrescentar ao bloco Conventions):**
```markdown
- **Spec vs code anchoring:** any visual validation that references a
  numeric threshold MUST be checked against the current code (e.g. via
  `python3 -c "import json; ..."` dump), not against the spec alone.
  If they diverge, the validation uses the code value and the
  divergence is noted in the corresponding task.
```

**Como reduziria custo:** validações visuais já nasceriam corretas;
nenhuma task downstream precisaria ser corrigida.

### 9.3 Melhorias nas tasks da fase executada

Todas as melhorias já foram aplicadas nesta sessão:

- **task-5.1:** `rg` estendido para 60/100/150/200/400/600; passo de
  verificação de VAR_NAMES adicionado; exemplo de "current code"
  corrigido para dict form; colunas do inventory explicitadas.
- **task-5.2:** valores 200/400/600; accumulator pattern para
  `window.JhonnyRace`; remover menção a "retrospective guidance";
  visual validation com 200/199.
- **task-5.3:** fallback defensivo em dict form; patch M; Audit M com
  regex de 6 formas; ceremony-lock invariant; indent=4 + HEAD check;
  reword de "Prior art: any prior generator".
- **tasks.md:** Phase 5 validation 200/199; patch letter namespace
  atualizado A-L + M.

**Como validar que as novas instruções são suficientes:** rodar
`/loki:enrich-tasks` novamente sobre a Fase 5 — deve ser idempotente
(R4) e imprimir "nenhuma alteração necessária".

### 9.4 Problemas fora do escopo dos artefatos

| Problema                                                      | Por que está fora do escopo                                              | Como tratar                                                                                          |
|---------------------------------------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| 3 agentes paralelos quando 2 bastavam                         | Decisão operacional da LLM, não deficiência de spec                      | Heurística interna: particionar por tema, não por pasta                                              |
| Verificação empírica veio depois dos agentes                  | Ordem operacional da LLM                                                 | Heurística interna: site target dump = passo 1                                                       |
| Pergunta sobre destino do retro                               | Convenção de meta-retros não documentada                                 | Documentar no CLAUDE.md do plano: "retros de /loki:enrich-tasks vão em `retrospetivas/fase<N>/`"   |
| Necessidade de R7 reword ("earlier phases")                   | Regra R1 é estrita; a LLM testou o limite aceitável                      | Manter R1; heuristicamente, prefira "Conventions (see X pattern)" a "established by previous Y"     |

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado                                    | Causa principal                                | Artefato responsável         | Alteração necessária                                              | Prioridade |
|-------------------------------------------------------|------------------------------------------------|------------------------------|-------------------------------------------------------------------|------------|
| Valores de threshold divergem entre spec e código     | Spec não confrontada com código na análise     | Análise técnica              | Adicionar "Known divergences" em `race-feedback-impl-guide.md` §2.4 | Alta       |
| Validação visual da Fase 5 citava 60/59 (spec)        | Plano ancorou validação na spec, não no código | Plano de implementação       | Adicionar regra "Spec vs code anchoring" às Conventions           | Alta       |
| Tasks 5.1/5.2/5.3 prescreviam estrutura/code errados  | Tasks não validaram "before" contra código     | Tasks (já aplicado)          | Aplicado nesta sessão — idempotente na próxima                    | Alta       |
| Audit I colidia com Fase 3                            | Ausência de verificação de namespace           | Tasks (já aplicado)          | Renomeado para Audit M; Conventions recomenda `rg` antes           | Média      |
| `window.JhonnyRace` API puderia ser clobbada          | Análise não grepou a global                    | Análise técnica + Tasks      | Aplicado; regra: grep globals antes de prescrever inserção        | Média      |
| Decisão operacional de 3 agentes vs 2                 | Partição arbitrária                            | Fora do escopo               | Heurística interna only                                           | Baixa      |
| Convenção de destino de meta-retros                   | Não documentada                                | Fora do escopo               | Documentar no CLAUDE.md do plano                                  | Baixa      |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar a `Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md`,
seção §2.4 (Migration Safety), nova sub-seção:

```markdown
### Known divergences (spec vs current code)

The following divergences between the spec and the current codebase
were identified during Phase 5 enrich-tasks on 2026-06-21. They MUST
be respected by the refactor:

- **THRESHOLDS values**: spec §8.2 prescribes `{1:60, 2:100, 3:150}`.
  Current code in CE 19 cmd[8] has `{1:200, 2:400, 3:600}` with
  `|| 60` fallback. Phase 5 MUST preserve code values; aligning to
  spec is out of scope.
- **Defensive fallback structure**: current code uses
  dict-with-`|| 60`, not a ternary. The fallback MUST replicate the
  dict form verbatim.
- **`window.JhonnyRace` global already exists** in
  `Jhonny_RaceHelper.js` (~line 170) inside the IIFE, exposing APIs
  like `logFrameDebug` and `rollPCena`. Any new namespace block MUST
  use the accumulator pattern (`window.JhonnyRace = window.JhonnyRace || {}`),
  never reassignment.
```

#### Patch sugerido para o plano de implementação

Adicionar a `Jhonny/planos/003-bug-fix-round1/tasks.md`, bloco
Conventions:

```markdown
- **Spec vs code anchoring:** any visual validation that references a
  numeric threshold, literal value, or code structure MUST be checked
  against the current code (e.g. via
  `python3 -c "import json; ..."` dump for CE scripts, or `grep` for
  plugin globals), not against the spec alone. If spec and code
  diverge, the validation uses the code value and the divergence is
  noted in the corresponding task as a "Known divergence" item.
```

#### Patch sugerido para as tasks da fase executada

`Nenhuma alteração recomendada para as tasks desta fase.` Todas as
melhorias aplicáveis já foram aplicadas nesta sessão; uma re-execução
do `/loki:enrich-tasks` deve ser idempotente.

#### Ações fora do fluxo de especificação

- Documentar no `Jhonny/planos/003-bug-fix-round1/CLAUDE.md` (ou no
  `tasks.md` Conventions) a convenção de destino de meta-retros:
  retros sobre o processo `/loki:enrich-tasks` vão em
  `retrospetivas/fase<N>/YYYY-MM-DD-retrospectiva-faseN-enrich-tasks.md`
  (decisão do usuário em 2026-06-21: usar `fase<N>/`, não
  `fase-planning/`).
- Heurística operacional (interna da LLM, não dos artefatos): em
  `/loki:enrich-tasks`, fazer o dump empírico do site-alvo ANTES de
  lançar agentes de análise de fontes internas. Reduz custo e
  elimina especulação.

## 10. Checklist operacional

Antes e durante a próxima execução de `/loki:enrich-tasks`:

1. **Pré-condição:** usuário confirmou os 4 parâmetros obrigatórios
   (FASE_ATUAL, DIR_RETROSPECTIVAS, DIR_BUILDS, TASKS_MD).
2. **Pré-condição:** dump empírico do site-alvo da fase executado
   antes de ler fontes internas.
3. **Fonte de verdade:** código atual (CE dumps, plugin grep) >
   retrospectivas > spec normativa. Quando divergem, código atual
   vence para "preservar behavior"; spec vence para "intenção de
   design" — conflitos vão ao usuário.
4. **Validação crítica:** `rg "patch_[a-z]_"` e `rg "Audit [A-Z]"`
   antes de nomear qualquer novo patch ou audit.
5. **Validação crítica:** `rg -i "retrospect|previous (build|phase)|prior art|fase passada|build anterior|as seen in|was learned"` ao final (R7).
6. **Erro conhecido:** namespaces `window.*` já podem existir em
   plugins — sempre grep antes de prescrever inserção.
7. **Erro conhecido:** estruturas "before" em refatorações devem
   matchear código atual, não spec.
8. **Critério de conclusão:** regra R4 idempotente — uma re-execução
   do `/loki:enrich-tasks` deve imprimir "nenhuma alteração
   necessária" para todas as tasks da fase.
9. **Critério de conclusão:** nenhum termo proibido sobreviveu ao
   R7 check.
10. **Critério de conclusão:** para cada aprendizado aplicável, há
    uma instrução técnica objetiva no artefato editado, sem
    referência à fonte.
