# Electron Automation com Playwright - Guia Rápido

> Específico para automação de aplicações Electron Desktop

## Arquitetura Electron

```
┌─────────────────────────────────────────────────┐
│           Electron Application                  │
├───────────────────┬─────────────────────────────┤
│  Main Process     │     Renderer Process(s)     │
│  (Node.js)        │     (Chromium)               │
│                   │                             │
│  • window_mgmt    │  • UI React/HTML            │
│  • file_system    │  • user interactions        │
│  • IPC handlers   │  • page/locator access      │
│  • native_menus   │                             │
└───────────────────┴─────────────────────────────┘
         ↕                          ↕
    IPC Communication            page object
```

## Setup Inicial

### Configuração do Teste

```typescript
import { test, _electron as electron } from '@playwright/test'

test.describe('Electron App', () => {
  let electronApp: ElectronApp

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: ['.', '--no-sandbox'] // args do app
    })
  })

  test.afterAll(async () => {
    await electronApp.close() // ⚠️ CRITICAL: evitar leak
  })

  test('janela abre', async () => {
    const window = await electronApp.firstWindow()
    await expect(window).toHaveTitle(/Meu App/)
  })
})
```

## Comandos por Processo

### Main Process (electronApp.evaluate)

Executa código Node.js no processo principal:

```typescript
// Acessar APIs nativas
const appPath = await electronApp.evaluate(async ({ app }) => {
  return app.getAppPath()
})

// Manipular filesystem
const files = await electronApp.evaluate(async ({ }) => {
  const fs = await import('fs')
  return fs.readdirSync('./data')
})

// Acessar estado interno
const version = await electronApp.evaluate(async ({ app }) => {
  return app.getVersion()
})
```

### Renderer Process (page/window)

Acesso via `window` padrão do Playwright:

```typescript
const window = await electronApp.firstWindow()

// Locators funcionam igual web
await window.getByRole('button', { name: 'Salvar' }).click()
await expect(window.getByText('Arquivo salvo')).toBeVisible()
```

## IPC Communication Testing

### Enviar mensagem para Main Process

```typescript
test('IPC: save-file', async ({ electronApp }) => {
  const window = await electronApp.firstWindow()

  // IPC send do renderer
  await window.evaluate(() => {
    window.electronAPI.saveFile({ content: 'dados' })
  })

  // Verificar resultado no renderer
  await expect(window.getByText('Arquivo salvo')).toBeVisible()
})
```

### Acessar IPC handlers diretamente

```typescript
test('IPC handler processado', async ({ electronApp }) => {
  const result = await electronApp.evaluate(async ({ ipcMain }) => {
    // Verificar se handler está registrado
    return ipcMain.listenerCount('save-file')
  })

  expect(result).toBeGreaterThan(0)
})
```

## Multi-Window Handling

```typescript
test('abre segunda janela', async ({ electronApp }) => {
  const firstWindow = await electronApp.firstWindow()

  // Monitorar nova janela
  const [secondWindow] = await Promise.all([
    electronApp.waitForEvent('window'),
    firstWindow.getByRole('button', { name: 'Novo' }).click()
  ])

  await expect(secondWindow).toHaveTitle('Nova Janela')
  await secondWindow.close()
})
```

## Checklist Electron Específico

| ID | Regra | Severidade | Verificar |
|----|-------|------------|-----------|
| `[PW-EL-01]` | electronApp.evaluate() para Main Process | CRITICAL | Acessar APIs nativas |
| `[PW-EL-02]` | Aguardar electronApp.firstWindow() | CRITICAL | Antes de interações |
| `[PW-EL-03]` | Validar comunicação IPC | HIGH | Mensagens renderer↔main |
| `[PW-EL-04]` | Monitorar on('window') | HIGH | Multi-janela |
| `[PW-EL-05]` | electronApp.close() no afterAll | CRITICAL | Teardown obrigatório |

## Smells Comuns em Electron

### CRITICAL

| Smell | Exemplo | Correção |
|-------|---------|----------|
| **Missing Teardown** | Sem `afterAll` com close | `await electronApp.close()` |
| **Race Condition** | Interage sem firstWindow | `const w = await electronApp.firstWindow()` |
| **Wrong Process** | Tenta usar `page.evaluate` para filesystem | `electronApp.evaluate()` |

### HIGH

| Smell | Exemplo | Correção |
|-------|---------|----------|
| **No IPC Validation** | Envia mensagem sem verificar resposta | `expect(response).toEqual(expected)` |
| **Missing Window Monitor** | Assume janela abriu | `electronApp.waitForEvent('window')` |

## Padrões: Certo vs Errado

### Acesso a APIs Nativas

```typescript
// ❌ ERRADO: page não tem acesso a Node.js
const files = await page.evaluate(() => {
  return fs.readdirSync('./data') // undefined
})

// ✅ CERTO: evaluate no electronApp
const files = await electronApp.evaluate(async ({ app }) => {
  const fs = await import('fs')
  return fs.readdirSync('./data')
})
```

### Teardown

```typescript
// ❌ ERRADO: sem cleanup
test.afterAll(() => {}) // vazio

// ✅ CERTO: close explícito
test.afterAll(async ({ electronApp }) => {
  await electronApp.close()
})
```

### Multi-Janela

```typescript
// ❌ ERRADO: assumes second window exists
const windows = electronApp.windows()
const second = windows[1] // pode ser undefined

// ✅ CERTO: aguarda evento
const secondWindow = await Promise.all([
  electronApp.waitForEvent('window'),
  firstWindow.getByRole('button', { name: 'Abrir' }).click()
])
```

## Debug Tips

```typescript
// Ver todas as janelas
const windows = electronApp.windows()
console.log('Janelas abertas:', windows.map(w => w.url()))

// Logs do main process
electronApp.evaluate(async ({ app }) => {
  app.on('window-all-closed', () => console.log('Todas janelas fechadas'))
})

// Logs do renderer
window.on('console', msg => console.log('Renderer:', msg.text()))
```

## Referências

- [ElectronApplication API](https://playwright.dev/docs/api/class-electronapplication)
- [Electron IPC Docs](https://electronjs.org/docs/latest/tutorial/ipc)
- [Playwright Electron Guide](https://playwright.dev/docs/api/class-electron)
