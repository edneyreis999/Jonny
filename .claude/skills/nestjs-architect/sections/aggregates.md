# Aggregates

Template curto:
```ts
export class Order extends AggregateRoot {
  private constructor(
    readonly id: OrderId,
    private items: OrderItem[],
    private status: OrderStatus
  ) { super(id); }

  static create(props: CreateOrderProps): Order {
    const notification = new Notification();
    const order = new Order(props.id, props.items, OrderStatus.created());
    order.validate(notification);
    if (notification.hasErrors()) throw new EntityValidationError(notification.messages());
    order.apply(new OrderCreatedEvent(order.id));
    return order;
  }

  private validate(notification: Notification) {
    if (!this.items?.length) notification.addError('Order must have items');
  }
}
```
Checklist: construtor privado; fábrica `create`; valida com Notification; aplica eventos; VOs imutáveis; sem decorators NestJS.
