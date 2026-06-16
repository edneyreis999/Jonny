# Princípios Arquiteturais

- Domínio isolado: nada de `@nestjs/*` ou ORM dentro de `src/core/`.
- Camadas obrigatórias: domínio, aplicação, infra, nest-modules.
- Dependência unidirecional: NestJS depende do domínio, nunca o contrário.
- Use casos orquestram; agregados guardam regras de negócio; repositórios persistem; controllers delegam.
- Prefira Notification Pattern em vez de exceptions diretas para validação.
