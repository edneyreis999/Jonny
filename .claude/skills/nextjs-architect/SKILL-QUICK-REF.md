# Nextjs Architect — Quick Ref

- Gatilho: Next.js 15/React 19, App Router, shadcn/ui + Tailwind; dúvidas de arquitetura, estado, formulários, performance ou segurança.
- Fluxo: `sections/activation.md` → aplique seções necessárias → valide com `checklists/quality.md`.

## Árvore base recomendada

```
src/
├─ app/                 # orquestração de rotas/layouts
├─ components/ui/       # primitivas shadcn (propriedade do dev)
├─ features/            # domínios isolados (API pública via index.ts)
│  └─ <feature>/
│     ├─ components/    # UI específica
│     ├─ server/        # server actions, DAL, loaders
│     ├─ hooks/         # hooks client/context local
│     └─ schemas/       # Zod compartilhado
├─ lib/                 # utilitários globais (serverFetch, cn)
└─ types/               # contratos globais
```

## Respostas devem conter

- Título curto + bullets por área (Estrutura, Dados/Cache, Estado, UI/Tailwind, Formulários, Segurança, Performance, DX/Testes).
- Caminhos em backticks; blocos `ts/tsx` quando houver código.
- Justificativa de server vs client; caching com tags quando houver escrita.
