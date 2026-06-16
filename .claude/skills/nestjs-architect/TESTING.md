# Guia de Testes - NestJS Architect Skill

Este documento descreve como testar se a skill está funcionando corretamente com Claude Code.

## 🧪 Testes de Ativação

### Teste 1: Detecção Automática

**Prompt para Claude Code:**

```
"Crie um novo agregado Order seguindo os padrões DDD"
```

**Comportamento Esperado:**

- Claude Code menciona que está usando a "NestJS Architect Skill"
- Cria estrutura de diretórios em `core/order/`
- Implementa `OrderAggregate` sem decorators de framework
- Cria `IOrderRepository` interface no domínio
- Gera fake builder e testes

**Checklist de Validação:**

- [ ] Domínio em `src/core/order/domain/`
- [ ] Sem imports de `@nestjs/common` no domínio
- [ ] Aggregate estende `AggregateRoot`
- [ ] Value Objects imutáveis (`readonly`)
- [ ] Factory method `static create()`
- [ ] Validação com Notification Pattern

---

### Teste 2: Refatoração de Código Existente

**Prompt para Claude Code:**

```
"Refatore este serviço para seguir o padrão Use Case correto"

[Cole um serviço NestJS simples com lógica misturada]
```

**Comportamento Esperado:**

- Identifica violações arquiteturais
- Separa domínio de infraestrutura
- Move lógica de negócio para agregados
- Cria use case com `IUseCase<Input, Output>`
- Adiciona Notification Pattern
- Sugere testes

**Checklist de Validação:**

- [ ] Use case implementa `IUseCase<Input, Output>`
- [ ] Lógica de negócio movida para agregado
- [ ] Validação com `entity.notification.hasErrors()`
- [ ] Output mapper criado
- [ ] Testes de integração sugeridos

---

### Teste 3: Implementação de Specification Pattern

**Prompt para Claude Code:**

```
"Implemente regras de validação de invoice com Specification Pattern:
- Validar se valor é suspeito (>3x média histórica)
- Validar se conta está bloqueada
- Validar se frequência é anormal"
```

**Comportamento Esperado:**

- Cria interface `IInvoiceSpecification`
- Implementa 3 specifications concretas
- Cria `InvoiceAggregateSpecification` (agregador)
- Configura providers com token `INVOICE_SPECIFICATIONS`
- Injeta no use case

**Checklist de Validação:**

- [ ] Interface `IInvoiceSpecification` criada
- [ ] 3 classes concretas implementando interface
- [ ] Agregador com Chain of Responsibility
- [ ] Provider com `useFactory` e lista de specs
- [ ] Documentação de como adicionar novas regras

---

### Teste 4: Configuração de Módulo NestJS

**Prompt para Claude Code:**

```
"Configure o módulo NestJS para o agregado Product com:
- Repository Sequelize e In-Memory
- Use cases: Create, Update, Delete, List
- Controller fino
- DTOs validados
- Presenters"
```

**Comportamento Esperado:**

- Cria `products.providers.ts` com REPOSITORIES, USE_CASES
- Configura module com imports e exports corretos
- Controller fino delegando para use cases
- DTOs com decorators `class-validator`
- Presenters para serialização

**Checklist de Validação:**

- [ ] Providers organizados em constantes (REPOSITORIES, USE_CASES)
- [ ] `useFactory` para injeção de dependências
- [ ] Controller sem lógica de negócio
- [ ] DTOs com `@IsString()`, `@IsNumber()`, etc.
- [ ] Presenters transformando output

---

### Teste 5: Anti-Pattern Detection

**Prompt para Claude Code:**

```
"Revise este código e identifique anti-patterns"

[Cole código com framework no domínio, any[] em genéricos, etc.]
```

**Comportamento Esperado:**

- Lista todos os anti-patterns encontrados
- Explica o problema de cada um
- Sugere correções específicas
- Fornece código corrigido

**Checklist de Validação:**

- [ ] Identifica `@Injectable` no domínio
- [ ] Identifica `any[]` em genéricos
- [ ] Identifica validação comentada
- [ ] Identifica Value Objects mutáveis
- [ ] Sugere código correto para cada caso

---

## 🎯 Testes de Qualidade de Código

### Teste 6: Geração de Testes

**Prompt para Claude Code:**

```
"Gere testes completos para o CreateProductUseCase"
```

**Comportamento Esperado:**

- Testes unitários com In-Memory repository
- Casos de sucesso e erro
- Uso de Fake Builder
- Arrange-Act-Assert pattern
- Cobertura >80%

**Checklist de Validação:**

- [ ] Setup com `beforeEach`
- [ ] In-Memory repository
- [ ] Fake builder usado
- [ ] Testes de validação
- [ ] Testes de regras de negócio
- [ ] Assertions corretas

---

### Teste 7: Value Objects Complexos

**Prompt para Claude Code:**

```
"Crie um Value Object Money com validação de moeda e operações aritméticas"
```

**Comportamento Esperado:**

- Classe imutável (`readonly`)
- Validação no construtor
- Operações retornando novas instâncias
- Método `equals()` para comparação
- Método `toJSON()` para serialização

**Checklist de Validação:**

- [ ] Propriedades `readonly`
- [ ] Validação de valor e moeda
- [ ] Fail-fast para valores inválidos
- [ ] `add()`, `multiply()` retornam novas instâncias
- [ ] `equals()` implementado
- [ ] `toString()` e `toJSON()`

---

### Teste 8: Repository com Busca Avançada

