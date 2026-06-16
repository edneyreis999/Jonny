# Playwright Best Practices - Guia Rápido de Referência

> Este documento contém práticas recomendadas extraídas de "Arquitetura e Diretrizes de Qualidade para Automação com Playwright"

## Índice Rápido por Categoria

### 🏗️ Arquitetura

| Prática | Por que |
|---------|---------|
| **3 camadas**: Core, Business, Data | Isola mudanças de UI, infraestrutura e dados |
| **Fixtures > Hooks** | Setup/teardown juntos, lazy loading, melhor performance |
| **storageState para auth** | Evita repetir login a cada teste |
| **TypeScript estrito** | Previne erros em runtime, facilita refatoração |

### 🎯 Locadores (Hierarquia de Resiliência)

```
1. getByRole()          ← Altíssima (USE SEMPRE)
2. getByLabel()         ← Alta
3. getByText()          ← Alta
4. getByTestId()        ← Médio-Alta (quando sem semântica)
5. CSS / XPath          ← Baixa (EVITAR)
```

**Sinais de alerta:**

- `.css-xyz` (framework class)
- `:nth-child()` (estrutural)
- `div > span > button` (frágil)

### ⏱️ Sincronização

| ✅ Web-First | ❌ Anti-padrão |
|--------------|---------------|
| `await expect(locator).toBeVisible()` | `await page.waitForTimeout(5000)` |
| `await page.waitForResponse()` | `click({ force: true })` |
| `waitForLoadState('networkidle')` |  |

**Problema de Hidratação (React/Next.js):**

- Elemento visível no DOM mas sem event listeners
- Solução: aguardar atributo de ready state ou requisições críticas

### 🔒 Isolamento

| Prática | Como |
|---------|------|
| **Testes independentes** | Cada teste configura seu próprio estado |
| **Browser Contexts** | `browser.newContext()` para isolamento |
| **Mock APIs externas** | `page.route('**/api/**', handler)` |
| **Teardown explícito** | `afterEach` / `afterAll` limpeza |

### 📦 Fixtures vs Hooks

```typescript
// ❌ Hooks (espalhados, frágeis)
beforeEach(async () => {
  loginPage = new LoginPage(page)
  await loginPage.navigate()
})

// ✅ Fixtures (encapsuladas)
const loginFixture = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page)
    await lp.navigate()
    await use(lp)
  }
})
```

## Padrões de Smell Detecção

### CRITICAL (score -2)

- **Fragile Selector**: CSS/XPath ao invés de getByRole
- **Hardcoded Wait**: waitForTimeout fixo
- **Architecture Violation**: Seletores no .spec.ts
- **Force Click**: click({ force: true })

### HIGH (score -1)

- **Missing Web-First**: Sem expect().toBeVisible()
- **Framework CSS**: Classes .css-* que mudam
- **Hydration Race**: Interage antes de React hidratar
- **Shared State**: Teste B depende de A

### MEDIUM (score -0.5)

- **Static Fixture**: Dados hard-coded
- **Weak Locator**: getByTestId quando role possível
- **Missing Network Mock**: Chama API real

## Exemplos: Certo vs Errado

### Locadores

```typescript
// ❌ FRÁGIL
await page.locator('.container > div:nth-child(2) > button').click()

// ✅ RESILIENTE
await page.getByRole('button', { name: 'Enviar' }).click()
```

### Sincronização

```typescript
// ❌ LENTO/FLAKY
await page.waitForTimeout(3000)
await expect(page.getByText('Sucesso')).toBeVisible()

// ✅ INTELIGENTE
await expect(page.getByText('Sucesso')).toBeVisible()
// Playwright auto-aguarda até 5s por padrão
```

### Arquitetura

```typescript
// ❌ .spec.ts com lógica de página
test('login', async ({ page }) => {
  await page.locator('#username').fill('user')
  await page.locator('#password').fill('pass')
  await page.locator('button').click()
})

// ✅ POM injetado via fixture
test('login', async ({ loginPage }) => {
  await loginPage.login('user', 'pass')
})
```

### External APIs

```typescript
// ❌ Chama API real (lento, não determinístico)
await fetch('https://api-pagamento.com/charge')

// ✅ Mock controlado
page.route('**/api/charge', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true })
  })
})
```

## Referências Externas

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Fixtures Documentation](https://playwright.dev/docs/test-fixtures)
- [Selector Best Practices](https://www.browserstack.com/guide/playwright-selectors-best-practices)
