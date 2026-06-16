# Integração com NestJS

- Controllers finos: validam DTO (class-validator) e delegam ao use case.
- Presenters convertem domínio -> HTTP/GraphQL.
- Módulo expõe providers agrupados (REPOSITORIES, USE_CASES, VALIDATIONS).
- Não coloque regra de negócio em pipes, guards ou interceptors; mantenha no domínio/use case.
