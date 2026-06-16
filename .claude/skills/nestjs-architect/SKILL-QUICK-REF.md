# NestJS Architect – Quick Ref

Confirmação inicial (sempre):

```
🏗️ NestJS Architect Skill Ativada
Padrões: DDD, Clean Architecture, Repository Pattern, Notification Pattern
```

Sequência relâmpago (nova feature):

1) Criar dirs: `core/<ctx>/{domain,application,infra}` e `nest-modules/<ctx>-module/{dto,presenters}`.
2) Aggregate raiz: construtor privado, factory `create`, valida com Notification, aplica eventos, sem decorators NestJS.
3) VO imutável: `readonly` props, valida no construtor.
4) Repository interface no domínio; impl prisma/in-memory na infra com mapper.
5) Use case: implementa `IUseCase`, cria aggregate, chama repo, retorna via presenter.
6) Controller fino: injeta use case, valida DTO (class-validator), delega.
7) Testes: unidade (domínio/use case) sem framework; integração controller com módulo Nest.

Anti-patterns a evitar:

- Decorators de framework no domínio.
- Value Objects com setters ou mutáveis.
- Validação comentada ou ignorada.
- Controllers com regra de negócio.
- Repositórios retornando modelo ORM ao domínio.

Mappers/Presenters:

- Converta domínio -> DTO de resposta no presenter, nunca no controller.

Providers exemplo:

```
provide: 'IOrderRepository'
useFactory: (prisma) => new OrderPrismaRepository(prisma)
inject: [PrismaService]
```

Quando usar versão completa: regras complexas (Specification, Chain of Responsibility) ou migrações grandes.
