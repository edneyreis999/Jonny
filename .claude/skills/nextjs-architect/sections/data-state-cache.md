# Dados, Estado e Cache

- Wrappers:
  - `src/lib/serverFetch.ts`: adiciona auth/cookies, trata 401 com redirect, lança erro tipado.
  - Usar `server-only` em libs server.
- Caching:
  - Preferir `next: { tags: ['entity'] }` em fetch.
  - Após mutação, `revalidateTag('entity')`.
- Estado (ordem de preferência):
  1) Server data em RSC.  
  2) URL state com `searchParams` ou `nuqs`.  
  3) Client UI state mínimo (Zustand/Context local).  
  - TanStack Query só para interações ricas (polling, optimistic) no client.
- Estrutura de feature:
  - `server/` para loaders/DAL/server actions.
  - `hooks/` para estado local/client.
  - `schemas/` para Zod compartilhado (cliente/servidor).
