---
name: test-e2e-playwright
description: Analisa testes E2E Playwright contra best practices modernas de arquitetura, locatores, sincronização e isolamento. Detecta anti-padrões como seletores frágeis, esperas fixas, violações de POM e vazamento de recursos. Calcula score quantitativo 0-10 com penalidades por severidade. Use quando auditar qualidade de testes E2E Playwright/TypeScript em aplicações web, React, Next.js ou Electron.
---

# Test E2E Playwright Analyzer

Skill para análise de qualidade de testes E2E com Playwright, focada em manutenibilidade, confiabilidade e resiliência de longo prazo.

## Purpose

Analisar testes E2E Playwright contra best practices modernas, identificando anti-padrões que comprometem a manutenibilidade e a confiabilidade da suíte. Calcular score quantitativo e fornecer recomendações acionáveis.

## When to Use

Invocar esta skill quando:

- Auditar qualidade de testes E2E Playwright existentes
- Revisar code review de PRs com testes Playwright
- Diagnosticar problemas de manutenibilidade em suítes de testes
- Validar aderência a padrões arquiteturais de automação
- Preparar métricas de saúde de testes E2E

## Sinais de Teste Playwright

Um teste é reconhecido como Playwright E2E quando apresenta:

- Importa de `@playwright/test`
- Usa `page.locator()`, `getByRole()`, `getByText()`, `getByLabel()`
- Extende `PageObject` ou usa `test.extend()`
- Usa `expect(page).toHaveURL()`, `waitForLoadState()`, `waitForResponse()`

## Workflow de Análise

### 1. Identificação e Leitura Skim-First

Antes de ler código completo, aplicar token economy:

- Ler apenas imports e assinaturas de teste
- Identificar camada e tipo (web, electron, mobile)
- Verificar presença de fixtures vs hooks tradicionais

### 2. Checklist por Categoria

Aplicar checklists abaixo em ordem de severidade. Documentar violações com ID acadêmico, linha e mensagem.

#### Arquitetura e Camadas

| ID | Regra | Severidade | Verificação |
|----|-------|------------|-------------|
| `[PW-ARCH-01]` | Separação em 3 camadas: Core, Business, Data | CRITICAL | Verificar estrutura de diretórios e organização de arquivos |
| `[PW-ARCH-02]` | Page Objects via fixtures (não hooks) | CRITICAL | Buscar `test.extend()` e fixtures customizadas |
| `[PW-ARCH-03]` | Seletores isolados dos arquivos .spec.ts | CRITICAL | Arquivos .spec não devem conter `page.locator()` |
| `[PW-ARCH-04]` | TypeScript com tipagem estrita | HIGH | Verificar imports de tipos e interfaces |
| `[PW-ARCH-05]` | storageState para reuso de autenticação | HIGH | Verificar uso de `storageState` em fixtures |

#### Locadores e Seleção

| ID | Regra | Severidade | Verificação |
|----|-------|------------|-------------|
| `[PW-LOC-01]` | Usar getByRole como prioridade absoluta | CRITICAL | Buscar padrões de locadores usados |
| `[PW-LOC-02]` | getByLabel para formulários e inputs | HIGH | Verificar formulários |
| `[PW-LOC-03]` | getByText para validação de conteúdo | HIGH | Verificar asserções de texto |
| `[PW-LOC-04]` | data-testid apenas para elementos sem semântica | MEDIUM | Usar quando getByRole não é possível |
| `[PW-LOC-05]` | Proibir seletores CSS frágeis (.css-xyz, nth-child) | CRITICAL | Buscar `.css-`, `:nth-child()`, seletores compostos |
| `[PW-LOC-06]` | Strict Mode: locator resolve para 1 elemento | HIGH | Verificar filtros e especificidade |

#### Sincronização e Esperas

