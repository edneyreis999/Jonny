# Formulários e Server Actions

- Validação isomórfica: schema Zod compartilhado em `schemas/`.
- Cliente: React Hook Form com `zodResolver`; exibir erros do RHF + erros retornados.
- Server Actions:
  - Retornar `ActionResponse { success: boolean; message?: string; errors?: Record<string,string>; inputs?: any }`.
  - Usar `useActionState` para pendência e hidratação de erros.
  - Evitar try/catch para erros esperados; use retornos estruturados.
- Fluxo:
  1) RHF bloqueia erros óbvios.  
  2) Server Action revalida com Zod.  
  3) Em 401/403 redirecionar em camada server.  
  4) Após sucesso, revalidateTag(s) pertinentes.
