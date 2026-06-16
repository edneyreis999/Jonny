# Checklist de Qualidade (Nextjs Architect)

1. Estrutura feature-first clara; `app/` apenas orquestra.
2. Boundaries server/client explícitos; `use client` mínimo e justificado.
3. Tailwind usa tokens/variáveis; `content` cobre `src/app`, `src/features`, `src/components`, `src/lib`; sem cores literais.
4. Wrappers de dados: `serverFetch` com auth/cookies; fetch com tags; revalidate após mutação.
5. Estado: server > URL (`nuqs`/searchParams) > client mínimo (Zustand/Context).
6. Formulários: Zod compartilhado; RHF no cliente; Server Actions retornam `ActionResponse`; `useActionState` aplicado; erros exibidos por campo.
7. Segurança: middleware leve; DAL com auth/roles; error boundaries presentes; sanitização quando renderiza HTML.
8. Performance: Suspense + fallbacks; dynamic import para blocos pesados; fontes/imagens otimizadas; olhar Web Vitals.
9. DX: ESLint strict + .cursorrules; commits pequenos; testes RTL/Jest para fluxos críticos.
10. Clean code: DRY/SRP; nomes descritivos; comentários de intenção apenas.