| ID | Regra | Severidade | Verificação |
|----|-------|------------|-------------|
| `[PW-SYNC-01]` | Asserções Web-First expect().toBeVisible() | CRITICAL | Buscar padrões de asserção |
| `[PW-SYNC-02]` | Proibir waitForTimeout (esperas fixas) | CRITICAL | Buscar `waitForTimeout` no código |
| `[PW-SYNC-03]` | Aguardar hidratação React/Next.js concluída | HIGH | Verificar Next.js específico |
| `[PW-SYNC-04]` | Monitoramento de rede para dados dinâmicos | HIGH | Buscar `waitForResponse`, `page.route()` |
| `[PW-SYNC-05]` | Proibir force: true em cliques | HIGH | Buscar `click({ force: true })` |
| `[PW-SYNC-06]` | Usar waitForResponse/page.route() para APIs | MEDIUM | Verificar mocks de APIs externas |

#### Isolamento e Estado

| ID | Regra | Severidade | Verificação |
|----|-------|------------|-------------|
| `[PW-ISO-01]` | Cada teste independente (sem dependência) | CRITICAL | Verificar ordem de execução |
| `[PW-ISO-02]` | Contextos de Browser isolados | CRITICAL | Buscar `browser.newContext()` |
| `[PW-ISO-03]` | Mock APIs externas via page.route() | HIGH | Verificar APIs de terceiros |
| `[PW-ISO-04]` | Limpeza adequada de recursos (teardown) | HIGH | Buscar `afterEach`, `afterAll` |

#### Electron Específico (quando aplicável)

| ID | Regra | Severidade | Verificação |
|----|-------|------------|-------------|
| `[PW-EL-01]` | electronApp.evaluate() para Main Process | CRITICAL | Buscar interações com Main |
| `[PW-EL-02]` | Aguardar electronApp.firstWindow() | CRITICAL | Verificar inicialização |
| `[PW-EL-03]` | Validar comunicação IPC | HIGH | Buscar handlers IPC |
| `[PW-EL-04]` | Monitorar novas janelas via on('window') | HIGH | Verificar multi-janela |
| `[PW-EL-05]` | Encerrar explicitamente com electronApp.close() | CRITICAL | Buscar teardown |

### 3. Taxonomia de Test Smells

#### CRITICAL (-2 pontos cada)

| ID | Nome | Descrição | Padrão de Detecção |
|----|------|-----------|-------------------|
| `[PW-CRIT-01]` | Fragile Selector | Usa CSS/XPath ao invés de getByRole/getByText | `page.locator('.css-')`, `page.locator('div > span')` |
| `[PW-CRIT-02]` | Hardcoded Wait | Usa waitForTimeout com tempo fixo | `await page.waitForTimeout(5000)` |
| `[PW-CRIT-03]` | Architecture Violation | Seletores/lógica de página no .spec.ts | `.spec.ts` com `page.locator()` |
| `[PW-CRIT-04]` | Force Click | Usa click({ force: true }) mascarando problemas | `click({ force: true })` |
| `[PW-CRIT-05]` | Electron Teardown Leak | Não executa electronApp.close() | Falta `afterAll` com close |

#### HIGH (-1 ponto cada)

| ID | Nome | Descrição | Padrão de Detecção |
|----|------|-----------|-------------------|
| `[PW-HIGH-01]` | Missing Web-First Assertions | Não usa expect().toBeVisible() com auto-retry | `expect(element).toBe(x)` sem `await` |
| `[PW-HIGH-02]` | Framework CSS Selector | Seletores .css-xyz que mudam a cada build | `.css-[0-9a-z]+` |
| `[PW-HIGH-03]` | Hydration Race | Interage antes de React/Next.js hidratar | Interação imediada após navegação |
| `[PW-HIGH-04]` | Shared State | Teste depende de estado de teste anterior | Testes B dependem de A |
| `[PW-HIGH-05]` | No StorageState | Repete login em cada teste | Login repetido sem storageState |
| `[PW-HIGH-06]` | Missing Strict Mode | Locator ambíguo sem filtro específico | Locator retorna múltiplos |

#### MEDIUM (-0.5 ponto cada)

