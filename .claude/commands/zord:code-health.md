---
name: zord:code-health
description: Audita saude do codigo de implementacao contra best practices Clean Architecture com score quantitativo 0-10
tools: Task, AskUserQuestion, Glob, Grep
model: sonnet
---

# Code Health Analyzer

Voce esta executando o comando de analise de saude de codigo. Este comando analisa projetos React + Electron contra best practices de Clean Architecture, React Hooks, Electron IPC, TypeScript, Apollo Client e Tailwind CSS.

## Workflow de Execucao

### Passo 1: Scan de Arquivos

Primeiro, identifique os arquivos TypeScript/TSX do projeto:

```bash
# Encontrar arquivos TypeScript/TSX
**/*.ts
**/*.tsx
**/*.jsx
```

Use Glob e Grep para identificar:
- Arquivos por camada (domain/, infrastructure/, etc.)
- Tipos de arquivos (componentes, hooks, servicos)
- Arquivos modificados (se necessario)

### Passo 2: Perguntas ao Usuario

Use `AskUserQuestion` com as seguintes perguntas:

#### Q1: Camada
```
header: "Camada"
question: "Qual camada da aplicacao voce quer validar?"
options:
  - label: "Todas as camadas"
    description: "Analisa Domain, Infrastructure e All em paralelo"
  - label: "Domain"
    description: "Apenas camada de dominio"
  - label: "Infrastructure"
    description: "Apenas camada de infraestrutura"
multiSelect: false
```

#### Q2: Tipo de Problema
```
header: "Problema"
question: "Qual tipo de problema voce quer identificar?"
options:
  - label: "Clean Architecture"
    description: "Violacoes de arquitetura limpa (FRONT-ARCH-*)"
  - label: "React Hooks"
    description: "Uso incorreto de hooks (FRONT-HOOK-*)"
  - label: "Electron IPC"
    description: "Problemas de seguranca Electron (FRONT-ELEC-*)"
  - label: "TypeScript"
    description: "Uso de tipos e best practices (FRONT-TS-*)"
multiSelect: true
```

#### Q3: Escopo
```
header: "Escopo"
question: "Qual o escopo da analise?"
options:
  - label: "Projeto inteiro"
    description: "Analisa todos os arquivos TypeScript/TSX"
  - label: "Modulo especifico"
    description: "Analisa apenas um modulo/diretorio"
  - label: "Arquivos modificados"
    description: "Analisa apenas arquivos com mudancas (git status)"
multiSelect: false
```

#### Q4: Modo de Acao
```
header: "Acao"
question: "O que fazer apos a analise?"
options:
  - label: "Apenas relatorio"
    description: "Exibe dashboard com scores e issues"
  - label: "Relatorio + Plano de acao"
    description: "Inclui recomendacoes priorizadas"
multiSelect: false
```

### Passo 3: Invocar Agente (COM PARALELISMO)

A estrategia de invocacao depende das respostas do usuario.

#### 3.1 Caso Q1 = "Todas as camadas" (PARALELO)

Enviar 3 chamadas Task em UMA UNICA mensagem:

```
Task(
  subagent_type="implementation-analyzer",
  prompt="mode: health, layer: Domain, categories: [q2_selection], scope: [q3_response], files: [domain_files], action_mode: [q4_response]"
)
Task(
  subagent_type="implementation-analyzer",
  prompt="mode: health, layer: Infrastructure, categories: [q2_selection], scope: [q3_response], files: [infra_files], action_mode: [q4_response]"
)
Task(
  subagent_type="implementation-analyzer",
  prompt="mode: health, layer: All, categories: [q2_selection], scope: [q3_response], files: [all_files], action_mode: [q4_response]"
)
```

Apos conclusao paralela:
- Aguardar todas as tasks completarem
- Agregar resultados com ponderacao: `Score Final = 0.5*Domain + 0.3*Infrastructure + 0.2*General`
- Exibir dashboard consolidado

#### 3.2 Caso Q1 = Camada Especifica (UNICA)

Invocacao unica:

```
Task(
  subagent_type="implementation-analyzer",
  prompt="mode: health, layer: [q1_response], categories: [q2_selection], scope: [q3_response], files: [filtered_files], action_mode: [q4_response]"
)
```

#### 3.3 Formato do Prompt

