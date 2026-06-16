# Segurança em Camadas

- Middleware (edge): somente roteamento/headers/CSP; nada de lógica de negócio ou acesso a DB.
- DAL: funções em `server/` validam sessão/roles antes de acessar dados; nunca chamar DB direto do componente.
- Error boundaries: `error.tsx` / `global-error.tsx` para falhas inesperadas; mensagens seguras.
- Sanitização: ao renderizar HTML externo, sanitizar (ex.: DOMPurify).
- Auth: propagar cookies/tokens no wrapper `serverFetch`; bloquear 401 com redirect centralizado.
