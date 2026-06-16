# Anti-Patterns Prioritários

- Decorators de framework no domínio (`@Injectable`, `@Controller`).
- Value Objects mutáveis ou com setters públicos.
- Validação comentada ou ignorada em factories.
- Controllers gordos com regra de negócio.
- Repositórios acoplando domínio a ORM (retornando modelos).