```
mode: health | error
layer: Domain | Infrastructure | All
categories: architecture[, hooks, electron, typescript, apollo, tailwind]
scope: full | module:<path> | changed
files: ["relative/path/1.ts", "relative/path/2.tsx", ...]
action_mode: report | plan
```

### Passo 4: Dashboard Visual

Exiba os resultados no seguinte formato:

```
+======================================================================+
|                    CODE HEALTH DASHBOARD                             |
+======================================================================+
| Category      | Files | Issues | Score | Top Issues                 |
|---------------|-------|--------|-------|----------------------------|
| Architecture  |   12  |   3    |  7.0  | FRONT-ARCH-01 x2           |
| React Hooks   |   24  |   8    |  6.0  | FRONT-HOOK-02 x5           |
| Electron IPC  |    6  |   2    |  8.5  | FRONT-ELEC-01 x1           |
| TypeScript    |   30  |   5    |  7.5  | FRONT-TS-01 x3             |
+---------------|-------|--------|-------|----------------------------|
| TOTAL SCORE   |   72  |  18    |  7.2  | Weighted Average           |
+======================================================================+

Health Level: Bom (6.0 - 7.9)

Critical Issues: 5
High Issues: 12
Medium Issues: 8

Top 3 Issues by Frequency:
1. FRONT-HOOK-02 (Dependencies Array Missing) - 8 occurrences
2. FRONT-ARCH-01 (Framework Leakage) - 2 occurrences
3. FRONT-TS-01 (Any Type) - 3 occurrences
```

## Detalhes por Arquivo

Para arquivos com score < 7.0, exiba:

```
src/components/UserForm.tsx (Score: 6.5)
  Issues:
    [HIGH] FRONT-HOOK-02 @ L45: useEffect com dependencias faltando
    [MEDIUM] FRONT-STATE-03 @ L67: Estado derivado em useEffect
  Recommendation: Adicionar fetchData às dependências do useEffect
```

## Plano de Acao (se Q4 = "Relatorio + Plano de acao")

```
Priority 1 (Critical):
  - FRONT-ARCH-01: Remover imports de React em domain/
  - FRONT-ELEC-01: Implementar contextBridge em preload/

Priority 2 (High):
  - FRONT-HOOK-02: Corrigir arrays de dependencias em 8 locais
  - FRONT-TS-01: Substituir any por tipos especificos

Priority 3 (Medium):
  - FRONT-STATE-03: Mover estado derivado para computed values
  - FRONT-MED-01: Refatorar componentes > 400 LOC
```

## Mapeamento de Categorias

Mapeie as selecoes do usuario Q2 para categorias internas:

| Selecao Q2        | Categoria Skill      | Checklists Aplicados    |
|-------------------|----------------------|-------------------------|
| Clean Architecture | architecture        | FRONT-ARCH-01 a 05      |
| React Hooks       | hooks                | FRONT-HOOK-01 a 05      |
| Electron IPC      | electron             | FRONT-ELEC-01 a 04      |
| TypeScript        | typescript           | FRONT-TS-01 a 03        |

## Mapeamento de Escopo

| Selecao Q3          | Mode     | Files Selecionados              |
|---------------------|----------|---------------------------------|
| Projeto inteiro     | deep     | **/*.ts, **/*.tsx               |
| Modulo especifico   | standard | <path_user>/**/*.ts             |
| Arquivos modificados| quick    | git diff --name-only            |

## Filtros de Arquivo

Filtre arquivos por camada baseado em Q1:

| Q1 Selection   | Glob Pattern                              |
|----------------|-------------------------------------------|
| Domain         | **/domain/**/*.ts, **/core/**/*.ts        |
| Infrastructure | **/infrastructure/**/*.ts, **/ui/**/*.ts  |
| All            | **/*.ts, **/*.tsx                          |

---

## Export de Analise (Opcional)

No inicio do Passo 2, adicionar pergunta extra:

#### Q0: Export
```
header: "Export"
question: "Deseja exportar a analise para XML?"
options:
  - "Nao" - Continuar normalmente
  - "Sim" - Exportar ao final
```

Se Sim: perguntar path de destino (string). Ao final do Passo 4, gerar XML conforme `.claude/templates/analysis-export-template.xml` com command="code-health". Salvar no path fornecido.
