---
title: "Retrospectiva Técnica — Fase 7 (Polish + Observabilidade)"
fase: 7
tipo: retrospectiva-tecnica
data: "2026-06-19"
destinatario: "LLM futura executando implementação de fase com script gerador idempotente + extensão de plugin"
status: "concluída com 1 correção de gap de fase anterior"
---

# Retrospectiva Técnica — Fase 7

## 1. Resumo da tarefa

**Solicitado:** Executar a Fase 7 do plano `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md` — 3 tasks (audio feedback, HUD TENTATIVA N, plugin command `logRaceEvent`).

**Entregue:**
- `fase7/build_phase7_ces.py` — gerador idempotente cobrindo 7 patches em 6 CEs.
- `Jhonny_RaceHelper.js` estendido com `logRaceEvent` + `captureRaceState` + `PluginManager.registerCommand`.
- `CommonEvents.json` regenerado (CEs 5/6/11/12/15/18/19 alterados).
- `System.json` — gap F6 corrigido: `VAR_VITORIA_PASSOU` (Editor ID 117) finalmente gravada.
- `tasks.md` atualizado (F7 = IMPLEMENTADA, tasks 7.1/7.2/7.3 ✅).
- `core_loop_corrida/fase-7-completa.md` criado com cenários de playtest.

**Critérios de sucesso:**
- `node -c Jhonny_RaceHelper.js` → OK.
- `python3 -m json.tool CommonEvents.json` → OK.
- `build_phase7_ces.py` idempotente (diff vazio em re-execução).
- 12 auditorias programáticas (Play SE, Picture 52, logRaceEvent calls).

**Restrições relevantes:**
- Artefato-fonte primeiro: corrigir gerador Python antes do JSON.
- Bug F4: refresh runtime MZ obrigatório (F10 → Ctrl+S → reiniciar Playtest).
- Pattern TextPicture replicado de CE 6 (code 357 + 657 + 231 com `name=""`).
- Plugin Commands logRaceEvent são automatizáveis via JSON (F6 confirmou para TextPicture; mesmo padrão se aplica aqui).

## 2. Decisões técnicas e inferências

