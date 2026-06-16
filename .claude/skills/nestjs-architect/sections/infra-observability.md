# Infra, UoW e Observabilidade

## Unidade de Trabalho e Eventos
- Garanta atomicidade usando Unit of Work (Prisma ou Sequelize) reutilizando transação existente ou criando nova.
- Registre agregados na UoW para publicar eventos após commit via mediador de eventos de domínio.
- Mantenha mappers dedicados VO ↔ ORM para preservar o domínio imune a storage.

## Logging estruturado
- Use logger central (ex.: Winston) com `timestamp`, `errors({ stack: true })`, formato `json` e transporte console em dev.
- Propague contexto por interceptor adicionando `requestId`, `userId`, `empresaId`, `service`, `duration` em logs de início/fim/erro.
- Substitua `console.*` por logger injetável; mascare dados sensíveis.

## Testing Config (Jest)
- Use Jest + SWC (`@swc/jest`) para velocidade.
- Cobertura mínima 80% global (statements/branches/functions/lines).
- Configure `moduleNameMapper` / `paths` para `@core/*` ou `@/`.
- Registre matchers customizados (ex.: `toBeValueObject`, `notificationContainsErrorMessages`).

## Estratégia de Testes
- Domínio: invariantes de VOs/agregados usando builders.
- Aplicação: casos de uso com UoW e notificações; inclua rollback de transação.
- Infra: integração Prisma/Sequelize com setup/teardown por agregado.
- E2E/HTTP: `supertest` com fixtures mínimas.
- Alternar DB real vs in-memory via flags de ambiente (`RUN_PRISMA_INTEGRATION`, etc.).

## API First
- Documente contratos com Swagger; versionamento de rota (`/api/v1`).
- Habilite `ValidationPipe` global com `whitelist` + `forbidNonWhitelisted`.
- DTOs seguem contrato; conversão para VOs ocorre no use case.
