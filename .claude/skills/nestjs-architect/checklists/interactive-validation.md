# Checklist Interativo de Validação

Use em um chat com Claude Code para validar entregas rapidamente. Marque as caixas conforme passar.

## 1) Ativação

- [ ] Skill respondeu com "🏗️ NestJS Architect Skill Ativada"
- [ ] Listou padrões aplicados (DDD, Clean, Repository, Notification)

## 2) Arquitetura

- [ ] Domínio sem imports de `@nestjs/*`
- [ ] Estrutura `core/<ctx>/{domain,application,infra}` + `nest-modules/<ctx>-module`
- [ ] Use cases orquestram; controllers finos

## 3) Aggregates

- [ ] Construtor privado + `static create`
- [ ] Notification Pattern na validação
- [ ] Eventos aplicados (`apply`)
- [ ] VOs imutáveis (`readonly`)

## 4) Repositórios

- [ ] Interface no domínio
- [ ] Implementação na infra (prisma/orm/in-memory) com mapper
- [ ] Providers agrupados (REPOSITORIES, USE_CASES)

## 5) Testes

- [ ] Testes de domínio e use case sem framework
- [ ] Integração de controller com TestingModule
- [ ] Builders/fakes usados

## 6) Anti-Patterns

- [ ] Nenhum decorator de framework no domínio
- [ ] Nenhum VO mutável
- [ ] Nenhuma validação comentada

## 7) Integrações

- [ ] Chamou `nestjs-test-excellence` para testes
- [ ] Usou `fakebuilder-generator` para fakes

## Resultado

- [ ] ✅ Aprovado | [ ] ⚠️ Atenção | [ ] ❌ Reprovado
