---
name: test:service-layer
description: Gera testes para Application Layer (Services, Use Cases). Prioriza integracao sobre unitario. FakeBuilder obrigatorio.
---

# Test Service Layer

Testes para camada Application (DDD).

## Regras

1. INTEGRACAO prioritaria - unitario so se FakeBuilder + loop criar multiplos cenarios
2. FakeBuilder OBRIGATORIO para inputs
3. Mock apenas dependencias externas (DB, HTTP, eventos)
4. Nomenclatura: `*.integration.spec.ts` (integracao) ou `*.spec.ts` (unitario)

## Decisao Integracao vs Unitario

| Cenario | Tipo |
|---------|------|
| Fluxo completo com DB | Integracao |
| Multiplas variacoes de input | Unitario + loop |
| Validacao de orquestracao | Integracao |

## Padrao

```typescript
describe('[UseCase]', () => {
  it('should [resultado] given [contexto]', async () => {
    const input = Entity.fake().anEntity().build();
    const result = await useCase.execute(input);
    expect(result).toMatchObject({...});
  });
});
```

## Arvore de Decisao

```
Tem side-effect externo (DB, HTTP, evento)?
├─ SIM → INTEGRACAO
└─ NAO → Tem >3 variacoes de input?
         ├─ SIM → UNITARIO com loop + FakeBuilder
         └─ NAO → INTEGRACAO (mais valor)
```

## Mocking Strategy

| Dependencia | Mock? | Motivo |
|-------------|-------|--------|
| Repository | SIM (unit) / NAO (integ) | Testar persistencia real em integracao |
| External API | SEMPRE | Nao depender de servico externo |
| Domain Entity | NUNCA | Usar FakeBuilder |
| EventEmitter | SPY | Verificar emissao, nao mockar |

## Auto-Mocking (Preferido)

```typescript
vi.mock('./repository');
vi.mocked(repository.save).mockResolvedValue(entity);
```

Evitar mock manual - usar `vi.mock`/`jest.mock` no nivel de modulo.

## Estrutura de Arquivos

Testes DEVEM estar em `__tests__/`:

```
src/application/__tests__/list-entities.use-case.spec.ts
```

## test.each para Search/Filter/Paginate

```typescript
describe('search with filter and paginate', () => {
  const entities = [
    Entity.fake().anEntity().withName('test').build(),
    Entity.fake().anEntity().withName('TEST').build(),
    Entity.fake().anEntity().withName('TeSt').build(),
  ];

  const arrange = [
    { input: { page: 1, per_page: 2, filter: { name: 'TEST' } }, expected: { total: 3, current_page: 1 } },
    { input: { page: 2, per_page: 2, filter: { name: 'TEST' } }, expected: { total: 3, current_page: 2 } },
  ];

  beforeEach(() => repository.bulkInsert(entities));

  test.each(arrange)('when input is $input', async ({ input, expected }) => {
    const output = await useCase.execute(input);
    expect(output).toMatchObject(expected);
  });
});
```
