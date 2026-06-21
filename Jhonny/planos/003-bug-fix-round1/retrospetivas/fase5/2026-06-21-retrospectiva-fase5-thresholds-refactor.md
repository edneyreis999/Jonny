---
data: 2026-06-21
fase: 5
processo: implementação (tasks 5.1, 5.2, 5.3)
artefatos_editados:
  - Jhonny/js/plugins/Jhonny_RaceHelper.js
  - Jhonny/data/CommonEvents.json
artefatos_criados:
  - Jhonny/planos/003-bug-fix-round1/interaction/fase5/sites-inventory.md
  - Jhonny/planos/003-bug-fix-round1/interaction/fase5/build_phase5_ces.py
  - Jhonny/planos/003-bug-fix-round1/interaction/fase5/fase-5-completa.md
---

# Retrospectiva Técnica — Implementação Fase 5 (THRESHOLDS refactor)

## 1. Resumo da tarefa

**Solicitado:** implementar a Fase 5 do plano `003-bug-fix-round1/tasks.md` —
refatorar os magic numbers de threshold de vitória para um namespace
`window.JhonnyRace.Config.THRESHOLDS` no plugin, substituindo o bloco inline
de comparação em CE 19 (EV_VitoriaCorrida) por uma chamada ao helper
`isVictory(pontosGloria, raceId)`, preservando um fallback defensivo
verbatim se o plugin não estiver carregado.

**Entregue:**
- `Jhonny_RaceHelper.js`: bloco `window.JhonnyRace.Config.THRESHOLDS = Object.freeze({1:200, 2:400, 3:600})` + `DEFAULT_THRESHOLD = 60` + `isVictory`/`thresholdFor`, via accumulator pattern preservando a API existente.
- `CommonEvents.json` CE 19 cmd[6-10]: bloco de 5 scripts reescrito para `if (typeof window.JhonnyRace === "undefined") { ...fallback... } else { ...helper call... }`, mesma forma `1×code=355 + 4×code=655`.
- Gerador idempotente `interaction/fase5/build_phase5_ces.py` (patch M).

**Critérios de conclusão:**
- `node -c` no plugin OK.
- `python3 -m json.tool` no CommonEvents.json OK.
- Gerador idempotente: 2ª run = "skipped" + `git diff` vazio.
- Audit M semântico passa.
- Smoke test Node em ambos os paths (helper + fallback) produz o mesmo resultado nos boundaries.
- Usuário confirmou Playtest ("FUNCIONOU!").

**Restrições relevantes:**
- RPG Maker MZ JSON: code 355=Script, 655=ScriptContinue, 121=ControlSwitch (params[2]=0 ON, 1 OFF), 111=ConditionalBranch, 411=Else, 412=End, 117=CallCE, 118=Label, 119=JumpToLabel.
- Ceremony-lock invariant: switches 100/101/104 não podem ser tocados em CE 19 fora do head/tail canônicos.
- Forma do bloco: 5 cmds contíguos (1×355+4×655), sob pena de deslocar Label WAIT_INPUT e branches em VAR_VITORIA_PASSOU.
- Patch letter M reservado para Fase 5 (Phases 1-4 usaram A-L).

## 2. Decisões técnicas e inferências

### 2.1 — Valores do threshold: 200/400/600 (não 60/100/150)

- **Decisão:** usar `{1:200, 2:400, 3:600}` com `DEFAULT_THRESHOLD=60` no namespace.
- **Motivo:** spec §8.2 diz 60/100/150, mas CE 19 atualmente contem `{1:200, 2:400, 3:600}` com `|| 60`. Task-5.2.md era explícito: "MUST match the literal values currently inlined in CE 19".
- **Evidência:** `python3 -c` em CE 19 cmd[8] imprimiu `'const thresholds = { 1: 200, 2: 400, 3: 600 };'`.
- **Resultado:** funcionou; behaviour do jogo preservado.
- **Avaliação:** necessária. Spec está desatualizada; mudar os valores seria mudar balance, fora de escopo.
- **Melhoria futura:** nenhum action items para a task — o desvio spec vs código é um facto do projecto que merece ser corrigido em tuning futuro, não nesta refator.

