---
name: zord:generate-action-plan
description: Gera plano tecnico executavel (tasks.xml + tasks XML individuais) a partir de analise usando PAL MCP planner e consensus opcional
tools: Task, AskUserQuestion, Glob, Grep, Read, Write
model: sonnet
---

# Generate Action Plan

Gera plano de acao tecnico a partir de analises de codigo ou documentos.

## Passo 0: Health Check PAL MCP

Invocar `mcp__pal__version()`. Se falhar ou `result.server_version` ausente:

```
PAL MCP indisponivel.
1. Verifique ~/.claude/mcp_settings.json
2. Reinicie Claude Code
3. /help mcp
```

Abortar comando se falhar.

## Passo 1: Scan de Contexto

Perguntar ao usuario onde buscar informacoes, depois coletar:

1. Stack tecnologica (package.json, Cargo.toml, etc.)
2. Test runners (jest, pytest, vitest, etc.)
3. Estrutura src/tests mapeada
4. Build system (vite, webpack, cargo, etc.)

Se fonte nao contiver os 4 itens, perguntar se pode fazer scan no codigo. Output: REPO_CONTEXT (max 300 linhas).

## Passo 2: Perguntas (AskUserQuestion)

Q1: Fonte da analise

- Contexto do terminal | Arquivo JSON exportado | PRD do projeto | Tech Spec existente | Analise em tempo real (scan)

Q2: Diretorio de output (string)

Q3: Criar techspec? (Sim | Nao)

Q4: Validar com consensus? (Nao validar [padrao] | Validar tasks.xml | Validar techspec | Validar ambos)

Extra: Restricoes especificas (opcional)

## Passo 3: PAL MCP Planner

Carregar analise base (JSON ou contexto). Montar prompt com REPO_CONTEXT + analise + restricoes.

Invocar `mcp__pal__planner` com model gpt-5.2.

**REGRA OBRIGATORIA - Task 00**: Sempre gerar Task 00 (health check baseline) como primeira task. Task 00 roda install + lint + build + test. Gate: se falhar, plano BLOCKED.

**REGRA OBRIGATORIA - execution_plan**: Gerar `<execution_plan>` em tasks.xml. Calcular levels via topological sort. Matriz de conflito para tasks no mesmo `path` ou `group`:

| Task A | Task B | Resultado |
|---|---|---|
| read | read | PARALELO |
| read | write ou read-write | SERIAL |
| write ou read-write | qualquer write | SERIAL |

Task sem `<resources>` declarados → stage exclusivo (serial). Normalizar paths (remover `./`, resolver relativos). Suportar `group` para recursos globais (ex: `repo:lockfile`). Ver template.

Usar templates de `.claude/templates/tasks-xml-template.xml` e `task-xml-template.xml`.

## Passo 3.5: TechSpec Generator (se Q3=Sim)

Invocar agente `techspec-generator` via Task tool:

```
Task({
  subagent_type: "techspec-generator",
  prompt: `Gerar TechSpec para este plano.

  Contexto:
  - plan_dir: {{Q2_DIRECTORY}}
  - tasks_xml: tasks.xml draft gerado no Passo 3
  - analysis: {{ANALYSIS_XML_DO_PASSO_2_SE_DISPONIVEL}}

  REPO_CONTEXT (para contexto adicional):
  {{REPO_CONTEXT_DO_PASSO_1}}
  `
})
```

**Inputs esperados pelo agente:**

- `plan_dir` - Diretório do plano ({{Q2_DIRECTORY}})
- `tasks_xml` - Tasks XML draft do Passo 3 (opcional)
- `analysis` - Analysis disponível (do Passo 2)

**Outputs gerados pelo agente em `planos/<id>/tasks/`:**

- techspec.xml
- techspec.md
- contracts_facts.json
- observability_checklist.json

## Passo 4: Write Artifacts

```bash
mkdir -p {{Q2_DIRECTORY}}
```

Escrever: tasks.xml + 00_task.xml + 01_task.xml...
Nota: techspec.md/techspec.xml são gerados no Passo 3.5 (se Q3=Sim).
Validar XMLs: `xmllint --noout` ou fallback Node.js (`fast-xml-parser`).

## Passo 5: Consensus e Delegacao (se Q4 != "Nao validar")

Invocar `mcp__pal__consensus` nos artefatos selecionados.

Se PASS: adicionar `<validation_status>` em tasks.xml.

Se GAPS detectados:

- Perguntar: "Deseja enriquecer automaticamente?" (Sim | Nao)
- Se SIM: criar arquivo temporario no scratchpad com contexto JSON, invocar `Skill({ skill: "zord:enrich-tasks", args: "--context-file <path>" })`
- Se NAO: documentar gaps em tasks.xml, sugerir `/enrich-tasks` depois
