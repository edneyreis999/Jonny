/**
 * EXEMPLO COMPLETO: Agregado Product seguindo padrões DDD
 *
 * Este arquivo demonstra a implementação completa de um agregado seguindo
 * os padrões definidos na NestJS Architect Skill.
 *
 * Estrutura de diretórios assumida:
 *
 * src/
 * ├── core/
 * │   └── product/
 * │       ├── domain/
 * │       │   ├── product.aggregate.ts (este arquivo)
 * │       │   ├── product.repository.ts
 * │       │   ├── product-id.vo.ts
 * │       │   └── product-fake.builder.ts
 * │       ├── application/
 * │       │   └── use-cases/
 * │       │       └── create-product/
 * │       └── infra/
 * │           └── db/
 * │               ├── sequelize/
 * │               └── in-memory/
 * └── nest-modules/
 *     └── products-module/
 *         ├── products.controller.ts
 *         ├── products.module.ts
 *         └── products.providers.ts
 */

// =============================================================================
// 1. DOMAIN LAYER - Aggregate Root
// src/core/product/domain/product.aggregate.ts
// =============================================================================

import { AggregateRoot } from '@/core/shared/domain/aggregate-root';
import { ValueObject } from '@/core/shared/domain/value-object';
import { ProductId } from './product-id.vo';
import { Money } from '@/core/shared/domain/value-objects/money.vo';

