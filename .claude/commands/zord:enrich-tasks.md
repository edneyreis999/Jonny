---
name: zord:enrich-tasks
description: Enriquece tasks existentes identificando e preenchendo gaps via validacao de 9 dimensoes (PAL MCP consensus, modelo atual ou ambos)
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep
model: sonnet
---

# Enrich Tasks

Avalia e enriquece tasks XML contra 8 dimensoes de completude. Referencia: `planos/015-arrumando-agentes/TASK_COMPLETENESS_MODEL.md`.

**Modos de validacao:**
- [A] PAL MCP Consensus (externo) - valida usando multiplos modelos via PAL MCP
- [B] Modelo atual (local/ativo; sem PAL) - valida usando proprio modelo com evidencias do repo
- [C] Ambos (rodar B e A; comparar e consolidar) - executa ambos e compara resultados

## Passo 0: Health Check e Deteccao de Modo

**Modo Automatico**: args contem `--context-file <path>` → ler JSON, pular Passos 1-2.
**Modo Interativo**: args vazio → perguntas ao usuario.

**Health Check PAL (Condicional)**:
- Se modo escolhido incluir PAL (opcao A ou C): invocar `mcp__pal__version()`.
- Se falhar: perguntar ao usuario se quer fazer fallback para modo B (validacao local).
- Se usuario aceitar fallback: continuar com modo B.
- Se usuario recusar ou erro for fatal: erro claro e abortar.
- Se modo escolhido for B (local apenas): pular check do PAL.

## Passo 1: Localizar Tasks (Interativo)

Perguntar diretorio das tasks. Validar existencia de tasks.xml e `<num>_task.xml`. Listar tasks encontradas.

## Passo 2: Perguntas (Interativo)

Q1: Quais tasks analisar? (todas | especificas: "1,3,5" | range: "1-5")
Q2: Fonte para gaps? (terminal | codebase | analysis.xml | techspec.md | multiplos - apontar caminhos)
Q3: Modo de validacao das dimensoes? (default: A)
  - [A] PAL MCP Consensus (externo) - valida usando multiplos modelos via PAL MCP
  - [B] Modelo atual (local/ativo; sem PAL) - valida usando proprio modelo com evidencias do repo
  - [C] Ambos (rodar B e A; comparar e consolidar) - executa ambos e compara resultados

Q3.1 (apenas se A ou C): Qual modelo usar no PAL consensus? (default: gpt-5.2)

## Passo 3: Task Completeness Report (8 Dimensoes)

Para cada task (exceto Task 00), avaliar dimensoes definidas em `.claude/templates/task-completeness-model.xml`.

**Rubrica (OBRIGATORIO para modo B):** Ler XML com criterios PASS/WARN/FAIL por dimensao.

**Validacao do execution_plan (tasks.xml):** Verificar que `<execution_plan>` existe e contem stages validos. Tasks no stage N devem depender apenas de tasks nos stages < N.

**Status:** READY (zero FAIL em P0), NEEDS_INPUT (FAIL em P0 por info ausente), BLOCKED (D6 FAIL por impedimento pratico). P1 (D5,D9) e P2 (D8) não bloqueiam.

---

### 3A: Validacao com Modelo Atual (sem PAL)

**Executa quando:** Modo B ou C escolhido.

**Regra de ouro (anti-alucinacao):** Sem path + trecho lido/grepado = tratar como desconhecido ⇒ WARN/FAIL.

**Processo por task:**

1. Ler o XML da task (`<num>_task.xml`)
2. Ler `.claude/templates/task-completeness-model.xml` (OBRIGATORIO)
3. Para cada dimensao D1..D9:
   - Usar `Grep/Glob/Read` para buscar evidencias nos docs e codebase:
     - D2: techspec linkado existe e tem secao/ancora
     - D3: files_to_modify existe ou discovery tem comandos validos
     - D4: decisoes/contratos em docs linkados ou patterns no repo
     - D7: comandos de teste existem e sao validos
     - D8: security/PII em docs ou patterns do repo
     - D9: logging/tracing em techspec (secao observability_requirements)
   - Emitir por dimensao:
     - `status: PASS|WARN|FAIL`
     - `score: 2|1|0`
     - `evidence`: lista de paths + trechos realmente consultados
     - `gaps`: bullets acionaveis
     - `open_questions` quando P0 falhar por falta de info

**Metadados de validacao:**
```xml
<validated_by mode="local_model" model="{modelo_atual}" timestamp="{ISO8601}">
  <rubric>.claude/templates/task-completeness-model.xml</rubric>
  <sources_consulted>
    <source path="..." excerpt="..."/>
  </sources_consulted>
</validated_by>
```

**Nota:** Sempre registrar `sources_consulted` com paths e trechos usados para fundamentar cada avaliacao.

---

### 3B: Validacao com PAL MCP Consensus

**Executa quando:** Modo A ou C escolhido.

**Processo por task:**

1. Ler o XML da task
2. Invocar `mcp__pal__consensus` com:
   - Proposal: avaliacao das 9 dimensoes conforme task-completeness-model.xml
   - Models: conforme escolhido em Q3.1 (default: gpt-5.2)
   - Stances: configurar modelos com posturas diferentes (for/against/neutral) se aplicavel
