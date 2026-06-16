# Use Cases

- Implementa `IUseCase<Input, Output>`.
- Recebe repositórios via construtor (injeção explícita).
- Converte DTO -> domínio; retorna Output via presenter/mapper.
- Não contém regras de negócio; apenas orquestra.

Exemplo:
```ts
export class CreateOrderUseCase implements IUseCase<Input, Output> {
  constructor(private repo: IOrderRepository) {}
  async execute(input: Input): Promise<Output> {
    const order = Order.create(mapToDomain(input));
    await this.repo.insert(order);
    return OrderPresenter.toOutput(order);
  }
}
```
