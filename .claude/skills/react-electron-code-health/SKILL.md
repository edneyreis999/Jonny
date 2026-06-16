---
name: react-electron-code-health
description: Analisa código React + Electron contra best practices de Clean Architecture, React Hooks, Electron IPC, TypeScript, Apollo Client e Tailwind CSS. Detecta code smells, violações de arquitetura e calcula score quantitativo.
tools: Read, Glob, Grep
model: sonnet
---

# React + Electron Code Health Analyzer

## Purpose

Esta skill analisa codigo React + Electron contra best practices modernas, detectando:

- Violacoes de Clean Architecture
- Uso incorreto de React Hooks
- Problemas de seguranca Electron IPC
- Anti-patterns TypeScript
- Problemas com Apollo Client
- Violacoes de Tailwind CSS

Calcula score quantitativo de 0-10 e gera relatorio estruturado em JSON.

## When to Use

Invocar esta skill quando:

- O codigo contem imports de `react`, `@react`, `@electron/`, `electron`
- Arquivos sao .tsx, .jsx em estrutura Electron
- Precisar validar Clean Architecture em frontend
- Detectar problemas de seguranca Electron

## Sinais de Reconhecimento

Um codigo e reconhecido como React + Electron quando apresenta:

- Importa de `react`, `@react`
- Usa hooks: `useState`, `useEffect`, `useContext`
- Importa de `@electron/` ou `electron`
- Usa `ipcRenderer`, `ipcMain`, `contextBridge`
- Arquivos em `src/main/`, `src/preload/`, `src/renderer/`

## Workflow de Analise

### 1. Identificacao Skim-First

Antes de ler codigo completo, aplicar token economy:

- Ler apenas imports e primeiras 50 linhas
- Identificar camada (domain/application/infrastructure)
- Verificar presenca de padroes especificos (hooks, decorators)
- Decidir se leitura completa e necessaria

### 2. Checklist por Categoria

Aplicar checklists abaixo em ordem de severidade. Documentar violacoes com ID academico, linha e mensagem.

### 2.1 Clean Architecture (FRONT-ARCH-*)

| ID | Regra | Severidade | Verificacao |
|----|-------|------------|-------------|
| FRONT-ARCH-01 | Isolamento de Dominio | CRITICAL | Sem imports de React/Apollo em domain/ |
| FRONT-ARCH-02 | Casos de Uso Abstratos | HIGH | Logica de negocio em funcoes puras |
| FRONT-ARCH-03 | Inversao de Repositorio | HIGH | UI depende de interfaces |
| FRONT-ARCH-04 | Fronteiras de Camada | CRITICAL | Sem importacoes circulares |
| FRONT-ARCH-05 | Separação UI/Domain | HIGH | Componentes agnosticos a framework |

### 2.2 React Hooks (FRONT-HOOK-*)

| ID | Regra | Severidade | Verificacao |
|----|-------|------------|-------------|
| FRONT-HOOK-01 | Rules of Hooks | CRITICAL | Hooks em condicional |
| FRONT-HOOK-02 | Dependencies Array | HIGH | useEffect com deps faltando |
| FRONT-HOOK-03 | Effect Overuse | MEDIUM | useEffect para transformacao |
| FRONT-HOOK-04 | Custom Hooks | HIGH | Logica encapsulada em hooks |
| FRONT-HOOK-05 | State Location | MEDIUM | Estado global que poderia ser local |

### 2.3 Electron IPC (FRONT-ELEC-*)

| ID | Regra | Severidade | Verificacao |
|----|-------|------------|-------------|
| FRONT-ELEC-01 | contextBridge | CRITICAL | Uso de contextBridge |
| FRONT-ELEC-02 | nodeIntegration: false | CRITICAL | nodeIntegration desativado |
| FRONT-ELEC-03 | API Minima | HIGH | Exposicao minima ao window |
| FRONT-ELEC-04 | Isolamento de Servicos | HIGH | Servicos injetaveis |

### 2.4 TypeScript (FRONT-TS-*)