export type ProductProps = {
  product_id: ProductId;
  name: string;
  description: string | null;
  price: Money;
  stock: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ProductCreateCommand = {
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  stock?: number;
};

export class Product extends AggregateRoot {
  product_id: ProductId;
  name: string;
  description: string | null;
  price: Money;
  stock: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(props: ProductProps) {
    super();
    this.product_id = props.product_id;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.stock = props.stock;
    this.is_active = props.is_active;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  // Factory method - ponto de entrada principal
  static create(command: ProductCreateCommand): Product {
    const product = new Product({
      product_id: new ProductId(),
      name: command.name,
      description: command.description ?? null,
      price: new Money(command.price, command.currency),
      stock: command.stock ?? 0,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    product.validate(['name', 'price', 'stock']);

    // Event Sourcing local
    product.applyEvent(new ProductCreatedEvent(product));

    return product;
  }

  // Métodos de negócio que alteram estado
  changeName(name: string): void {
    this.name = name;
    this.updated_at = new Date();
    this.validate(['name']);
    this.applyEvent(new ProductNameChangedEvent(this));
  }

  changePrice(price: number, currency: string): void {
    this.price = new Money(price, currency);
    this.updated_at = new Date();
    this.validate(['price']);
    this.applyEvent(new ProductPriceChangedEvent(this));
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new InvalidStockQuantityError('Quantity must be positive');
    }
    this.stock += quantity;
    this.updated_at = new Date();
    this.applyEvent(new ProductStockIncreasedEvent(this, quantity));
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new InvalidStockQuantityError('Quantity must be positive');
    }
    if (quantity > this.stock) {
      throw new InsufficientStockError(this.stock, quantity);
    }
    this.stock -= quantity;
    this.updated_at = new Date();
    this.applyEvent(new ProductStockDecreasedEvent(this, quantity));
  }

  activate(): void {
    this.is_active = true;
    this.updated_at = new Date();
  }

  deactivate(): void {
    this.is_active = false;
    this.updated_at = new Date();
  }

  // Validação centralizada
  validate(fields?: string[]) {
    const validator = ProductValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  get entity_id(): ValueObject {
    return this.product_id;
  }

  toJSON() {
    return {
      product_id: this.product_id.id,
      name: this.name,
      description: this.description,
      price: this.price.toJSON(),
      stock: this.stock,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

// =============================================================================
// 2. DOMAIN LAYER - Value Objects
// src/core/product/domain/product-id.vo.ts
// =============================================================================

import { Uuid } from '@/core/shared/domain/value-objects/uuid.vo';

export class ProductId extends Uuid {
  // Herda validação automática da classe Uuid
}

// src/core/shared/domain/value-objects/money.vo.ts
export class Money extends ValueObject {
  readonly amount: number;
  readonly currency: string;

  constructor(amount: number, currency: string) {
    super();
    this.amount = amount;
    this.currency = currency.toUpperCase();
    this.validate();
  }

  private validate() {
    if (this.amount < 0) {
      throw new InvalidMoneyError('Amount cannot be negative');
    }
    if (!['USD', 'BRL', 'EUR'].includes(this.currency)) {
      throw new InvalidCurrencyError(this.currency);
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }

  toString() {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}

// =============================================================================
// 3. DOMAIN LAYER - Repository Interface
// src/core/product/domain/product.repository.ts
// =============================================================================

import { ISearchableRepository } from '@/core/shared/domain/repository/repository-interface';

export interface IProductRepository
  extends ISearchableRepository<Product, ProductId> {
  findByName(name: string): Promise<Product | null>;
  findActiveProducts(): Promise<Product[]>;
}

// =============================================================================
// 4. APPLICATION LAYER - Use Case
// src/core/product/application/use-cases/create-product/create-product.use-case.ts
// =============================================================================

import { IUseCase } from '@/core/shared/application/use-case';

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock?: number;
};

export type CreateProductOutput = {
  id: string;
  name: string;
  description: string | null;
  price: {
    amount: number;
    currency: string;
  };
  stock: number;
  is_active: boolean;
  created_at: Date;
};

export class CreateProductUseCase
  implements IUseCase<CreateProductInput, CreateProductOutput> {

  constructor(private readonly productRepo: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    // 1. Criar entidade de domínio
    const entity = Product.create({
      name: input.name,
      description: input.description,
      price: input.price,
      currency: input.currency,
      stock: input.stock,
    });

    // 2. Validar com Notification Pattern
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    // 3. Verificar unicidade de nome (validação de negócio)
    const existingProduct = await this.productRepo.findByName(input.name);
    if (existingProduct) {
      throw new ProductNameAlreadyExistsError(input.name);
    }

    // 4. Persistir
    await this.productRepo.insert(entity);

    // 5. Mapear para output
    return ProductOutputMapper.toOutput(entity);
  }
}

// =============================================================================
// 5. INFRASTRUCTURE LAYER - In-Memory Repository (para testes)
// src/core/product/infra/db/in-memory/product-in-memory.repository.ts
// =============================================================================

export class ProductInMemoryRepository implements IProductRepository {
  items: Product[] = [];

  async insert(entity: Product): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: ProductId): Promise<Product | null> {
    return this.items.find((item) => item.product_id.equals(id)) || null;
  }

  async findByName(name: string): Promise<Product | null> {
    return this.items.find((item) => item.name === name) || null;
  }

  async findActiveProducts(): Promise<Product[]> {
    return this.items.filter((item) => item.is_active);
  }

  async update(entity: Product): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.product_id.equals(entity.product_id)
    );
    if (index !== -1) {
      this.items[index] = entity;
    }
  }

  async delete(id: ProductId): Promise<void> {
    const index = this.items.findIndex((item) => item.product_id.equals(id));
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}

// =============================================================================
// 6. INFRASTRUCTURE LAYER - Sequelize Repository
// src/core/product/infra/db/sequelize/product-sequelize.repository.ts
// =============================================================================

export class ProductSequelizeRepository implements IProductRepository {
  constructor(private productModel: typeof ProductModel) {}

  async insert(entity: Product): Promise<void> {
    const model = ProductModelMapper.toModel(entity);
    await this.productModel.create(model.toJSON());
  }

  async findById(id: ProductId): Promise<Product | null> {
    const model = await this.productModel.findByPk(id.id);
    return model ? ProductModelMapper.toEntity(model) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const model = await this.productModel.findOne({ where: { name } });
    return model ? ProductModelMapper.toEntity(model) : null;
  }

  async findActiveProducts(): Promise<Product[]> {
    const models = await this.productModel.findAll({
      where: { is_active: true },
    });
    return models.map(ProductModelMapper.toEntity);
  }

  async update(entity: Product): Promise<void> {
    const model = ProductModelMapper.toModel(entity);
    await this.productModel.update(model.toJSON(), {
      where: { product_id: entity.product_id.id },
    });
  }

  async delete(id: ProductId): Promise<void> {
    await this.productModel.destroy({
      where: { product_id: id.id },
    });
  }
}

// =============================================================================
// 7. NESTJS LAYER - Providers
// src/nest-modules/products-module/products.providers.ts
// =============================================================================

export const REPOSITORIES = {
  PRODUCT_REPOSITORY: {
    provide: 'ProductRepository',
    useExisting: ProductSequelizeRepository,
  },
  PRODUCT_SEQUELIZE_REPOSITORY: {
    provide: ProductSequelizeRepository,
    useFactory: (productModel: typeof ProductModel) => {
      return new ProductSequelizeRepository(productModel);
    },
    inject: [getModelToken(ProductModel)],
  },
};

export const USE_CASES = {
  CREATE_PRODUCT_USE_CASE: {
    provide: CreateProductUseCase,
    useFactory: (productRepo: IProductRepository) => {
      return new CreateProductUseCase(productRepo);
    },
    inject: [REPOSITORIES.PRODUCT_REPOSITORY.provide],
  },
  UPDATE_PRODUCT_USE_CASE: {
    provide: UpdateProductUseCase,
    useFactory: (productRepo: IProductRepository) => {
      return new UpdateProductUseCase(productRepo);
    },
    inject: [REPOSITORIES.PRODUCT_REPOSITORY.provide],
  },
  DELETE_PRODUCT_USE_CASE: {
    provide: DeleteProductUseCase,
    useFactory: (productRepo: IProductRepository) => {
      return new DeleteProductUseCase(productRepo);
    },
    inject: [REPOSITORIES.PRODUCT_REPOSITORY.provide],
  },
};

export const PRODUCT_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};

// =============================================================================
// 8. NESTJS LAYER - Module
// src/nest-modules/products-module/products.module.ts
// =============================================================================

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductModel } from '@/core/product/infra/db/sequelize/product.model';
import { PRODUCT_PROVIDERS } from './products.providers';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel])],
  controllers: [ProductsController],
  providers: [
    ...Object.values(PRODUCT_PROVIDERS.REPOSITORIES),
    ...Object.values(PRODUCT_PROVIDERS.USE_CASES),
  ],
  exports: [
    PRODUCT_PROVIDERS.REPOSITORIES.PRODUCT_REPOSITORY.provide,
  ],
})
export class ProductsModule {}

