# Nextjs Architect Skill

Skill profissional para conduzir decisões arquiteturais em Next.js 15/React 19 com paradigma server-first, organização por features, shadcn/ui e Tailwind semântico.

## O que esta skill faz

- Estrutura projetos em modo feature-first com app/ como orquestrador.
- Define fronteiras server/client e uso mínimo de `use client`.
- Padroniza dados, caching (tags/revalidate), estado (server > URL > client), e wrappers de fetch/server actions.
- Garante UI consistente via shadcn/Radix + Tailwind com tokens/variáveis.
- Normaliza formulários com Zod + React Hook Form + Server Actions + `useActionState`.
- Fortalece segurança em camadas (middleware leve, DAL com auth/roles, error boundaries).
- Eleva DX (ESLint strict, .cursorrules) e performance (Suspense, dynamic import, Web Vitals).

## Quando usar

- Arquitetar ou revisar apps Next.js/App Router.
- Decidir server vs client, caching, estado, formulários ou performance.
- Preparar guidelines para squads frontend.

## Instalação

Pasta já está em `.claude/skills/nextjs-architect/`. Para uso global:

```bash
mkdir -p ~/.claude/skills
cp -r .claude/skills/nextjs-architect ~/.claude/skills/
```