| ID | Regra | Severidade | Verificacao |
|----|-------|------------|-------------|
| FRONT-TS-01 | Uso de any | CRITICAL | any explicito |
| FRONT-TS-02 | Strict Mode | HIGH | tsconfig.json strict: true |
| FRONT-TS-03 | Unoes Discriminadas | MEDIUM | Estado com discriminador |

### 2.5 Apollo Client (FRONT-APOLLO-*)

| ID | Regra | Severidade | Verificacao |
|----|-------|------------|-------------|
| FRONT-APOLLO-01 | Custom Hooks | HIGH | Abstracao de useQuery |
| FRONT-APOLLO-02 | Cache Management | MEDIUM | Atualizacao granular |
| FRONT-APOLLO-03 | Reactive Variables | LOW | Estado local com @client |
| FRONT-APOLLO-04 | Normalizacao | HIGH | IDs consistentes |

### 2.6 Tailwind CSS (FRONT-TW-*)

| ID | Regra | Severidade | Verificacao |
|----|-------|------------|-------------|
| FRONT-TW-01 | Componentizacao | MEDIUM | Botoes, cards, etc. |
| FRONT-TW-02 | Design Tokens | LOW | Valores arbitrarios |

### 3. Taxonomia de Code Smells

#### CRITICAL (-2 pontos)

| ID | Nome | Padrao de Detecção |
|----|------|-------------------|
| FRONT-CRIT-01 | Framework Leakage in Domain | `import react` em `domain/` |
| FRONT-CRIT-02 | Hook in Conditional | `if (condition) { useState() }` |
| FRONT-CRIT-03 | Missing contextBridge | `window.electronAPI` ausente |
| FRONT-CRIT-04 | nodeIntegration: true | `nodeIntegration: true` |
| FRONT-CRIT-05 | Any Type | `: any` sem type guard |

#### HIGH (-1 ponto)

| ID | Nome | Padrao de Detecção |
|----|------|-------------------|
| FRONT-HIGH-01 | Missing Dependencies | `useEffect(() => {}, [])` vazio |
| FRONT-HIGH-02 | No Custom Hook | useQuery direto no componente |
| FRONT-HIGH-03 | Not Strict Mode | `strict: false` |
| FRONT-HIGH-04 | Circular Import | domain/ -> infrastructure/ |
| FRONT-HIGH-05 | useEffect for Transform | useEffect calculando derivado |

#### MEDIUM (-0.5 ponto)

| ID | Nome | Padrao de Detecção |
|----|------|-------------------|
| FRONT-MED-01 | Large Component | > 400 LOC ou > 4000 tokens |
| FRONT-MED-02 | Global State | useState que poderia ser local |
| FRONT-MED-03 | Refetch Queries | Uso de refetch em vez de cache.modify |
| FRONT-MED-04 | Arbitrary Tailwind | `text-[13px]`, `bg-[#f4f4f4]` |

### 4. Thresholds de Heurísticas

#### Component Size

- **Warning**: > 250 LOC
- **High**: > 400 LOC
- **Penalidade**: MEDIUM (-0.5) ou HIGH (-1)

#### State Complexity

- **Warning**: > 3 useState
- **High**: > 5 useState
- **Recomendacao**: Usar useReducer
- **Penalidade**: MEDIUM (-0.5)

#### Fan-out

- **Warning**: > 7 imports unicos
- **High**: > 12 imports unicos
- **Penalidade**: MEDIUM (-0.5) ou HIGH (-1)

#### Testability Index

```
TI = 1 / (n_deps × side_effects)
```

- **TI < 0.01**: Baixa testabilidade (CRITICAL)
- **TI 0.01-0.05**: Testabilidade media (MEDIUM)
- **TI > 0.05**: Alta testabilidade (bom)

### 5. Calculo de Score

#### Fórmula por Arquivo

```
Score = max(0, 10 - soma_penalidades)
```

#### Ponderação (Score Agregado)

```
Score Final = 0.3*Architecture + 0.25*Hooks + 0.2*Electron + 0.15*TypeScript + 0.1*Apollo
```

#### Classificação de Saúde