// =============================================================================
// 9. NESTJS LAYER - Controller
// src/nest-modules/products-module/products.controller.ts
// =============================================================================

import { Controller, Post, Body, Get, Param, Put, Delete, Inject } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Inject(CreateProductUseCase)
  private createUseCase: CreateProductUseCase;

  @Inject(UpdateProductUseCase)
  private updateUseCase: UpdateProductUseCase;

  @Inject(DeleteProductUseCase)
  private deleteUseCase: DeleteProductUseCase;

  @Post()
  async create(@Body() createDto: CreateProductDto) {
    const output = await this.createUseCase.execute(createDto);
    return ProductsController.serialize(output);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto
  ) {
    const output = await this.updateUseCase.execute({ id, ...updateDto });
    return ProductsController.serialize(output);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteUseCase.execute({ id });
    return { deleted: true };
  }

  static serialize(output: ProductOutput) {
    return new ProductPresenter(output);
  }
}

// =============================================================================
// 10. NESTJS LAYER - DTOs
// src/nest-modules/products-module/dto/create-product.dto.ts
// =============================================================================

import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
}

// =============================================================================
// 11. TESTS - Fake Builder
// src/core/product/domain/product-fake.builder.ts
// =============================================================================

export class ProductFakeBuilder<TBuild = any> {
  private _product_id: ProductId | undefined;
  private _name: PropOrFactory<string> = () => this.faker.commerce.productName();
  private _description: PropOrFactory<string | null> = () =>
    this.faker.commerce.productDescription();
  private _price: PropOrFactory<Money> = () =>
    new Money(Number(this.faker.commerce.price()), 'USD');
  private _stock: PropOrFactory<number> = () => this.faker.number.int({ min: 0, max: 100 });
  private _is_active: PropOrFactory<boolean> = () => true;

  static aProduct() {
    return new ProductFakeBuilder<Product>();
  }

  static theProducts(countObjs: number) {
    return new ProductFakeBuilder<Product[]>(countObjs);
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withPrice(amount: number, currency: string) {
    this._price = new Money(amount, currency);
    return this;
  }

  withStock(valueOrFactory: PropOrFactory<number>) {
    this._stock = valueOrFactory;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  build(): TBuild {
    const products = new Array(this.countObjs)
      .fill(undefined)
      .map(() => {
        const product = new Product({
          product_id: this._product_id ?? new ProductId(),
          name: this.callFactory(this._name),
          description: this.callFactory(this._description),
          price: this.callFactory(this._price),
          stock: this.callFactory(this._stock),
          is_active: this.callFactory(this._is_active),
          created_at: new Date(),
          updated_at: new Date(),
        });
        product.validate();
        return product;
      });

    return this.countObjs === 1 ? products[0] : products;
  }
}

// =============================================================================
// 12. TESTS - Use Case Integration Test
// src/core/product/application/use-cases/create-product/__tests__/create-product.use-case.spec.ts
// =============================================================================

describe('CreateProductUseCase Integration Tests', () => {
  let useCase: CreateProductUseCase;
  let repository: ProductInMemoryRepository;

  beforeEach(() => {
    repository = new ProductInMemoryRepository();
    useCase = new CreateProductUseCase(repository);
  });

  it('should create a product', async () => {
    const output = await useCase.execute({
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 1999.99,
      currency: 'USD',
      stock: 10,
    });

    expect(output).toStrictEqual({
      id: repository.items[0].product_id.id,
      name: 'Laptop',
      description: 'High-performance laptop',
      price: {
        amount: 1999.99,
        currency: 'USD',
      },
      stock: 10,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
  });

  it('should throw error when name already exists', async () => {
    await useCase.execute({
      name: 'Laptop',
      price: 1999.99,
      currency: 'USD',
    });

    await expect(() =>
      useCase.execute({
        name: 'Laptop',
        price: 2999.99,
        currency: 'USD',
      })
    ).rejects.toThrow(ProductNameAlreadyExistsError);
  });

  it('should throw error when price is negative', async () => {
    await expect(() =>
      useCase.execute({
        name: 'Laptop',
        price: -100,
        currency: 'USD',
      })
    ).rejects.toThrow(EntityValidationError);
  });
});
