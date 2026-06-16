---
name: test:controller-layer
description: Gera testes para Infrastructure Layer (Controllers, Handlers, React Components). Prioriza integracao. FakeBuilder obrigatorio. RTL com seletores por role.
---

# Test Controller Layer

Testes para camada Infrastructure.

## Regras

1. INTEGRACAO prioritaria
2. FakeBuilder OBRIGATORIO
3. React: RTL com `getByRole` (accessibility-first), NAO usar `getByTestId`
4. NestJS: supertest com TestingModule

## NestJS Controller

```typescript
describe('[Controller] (e2e)', () => {
  it('POST /endpoint should return 201', () => {
    const dto = Entity.fake().anEntity().build();
    return request(app.getHttpServer())
      .post('/endpoint')
      .send(dto)
      .expect(201);
  });
});
```

## React Component

```typescript
describe('<Component />', () => {
  it('renders [elemento] with [estado]', () => {
    render(<Component {...props} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });
});
```

## NestJS - Cenarios Obrigatorios

1. Status codes corretos (200, 201, 400, 404, 500)
2. Validacao de DTOs (class-validator rejeita input invalido)
3. Guards aplicados (401/403 quando nao autenticado)
4. Exception filters (erro formatado corretamente)

## React - Cenarios Obrigatorios

1. Renderizacao inicial (elementos visiveis)
2. Interacao do usuario (click, input, submit)
3. Estados de loading/error/success
4. Acessibilidade (roles, labels, aria)

## RTL Seletores por Prioridade

1. `getByRole` (PREFERIDO - semantico)
2. `getByLabelText` (forms)
3. `getByText` (fallback)
4. `getByTestId` (PROIBIDO - quebra com refactor)

## Estrutura de Arquivos

Testes DEVEM estar em `__tests__/`:
```
src/infra/__tests__/categories.controller.e2e.spec.ts
```

## test.each para Controller + Fixture

```typescript
describe('should create entity', () => {
  const arrange = CreateEntityFixture.arrangeForCreate();

  test.each(arrange)('when body is $send_data', async ({ send_data, expected }) => {
    const presenter = await controller.create(send_data);
    const entity = await repository.findById(new Uuid(presenter.id));
    expect(entity!.toJSON()).toMatchObject(expected);
  });
});
```

## test.each para E2E com Validacao

```typescript
describe('should return 422 for invalid request', () => {
  const invalidRequest = CreateEntityFixture.arrangeInvalidRequest();
  const arrange = Object.keys(invalidRequest).map((key) => ({
    label: key,
    value: invalidRequest[key],
  }));

  test.each(arrange)('when body is $label', ({ value }) => {
    return request(app.getHttpServer())
      .post('/entities')
      .send(value.send_data)
      .expect(422)
      .expect(value.expected);
  });
});
```
