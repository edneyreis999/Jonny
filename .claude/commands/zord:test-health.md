---
name: zord:test-health
description: Audita saude dos testes contra best practices DDD com score quantitativo 0-10
---

# Test Health Command

Audita a qualidade dos testes do sistema com score quantitativo e dashboard visual.

## Workflow

### 1. Scan de Arquivos

Use Glob para encontrar todos os arquivos de teste:

```
**/*.spec.ts
**/*.test.ts
```

### 2. Classificacao por Camada DDD

Classificar cada arquivo:

| Padrao | Camada |
|--------|--------|
| `*.entity.spec.ts`, `*.aggregate.spec.ts`, `*.vo.spec.ts` | Domain |
| `*.service.spec.ts`, `*.use-case.spec.ts` | Application |
| `*.controller.spec.ts`, `*.e2e-spec.ts`, `*.tsx` | Infrastructure |

### 3. Perguntas

Use AskUserQuestion com as perguntas abaixo:

#### Q1: Camada

```
header: "Camada"
question: "Qual camada da aplicacao voce quer validar?"
options:
  - "Todas as camadas" - Analise completa do sistema
  - "Domain" - Entities, Aggregates, Value Objects
  - "Application" - Use Cases, Services
  - "Infrastructure" - Controllers, Handlers, React
```

#### Q2: Tipo de Problema (multiSelect: true)

```
header: "Problema"
question: "Qual tipo de problema voce quer identificar?"
options:
  - "FakeBuilder ausente" - Objetos literais ao inves de builders
  - "Over-mocking" - Application mockando Repository
  - "Test Smells" - Assertion Roulette, General Fixture
  - "RTL anti-patterns" - getByTestId, shallow rendering
```

#### Q3: Escopo

```
header: "Escopo"
question: "Qual o escopo da analise?"
options:
  - "Projeto inteiro" - Todos os modulos
  - "Modulo especifico" - Filtrar por feature
  - "Arquivos modificados" - Apenas branch atual
```

#### Q4: Modo de Acao

```
header: "Acao"
question: "O que fazer apos a analise?"
options:
  - "Apenas relatorio" - Sem modificar codigo
  - "Relatorio + Plano de acao" - Com tasks priorizadas
  - "Auto-fix (com confirmacao)" - Propor correcoes
```

#### Q5: Prioridade (se acao != relatorio)

```
header: "Prioridade"
question: "Qual nivel de severidade corrigir primeiro?"
options:
  - "Apenas CRITICAL" - FakeBuilder, over-mocking
  - "CRITICAL + HIGH" - Inclui test smells, RTL
  - "Todos os niveis" - Inclui MEDIUM e LOW
```

### 4. Invocar test-analyzer em PARALELO

IMPORTANTE: Enviar todas as chamadas em UMA UNICA mensagem para execucao paralela.
Caminho do agente test-analyzer: `.claude/agents/test-analyzer.md`

```
Task(subagent_type="test-analyzer", prompt="mode: health, layer: Domain, files: [...]")
Task(subagent_type="test-analyzer", prompt="mode: health, layer: Application, files: [...]")
Task(subagent_type="test-analyzer", prompt="mode: health, layer: Infrastructure, files: [...]")
```

### 5. Agregar Resultados

Coletar outputs de todos os agentes e calcular:

```
Score Total = 0.5*Domain + 0.3*Application + 0.1*Infrastructure + 0.1*General
```

### 6. Exibir Dashboard

```
+======================================================================+
|                    TEST HEALTH DASHBOARD                              |
+======================================================================+
| Layer         | Files | Coverage | Issues | Score | Breakdown        |
+---------------+-------+----------+--------+-------+------------------+
| Domain        |   12  |   85%    |   3    |  7.0  | Iso:8 Inv:6 Pur:7|
| Application   |   24  |   72%    |   8    |  6.0  | Fak:5 Orc:7 DTO:6|
| Infrastructure|   18  |   65%    |  12    |  5.0  | Beh:4 RTL:5 E2E:6|
| General       |    -  |    -     |   5    |  8.5  | Sml:9 Nom:8 Cic:8|
+---------------+-------+----------+--------+-------+------------------+
| TOTAL SCORE   |   54  |   74%    |  28    |  6.4  | Weighted Average |
+======================================================================+

Top Issues by Test Smell:
[CRITICAL] [ENT-03] 5 tests missing FakeBuilder
[CRITICAL] [APP-01] 3 use cases mocking Repository
[HIGH] [RTL-01] 8 tests using getByTestId
[HIGH] [GF-01] 4 tests with General Fixture
```

### 7. Auto-fix (se solicitado)

Se action_mode = autofix:

1. Agrupar issues por arquivo
2. Invocar coreto-test-agent em PARALELO para arquivos diferentes
3. Apresentar diff para confirmacao
4. Aplicar correcoes aprovadas

## Calculo de Score por Categoria

### Domain (0-10)

- Isolamento de infraestrutura (imports, decoradores)
- Teste de invariantes (violacoes, limites)
- Pureza de entidades (sem Active Record)
- Uso de FakeBuilder

### Application (0-10)

- Fakes in-memory vs Mocks
- Foco em orquestracao
- DTOs para entrada/saida
- Padrao Result vs excecoes

### Infrastructure (0-10)

- Testes de comportamento externo
- RTL com seletores semanticos
- E2E com banco real ou Testcontainers

### General (0-10)

- Ausencia de test smells
- Nomenclatura ubiqua
- Baixa complexidade ciclomatica

## Penalidades

| Severidade | Penalidade |
|------------|------------|
| CRITICAL | -2 pontos |
| HIGH | -1 ponto |
| MEDIUM | -0.5 ponto |
| LOW | -0.25 ponto |

Score = max(0, 10 - penalidades)

---

## Export de Analise (Opcional)

No inicio do Passo 3 (Perguntas), adicionar pergunta extra:

#### Q0: Export
```
header: "Export"
question: "Deseja exportar a analise para XML?"
options:
  - "Nao" - Continuar normalmente
  - "Sim" - Exportar ao final
```

Se Sim: perguntar path de destino (string). Ao final do Passo 6 (Dashboard), gerar XML conforme `.claude/templates/analysis-export-template.xml` com command="test-health". Salvar no path fornecido.
