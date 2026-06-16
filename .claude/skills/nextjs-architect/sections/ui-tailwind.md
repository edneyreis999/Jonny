# UI, Tailwind e shadcn

- shadcn/Radix como primitivas; nunca incluir lógica de domínio nos componentes de UI.
- Composição > props gigantes. Preferir padrões `<Dialog><DialogTrigger/>...</DialogContent></Dialog>`.
- Tailwind:
  - Usar tokens/variáveis; evitar cores literais. Mapear em `globals.css` e `tailwind.config`.
  - Atualizar `content` para incluir `src/app`, `src/features`, `src/components`, `src/lib`.
  - Mobile-first; responsividade com utilitários.
- Theming:
  - Variáveis CSS para `--primary`, `--destructive`, `--muted-foreground`; Tailwind classes semânticas (`bg-primary`, `text-muted-foreground`).
- Acessibilidade:
  - Usar elementos semânticos; aria-label/tabindex quando interativo; seguir padrões Radix.