**Prompt para Claude Code:**

```
"Implemente ProductRepository com busca por nome, categoria, faixa de preço e paginação"
```

**Comportamento Esperado:**

- Interface `IProductRepository` estende `ISearchableRepository`
- Métodos de busca customizados
- Implementação Sequelize com query complexas
- Implementação In-Memory com filtros
- Suporte a `SearchParams` e `SearchResult`

**Checklist de Validação:**

- [ ] Interface no domínio
- [ ] Implementações na infra
- [ ] `search()` com `SearchParams`
- [ ] Filtros funcionais
- [ ] Paginação implementada
- [ ] Testes para ambas implementações

---

## 🚀 Testes Avançados

### Teste 9: Event Sourcing Local

**Prompt para Claude Code:**

```
"Adicione eventos de domínio ao agregado Product:
- ProductCreated
- ProductPriceChanged
- ProductStockChanged"
```

**Comportamento Esperado:**

- Classes de evento criadas
- `applyEvent()` chamado em métodos de negócio
- `getUncommittedEvents()` implementado
- Handlers locais registrados (opcional)
- Testes de eventos

**Checklist de Validação:**

- [ ] Classes de evento implementadas
- [ ] `implements IDomainEvent`
- [ ] `applyEvent()` nos métodos relevantes
- [ ] Events adicionados ao `Set<IDomainEvent>`
- [ ] Testes verificando eventos disparados

---

### Teste 10: Validação Cruzada entre Agregados

**Prompt para Claude Code:**

```
"Implemente validação que verifica se categorias existem antes de criar um produto"
```

**Comportamento Esperado:**

- Validator na camada de aplicação
- Verificação no repositório de categorias
- Uso de `Either<Success, Error>` pattern
- Injeção do validator no use case
- Testes com categorias existentes e inexistentes

**Checklist de Validação:**

- [ ] Validator em `application/validations/`
- [ ] Depende de `ICategoryRepository`
- [ ] Retorna `Either<CategoryId[], NotFoundError[]>`
- [ ] Usado no `CreateProductUseCase`
- [ ] Provider configurado
- [ ] Testes de sucesso e falha

---

## 📊 Métricas de Sucesso

Para considerar a skill funcionando corretamente, Claude Code deve:

### Arquitetura (10/10)

- [x] Separar domínio de infraestrutura (100%)
- [x] Criar aggregates sem framework (100%)
- [x] Implementar repository pattern corretamente (100%)
- [x] Usar value objects imutáveis (100%)
- [x] Aplicar notification pattern (100%)
- [x] Seguir estrutura de diretórios (100%)
- [x] Criar use cases com interface (100%)
- [x] Implementar event sourcing local (100%)
- [x] Specification pattern quando aplicável (100%)
- [x] Validação cruzada entre agregados (100%)

### NestJS Integration (6/6)

- [x] Providers organizados (REPOSITORIES, USE_CASES) (100%)
- [x] Controllers finos (100%)
- [x] DTOs com class-validator (100%)
- [x] Presenters para output (100%)
- [x] Modules com exports (100%)
- [x] Injection tokens corretos (100%)

### Qualidade (4/4)

- [x] Fake builders criados (100%)
- [x] Testes unitários e integração (100%)
- [x] Sem anti-patterns (100%)
- [x] TypeScript estrito (100%)

**Score Mínimo para Aprovação**: 18/20 (90%)

---

## 🐛 Troubleshooting

### Problema: Skill não está sendo ativada

**Soluções:**

1. Verifique se `SKILL.md` está em `.claude/skills/nestjs-architect/`
2. Reinicie Claude Code
3. Tente invocar explicitamente: "Use a skill NestJS Architect para..."
4. Verifique logs de Claude Code para erros

### Problema: Código gerado não segue padrões

**Soluções:**

1. Seja mais específico no prompt: "seguindo padrões DDD"
2. Referencie a skill explicitamente
3. Peça revisão: "Revise este código com base na NestJS Architect Skill"
4. Verifique se a skill foi atualizada corretamente

### Problema: Testes não são gerados

**Soluções:**

1. Peça explicitamente: "Gere testes para..."
2. Especifique tipo: "testes unitários com In-Memory repository"
3. Referencie fake builders: "usando fake builder"

### Problema: Anti-patterns não detectados

**Soluções:**

1. Peça revisão explícita: "Revise e identifique anti-patterns"
2. Cole código problemático diretamente
3. Pergunte sobre caso específico: "Por que isso é anti-pattern?"

---

## 📝 Relatório de Testes

Use este template para documentar resultados:

```markdown
## Relatório de Testes - [Data]

### Teste 1: Detecção Automática
- ✅ Passou | ❌ Falhou
- Observações: [...]

### Teste 2: Refatoração
- ✅ Passou | ❌ Falhou
- Observações: [...]

[... demais testes ...]

### Score Final: __/20 (___%)

### Problemas Encontrados:
- [...]

### Melhorias Sugeridas:
- [...]
```

---

## 🔄 Próximos Passos

Após validar que a skill funciona:

1. **Documentar casos de uso reais** do projeto
2. **Refinar padrões** com base no feedback da equipe
3. **Adicionar novos templates** conforme necessário
4. **Atualizar exemplos** com código real do projeto
5. **Compartilhar com time** e coletar feedback

---

**Mantido por**: Time de Arquitetura
**Última Atualização**: 2025-01-18
**Próxima Revisão**: Após cada sprint ou quando bugs forem reportados
