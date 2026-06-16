# Arquitetura Server-First & Estrutura

- Estrutura base:
  - `src/app/`: orquestra rotas/layouts; manter fino (fetch inicial + composição).
  - `src/features/<feature>/`: UI, server actions, DAL, hooks, schemas; expor API pública via `index.ts`.
  - `src/components/ui/`: primitivas shadcn/Radix (sem lógica de domínio).
  - `src/lib/`: utilitários globais (ex.: `serverFetch`, `cn`).
  - `src/types/`: contratos globais.
- Boundaries server/client:
  - RSC por padrão; `use client` apenas para eventos, Web APIs, interatividade intensa.
  - Evitar `useEffect/useState` para busca de dados server-side; preferir fetch em RSC + props.
- Colocation e pastas privadas:
  - `_components`, `_hooks` dentro de rotas para escopo local.
- Barrel files:
  - Cada feature deve expor só o que é público em `src/features/<feature>/index.ts`.
- Nomeação:
  - Pastas kebab-case; componentes PascalCase; booleanos com is/has; handlers com `handle*`.