- **8.0 - 10.0**: Excelente - Saudável
- **6.0 - 7.9**: Bom - Melhorias necessárias
- **4.0 - 5.9**: Regular - Vários problemas
- **2.0 - 3.9**: Ruim - Críticos violados
- **0.0 - 1.9**: Crítico - Risco alto

### 6. Deduplicação e Agregação

#### Deduplicação de Findings

Agrupar por localização (arquivo:linha) e manter finding de maior severidade.

#### Resolução de Conflitos de Severidade

Tomar severidade máxima quando múltiplas regras discordam.

### 7. Output Format

Retornar relatório estruturado em JSON:

```json
{
  "summary": {
    "total_files": 72,
    "overall_score": 7.2,
    "health_level": "Bom",
    "critical_issues": 5,
    "high_issues": 12,
    "medium_issues": 8,
    "low_issues": 0,
    "analysis_duration_ms": 15000
  },
  "categories": {
    "architecture": { "score": 7.0, "issues": 3, "top_issues": ["FRONT-ARCH-01", "FRONT-ARCH-05"] },
    "hooks": { "score": 6.0, "issues": 8, "top_issues": ["FRONT-HOOK-02"] },
    "electron": { "score": 8.5, "issues": 2, "top_issues": ["FRONT-ELEC-01"] },
    "typescript": { "score": 7.5, "issues": 5, "top_issues": ["FRONT-TS-01"] },
    "apollo": { "score": 8.0, "issues": 0, "top_issues": [] },
    "tailwind": { "score": 9.0, "issues": 0, "top_issues": [] }
  },
  "files": [
    {
      "path": "src/components/UserForm.tsx",
      "score": 6.5,
      "category_scores": {
        "architecture": 8.0,
        "hooks": 5.0,
        "typescript": 7.0
      },
      "issues": [
        {
          "id": "FRONT-HOOK-02",
          "category": "hooks",
          "severity": "HIGH",
          "line": 45,
          "msg": "useEffect com dependências faltando",
          "code": "useEffect(() => { fetchData(); }, [])",
          "why_it_matters": "Dependências faltantes podem causar bugs de stale closure",
          "recommended_fix": "Adicionar fetchData às dependências: [fetchData]"
        }
      ],
      "smells": ["FRONT-HIGH-01"],
      "recommendation": "Adicionar fetchData às dependências do useEffect"
    }
  ],
  "aggregate_issues": {
    "FRONT-HOOK-02": { "count": 8, "severity": "HIGH", "description": "Dependencies Array Missing" },
    "FRONT-ARCH-01": { "count": 2, "severity": "CRITICAL", "description": "Framework Leakage" },
    "FRONT-TS-01": { "count": 3, "severity": "CRITICAL", "description": "Any Type" }
  },
  "metadata": {
    "analyzer_version": "1.0.0",
    "timestamp": "2026-02-05T10:00:00Z",
    "mode": "health",
    "constraints_applied": false,
    "project_type": "electron",
    "stack_features": ["apollo", "tailwind"]
  }
}
```

## Token Economy

### Skim-First Reading

1. Ler apenas imports e primeiras 50 linhas
2. Identificar camada (domain/application/infrastructure)
3. Verificar presença de padroes especificos (hooks, decorators)
4. Decidir se leitura completa e necessaria

### Pruning

- Ignorar arquivos sem imports de frameworks
- Pular regioes ja analisadas sem findings
- Ignorar codigo boilerplate gerado

### Chunking Strategy

Para arquivos grandes (> 10000 linhas ou > 8000 tokens):

- Processar em chunks com sobreposição de 100 linhas
- Respeitar limites de funcao/classe
- Priorizar regioes com maior probabilidade de issues

## Error Handling

### Syntax Error Recovery

Em caso de erro sintatico:

- Continuar analise das partes validas
- Retornar `partial: true` com findings parciais
- Marcar regions com erro para review manual

### Timeout Handling

Thresholds:

- Single file: 30s
- Multi file: 5min
- LLM call: 30s

Estrategia:

- Retornar analise parcial em caso de timeout
- Priorizar arquivos criticos (domain/, core/)
- Flag arquivos nao analisados para retentativa