### 2.2 — Distribuição do novo bloco: fallback todo em cmd[6], helper em cmd[7-9], close `}` em cmd[10]

- **Decisão:** carregar toda a branch fallback numa única string em cmd[6] (após o `if`), deixando cmd[7-10] só com a branch helper.
- **Motivo:** tornar o audit M viável — assim o segmento helper (depois de `} else {`) fica livre de qualquer literal adjacente a `value(105)`/`value(100)`, e o fallback fica isolado num único segmento auditável.
- **Evidência:** task-5.3.md step 7 descrevia audit com trigger `'thresholds' in ctx` + janela 60 chars — esse audit seria incompatível com qualquer fallback que co-localizasse thresholds/literals (que é o ponto do fallback).
- **Resultado:** funcionou. Audit M semântico (split em `} else {`) passou limpo.
- **Avaliação:** necessária. Sem essa distribuição, qualquer fallback verbatim falharia o audit.
- **Melhoria futura:** o audit spec tinha uma incoerência interna (exigia fallback verbatim + audit que proíbe literals perto de thresholds); um futuro autor de audits semelhantes deveria explicitar "fallback é a única zona permitida para literals em forma de comparação".

### 2.3 — Acumulator pattern `const JhonnyRace = window.JhonnyRace || {}` seguido de `Object.assign`

- **Decisão:** não reescrever `window.JhonnyRace = { ... }` do final do IIFE; em vez disso, capturar o global existente, adicionar `Config`/`isVictory`/`thresholdFor`, depois mesclar via `Object.assign` antes de re-publicar.
- **Motivo:** task-5.2.md step 4 exigia preservar API existente (logFrameDebug, rollPCena, etc.).
- **Evidência:** plugin já publicava `window.JhonnyRace = { rollSceneType, rollPCena, ... }` na linha 170; um simples reassignment sobrescreveria.
- **Resultado:** funcionou. Smoke test confirmou todas as 8 propriedades existentes ainda presentes após o edit.
- **Avaliação:** necessária e não óbvia.
- **Melhoria futura:** nenhum action item — a regra já está no task-5.2.md; foi seguida correctamente.

### 2.4 — Desvio do audit literal do task-5.3.md step 7

- **Decisão:** não aplicar o audit literal (com trigger `'thresholds' in ctx`); em vez disso, escrever audit semântico com split em `} else {`.
- **Motivo:** o audit literal é incompatível com o fallback exigido no step 3 do mesmo task — co-localização de `value()`/`thresholds`/literals é a definição do fallback.
- **Evidência:** o comentário do próprio audit dizia "Only flag literals adjacent to value(105)/value(100)" — ou seja, a intenção declarada era só `value()`, não `thresholds`. A inclusão de `'thresholds' in ctx` era uma sobreposição não intencional.
- **Resultado:** funcionou. Documentado em `fase-5-completa.md` seção "Desvio documentado do audit literal".
- **Avaliação:** necessária. Aplicar o audit literal teria falhado o DoD sem motivo real.
- **Melhoria futura:** preferir sempre a intenção declarada do audit (no comentário) ao código literal, quando há contradição. Documentar o desvio no relatório de conclusão.

## 3. Uso de ferramentas, comandos e scripts

### 3.1 — `rg -n "\b(60|100|150|200|400|600)\b"` em CommonEvents.json + plugin

- **Objetivo:** inventariar todos os sites de thresholds (task 5.1).
- **Resultado:** 154 hits; classificação manual em 1 threshold-related + 149 unrelated.
- **Substituível?** Não. Único comando que cobre o espaço de busca.
- **Como evitar redundância:** executado uma única vez.

### 3.2 — `rg -n "threshold"` no plugin