| ID | Nome | Descrição | Padrão de Detecção |
|----|------|-----------|-------------------|
| `[PW-MED-01]` | Static Fixture | Dados hard-coded ao invés de factories | Objetos literais em variáveis |
| `[PW-MED-02]` | Weak Locator | getByTestId quando getByRole seria possível | `getByTestId` com role disponível |
| `[PW-MED-03]` | Missing Network Mock | Chama API externa real ao invés de mock | `fetch()` para APIs externas |
| `[PW-MED-04]` | Generic Error Handler | try-catch que silencia falhas | `try {} catch {}` vazio |

### 4. Cálculo de Score

#### Fórmula por Arquivo

```
Score do arquivo = max(0, 10 - soma_penalidades)
```

#### Ponderação por Categoria (score agregado)

```
Score Final = 0.4*Locatores + 0.3*Sincronização + 0.2*Arquitetura + 0.1*Isolamento
```

Onde cada categoria é calculada individualmente usando a mesma fórmula de penalidades.

#### Classificação de Saúde

- **8.0 - 10.0**: Excelente - Suíte saudável, follow best practices
- **6.0 - 7.9**: Bom - Algumas melhorias necessárias
- **4.0 - 5.9**: Regular - Vários anti-padrões, refatoração recomendada
- **2.0 - 3.9**: Ruim - Críticos violados, atenção urgente
- **0.0 - 1.9**: Crítico - Suíte em risco alto de manutenibilidade

### 5. Output Format

Retornar relatório estruturado em JSON:

```json
{
  "summary": {
    "total_files": 10,
    "overall_score": 7.2,
    "health_level": "Bom",
    "critical_issues": 5,
    "high_issues": 12,
    "medium_issues": 8
  },
  "files": [
    {
      "path": "tests/e2e/login.spec.ts",
      "layer": "E2E",
      "score": 8.5,
      "category_scores": {
        "locators": 9.0,
        "synchronization": 8.0,
        "architecture": 9.0,
        "isolation": 8.0
      },
      "issues": [
        {
          "id": "PW-LOC-04",
          "severity": "MEDIUM",
          "line": 15,
          "msg": "getByTestId usado quando getByRole seria possível",
          "code": "page.getByTestId('submit-btn')"
        }
      ],
      "smells": ["PW-MED-02"],
      "recommendation": "Substituir getByTestId por getByRole('button', { name: 'Entrar' })"
    }
  ],
  "aggregate_issues": {
    "PW-LOC-05": { "count": 5, "severity": "CRITICAL", "description": "Seletores CSS frágeis" },
    "PW-SYNC-02": { "count": 3, "severity": "CRITICAL", "description": "Esperas fixas" }
  }
}
```

## Anti-padrões: Certo vs. Errado

Referência rápida para análise:

| Categoria | Anti-padrão ❌ | Prática de Excelência ✅ |
| :---- | :---- | :---- |
| **Locadores** | `page.locator('.container > div:nth-child(2)')` | `page.getByRole('button', { name: 'Enviar' })` |
| **Sincronismo** | `await page.waitForTimeout(5000)` | `await expect(page.getByText('Carregado')).toBeVisible()` |
| **Arquitetura** | Seletores dentro do .spec.ts | POM injetado via fixtures |
| **Autenticação** | Repete login a cada teste | `storageState` com cookies reutilizados |
| **Isolamento** | Teste B depende do teste A | Cada teste com seu próprio context |
| **External APIs** | `await fetch('https://api-pagamento.com')` | `page.route('**/api/**', mockHandler)` |
| **Electron** | Interação sem aguardar window | `await electronApp.firstWindow()` |
| **Tratamento de Erros** | `try { ... } catch (e) {}` | `expect.soft()` com traces detalhados |

## Referências Adicionais

Para análise profunda de arquitetura ou casos específicos, consultar:

- `references/playwright-best-practices.md` - Guia completo de práticas recomendadas
- `references/electron-automation.md` - Específico para aplicações Electron