| Decisão | Motivo | Evidência | Resultado | Avaliação | Melhoria futura |
|---------|--------|-----------|-----------|-----------|-----------------|
| **Executar `setup_phase6_system.py` antes do F7** | Snapshot System.json mostrou 117 slots (0-116), faltando slot 117 nomeado | CEs 18/19 já referenciavam `value(117)` em scripts inline, mas o Database não tinha o nome | Slot 117 gravado corretamente | **Necessária** — bug F6 latente; sem isso, MZ Editor mostraria slot em branco | Toda fase deve começar com snapshot System.json (não apenas CEs) — variável "existente" pode não estar nomeada |
| **Estender plugin com `captureRaceState()` + `logRaceEvent()` em vez de função única** | Composição: captura pode ser reusada em dashboard/replay futuros | Hooks `Python Standards` + `JavaScript Standards` reforçam: small functions, single responsibility | Plugin ficou legível e testável | Necessária | Sempre que uma função fazer >1 coisa (captura + formato + output), split em helpers |
| **Usar `Jhonny_RaceHelper` como pluginName no registerCommand (const já existia)** | Const `pluginName = 'Jhonny_RaceHelper'` definida no topo do IIFE | Padrão MZ exige o nome exato do plugin | `PluginManager.registerCommand(pluginName, "logRaceEvent", logRaceEvent)` OK | Necessária | Sempre reusar const `pluginName` existente; não硬codificar string |
| **`logRaceEvent` no cmd 0 do CE 18 (antes do `Play ME Shock1`)** | Captura `ATTEMPT_N` antes do increment — log mostra a tentativa que falhou | task-7.3.md tabela posicional | Log terá `ATTEMPT_N: N` (tentativa que acabou de falhar), não `N+1` | Necessária | Em handlers com increment + log, log antes do increment para capturar "estado pré-mudança" |
| **Remover Comment stale `[TASK 5.4 MANUAL MZ]` do CE 6 cmd 1** | cmds 2-4 já implementavam o que o Comment pedia desde F6 (Parte 4 da retrospectiva F6) | Dump CE 6 mostrou code 357+657+231 presentes | Estrutura limpa sem resíduo | **Parcialmente necessária** — fora do escopo estrito de F7, mas bom void | Gerador idempotente deve limpar Comments placeholder antigos ao regenerar vizinhança |
| **Pular slot 114 (vazio) no `VAR_NAMES` do plugin** | Snapshot mostrou `variables[114] = ''` | Variável sem nome não tem significado | `$gameVariables.value(114)` não é capturado | Necessária | Snapshot System.json antes de codificar listas de IDs em plugins |

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Resultado | Substituível? | Como evitar redundância |
|------------|----------|-------------|-----------|---------------|---------------------------|
| `Read` `Jhonny_RaceHelper.js` (123 linhas) | Entender estrutura do plugin antes de estender | Sim | IIFE com `window.JhonnyRace` + const `pluginName` | Não | Manter — leitura obrigatória para editar plugin |
| `Read` `fase6/build_phase6_ces.py` (476 linhas) | Template estrutural do gerador (C(), constantes, main idempotente) | **Sim — crítico** | Padrão reusado em `build_phase7_ces.py` | Não | Sempre ler gerador anterior antes de escrever novo (heurística F5/F6) |
| `Read` `fase6/retrospectiva.md` (1018 linhas) | "Aprendizados das fases anteriores" | **Parcial** — Só Parte 4 (TextPicture) foi diretamente útil | Confirmação de padrão TextPicture | **Sim, parcialmente** — tasks.md "Aprendizados Consolidados" teria bastado | Antes de ler retrospectiva integral, ler tasks.md síntese primeiro |
| `Bash` snapshot System.json (variables[100:118]) | Validar IDs canônicos | **Crítico** | Revelou gap F6 (var 117 ausente) | Não | Sempre rodar antes de qualquer edição — descreve estado real |
| `Bash` snapshot CEs (cmd counts) | Confirmar slots preservados | Sim | 20 slots, CEs 5/6/11/12/15/18/19 com tamanhos esperados | Não | Sempre snapshot antes de patchear |
| `Bash` dump CE 11/12/15/6 (listas completas) | Planejar patches cirúrgicos | **Crítico** | Identificou: CE 11 cmd 7 = freada, CE 12 cmd 7 = pneu_cantando, CE 15 sem SE, CE 6 cmds 2-4 já têm Glória + Comment stale em cmd 1 | Não | Sempre fazer dump das listas alvo antes de escrever patches |
| `Bash` dump CE 5/18/19 (listas completas) | Identificar pontos de inserção para logRaceEvent | **Crítico** | CE 5 cmd 14 = ControlVar 117 (insert após), CE 18/19 cmd 0 = primeira posição | Não | Idem |
| `Bash` rodar `setup_phase6_system.py` | Corrigir gap F6 | Necessária para integridade do Database | var[117] = 'VAR_VITORIA_PASSOU' gravado | Não | Detectar gaps de fases anteriores via snapshot antes da execução principal |
| `Write` `build_phase7_ces.py` (290 linhas) | Gerador F7 — patches para 7 mudanças em 6 CEs | Sim | Script passou em 1ª execução sem correções | Não | Manter — única forma de gerenciar 7 patches consistentemente |
| `Edit` `Jhonny_RaceHelper.js` (2x: header + IIFE) | Estender plugin com logRaceEvent | Sim | `node -c` OK | Não | Manter |
| `Bash` `node -c Jhonny_RaceHelper.js` | Validar sintaxe JS | Obrigatório | OK | Não | Obrigatório após qualquer Write em plugin |
| `Bash` `python3 build_phase7_ces.py` (1ª execução) | Aplicar patches | Sim | 7 patches aplicados | Não | Manter |
| `Bash` `python3 build_phase7_ces.py` (2ª execução) + diff | Validar idempotência | Obrigatório | diff vazio confirmado | Não | Sempre rodar 2x; 2ª deve imprimir "skip" em todos os patches |
| `Bash` `python3 -m json.tool` | Validar JSON | Obrigatório | OK | Não | Obrigatório após qualquer Write em data/*.json |
| `Bash` auditoria programática (12 checks) | Confirmar que cada patch landed | Obrigatório | 12/12 passaram | Não | Sempre codificar auditoria programática para cada requisito |
| `Bash` `rg "value\(|setValue\("` em CommonEvents.json | Auditoria IDs inline | Obrigatório (heurística F3+) | IDs 100-117 confirmados | Não | Obrigatório após qualquer mudança em scripts inline |

**Leituras que poderiam ter sido evitadas:**
- `Read fase6/retrospectiva.md` (1018 linhas): a Parte 1-3 repetia conteúdo já consolidado em `tasks.md` "Aprendizados Consolidados". Só a Parte 4 (TextPicture automatizado) trouxe informação nova. **Desperdício médio** (~10-15k tokens economizáveis).

## 4. Intervenções e correções do usuário

**Nenhuma intervenção.** A execução ocorreu integralmente conforme plano da F7. Única interação foi o `/context` + comando de retrospectiva ao final.

Isso é atribuído a:
1. Plano detalhado em `task-7.1.md`/`task-7.2.md`/`task-7.3.md` (revisado na sessão anterior com `AskUserQuestion` para resolver 3 ambiguidades).
2. Padrão de gerador idempotente já estabelecido em F3-F6.
3. Leitura atenta de `build_phase6_ces.py` antes de escrever `build_phase7_ces.py`.

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|---------|-------|-------------|
| Leitura integral de `fase6/retrospectiva.md` (1018 linhas) quando só Parte 4 era necessária | **Médio** (~10-15k tokens) | Hábito de "ler retrospectiva da fase anterior para aprender" | Antes de ler retrospectiva >300 linhas, `grep -n "TextPicture\|idempot\|pattern"` para localizar seções relevantes; usar `offset/limit` |
| Snapshot System.json + CEs em chamadas Python separadas | **Baixo** | Não combinei auditorias | Combinar todas as auditorias iniciais em um único script Python |
| `Read` de `task-7.1.md`/`task-7.2.md`/`task-7.3.md` foi via `<system-reminder>` (contexto de sessão anterior) — não contei como custo desta sessão | — | — | — |

**Não houve:** buscas amplas, tentativas exploratórias, perguntas ao usuário cuja resposta estava no contexto, artefatos intermediários inúteis, re-execução do gerador por bug.

## 6. Caminho mínimo recomendado

1. **Snapshot System.json + CEs (Python inline):** `python3 -c "import json; s=json.load(open('Jhonny/data/System.json')); c=json.load(open('Jhonny/data/CommonEvents.json')); print(len(s['variables']), len(s['switches'])); [print(i, c[i].get('name'), len(c[i].get('list',[]))) for i in [5,6,11,12,15,18,19]]"`.
   - Critério: confirmar que variáveis nomeadas batem com referenciadas nos CEs.

2. **Se gap detectado (ex.: var referenciada mas sem nome):** rodar `setup_phase<N-1>_system.py` correspondente antes de prosseguir.
   - Critério: snapshot confirma nome presente.

3. **Ler `tasks.md` linhas da Fase atual + "Aprendizados Consolidados" + tasks individuais (`task-X.Y.md`).**
   - Critério: conhecer escopo, padrões e armadilhas da fase.

4. **Ler `fase<N-1>/build_phase<N-1>_ces.py` por inteiro (não retrospectiva).**
   - Critério: helper `C()`, constantes de IDs, modo idempotente internalizados.

5. **Dump Python das listas dos CEs alvo de patch** (1 linha por cmd com `code`, `indent`, `parameters`).
   - Critério: identificadas strings exatas e índices para inserção.

6. **Escrever `fase<N>/build_phase<N>_ces.py`** com:
   - Helper `C()`.
   - Função por patch com idempotência via pattern detection.
   - `main()` com prints descritivos por patch applied/skipped.
   - Critério: `python3 build_phase<N>_ces.py` executa sem erro.

7. **Para extensão de plugin:** `Edit` em 2 passos — header `@command`/`@arg` + IIFE com função e `registerCommand`.
   - Critério: `node -c plugin.js` OK.

8. **Validação obrigatória:**
   - `python3 -m json.tool CommonEvents.json` → sem erro.
   - `python3 build_phase<N>_ces.py` executado 2x → 2ª vez com todas mensagens "skip" + diff vazio.
   - `node -c` no plugin → OK.
   - Auditoria programática para cada requisito (Python inline).
   - `rg "value\(|setValue\(" CommonEvents.json` → IDs dentro do range esperado.

9. **Criar `core_loop_corrida/fase-N-completa.md`** com passos manuais MZ pendentes + cenários de playtest.
   - Critério: documento autônomo — usuário valida sem ler tasks originais.

10. **Atualizar `tasks.md`** status da fase + checkboxes ✅.
    - Critério: status reflete realidade.

## 7. Conhecimento reutilizável

### Fatos confirmados

- **Pattern TextPicture** (code 357 + 657 + 231 com `name=""`) é válido para qualquer texto em picture — replicável do CE 6.
- **Pattern Plugin Command genérico** (code 357 + 657) é automatizável via JSON para QUALQUER plugin com `PluginManager.registerCommand` — não só TextPicture.
- **`setup_phase<N>_system.py` pode ter sido pulado na fase anterior.** Variável referenciada em CE ≠ variável nomeada em System.json. RMMZ cria slot em runtime, mas Database não mostra nome.
- **Bug F4 persiste:** refresh runtime MZ (F10 → Ctrl+S → reiniciar Playtest) é obrigatório após editar JSON em disco.
- **Slot 114 de variables está vazio** no projeto Jhonny (entre 113 LAST_RENDERED_INDEX e 115 HOVER_LEVEL) — não capturar em listas de vars.
- **Plugin `Jhonny_RaceHelper.js`** tem const `pluginName = 'Jhonny_RaceHelper'` reusável para `registerCommand`.

### Preferências do usuário

- Workflow: entrevista de atualização no início de cada fase (`fase<N>/Atualizacao.md`), usuário é fonte da verdade absoluta.
- Spec ↔ tasks sincronia é regra estabelecida (Parte 1 retrospectiva F6).
- Regra [[never-delete-common-events]]: nunca null, sempre objeto vazio canônico.
- Regra [[user-testable-feedback]]: feedback deve ser visível/audível sem F12/F9.
- Regra [[mz-playtest-pauses]]: F12 devtools focus pausa game loop.

### Restrições técnicas

- `node -c plugin.js` valida apenas sintaxe, não lógica.
- `python3 -m json.tool` valida apenas estrutura JSON, não semântica MZ.
- Auditoria programática por requisito é a única validação confiável para patches cirúrgicos.
- Re-execução do gerador com diff é a única validação confiável de idempotência.

### Armadilhas conhecidas

- **Assumir que fase anterior está completa** porque CEs existem — `setup_phase<N>_system.py` pode ter sido pulado. Sempre snapshot System.json.
- **Ler retrospectiva integral** quando `tasks.md "Aprendizados Consolidados"` + `build_phase<N-1>_ces.py` bastam — desperdício médio.
- **Comment placeholder stale** pode permanecer no CE mesmo depois do trabalho implementado (ex.: CE 6 cmd 1 `[TASK 5.4 MANUAL MZ]`). Auditoria visual do dump CE revela.

### Heurísticas recomendadas

- **"Estado real primeiro"**: `python3 -c "import json; ..."` em 1 linha antes de ler qualquer `.md`.
- **"Artefato-fonte primeiro"**: ao corrigir JSON gerado, editar `build_phase<N>_ces.py` e regerar.
- **"Gerador anterior como template"**: ler `fase<N-1>/build_phase<N-1>_ces.py` por inteiro antes de escrever o novo.
- **"Composição em plugins"**: função com >1 responsabilidade (captura + formato + output) deve ser split em helpers.
- **"Idempotência via pattern detection"**: cada patch detecta se já foi aplicado (ex.: `any(cmd.code == 357 and cmd.parameters[1] == "<cmdName>" for cmd in cmds)`).
- **"Auditoria programática por requisito"**: codificar 1 check Python por requisito da task; todos devem passar.

## 8. Informações que deveriam estar no prompt inicial

| Informação | Classificação | Justificativa |
|------------|---------------|---------------|
| Snapshot System.json esperado pós-F6 (variables[100:118]) | **Obrigatório** | Teria revelado gap de var 117 sem precisar de snapshot — mas o snapshot é 1 linha, então crítico apenas se o prompt quiser evitar essa chamada |
| Indicação de que `setup_phase<N-1>_system.py` pode ter sido pulado | **Útil** | Teria feito eu checar antes de começar a escrever patches |
| Indicação de que `tasks.md "Aprendizados Consolidados"` cobre F1-F6 | **Útil** | Teria evitado leitura integral de retrospectiva F6 |
| Lista exata dos CEs que serão alvo de patch | **Útil** | Evitaria snapshot exploratório |
| Indicação de que a tarefa envolve extensão de plugin (não só CEs) | **Útil** | Mas foi implícito pela task-7.3 |

Nenhum item classificado como **obrigatório** — a LLM pode inferir todos via snapshot + leitura de tasks.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema:** A análise técnica não documenta que `setup_phase<N>_system.py` (criação de variáveis em System.json) é **pré-condição** para o gerador de CEs que referencia essas variáveis.

**Patch sugerido para o Guia de Implementação:**

```markdown
### Pré-condição: snapshot System.json antes de gerador de CEs

Antes de escrever `build_phase<N>_ces.py` que referencia variável Editor ID X,
confirmar via `python3 -c "import json; print(json.load(open('Jhonny/data/System.json'))['variables'][X])"`
que o slot está nomeado. Se `''` (vazio), executar `setup_phase<N-1>_system.py`
da fase anterior ou criar novo setup script. CEs podem referenciar IDs em runtime
sem nome em System.json, mas o Database MZ Editor mostra slot em branco —
inconsistência latente que deve ser corrigida a cada fase.
```

**Impacto esperado:** Alto — previne gaps silenciosos como o de var 117.

### 9.2 Melhorias no plano de implementação

**Problema:** O plano não lista "verificar pré-condições de fases anteriores" como pré-passo explícito.

**Patch sugerido para `tasks.md` §Pré-passos F<N>:**

```markdown
- [ ] Snapshot System.json (variables + switches) e CommonEvents.json (CE names
      + cmd counts). Confirmar que TODAS as variáveis referenciadas pelos CEs
      atuais estão nomeadas. Se alguma estiver em branco, executar
      `fase<M>/setup_phase<M>_system.py` correspondente antes de prosseguir.
```

**Impacto esperado:** Médio — previne carregar gap de uma fase para a próxima.

### 9.3 Melhorias nas tasks da fase executada

| Task | Informação ausente/ambígua | Consequência | Alteração recomendada | Validação |
|------|------------------------------|--------------|------------------------|-----------|
| task-7.1.md | Não lista "Confirmar via dump que CE 11 cmd 7 tem Play SE freada" como subtarefa explícita | Patch foi inferido do enunciado + dump, sem validação prévia | Adicionar subtarefa 7.1.X: "Dump Python de CE 11/12/15 para confirmar posições exatas antes de escrever patches" | Patch casa na 1ª execução |
| task-7.2.md | Não mencionava que Comment stale `[TASK 5.4 MANUAL MZ]` no CE 6 cmd 1 deveria ser limpo | Limpeza foi bônus — não prevista na task | Adicionar subtarefa 7.2.X: "Se Comment placeholder `[TASK 5.4 MANUAL MZ]` existir no CE 6, removê-lo — cmds 2-4 já implementam Glória desde F6" | `python3 -c "...; print([c for c in ces[6]['list'] if c['code']==108])"` retorna vazio |
| task-7.3.md | Não explicita que `pluginName` (const existente no IIFE) deve ser reusado em `registerCommand` | LLM inexperiente poderia hardcodificar string | Adicionar nota na seção "Código a adicionar": "Usar `pluginName` (const já definida linha 38 do plugin) — não hardcodificar 'Jhonny_RaceHelper'" | `grep "registerCommand" plugin.js` mostra `pluginName` |

### 9.4 Problemas fora do escopo dos artefatos

| Problema | Por que está fora do escopo | Como tratar | Proteção operacional |
|----------|------------------------------|-------------|----------------------|
| Gap F6 (var 117 não nomeada em System.json) | Falha de execução da F6, não deficiência do plano F7 | Detectado via snapshot System.json e corrigido rodando script F6 | Snapshot System.json sempre como pré-passo |
| Leitura integral da retrospectiva F6 (~30k tokens) | Falha operacional da LLM, não deficiência do plano | Heurística "ler tasks.md síntese primeiro" já documentada | `grep` antes de `Read` em arquivos >300 linhas |

### 9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|----------------------|----------------------|------------|
| Gap F6 var 117 não nomeada em System.json | Falta de pré-condição documentada | Análise técnica (Guia de Implementação) | Adicionar seção "Pré-condição: snapshot System.json" | Alta |
| Plano não checa pré-condições de fases anteriores | Pré-passos não incluem "verificar setup de fases anteriores" | Plano de implementação | Adicionar item em Pré-passos F<N> | Média |
| task-7.1 não lista dump pré-patch | Subtarefa de verificação ausente | Task 7.1 | Adicionar subtarefa de dump | Média |
| task-7.2 não previa limpeza de Comment stale | Informação sobre F6 Parte 4 não propagada para task 7.2 | Task 7.2 | Adicionar subtarefa de cleanup | Baixa |
| task-7.3 não explicitava uso de const pluginName | Detalhe operacional do plugin | Task 7.3 | Adicionar nota sobre reusar const | Baixa |
| Leitura integral de retrospectiva F6 | Falha operacional da LLM | Fora do escopo | Heurística "grep antes de Read em >300 linhas" | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
### Pré-condição: snapshot System.json antes de gerador de CEs

Antes de escrever `build_phase<N>_ces.py` que referencia variável Editor ID X,
confirmar via `python3 -c "import json; print(json.load(open('Jhonny/data/System.json'))['variables'][X])"`
que o slot está nomeado. Se vazio, executar `setup_phase<M>_system.py` (M ≤ N)
da fase que introduziu a variável. CEs podem referenciar IDs em runtime sem nome
em System.json, mas o Database MZ Editor mostra slot em branco — inconsistência
latente que deve ser corrigida ao detectar.

### Plugin Command genérico — formato JSON canônico

Qualquer plugin MZ com `PluginManager.registerCommand(pluginName, cmdName, fn)`
pode ser invocado via JSON com 2 comandos:

  code 357 [pluginName, cmdName, "<display name>", {<args>}]
  code 657 ["<arg1> = <value>", "<arg2> = <value>", ...]  # uma linha por arg

O pattern é independente do plugin — TextPicture, Jhonny_RaceHelper, etc.
seguem o mesmo formato. F6 confirmou para TextPicture; F7 confirmou para
Jhonny_RaceHelper.logRaceEvent.
```

#### Patch sugerido para o plano de implementação

```markdown
Em "Pré-passos F<N>", adicionar como PRIMEIRO item:

- [ ] Snapshot System.json + CommonEvents.json via Python inline:
      `python3 -c "import json; s=json.load(open('Jhonny/data/System.json')); c=json.load(open('Jhonny/data/CommonEvents.json')); print('vars:', len(s['variables']), 'switches:', len(s['switches'])); [print(f'CE[{i}] {c[i].get(\"name\")!r} cmds={len(c[i].get(\"list\", []))}') for i in range(len(c)) if c[i]]"`
      Confirmar que TODAS as variáveis referenciadas pelos CEs atuais estão
      nomeadas em System.json. Se alguma estiver em branco, executar
      `fase<M>/setup_phase<M>_system.py` correspondente antes de prosseguir.
```

#### Patch sugerido para as tasks da fase executada

**task-7.1.md** — adicionar subtarefa:
```markdown
- [ ] 7.1.X Dump Python de CEs 11/12/15 para confirmar posições exatas dos
      Play SE antes de escrever patches:
      `python3 -c "import json; ces = json.load(open('Jhonny/data/CommonEvents.json')); [print(i, [(c['code'], c['parameters']) for c in ces[i]['list'] if c['code'] in (249, 250)]) for i in [11, 12, 15]]"`
```

**task-7.2.md** — adicionar subtarefa:
```markdown
- [ ] 7.2.X Se Comment placeholder `[TASK 5.4 MANUAL MZ]` existir no CE 6
      (cmd 1), removê-lo no `build_phase7_ces.py` — cmds 2-4 já implementam
      Glória TextPicture desde F6. Gerador idempotente deve produzir
      estrutura final sem resíduos de pendências antigas.
```

**task-7.3.md** — adicionar nota:
```markdown
**Nota sobre pluginName:** o plugin `Jhonny_RaceHelper.js` define
`const pluginName = 'Jhonny_RaceHelper'` na linha 38 (dentro do IIFE).
Usar essa const em `PluginManager.registerCommand(pluginName, ...)` —
não hardcodificar a string.
```

#### Ações fora do fluxo de especificação

- Internalizar regra operacional: antes de ler retrospectiva >300 linhas, `grep -n "TermPattern"` para localizar seções relevantes e usar `offset/limit`. Aplicar à próxima fase que referencia "aprendizados de fases anteriores".

## 10. Checklist operacional

- [ ] Antes de qualquer edição: `python3 -c "import json; ..."` snapshot System.json + CommonEvents.json.
- [ ] Confirmar que toda variável referenciada pelos CEs está nomeada em System.json; se não, rodar `setup_phase<M>_system.py` correspondente.
- [ ] Ler `fase<N-1>/build_phase<N-1>_ces.py` por inteiro antes de escrever `build_phase<N>_ces.py`.
- [ ] Dump Python das listas dos CEs alvo de patch (identificar índices e strings exatas).
- [ ] Cada patch no gerador tem idempotência via pattern detection.
- [ ] Para extensão de plugin: `Edit` em 2 passos (header `@command` + IIFE função + registerCommand); `node -c` ao final.
- [ ] Após gerar JSON: `python3 -m json.tool` valida estrutura; `rg "value\(|setValue\("` audita IDs inline.
- [ ] Após gerar JSON: re-executar `build_phase<N>_ces.py` (2x) → 2ª deve imprimir "skip" em todos os patches + diff vazio.
- [ ] Auditoria programática: 1 check Python por requisito da task; todos devem passar.
- [ ] Criar `fase<N>/fase-N-completa.md` com passos manuais MZ explícitos + cenários de playtest; atualizar `tasks.md` status ao final.