### Skill Failure Fallback

Estrategias em cascata:

1. Tentar skill primaria
2. Se falhar, usar heuristicas rule-based simples
3. Retornar analise basica com confidence baixo

## Supressão de False Positives

### Inline Comments

```typescript
// zord-ignore FRONT-HOOK-02
useEffect(() => { fetchData(); }, []);
```

### Configuration File (.zordignore)

```
src/legacy/**/*.ts
**/generated/**/*.ts
src/legacy/utils.ts: [FRONT-TS-01, FRONT-TS-03]
```

### Baseline (.zord-baseline.json)

```json
{
  "suppressions": [
    {
      "rule": "FRONT-HOOK-02",
      "file": "src/components/UserProfile.tsx",
      "line": 45,
      "reason": "Legacy API constraint",
      "expires": "2026-12-31"
    }
  ]
}
```

## Exemplos Good vs Bad

### Prop Drilling

```typescript
// BAD - Prop drilling profundo
function App() {
  const user = { name: 'John' };
  return <A user={user} />;
}
function A({ user }) { return <B user={user} />; }
function B({ user }) { return <C user={user} />; }
function C({ user }) { return <D user={user} />; }
function D({ user }) { return <span>{user.name}</span>; }

// GOOD - Context API
const UserContext = createContext<User | null>(null);
function App() {
  return (
    <UserContext.Provider value={{ name: 'John' }}>
      <A />
    </UserContext.Provider>
  );
}
function D() {
  const user = useContext(UserContext);
  return <span>{user?.name}</span>;
}
```

### useEffect para Estado Derivado

```typescript
// BAD - Effect para computação derivada
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    setDisplayName(user?.firstName + ' ' + user?.lastName);
  }, [user]);
  return <div>{displayName}</div>;
}

// GOOD - Estado derivado computado
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const displayName = `${user?.firstName} ${user?.lastName}`;
  return <div>{displayName}</div>;
}
```

### useEffect Cleanup (Memory Leak)

```typescript
// BAD - Missing cleanup
function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    // Missing cleanup - memory leak
  }, []);
  return <div>Timer: {seconds}s</div>;
}

// GOOD - Cleanup function
function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return <div>Timer: {seconds}s</div>;
}
```

### Electron contextBridge

```typescript
// BAD - ipcRenderer exposto diretamente
mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,        // PERIGO
    contextIsolation: false,      // PERIGO
  }
});

// GOOD - contextBridge com API mínima
mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
});

// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
});
```

### Clean Architecture Violation

```typescript
// BAD - Business logic em componente
const OrderSummary: React.FC = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const calculatedTotal = items.reduce((sum, item) => {
      if (item.isOnSale) return sum + (item.price * 0.8);
      return sum + item.price;
    }, 0);
    setTotal(calculatedTotal);
  }, [items]);
  return <div>Total: ${total}</div>;
};

// GOOD - Logic em use case
const OrderSummary: React.FC = () => {
  const { items, total } = useCalculateOrderTotal();
  return <div>Total: ${total}</div>;
};
```

## Contract

### Input

```typescript
interface SkillInput {
  files: string[];
  mode: "health" | "error";
  layer: "Domain" | "Infrastructure" | "All";
  categories: string[];
  scope: "full" | "module:<path>" | "changed";
  project_type: "electron" | "react" | "nextjs";
  stack_features: string[];
}
```

### Output

```typescript
interface AnalysisOutput {
  summary: {
    total_files: number;
    overall_score: number;
    health_level: "Crítico" | "Ruim" | "Regular" | "Bom" | "Excelente";
    critical_issues: number;
    high_issues: number;
    medium_issues: number;
    low_issues: number;
    analysis_duration_ms: number;
  };
  categories: {
    [key: string]: { score: number; issues: number; top_issues: string[] };
  };
  files: FileAnalysis[];
  aggregate_issues: { [ruleId: string]: AggregateIssue };
  metadata: {
    analyzer_version: string;
    timestamp: string;
    mode: string;
    constraints_applied: boolean;
  };
}
```
