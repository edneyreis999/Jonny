---
name: zord:test-diagnose
description: Diagnostica erro em teste, identifica causa raiz, avalia se teste deveria existir
---

# Test Diagnose Command

Diagnostica erros em testes e avalia sua validade.

## Workflow

### 1. Solicitar Output do Console

Pedir ao usuario que cole o output do console com o erro:

```
FAIL src/domain/__tests__/category.aggregate.spec.ts
  Category
    x should create category with valid props (15ms)

  ● Category › should create category with valid props

    TypeError: Cannot read properties of undefined (reading 'id')

      45 |     const category = Category.create(props);
      46 |
    > 47 |     expect(category.id).toBeDefined();
         |                     ^
      48 |   });

Test Suites: 1 failed, 1 total
```

### 2. Extrair Informacoes

Do output, extrair:

- **Arquivo**: path do arquivo de teste
- **Linha**: numero da linha do erro
- **Tipo de erro**: TypeError, AssertionError, etc.
- **Mensagem**: descricao do erro
- **Teste**: nome do teste que falhou

### 3. Perguntas

Use AskUserQuestion:

#### Q1: Contexto do Erro

```
header: "Contexto"
question: "O que voce sabe sobre esse erro?"
options:
  - "Teste funcionava antes" - Possivel regressao no codigo
  - "Teste novo que nunca passou" - Possivel erro no teste
  - "Teste flaky (as vezes passa)" - Problema de isolamento
  - "Nao sei" - Preciso de analise completa
```

#### Q2: Modo de Acao

```
header: "Acao"
question: "O que fazer apos o diagnostico?"
options:
  - "Apenas diagnostico" - Entender o problema
  - "Diagnostico + sugestao de codigo" - Ver como corrigir
  - "Auto-fix (com confirmacao)" - Aplicar correcao
```

### 4. Invocar test-analyzer

Caminho do agente test-analyzer: `.claude/agents/test-analyzer.md`

```
Task(subagent_type="test-analyzer", prompt="
  mode: error
  error_output: [output colado]
  context: [resposta Q1]
  action_mode: [resposta Q2]
")
```

### 5. Apresentar Diagnostico

Exibir o diagnostico estruturado:

```
+================================================================+
|                    DIAGNOSTICO DE ERRO                          |
+================================================================+
| Arquivo: src/domain/__tests__/category.aggregate.spec.ts        |
| Teste: should create category with valid props                  |
| Erro: TypeError - Cannot read properties of undefined           |
+----------------------------------------------------------------+
| CAUSA RAIZ: Mock mal configurado                                |
| LOCALIZACAO: Erro no TESTE (linha 47)                           |
| TEST SMELL: General Fixture [GF-01]                             |
+----------------------------------------------------------------+
| AVALIACAO DO TESTE:                                             |
| [!] 3 mocks configurados para teste unitario simples            |
| [!] Mock de Repository em teste de Domain (anti-pattern)        |
| [x] Teste valida comportamento real? PARCIALMENTE               |
+----------------------------------------------------------------+
| RECOMENDACAO: SIMPLIFICAR                                       |
|                                                                 |
| Este teste esta mockando dependencias que nao deveriam existir  |
| em um teste de Domain Layer. Agregados DDD devem ser testados   |
| sem mocks externos.                                             |
|                                                                 |
| Acao sugerida:                                                  |
| 1. Remover mocks de Repository                                  |
| 2. Usar Category.fake().anEntity().build()                      |
| 3. Testar apenas invariantes do agregado                        |
+================================================================+
```

### 6. Acao

Se recomendacao = **DELETAR**:

- Confirmar com usuario antes de remover
- Explicar porque teste e invalido

Se action_mode = **autofix**:

- Gerar codigo corrigido
- Mostrar diff
- Aplicar se confirmado via coreto-test-agent

## Arvore de Decisao: Onde esta o erro?

```
Erro em qual fase?
│
├── ARRANGE (setup/mocks)
│   ├── Mock retorna undefined? → ERRO NO TESTE (mock mal configurado)
│   ├── FakeBuilder ausente? → ERRO NO TESTE (usar builder)
│   └── Dependencia nao injetada? → ERRO NO TESTE (DI incorreta)
│
├── ACT (execucao)
│   ├── Metodo nao existe? → ERRO NO CODIGO (implementar)
│   ├── Parametros incorretos? → ERRO NO TESTE (ajustar chamada)
│   └── Excecao nao tratada? → ERRO NO CODIGO (adicionar try/catch)
│
└── ASSERT (verificacao)
    ├── Valor esperado incorreto? → ERRO NO TESTE (ajustar expect)
    ├── Comportamento mudou? → ERRO NO CODIGO (regressao)
    └── Propriedade nao existe? → ERRO NO CODIGO (implementar)
```

## Arvore de Decisao: Este teste deveria existir?

```
O teste valida comportamento real do usuario?
│
├── NAO
│   ├── Testa getter/setter trivial? → DELETAR
│   ├── Testa implementacao interna? → DELETAR ou REFATORAR
│   ├── >50% do teste e mock setup? → AVALIAR necessidade
│   └── Testa biblioteca externa? → DELETAR
│
└── SIM
    ├── Mock e mais complexo que o codigo? → SIMPLIFICAR
    ├── Teste duplica outro teste? → DELETAR duplicata
    ├── Teste e flaky? → REFATORAR isolamento
    └── Teste e valido → MANTER e corrigir
```

## Sinais de Teste Invalido (Over-Mocking)

| Sinal | Acao |
|-------|------|
| >5 mocks no mesmo teste | SIMPLIFICAR - integracao seria melhor |
| Mock de metodo privado | DELETAR - testa implementacao |
| Mock retorna mock | DELETAR - complexidade artificial |
| `jest.spyOn` em >3 metodos | SIMPLIFICAR - dividir em testes menores |
| `mockImplementation` com logica | AVALIAR - mock nao deveria ter logica |
| Testa biblioteca externa | DELETAR - nao e seu codigo |
| Assertion apenas em toHaveBeenCalled | AVALIAR - o que realmente valida? |

## Checklist: Teste Deveria Existir?

| Pergunta | Se NAO | Acao |
|----------|--------|------|
| Testa comportamento visivel ao usuario? | Nao | DELETAR |
| Sem este teste, bug passaria despercebido? | Seria pego em outro lugar | AVALIAR duplicidade |
| O teste e mais simples que o codigo? | Mais complexo | SIMPLIFICAR |
| Menos de 50% do teste e setup/mocks? | Mais de 50% e mock | REFATORAR |
| Testa SEU codigo (nao biblioteca)? | Testa lib | DELETAR |
| Consegue explicar o teste em 1 frase? | Muito complexo | DIVIDIR |

---

## Export de Analise (Opcional)

No inicio do Passo 3 (Perguntas), adicionar pergunta extra:

#### Q0: Export
```
header: "Export"
question: "Deseja exportar o diagnostico para XML?"
options:
  - "Nao" - Continuar normalmente
  - "Sim" - Exportar ao final
```

Se Sim: perguntar path de destino (string). Ao final do Passo 5 (Diagnostico), gerar XML conforme `.claude/templates/analysis-export-template.xml` com command="test-diagnose". Salvar no path fornecido.
