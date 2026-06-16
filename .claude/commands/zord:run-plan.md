---
name: zord:run-plan
description: Executa plano de tasks gerado pelo generate-action-plan respeitando stages, paralelismo e matriz de conflitos
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# Run Plan

Executa `tasks.xml` + tasks individuais respeitando execution_plan.

## Passo 0: Health Check

Validar que `tasks.xml` existe no diretorio informado. Ler `<execution_plan>` e todas `<task_ref>`. Se `<validation_status>` ausente, avisar e perguntar: continuar (execucao serial-only) ou abortar para `/enrich-tasks`.

## Passo 1: Perguntas

Q1: Diretorio do plano (string com tasks.xml)
Q2: Modo de execucao
- "Automatico" - Executa stages sequencialmente sem pausa
- "Stage-by-stage" - Pausa entre stages para aprovacao
- "Dry-run" - Simula sem executar, exibe ordem e conflitos

Q3: Escopo
- "Plano completo" - Todos os stages
- "A partir do stage N" - Retomar execucao (informar N)
- "Tasks especificas" - Selecionar por ID ("1,3,5")

## Passo 2: Carregar Plano

Ler tasks.xml. Para cada stage do `<execution_plan>`:

1. Coletar task_refs do stage
2. Ler XML individual de cada task
3. Extrair `<resources>` (path, group, mode) e `<properties>` (serial_only)
4. **Validar conflitos em runtime**: aplicar matriz no mesmo path/group:
   - read + read = PARALELO
   - qualquer write = SERIAL
5. Se serial_only=true, isolar task (nao paralelizar)
6. Agrupar tasks em **batches** respeitando max_parallel e conflitos

Defaults: fail_fast=true, max_parallel=sem limite (salvo override no XML).

Exibir plano resumido (stages, tasks por stage, conflitos detectados, defaults aplicados). **Pedir confirmacao Y/N** antes de executar. Se N, abortar.

## Passo 2.5: Task Execution Lifecycle (Self-Healing)

Cada task executa em loop isolado com auto-correção:

**Config:** MAX_RETRIES=3, REVIEW_TIMEOUT=60s

**Flow:**
1. GENERATION: Agente gera código, captura artifacts
2. VALIDATION: Review via PAL MCP (Diff + LayerRules + InterfaceContext)
3. DECISION:
   - PASS → git commit + mark COMPLETED
   - FAIL_RETRYABLE → Increment attempt, volta para GENERATION
   - MISSING_DEPENDENCY → Requeue (WAITING_QUEUE), acorda quando task terminar
   - API_ERROR → mark COMPLETED_WITHOUT_REVIEW, continua
   - MAX_RETRIES → mark COMPLETED_WITH_ERRORS, DEIXA arquivos no disco

**Cross-Layer Rules:**
- domain/: imports de @infrastructure/*, @application/* = BLOCKER
- application/: imports de @infrastructure/* = BLOCKER
- infrastructure/: pode importar domain/ports/*

**Deadlock Detection:** RUNNING=0 + WAITING>0 → Jailbreak (todas voltam com ALLOW_MISSING_DEPS=true)

### 3.1 Gate Check

**Task 00 e gate absoluto**: se Task 00 (health check baseline) falhar → plano inteiro BLOCKED, nao prosseguir independente de fail_fast. Para demais stages: se anterior falhou e fail_fast=true (default) → ABORT com relatorio parcial.

### 3.2 Dispatch Paralelo

Para cada task do batch, instanciar **TaskRunner isolado** que executa loop do Passo 2.5.

TaskRunner invoca subagente via Task():
```
Task(subagent_type="{{HINT ou general-purpose}}",
     prompt="{{TITLE}}. Steps: {{STEPS}}. Files: {{FILES}}. Criteria: {{CRITERIA}}.")
```

Tasks em WAITING_QUEUE têm prioridade sobre PENDING_TASKS (previnir starvation).

### 3.3 Coletar Resultados

TaskRunner reporta status final da execução:
- **COMPLETED**: Review passou, git commit realizado
- **COMPLETED_WITH_ERRORS**: Max retries atingido, arquivos deixados no disco (dirty state)
- **COMPLETED_WITHOUT_REVIEW**: API PAL falhou, sem validação
- **FAILED**: Erro de infraestrutura (crash tool, API fora, etc)

Para cada task, atualizar XML com:
- attempt_count, duration_total_s, files_touched
- validation_history (reviews com violations, scores)
- commit_hash (se COMPLETED)

**IMPORTANTE:** Pipeline NUNCA para por falha de review. Continua execução.

### 3.4 Checkpoint

Atualizar tasks.xml com execution_status expandido:

```xml
<execution_status>
  <last_stage_completed>{{N}}</last_stage_completed>
  <task_results>
    <result id="{{ID}}" status="completed|completed_with_errors|completed_without_review|failed">
      <attempt_count>{{N}}</attempt_count>
      <duration_total_s>{{S}}</duration_total_s>
      <files_touched>{{FILE_LIST}}</files_touched>
      <commit_hash>{{HASH ou EMPTY}}</commit_hash>
      <validation_history>
        <review attempt="1" status="passed|rejected" score="{{0-100}}"/>
      </validation_history>
    </result>
  </task_results>
</execution_status>
```

Se mode=stage-by-stage: pausar e perguntar "Continuar para stage {{N+1}}?".

## Passo 4: Relatorio Final

```
+==============================================================+
|                   QUALITY GATE SUMMARY                        |
+==============================================================+
| Total Tasks | Verified | Dirty/Failed | No Review | WaitTime |
|-------------|----------|--------------|-----------|----------|
|     10      |    8     |      1       |     1     |   5m20s  |
+==============================================================+

| ID | Status     | Attempts | Quality Check | Commit        |
|----|------------|----------|---------------|---------------|
| T1 | COMPLETED  | 1/3      | ✅ Clean      | abc1234       |
| T2 | COMPLETED  | 3/3      | ⚠️ Auto-Fixed | def5678       |
| T3 | DIRTY      | 3/3      | ❌ Rejected   | (uncommitted) |

[⚠️ DIRTY] Task 3: Create Controller
   STATUS: Failed Review (Max Retries)
   REASON: YAGNI - unused methods
   FILES: src/adapters/UserController.ts (left on disk)

ACTION REQUIRED:
  Run 'git status' to review dirty files.
  Fix and 'git commit' manually, or 'git checkout <file>' to discard.
```

## Restricoes de Seguranca

**Git Allow-List (NON-DESTRUCTIVE):**
- PERMITIDOS: git status, git diff, git ls-files, git log, git add <files>, git commit
- PROIBIDOS: git checkout, git reset, git clean, git rm, git revert, git stash

**Regra de Ouro:** NUNCA usar comandos git destrutivos. Se review falha, arquivos ficam no disco (dirty state OK). Usuario decide manualmente (git commit ou git checkout).

Outras restricoes:
- Nao executar comandos destrutivos (`rm -rf`, `sudo`, `chmod 777`)
- Limitar escopo ao workspace do projeto
- Nao prosseguir sem confirmacao na etapa de pre-voo
- Violacao de seguranca → task BLOCKED, registrar no relatorio
