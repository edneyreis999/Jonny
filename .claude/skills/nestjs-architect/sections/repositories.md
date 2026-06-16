# Repositórios

- Interface no domínio (ex.: `IOrderRepository`) com operações específicas do agregado.
- Implementações na infra (`prisma`, `typeorm`, `in-memory`) usando mappers.
- Providers organizados:
```ts
export const REPOSITORIES = {
  ORDER_REPOSITORY: {
    provide: 'IOrderRepository',
    useFactory: (prisma: PrismaService) => new OrderPrismaRepository(prisma),
    inject: [PrismaService]
  }
};
```
- Nunca retorne modelos ORM diretamente ao domínio.