3. Consolidar resultado do consensus:
   - Para cada dimensao, extrair status majoritario (PASS/WARN/FAIL)
   - Registrar evidencias citadas pelos modelos
   - Identificar divergencias significativas entre modelos
4. Emitir mesmo formato que 3A (status, score, evidence, gaps, open_questions)

**Metadados de validacao:**
```xml
<validated_by mode="pal_consensus" model="{modelo_escolhido}" timestamp="{ISO8601}">
  <rubric>.claude/templates/task-completeness-model.xml</rubric>
  <models_used>
    <model name="..." stance="..."/>
  </models_used>
  <divergences>
    <divergence dimension="D..." detail="..."/>
  </divergences>
</validated_by>
```

---

### 3C: Consolidacao de Resultados (Modo C - Ambos)

**Executa quando:** Modo C escolhido.

**Processo de consolidacao:**

1. Comparar resultados de 3A e 3B para cada dimensao:
   - Se concordam (mesmo status): usar resultado
   - Se divergem:
     - **Regra principal:** Pior status vence (FAIL > WARN > PASS)
     - Registrar divergencia em `<divergences>` com detalhes
     - Se 3A (local) FAIL e 3B (consensus) PASS: priorizar FAIL (evidence gating mais rigoroso)
     - Se 3A (local) PASS e 3B (consensus) FAIL: priorizar FAIL (consensus mais criterioso)

2. Gerar relatorio comparativo:
   - Tabela com status de 3A, 3B e consolidado por dimensao
   - Destacar divergencias e justificativa da decisao

3. Metadados finais:
```xml
<validated_by mode="hybrid" local_model="{modelo_atual}" consensus_model="{modelo_pal}" timestamp="{ISO8601}">
  <rubric>.claude/templates/task-completeness-model.xml</rubric>
  <consolidation_rule>pior_status_vence</consolidation_rule>
  <divergences count="{N}">
    <divergence dimension="D..." local="PASS" consensus="FAIL" final="FAIL" reason="..."/>
  </divergences>
</validated_by>
```

## Passo 4: Preencher Gaps (Discovery sem budget)

**Estrategia por fonte**: codebase (D3 primario, D6, D7 tests, D9 logging), techspec.md (D1, D2, D4, D5, D6, D7, D8, D9), analysis.xml (D4 contratos, D8 restricoes, D9 observabilidade), terminal (D6/D7 comandos, logs). Se apos todas as fontes qualquer gap P0 persistir: marcar NEEDS_INPUT e gerar open_questions com opcoes concretas + recomendacao.

**Gaps independentes**: invocar multiplos `Task(subagent_type="Explore")` em PARALELO por modulo.
**Gaps dependentes**: analise sequencial.
**Consolidar findings**: apos retorno dos agentes paralelos, merge obrigatorio — dedup evidencias, resolver conflitos entre fontes, alinhar recomendacoes e atualizar open_questions se houver divergencia.

## Passo 5: Enriquecer Artefatos

Para cada task com gaps:

- Atualizar secoes existentes no XML
- Adicionar tags conforme vocabulario: `<discovery>`, `<decisions>`, `<validation>`, `<assumptions>`, `<open_questions>` (so NEEDS_INPUT), `<non_functional_requirements>`, `<rollout>`, `<rollback>`
- **Formato open_questions**: incluir `<options>` (N opcoes + sempre ultima "Outro: descreva"), `<recommendation>` (option_id + reasoning), `<tradeoffs>` (riscos/custos por opcao), `<impact>` (o que muda no plano se escolher cada opcao), `<sources_consulted>` (paths + trechos relevantes)
- **METADADOS DE VALIDACAO**: Adicionar `<validated_by>` conforme formato definido no Passo 3 (3A, 3B ou 3C)
- **METADADOS DE PARALELIZACAO**: Extrair `<properties>` (idempotent, estimated_cost) e `<resources>` (path, mode, group). Aplicar matriz: read+read=PARALELO; qualquer write no mesmo path/group=SERIAL. Task sem `<resources>` → marcar `serial_only`. Normalizar paths antes de comparar
- Validar XML apos modificacao

Atualizar tasks.xml com `<validation_status>` incluindo `<task_statuses>` (id, status, score por task, validated_by).

## Passo 6: Relatorio Final

Apresentar: resumo (tasks, status, scores), gaps por dimensao. **SE houver NEEDS_INPUT**, exibir:

```
### ⚠️ Task XX: [titulo] precisa de sua decisao

**Pergunta Q1:** [texto]

Opcoes:
- [A] [desc A]
- [B] [desc B]
- [C] [desc C]
- [Outro] Descreva sua alternativa

Trade-offs:
- A: [risco/custo]  - B: [risco/custo]  - C: [risco/custo]

Impacto: se escolher [X], os passos [Y] mudam para [Z]

🤖 Recomendacao: **Opcao X** - [justificativa]
Fontes consultadas: [somente fontes realmente usadas, com paths]
```

Gerar `enrichment-report.md`.
