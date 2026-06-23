
# ENTRADAS

O usuário fornecerá, obrigatoriamente:

- `FASE_ATUAL` — número da fase do plano a revisar (ex.: `1`). Define quais tasks editar.
- `TASKS_MD` — caminho de filesystem para o `tasks.md` do plano.
- `DIR_ANALISE` (Opcional) — Caminho da pré-analise realizada antes da implementação.

Todos os caminhos são **filesystem relativo ou absoluto**. Resolva os paths dentro do sistema de arquivos.

# OBJETIVO

Executar o que foi planejado para a `FASE_ATUAL` mencionada pelo usuario.
Procure por entender bem o que vai ser executado e carregar as skills apropriadas pela execução, se necessário. 

# WORKFLOW

## Fase 1
- Faça uma analise nas tasks que vão ser executadas na fase atual
## Fase 2
Se o usuário te informou o diretório da pré-analise,
Invoke um agente em paralelo para extrair informações relevantes para a execução da `FASE_ATUAL`.

Se ele não informou, faça você uma pré-analise
Invoke um agente em paralelo para extrair informações relevantes do code-base  `FASE_ATUAL`.

## Fase 3
Execute o que foi pedido na `FASE_ATUAL`.

# REGRAS




