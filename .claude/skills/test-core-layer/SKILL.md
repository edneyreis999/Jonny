---
name: test:core-layer
description: Gera testes unitarios para Domain Layer (Entities, Aggregates, Value Objects). FakeBuilder obrigatorio. Foco em regras de negocio e invariantes.
---

# Test Core Layer

Testes unitarios para camada Domain (DDD).

## Regras

1. FakeBuilder OBRIGATORIO - invocar `fakebuilder-generator` se nao existir
2. Testar: invariantes, validacoes, comportamentos de dominio
3. NAO testar: getters/setters triviais, detalhes de implementacao
4. Nomenclatura: `*.spec.ts` ou `*.unit.spec.ts`

## Checklist (responder ANTES de criar teste)

- Qual unidade sob teste?
- Qual comportamento esperado?
- Como localiza bug futuro?
- Valida regra de negocio ou implementacao?

## Padrao de Teste

```typescript
describe('[Aggregate]', () => {
  it('should [comportamento] when [condicao]', () => {
    const entity = [Aggregate].fake().anEntity().build();
    // act + assert
  });
});
```

## Cenarios Obrigatorios

1. **Invariantes de criacao** - props invalidas rejeitadas
2. **Transicoes de estado** - metodos que alteram estado interno
3. **Regras de negocio** - calculos, validacoes compostas
4. **Edge cases** - null, vazio, limites numericos, strings longas

## Anti-Patterns (NAO fazer)

- Testar getters/setters triviais (zero valor)
- Mockar a propria entidade (usar FakeBuilder)
- Testar implementacao interna de Value Objects
- Duplicar teste de validacao que ja existe em outro cenario

## Estrutura de Arquivos

Testes DEVEM estar em `__tests__/`:
```
src/domain/__tests__/category.aggregate.spec.ts
```

## test.each para Validacao de Props

Usar test.each para testar variacoes de campos (null, undefined, valor valido):

```typescript
describe('category_id field', () => {
  const arrange = [
    { id: null },
    { id: undefined },
    { id: new CategoryId() },
  ];

  test.each(arrange)('should handle %j', (props) => {
    const category = Category.fake().anEntity().build();
    expect(category.category_id).toBeInstanceOf(CategoryId);
  });
});
```

OBRIGATORIO usar test.each quando testar >3 variacoes de input.
