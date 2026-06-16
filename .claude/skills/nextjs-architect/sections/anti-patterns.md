# Anti-Patterns

- Misturar lógica de domínio em middleware ou componentes client.
- Fetch sem wrapper ou sem tipagem; uso de `useEffect` para buscar dados server-side.
- Formulários sem validação dupla (cliente/servidor) ou sem retorno estruturado de erros.
- Cores literais e ausência de tokens/temas no Tailwind.
- Componentes monolíticos e sem composição shadcn.
- Falta de fallback em Suspense ou ausência de error boundary.
- Uso indiscriminado de `use client`; enums em vez de literais/maps.
