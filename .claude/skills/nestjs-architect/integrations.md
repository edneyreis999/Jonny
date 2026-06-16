# Integrações com Outras Skills

## backend-best-practices

- Use para revisar segurança, logging e performance após gerar código NestJS.
- Fluxo sugerido:
  1) Gere arquitetura com NestJS Architect.
  2) Rode backend-best-practices pedindo revisão de segurança/perf.

## nestjs-test-excellence

- Focada em testes completos de módulos NestJS.
- Fluxo sugerido: após criar use cases e controllers, peça à skill gerar suite de testes e fixtures.

## fakebuilder-generator

- Gera builders/fakes para aggregates e VOs.
- Fluxo sugerido: antes de escrever testes de domínio ou use case, gere builders com esta skill e importe nos testes.

## Como encadear

- Prompt exemplo:

```
Use a skill NestJS Architect para criar o módulo billing. Depois acione nestjs-test-excellence para gerar testes e backend-best-practices para revisão de segurança.
```