- **Objetivo:** confirmar que não havia THRESHOLDS pré-existente.
- **Resultado:** 0 hits, confirmou que task 5.2 introduz o namespace fresh.
- **Substituível?** Não, mas poderia ter sido combinado com 3.1 em paralelo (foi).

### 3.3 — `python3 -c` para inspecionar CE 19 cmd por cmd

- **Objetivo:** ver a estrutura interna do CE 19 antes de escrever o gerador.
- **Resultado:** revelou cmd[6-10] como o bloco alvo exato.
- **Substituível?** Não. Essencial para escrever o locator do gerador.
- **Como evitar redundância:** executado uma vez; subsequentes inspecções via audit M.

### 3.4 — Leitura integral do `race-feedback-impl-guide.md` (932 linhas)

- **Objetivo:** entender o guia de implementação.
- **Resultado:** fornecedor de §2.3 (pseudo-código) e §2.4 (migration safety), mas só ~50 linhas eram directamente relevantes para a Fase 5.
- **Substituível?** Sim, por leitura dirigida: `Read` apenas as linhas 96-200 do guide (secção Issue #1).
- **Impacto do desperdício:** médio (~880 linhas lidas sem necessidade).

### 3.5 — `node -c` no plugin após edit

- **Objetivo:** validar sintaxe JS.
- **Resultado:** passou.
- **Substituível?** Não. Checagem rápida e barata.

### 3.6 — `node -e` smoke test do namespace após edit (task 5.2)

- **Objetivo:** verificar `isVictory(200,1)===true`, `isVictory(199,1)===false`, API existente preservada, `Object.isFrozen(THRESHOLDS)===true`.
- **Resultado:** todos os casos passaram.
- **Substituível?** Não. Confirmou o DoD da task 5.2 sem precisar de Playtest.

### 3.7 — `node -e` smoke test do bloco CE 19 reescrito

- **Objetivo:** validar ambos os paths (helper + fallback) em runtime Node.
- **Resultado:** após uma falha inicial (ver 3.8), passou em ambos os paths.
- **Substituível?** Não. Capturou regressões no JS antes de Playtest.

### 3.8 — Bug no script Python de extração do bloco (`scripts[:5]` em vez de `cmds[6:11]`)

- **O que aconteceu:** filter por code 355/655 + slice `[:5]` pegou cmd[4] (erasePicture loop), cmd[6], cmd[7], cmd[8], cmd[9] — deixou cmd[10] `}` de fora.
- **Resultado:** `eval(block)` falhou com "Unexpected end of input".
- **Causa:** confundi "slice dos primeiros 5 scripts" com "slice dos cmds 6-10".
- **Impacto do desperdício:** baixo-médio (1 re-run de Python + 1 re-run de Node).
- **Como evitar:** extrair por índice (`cmds[6:11]`) quando a posição é canônica, não por filtro quando há outros scripts 355/655 no mesmo CE.

### 3.9 — `python3 -m json.tool CommonEvents.json` + `git diff --stat`

- **Objetivo:** validar JSON e confirmar scope do diff.
- **Resultado:** JSON válido, diff de 12 linhas (6 insertions + 6 deletions, incluindo trailing newline).
- **Substituível?** Não. Padrão exigido pelo `tasks.md`.

### 3.10 — Leitura do `build_phase2_ces.py` (~120 linhas)

- **Objetivo:** entender o padrão do gerador (orchestrator, `_write_back`, status verbs, idempotência).
- **Resultado:** revelou as convenções a seguir.
- **Substituível?** Parcialmente — conventions estão summarizadas em `tasks.md`, mas o código real foi mais preciso (e.g. como `_find_script_block` localiza por conteúdo).
- **Impacto do desperdício:** baixo. Justificado pela ausência de específicos no task.

## 4. Intervenções e correções do usuário

**Nenhuma intervenção correctiva durante a implementação.**

A única interacção do utilizador durante a execução foi a confirmação final
"FUNCIONOU!" após Playtest, sem qualquer correcção, redireccionamento ou
esclarecimento. Não houve mudanças de scope.

Isso significa que o enrich-tasks anterior (ver
`retrospetivas/fase5/2026-06-21-retrospectiva-fase5-enrich-tasks.md`)
cumpriu bem o seu papel: os artefactos estavam alinhados com a intenção
do utilizador, exceto pelo bug do audit M (corrigido em execução).

## 5. Análise de desperdício

### 5.1 — Leitura integral do `race-feedback-impl-guide.md`

- **O que aconteceu:** li 932 linhas quando só precisava de ~50 (secção §2).
- **Impacto:** médio.
- **Causa:** conveniência (Read sem offset/limit) em vez de leitura dirigida.
- **Como evitar:** para guias multi-issue como este, sempre `Read` com offset/limit explicitando a secção relevante. Ou usar `rg -n "Issue #1\|threshold\|window.JhonnyRace"` primeiro para localizar.

### 5.2 — Falha na extração do bloco CE 19 (`scripts[:5]` vs `cmds[6:11]`)

- **O que aconteceu:** primeiro smoke test Node falhou com SyntaxError porque o bloco extraído perdeu o `}` de fecho.
- **Impacto:** baixo-médio (1 ciclo de debug).
- **Causa:** usei filtro por code em vez de slice por índice canônico.
- **Como evitar:** quando os índices do alvo são conhecidos (cmd[6-10]), slicear por índice é mais robusto do que filter+slice.

### 5.3 — Inspecionar `interaction/fase4/` para descobrir a localização do gerador

- **O que aconteceu:** hesitei entre `builds/` (Fases 1-2) e `interaction/faseN/` (Fases 3-4) para colocar o gerador. Verifiquei Phase 4 primeiro para seguir o padrão mais recente.
- **Impacto:** baixo.
- **Causa:** ausência de regra explícita sobre onde geradores vivem.
- **Como evitar:** tasks.md poderia declarar a convenção canónica (`interaction/faseN/build_phaseN_ces.py`).

### 5.4 — Re-validação manual do namespace após cada Edit

- **O que aconteceu:** após editar o plugin, fiz smoke test imediato; após rodar o gerador, fiz audit imediato. Cada um consumiu tokens para verifier outputs.
- **Impacto:** baixo. Justificado pela regra projecto "tests every bug fix gets a regression test".
- **Causa:** —
- **Como evitar:** nenhum. Custo aceitável dado o risco de regressão em CE JSON.

## 6. Caminho mínimo recomendado

Para uma próxima execução equivalente (refactor de magic numbers para namespace), a sequência ideal seria:

1. **Inspecionar o alvo (CE ou plugin) por índice.** `python3 -c` para abrir o CE e listar `code`/`indent`/`parameters` cmd por cmd. Identifica exactamente quais comandos contêm os literals relevantes. (~30s)
2. **Fazer o inventário numa única passada de `rg`.** Uma única busca por todos os literals candidatos, classificação manual threshold-related vs unrelated, escrever o `sites-inventory.md`. (~5 min)
3. **Editar o plugin com `Edit` (uma passada).** Inserir o namespace no sitio canônico (antes do `window.JhonnyRace = { ... }` existente), usando accumulator pattern. (~3 min)
4. **Validar plugin imediatamente.** `node -c` + `node -e` smoke test cobrindo casos boundary + propriedades existentes preservadas. (~1 min)
5. **Escrever o gerador idempotente.** Locator por conteúdo (`{ 1:` + `thresholds[raceId]` + `|| 60`), não por índice (mais resiliente a futuras mudanças). Validar com 1ª run "applied" + 2ª run "skipped" + `git diff` vazio. (~10 min)
6. **Extrair o bloco reescrito para smoke test Node usando slice por índice** (não filter+slice). Testar ambos os paths (helper carregado + helper em falta). (~3 min)
7. **Auditar com semântica declarada no task, não código literal.** Se o audit do task tiver contradição interna (exige X + proíbe precondition de X), desviar e documentar. (~5 min)
8. **Handoff Playtest com procedimento claro** (boundary win + boundary lose). Marcar task completa só após confirmação do usuário. (~aguarda user)

**Critério de saída:** todos os smoke tests Node passam + audit M OK + `git diff` vazio na 2ª run do gerador + usuário confirma Playtest.

## 7. Conhecimento reutilizável

### Fatos confirmados

- **Thresholds canônicos do código são `{1:200, 2:400, 3:600}` com default 60** — NÃO os valores 60/100/150 da spec §8.2. Spec está desatualizada.
- **Plugin não tinha `THRESHOLDS`/`threshold`/`isVictory` antes da Fase 5.** Namespace foi introduzido fresh.
- **CE 19 cmd[6-10] é o único site threshold-related em todo o projeto.** Todos os outros 149 hits de 60/100/200/400/600 são unrelated (picture IDs, coords, opacities, switch IDs).
- **`150` não aparece em nenhum arquivo do projeto.** Spec table 60/100/150 foi nunca inlined.
- **Forma canónica do bloco script em CE 19: 1×code=355 + 4×code=655.** Manter essa forma ao reescrever preserva todos os índices downstream (Label WAIT_INPUT em cmd[33], Conditional Branch em cmd[11/18/45], ceremony-lock head cmd[0-1], unlock tail cmd[38+]).
- **`window.JhonnyRace` é acumulador-safe:** o padrão `const JhonnyRace = window.JhonnyRace || {}; ... Object.assign(JhonnyRace, {...}); window.JhonnyRace = JhonnyRace;` preserva qualquer propriedade pré-existente.
- **Patch letter M é o último reservado:** Phases 1-5 usaram A-M. Fase 6+ começa em N.

### Preferências do usuário

- **Documentar desvios de spec em vez de silenciosamente os aplicar.** (validado pela ausência de pushback em ter desviado do audit literal).
- **Commits são explícitos pelo usuário.** Não auto-commitar.
- **Commits não têm Co-authored-by.** (regra global já em CLAUDE.md).
- **Fase só é "validada" após confirmação explícita do Playtest.** (regra já em `Jhonny/CLAUDE.md`).

### Restrições técnicas

- **JSON writes em `data/*.json` exigem hard-refresh do browser** (`Cmd+Shift+R`) antes de re-entrar na cena. Cache mascara o fix.
- **F12 pausa o game loop.** Testes de boundary não podem depender de setTimeout durante F12 aberto; usar F9 (variable viewer) ou imagens HUD para observar estado.
- **CE inline scripts são concatenados com newline join em runtime** (`command355` + `command655`*). Strings multi-linha funcionam mas cada cmd ainda é uma string.
- **`json.dumps(ces, indent=4, ensure_ascii=False) + "\n"`** é o formato canónico para o `CommonEvents.json`. Verificar `git show HEAD:Jhonny/data/CommonEvents.json | head -c 200` antes da primeira escrita.
- **`Object.freeze` em THRESHOLDS** impede mutação acidental. Helpers usam `??` (nullish coalescing) para fallback a `DEFAULT_THRESHOLD` quando `raceId` não está na tabela.

### Armadilhas conhecidas

- **Audit com trigger `'thresholds' in ctx` + fallback exigido no mesmo task = incompatível.** O fallback por definição co-localiza `thresholds` e literals. Split em `} else {` é a forma correcta.
- **`scripts[:5]` (filter+slice) pega cmds errados quando há múltiplos scripts 355/655 no mesmo CE.** Para CE 19 cmd[6-10], usar `cmds[6:11]` (slice por índice).
- **`git diff --stat` mostra trailing newline como linha extra.** 6 inserts + 6 deletes = 5 strings reescritas + newline final. Não é regressão.
- **Misturar nomenclatura `builds/` vs `interaction/faseN/` para geradores.** Fases 1-2 usaram `builds/`, Fases 3-4 usaram `interaction/faseN/`. Sem regra explícita; preferir `interaction/faseN/` (mais recente).

### Heurísticas recomendadas

- **Antes de escrever um gerador CE, inspecione o CE alvo cmd-por-cmd.** Não confie na descrição do task; posições podem ter driftado.
- **Quando o task exige fallback + audit estrito, considere o audit como uma asserção sobre a branch helper, não sobre a fallback.** Estruture o código para que as duas branches sejam trivialmente separáveis (split em `} else {`).
- **Para accumulator namespace, sempre `Object.assign(existing, newProps)` em vez de reescrever o objecto literal.** Evita shadow acidental de APIs existentes.
- **Idempotência via substring presence do novo sentinel.** Verificar `"window.JhonnyRace.isVictory" in src` antes de mutar.
- **Smoke test Node em ambos os paths quando há fallback defensivo.** Confirma paridade comportamental sem precisar de Playtest.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:**
  - Convenção canónica para localização de geradores (`interaction/faseN/build_phaseN_ces.py`) — atualmente ambígua entre `builds/` (Fases 1-2) e `interaction/faseN/` (Fases 3-4).
- **Útil:**
  - Faixa exata do guia de implementação relevante para a Fase 5 (linhas 96-200, secção §2 Issue #1) — evitaria ler as 932 linhas inteiras.
  - Indicação explícita de que o audit M no task-5.3.md step 7 tem contradição interna (exige fallback verbatim + audit que proíbe precondition do fallback). Permitiria desvio informado desde o início.
- **Opcional:**
  - Exemplo do smoke test Node esperado em tasks de plugin edit (acumulador pattern, casos boundary, verificação de freeze).

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema observado:** o guia `race-feedback-impl-guide.md` §2.1 diz que os thresholds são "60/100/150 per race — spec §8.2". O código actualmente tem `{1:200, 2:400, 3:600}` com `|| 60`. Esta divergência foi resolvida em runtime (usei valores do código), mas gerou hesitação inicial.

**Informação ausente ou incorrecta:** confirmação de quais valores são canônicos.

**Por que pertence à análise técnica:** é um facto do sistema (estado actual do código vs spec), não uma decisão de execução.

**Secção a alterar:** §2.1 ("Why") do impl-guide, ou nova sub-secção "State verification" antes de §2.3.

**Texto sugerido para inclusão:**
> **State verification (run before implementation):**
> ```bash
> rg -n "\{\s*1:\s*\d+" Jhonny/data/CommonEvents.json Jhonny/js/plugins/Jhonny_RaceHelper.js
> ```
> Confirme os valores actual do código antes de os espelhar no namespace.
> Os valores podem divergir da spec §8.2 (que é normativa mas pode estar
> desatualizada). O código é canónico por enquanto; tuning de balance é
> pendente de playtest futuro.

**Impacto esperado:** elimina hesitação sobre valores canónicos; próxima execução não precisa de revalidar.

### 9.2 Melhorias no plano de implementação

**Problema observado:** Fase 5 foi colocada por último (após Fases 1-4) para "isolhar variáveis" no Playtest. Funcionou, mas o enrich-tasks desta fase ainda deixou passar o bug do audit M (que exigia fallback verbatim + audit que falha com fallback verbatim).

**Deficiência do plano:** auditor de audits — não há passo que valide que os audits especificados nas tasks são internamente consistentes com os requisitos das próprias tasks.

**Etapa afectada:** `loki:enrich-tasks` para a Fase 5.

**Alteração recomendada:** adicionar ao `enrich-tasks` um passo "consistency check" que detecte contradições entre a step "X é obrigatório" e a step "audit que proíbe precondition de X".

**Texto sugerido (a adicionar ao template do enrich-tasks):**
> Após enriquecer cada task, verificar consistência interna:
> - Para cada audit especificado, os seus triggers incluem todos os
>   patterns que a task exige preservar?
> - Se a task exige um fallback verbatim de um padrão P, e o audit
>   proíbe P numa zona não-excluída, o audit deve explicitar a zona
>   de exclusão (ex.: "fora do branch `else`").

**Como reduziria custo:** próxima Fase com fallback + audit não exigirá desvio documentado em runtime.

### 9.3 Melhorias nas tasks da fase executada

**Task 5.1:** nenhuma alteração. Task foi clara e completa.

**Task 5.2:** nenhuma alteração. Acumulador pattern explícito, valores canônicos confirmados em runtime.

**Task 5.3 — audit M (step 7):**

**Informação ambígua / incorrecta:** audit com `'thresholds' in ctx` + janela 60 chars é incompatível com o fallback exigido no step 3.

**Consequência observada:** desviei do audit literal e escrevi versão semântica (split em `} else {`), documentada em `fase-5-completa.md`.

**Alteração recomendada em task-5.3.md step 7:**

Substituir o bloco Python do audit por:

```python
# (b) No threshold literal survives OUTSIDE the typeof-guarded fallback.
# The fallback branch is ALLOWED to contain literals (defensive
# replication of pre-refactor behavior). The helper branch (after
# `} else {`) MUST NOT.
fallback_seg, _, helper_seg = src.partition('} else {')
assert fallback_seg and helper_seg, 'if/else structure missing'

comparison_forms = [
    r'>=\s*(60|100|150|200|400|600)\b',
    r'>\s*(60|100|150|200|400|600)\b',
    r'===\s*(60|100|150|200|400|600)\b',
    r'\?\s*(60|100|150|200|400|600)\s*:',
    r'\{\s*1:\s*(60|100|150|200|400|600)\b',
    r'\|\|\s*(60|100|150|200|400|600)\b',
]
for pat in comparison_forms:
    m = re.search(pat, helper_seg)
    assert m is None, f'threshold literal {m.group()!r} found in helper branch'

# (b-extra) Defensive fallback preserves dict-with-fallback structure verbatim.
assert re.search(r'\{\s*1:\s*200\b.*2:\s*400\b.*3:\s*600\b', fallback_seg), \
    'fallback missing dict { 1: 200, 2: 400, 3: 600 }'
assert '|| 60' in fallback_seg, 'fallback missing || 60 default'
assert 'typeof window.JhonnyRace === "undefined"' in fallback_seg, \
    'fallback missing typeof guard'
```

**Como validar que a nova instrução é suficiente:** executar o audit contra o código reescrito — deve passar; executar contra uma versão hipotética sem fallback — deve falhar em `(b-extra)`; executar contra uma versão com literal na branch helper — deve falhar em `(b)`.

### 9.4 Problemas fora do escopo dos artefatos

- **Hesitação `builds/` vs `interaction/faseN/` para o gerador:** origem ambígua mas o plano não exigia nada específico; resolveu-se verificando a fase mais recente. Adicionar regra canónica a `tasks.md` Secção "Conventions" resolve em definitivo, mas é baixa prioridade (apenas um цикlo de exploração).
- **Bug `scripts[:5]` vs `cmds[6:11]` no smoke test:** falha operacional da LLM; não justifica alterar spec.

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
| --- | --- | --- | --- | --- |
| Hesitação sobre valores canónicos (60/100/150 vs 200/400/600) | Spec §8.2 desatualizada vs código actual | Análise técnica (`race-feedback-impl-guide.md` §2.1) | Adicionar "State verification" antes de §2.3 | Média |
| Audit M incompatível com fallback exigido | Trigger `'thresholds' in ctx` sobreposto a `value()` | Task (`task-5.3.md` step 7) | Substituir audit por split em `} else {` + asserts de fallback verbatim | Alta |
| Ausência de enrich-tasks consistency check | `loki:enrich-tasks` não valida contradições internas | Plano de implementação (template enrich-tasks) | Adicionar passo "consistency check" | Média |
| Localização ambígua de geradores (`builds/` vs `interaction/`) | Convenção não declarada | Plano (`tasks.md` Secção "Conventions") | Adicionar regra canónica | Baixa |
| Leitura integral do impl-guide (932 linhas) | Falha operacional da LLM | Fora do escopo | Nenhuma — heurística "use offset/limit para guias multi-issue" é suficiente | Baixa |
| Bug `scripts[:5]` no smoke test | Falha operacional da LLM | Fora do escopo | Nenhuma | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar a `Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md`,
antes da secção §2.3 ("Pseudo-code"):

```markdown
### 2.2b State verification (run before implementation)

The spec §8.2 declares thresholds as `60 / 100 / 150`, but the actual
code may have diverged. Before mirroring values into
`window.JhonnyRace.Config.THRESHOLDS`, verify what is currently inlined:

```bash
rg -n "\{\s*1:\s*\d+.*2:\s*\d+.*3:\s*\d+" Jhonny/data/CommonEvents.json Jhonny/js/plugins/Jhonny_RaceHelper.js
rg -n "threshold" Jhonny/js/plugins/Jhonny_RaceHelper.js
```

The code is canonical for this refactor. Spec is normative for game
design but may lag behind implementation. Balance tuning is a separate
concern, out of scope for a refactor.
```

#### Patch sugerido para o plano de implementação

Adicionar ao template do `loki:enrich-tasks` (passo após enriquecer cada
task):

```markdown
## Consistency check (after enriching each task)

For every audit specified in a task:

1. Enumerate the patterns the audit triggers on.
2. Enumerate the patterns the task itself REQUIRES to exist (e.g.,
   fallback branches, defensive code, magic numbers that must be
   preserved).
3. If any required pattern overlaps an audit trigger, the audit MUST
   declare an exclusion zone (e.g., "outside the `else` branch") or
   the contradiction must be resolved before the task is considered
   enriched.
```

Adicionar a `Jhonny/planos/003-bug-fix-round1/tasks.md` Secção
"Conventions":

```markdown
- **Generator location:** canonical path is
  `interaction/fase<N>/build_phase<N>_ces.py`. Phases 1-2 used
  `builds/` for historical reasons; new generators go in
  `interaction/fase<N>/`.
```

#### Patch sugerido para as tasks da fase executada

Em `Jhonny/planos/003-bug-fix-round1/task-5.3.md`, substituir o bloco
Python do step 7 (audit M) pela versão split-em-`else-boundary` descrita
na secção 9.3 desta retrospectiva.

#### Ações fora do fluxo de especificação

Nenhuma ação externa ao fluxo de especificação foi identificada. Os
desperdícios operacionais (leitura integral do guide, bug `scripts[:5]`)
são cobertos pelas heurísticas em §7.

## 10. Checklist operacional

Antes e durante a próxima execução de refactor similar:

1. [ ] Inspecionar o CE alvo cmd-por-cmd via `python3 -c` antes de escrever qualquer gerador.
2. [ ] Verificar valores canónicos no código actual (`rg "\{\s*1:\s*\d+"`) antes de os espelhar no namespace.
3. [ ] Confirmar que `window.JhonnyRace` (ou equivalente) é acumulador-safe: nunca reescrever o global; usar `Object.assign`.
4. [ ] Para qualquer bloco reescrito em CE, preservar a forma code=355/code=655 e a contagem total de cmds.
5. [ ] Gerador deve ser idempotente via substring presence do novo sentinel; 2ª run deve dar `git diff` vazio.
6. [ ] Smoke test Node em ambos os paths quando há fallback defensivo (helper carregado + helper em falta).
7. [ ] Audit deve usar semântica declarada no comentário, não código literal; se houver contradição interna, desviar e documentar.
8. [ ] Ceremony-lock invariant: switches 100/101/104 não podem ser tocados em CE 19 fora do head/tail canônicos.
9. [ ] `node -c` no plugin + `python3 -m json.tool` no JSON após cada mutação.
10. [ ] Marcar task completa só após Playtest confirmado pelo usuário.
