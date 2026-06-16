---
name: test:integration
description: Gera testes cross-cutting que atravessam multiplas camadas DDD. FakeBuilder obrigatorio. Banco em memoria ou containers.
---

# Test Integration

Testes que atravessam multiplas camadas.

## Regras

1. FakeBuilder OBRIGATORIO
2. Banco: SQLite in-memory ou testcontainers
3. Validar contratos de dados e transacoes
4. Nomenclatura: `*.integration.spec.ts` ou `*.e2e.spec.ts`
5. NAO mockar Repository/DB - testar integracao REAL

## Cenarios Tipicos

- Controller -> Service -> Repository -> DB
- Event emitido -> Handler -> Side effect
- Transaction rollback em erro

## Padrao

```typescript
describe('[Feature] Integration', () => {
  beforeAll(async () => {
    await db.migrate();
  });

  afterEach(async () => {
    await db.truncateAll(); // Limpar entre testes
  });

  afterAll(async () => {
    await db.close();
  });

  it('should persist [entidade] through all layers', async () => {
    const input = Entity.fake().anEntity().build();
    const response = await request(app).post('/endpoint').send(input);
    const persisted = await repository.findById(response.body.id);
    expect(persisted).toBeDefined();
  });
});
```

## Cenarios Cross-Layer Obrigatorios

1. **Happy path completo** - request → response → persistido no DB
2. **Rollback em erro** - transacao reverte em falha de validacao
3. **Eventos propagados** - side effects executados apos commit
4. **Contratos de dados** - schema DB = schema API response

## Isolamento de Testes

- Cada teste DEVE ser independente (nao depender de ordem)
- `afterEach` trunca dados (nao deleta schema)
- Usar FakeBuilder com `withEntityId(fixedId)` para queries isoladas

## Estrutura de Arquivos

Testes DEVEM estar em `__tests__/`:

```
src/infra/__tests__/entity.repository.integration.spec.ts
```

## test.each para Repository Search

```typescript
describe('search with filter, sort and paginate', () => {
  const entities = [
    Entity.fake().aEntity().withName('test').build(),
    Entity.fake().aEntity().withName('TEST').build(),
    Entity.fake().aEntity().withName('TeSt').build(),
  ];

  const arrange = [
    {
      search_params: new EntitySearchParams({ page: 1, per_page: 2, sort: 'name', filter: 'TEST' }),
      search_result: new EntitySearchResult({ items: [entities[1], entities[2]], total: 3, current_page: 1 }),
    },
    {
      search_params: new EntitySearchParams({ page: 2, per_page: 2, sort: 'name', filter: 'TEST' }),
      search_result: new EntitySearchResult({ items: [entities[0]], total: 3, current_page: 2 }),
    },
  ];

  beforeEach(() => repository.bulkInsert(entities));

  test.each(arrange)('when params is $search_params', async ({ search_params, search_result }) => {
    const result = await repository.search(search_params);
    expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
  });
});
```
